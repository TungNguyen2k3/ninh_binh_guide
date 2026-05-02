import type { NitroFetchOptions, NitroFetchRequest } from 'nitropack'

export interface ApiError {
  success: false
  error: {
    code: string
    message: string
    details?: unknown
  }
}

export interface ApiSuccess<T> {
  success: true
  data: T
  meta?: {
    pagination?: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
  }
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError

// Request-level type that matches what $fetch accepts
type FetchMethod =
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'PATCH'
  | 'DELETE'
  | 'HEAD'
  | 'OPTIONS'
  | 'get'
  | 'post'
  | 'put'
  | 'patch'
  | 'delete'
  | 'head'
  | 'options'

export interface ApiFetchOptions {
  method?: FetchMethod
  body?: unknown
  headers?: Record<string, string>
  params?: Record<string, unknown>
  credentials?: RequestCredentials
}

let isRefreshing = false
let refreshPromise: Promise<boolean> | null = null

export function useApiFetch() {
  const config = useRuntimeConfig()
  const baseURL = config.public.apiUrl as string

  async function apiFetch<T>(url: string, options: ApiFetchOptions = {}): Promise<T> {
    // Lazy import to avoid circular dependency at module load time
    const { useAuthStore } = await import('~/stores/auth.store')
    const authStore = useAuthStore()

    function buildHeaders(): Record<string, string> {
      const h: Record<string, string> = { ...(options.headers ?? {}) }
      if (authStore.accessToken) {
        h['Authorization'] = `Bearer ${authStore.accessToken}`
      }
      return h
    }

    function buildFetchOptions(headers: Record<string, string>): NitroFetchOptions<NitroFetchRequest> {
      return {
        baseURL,
        headers,
        credentials: 'include',
        ...(options.method ? { method: options.method } : {}),
        ...(options.body !== undefined ? { body: options.body as NitroFetchOptions<NitroFetchRequest>['body'] } : {}),
        ...(options.params ? { params: options.params } : {})
      }
    }

    try {
      return await $fetch<T>(url, buildFetchOptions(buildHeaders()))
    } catch (err: unknown) {
      const fetchError = err as { response?: { status?: number } }

      if (fetchError?.response?.status === 401) {
        // Deduplicate concurrent refresh requests
        if (!isRefreshing) {
          isRefreshing = true
          refreshPromise = authStore.refreshTokens().finally(() => {
            isRefreshing = false
            refreshPromise = null
          })
        }

        const refreshed = await refreshPromise!

        if (refreshed) {
          // Retry original request with updated token
          return $fetch<T>(url, buildFetchOptions(buildHeaders()))
        }

        // Refresh failed — clear state and go to login
        authStore.clearState()
        await navigateTo('/auth/login')
        throw err
      }

      throw err
    }
  }

  return { apiFetch }
}
