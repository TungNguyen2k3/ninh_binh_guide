import { defineStore } from 'pinia'

export interface User {
  id: string
  email: string | null
  phone: string | null
  name: string
  role: 'admin' | 'staff' | 'tourist'
  ticketId?: string | null
}

interface AuthState {
  user: User | null
  accessToken: string | null // in-memory only — never persisted to localStorage
  isLoading: boolean
}

interface LoginCredentials {
  email?: string
  phone?: string
  password: string
}

interface RegisterData {
  email?: string
  phone?: string
  password: string
  name: string
}

interface AuthTokenResponse {
  accessToken: string
  user: User
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    accessToken: null,
    isLoading: false
  }),

  getters: {
    isAuthenticated: (state): boolean => !!state.accessToken,
    isAdmin: (state): boolean => state.user?.role === 'admin',
    isStaff: (state): boolean => state.user?.role === 'staff',
    isTourist: (state): boolean => state.user?.role === 'tourist',
    hasActiveTicket: (state): boolean => !!state.user?.ticketId
  },

  actions: {
    clearState() {
      this.user = null
      this.accessToken = null
      this.isLoading = false
    },

    async login(credentials: LoginCredentials): Promise<void> {
      this.isLoading = true
      try {
        const config = useRuntimeConfig()
        const response = await $fetch<{ success: true; data: AuthTokenResponse }>('/auth/login', {
          method: 'POST',
          baseURL: config.public.apiUrl as string,
          body: credentials,
          credentials: 'include'
        })
        this.accessToken = response.data.accessToken
        this.user = response.data.user
      } finally {
        this.isLoading = false
      }
    },

    async register(data: RegisterData): Promise<void> {
      this.isLoading = true
      try {
        const config = useRuntimeConfig()
        const response = await $fetch<{ success: true; data: AuthTokenResponse }>('/auth/register', {
          method: 'POST',
          baseURL: config.public.apiUrl as string,
          body: data,
          credentials: 'include'
        })
        this.accessToken = response.data.accessToken
        this.user = response.data.user
      } finally {
        this.isLoading = false
      }
    },

    async logout(): Promise<void> {
      this.isLoading = true
      try {
        const config = useRuntimeConfig()
        await $fetch('/auth/logout', {
          method: 'POST',
          baseURL: config.public.apiUrl as string,
          headers: this.accessToken
            ? { Authorization: `Bearer ${this.accessToken}` }
            : {},
          credentials: 'include'
        })
      } catch {
        // Ignore logout errors — clear state regardless
      } finally {
        this.clearState()
      }
    },

    async refreshTokens(): Promise<boolean> {
      try {
        const config = useRuntimeConfig()
        const response = await $fetch<{ success: true; data: { accessToken: string } }>(
          '/auth/refresh',
          {
            method: 'POST',
            baseURL: config.public.apiUrl as string,
            credentials: 'include'
          }
        )
        this.accessToken = response.data.accessToken
        return true
      } catch {
        this.clearState()
        return false
      }
    },

    async fetchMe(): Promise<void> {
      const { useApiFetch } = await import('~/utils/api')
      const { apiFetch } = useApiFetch()
      const response = await apiFetch<{ success: true; data: User }>('/auth/me')
      this.user = response.data
    },

    async initialize(): Promise<void> {
      const refreshed = await this.refreshTokens()
      if (refreshed) {
        try {
          await this.fetchMe()
        } catch {
          this.clearState()
        }
      }
    }
  }
})
