import { defineStore } from 'pinia'

export interface PackageLocation {
  location: {
    id: string
    nameVi: string
    nameEn: string
    slug: string
  }
}

export interface Package {
  id: string
  name: string
  description: string | null
  type: 'all_locations' | 'custom'
  validityHours: number
  price: number
  isActive: boolean
  locations: PackageLocation[]
}

export interface PackageFormData {
  name: string
  description: string
  type: 'all_locations' | 'custom'
  validityHours: number
  price: number
  isActive: boolean
}

interface PackageState {
  packages: Package[]
  isLoading: boolean
  current: Package | null
}

export const usePackageStore = defineStore('package', {
  state: (): PackageState => ({
    packages: [],
    isLoading: false,
    current: null
  }),

  actions: {
    async fetchList(): Promise<void> {
      this.isLoading = true
      try {
        const { useApiFetch } = await import('~/utils/api')
        const { apiFetch } = useApiFetch()
        const res = await apiFetch<{ success: true; data: Package[] }>('/admin/packages')
        this.packages = res.data
      } finally {
        this.isLoading = false
      }
    },

    async fetchOne(id: string): Promise<void> {
      this.isLoading = true
      try {
        const { useApiFetch } = await import('~/utils/api')
        const { apiFetch } = useApiFetch()
        const res = await apiFetch<{ success: true; data: Package }>(`/admin/packages/${id}`)
        this.current = res.data
      } finally {
        this.isLoading = false
      }
    },

    async create(data: PackageFormData): Promise<Package> {
      const { useApiFetch } = await import('~/utils/api')
      const { apiFetch } = useApiFetch()
      const res = await apiFetch<{ success: true; data: Package }>('/admin/packages', {
        method: 'POST',
        body: data
      })
      this.packages.push(res.data)
      return res.data
    },

    async update(id: string, data: Partial<PackageFormData>): Promise<Package> {
      const { useApiFetch } = await import('~/utils/api')
      const { apiFetch } = useApiFetch()
      const res = await apiFetch<{ success: true; data: Package }>(`/admin/packages/${id}`, {
        method: 'PUT',
        body: data
      })
      const idx = this.packages.findIndex((p) => p.id === id)
      if (idx !== -1) this.packages[idx] = res.data
      if (this.current?.id === id) this.current = res.data
      return res.data
    },

    async remove(id: string): Promise<void> {
      const { useApiFetch } = await import('~/utils/api')
      const { apiFetch } = useApiFetch()
      await apiFetch(`/admin/packages/${id}`, { method: 'DELETE' })
      this.packages = this.packages.filter((p) => p.id !== id)
    },

    async assignLocations(id: string, locationIds: string[]): Promise<void> {
      const { useApiFetch } = await import('~/utils/api')
      const { apiFetch } = useApiFetch()
      await apiFetch(`/admin/packages/${id}/locations`, {
        method: 'POST',
        body: { locationIds }
      })
      // Refresh current package so locations list updates
      await this.fetchOne(id)
    }
  }
})
