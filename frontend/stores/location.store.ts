import { defineStore } from 'pinia'

export interface LocationImage {
  id: string
  url: string
  caption: string | null
  displayOrder: number
}

export interface SpotImage {
  id: string
  url: string
}

export interface Spot {
  id: string
  nameVi: string
  nameEn: string
  descriptionVi: string | null
  descriptionEn: string | null
  audioViUrl: string | null
  audioEnUrl: string | null
  images: SpotImage[]
  order: number
}

export interface Location {
  id: string
  slug: string
  nameVi: string
  nameEn: string
  descriptionVi: string | null
  descriptionEn: string | null
  overviewVi: string | null
  overviewEn: string | null
  historyVi: string | null
  historyEn: string | null
  highlightsVi: string | null
  highlightsEn: string | null
  openTime: string | null
  closeTime: string | null
  admissionFee: number | null
  estimatedDuration: number | null
  address: string | null
  bestTime: string | null
  audioViUrl: string | null
  audioEnUrl: string | null
  imageUrl: string | null
  images: LocationImage[]
  spots: Spot[]
  latitude: number
  longitude: number
  displayOrder: number
  isActive: boolean
  createdAt: string
}

export interface LocationFormData {
  nameVi: string
  nameEn: string
  slug: string
  descriptionVi: string
  descriptionEn: string
  overviewVi: string
  overviewEn: string
  historyVi: string
  historyEn: string
  highlightsVi: string
  highlightsEn: string
  openTime: string
  closeTime: string
  admissionFee: number | null
  estimatedDuration: number | null
  address: string
  bestTime: string
  latitude: number | null
  longitude: number | null
  displayOrder: number
  isActive: boolean
}

interface LocationState {
  locations: Location[]
  total: number
  isLoading: boolean
  current: Location | null
}

interface FetchListParams {
  search?: string
  page?: number
  limit?: number
}

export const useLocationStore = defineStore('location', {
  state: (): LocationState => ({
    locations: [],
    total: 0,
    isLoading: false,
    current: null
  }),

  actions: {
    async fetchList(params: FetchListParams = {}): Promise<void> {
      this.isLoading = true
      try {
        const { useApiFetch } = await import('~/utils/api')
        const { apiFetch } = useApiFetch()
        const query: Record<string, unknown> = {}
        if (params.search) query.search = params.search
        if (params.page) query.page = params.page
        if (params.limit) query.limit = params.limit

        const res = await apiFetch<{
          success: true
          data: Location[]
          meta?: { pagination?: { total: number } }
        }>('/admin/locations', { params: query })

        this.locations = res.data
        this.total = res.meta?.pagination?.total ?? res.data.length
      } finally {
        this.isLoading = false
      }
    },

    async fetchOne(id: string): Promise<void> {
      this.isLoading = true
      try {
        const { useApiFetch } = await import('~/utils/api')
        const { apiFetch } = useApiFetch()
        const res = await apiFetch<{ success: true; data: Location }>(`/admin/locations/${id}`)
        this.current = res.data
      } finally {
        this.isLoading = false
      }
    },

    async create(data: LocationFormData): Promise<Location> {
      const { useApiFetch } = await import('~/utils/api')
      const { apiFetch } = useApiFetch()
      const res = await apiFetch<{ success: true; data: Location }>('/admin/locations', {
        method: 'POST',
        body: data
      })
      return res.data
    },

    async update(id: string, data: Partial<LocationFormData>): Promise<Location> {
      const { useApiFetch } = await import('~/utils/api')
      const { apiFetch } = useApiFetch()
      const res = await apiFetch<{ success: true; data: Location }>(`/admin/locations/${id}`, {
        method: 'PUT',
        body: data
      })
      // Update in list if present
      const idx = this.locations.findIndex((l) => l.id === id)
      if (idx !== -1) this.locations[idx] = res.data
      if (this.current?.id === id) this.current = res.data
      return res.data
    },

    async remove(id: string): Promise<void> {
      const { useApiFetch } = await import('~/utils/api')
      const { apiFetch } = useApiFetch()
      await apiFetch(`/admin/locations/${id}`, { method: 'DELETE' })
      this.locations = this.locations.filter((l) => l.id !== id)
      this.total = Math.max(0, this.total - 1)
    },

    async toggleActive(id: string, isActive: boolean): Promise<void> {
      const { useApiFetch } = await import('~/utils/api')
      const { apiFetch } = useApiFetch()
      const res = await apiFetch<{ success: true; data: Location }>(`/admin/locations/${id}`, {
        method: 'PUT',
        body: { isActive }
      })
      const idx = this.locations.findIndex((l) => l.id === id)
      if (idx !== -1) this.locations[idx] = res.data
    },

    async uploadAudio(id: string, file: File, lang: 'vi' | 'en'): Promise<void> {
      const config = useRuntimeConfig()
      const authStore = useAuthStore()
      const form = new FormData()
      form.append('file', file)
      await $fetch(`/admin/locations/${id}/audio?lang=${lang}`, {
        method: 'POST',
        baseURL: config.public.apiUrl as string,
        headers: authStore.accessToken
          ? { Authorization: `Bearer ${authStore.accessToken}` }
          : {},
        body: form
      })
      // Refresh current location to get updated URLs
      if (this.current?.id === id) {
        await this.fetchOne(id)
      }
    },

    async uploadImage(id: string, file: File): Promise<void> {
      const config = useRuntimeConfig()
      const authStore = useAuthStore()
      const form = new FormData()
      form.append('file', file)
      await $fetch(`/admin/locations/${id}/image`, {
        method: 'POST',
        baseURL: config.public.apiUrl as string,
        headers: authStore.accessToken
          ? { Authorization: `Bearer ${authStore.accessToken}` }
          : {},
        body: form
      })
      // Refresh current location to get updated URL
      if (this.current?.id === id) {
        await this.fetchOne(id)
      }
    }
  }
})
