import { defineStore } from 'pinia'

export interface TourStopLocation {
  id: string
  nameVi: string
  nameEn: string
  slug: string
  latitude: number
  longitude: number
  imageUrl: string | null
  audioViUrl: string | null
  audioEnUrl: string | null
}

export interface TourStop {
  id: string
  tourId: string
  locationId: string
  order: number
  suggestedTime: string | null
  suggestedDuration: string | null
  noteVi: string | null
  noteEn: string | null
  location: TourStopLocation
}

export interface Tour {
  id: string
  nameVi: string
  nameEn: string
  duration: string
  badgeVi: string | null
  badgeEn: string | null
  noteVi: string | null
  noteEn: string | null
  isActive: boolean
  displayOrder: number
  stops: TourStop[]
}

export interface TourFormData {
  nameVi: string
  nameEn: string
  duration: string
  badgeVi: string
  badgeEn: string
  noteVi: string
  noteEn: string
  displayOrder: number
  isActive: boolean
}

interface TourState {
  tours: Tour[]
  current: Tour | null
  touristTour: Tour | null
  isLoading: boolean
}

export const useTourStore = defineStore('tour', {
  state: (): TourState => ({
    tours: [],
    current: null,
    touristTour: null,
    isLoading: false,
  }),
  actions: {
    async fetchTouristTour(id: string): Promise<void> {
      this.isLoading = true
      try {
        const { apiFetch } = useApiFetch()
        const res = await apiFetch<{ success: true; data: Tour }>(`/tours/${id}`)
        this.touristTour = res.data
      } finally {
        this.isLoading = false
      }
    },
    async fetchList(): Promise<void> {
      this.isLoading = true
      try {
        const { apiFetch } = useApiFetch()
        const res = await apiFetch<{ success: true; data: Tour[] }>('/admin/tours')
        this.tours = res.data
      } finally {
        this.isLoading = false
      }
    },
    async fetchOne(id: string): Promise<void> {
      this.isLoading = true
      try {
        const { apiFetch } = useApiFetch()
        const res = await apiFetch<{ success: true; data: Tour }>(`/admin/tours/${id}`)
        this.current = res.data
      } finally {
        this.isLoading = false
      }
    },
    async create(data: Partial<TourFormData>): Promise<Tour> {
      const { apiFetch } = useApiFetch()
      const res = await apiFetch<{ success: true; data: Tour }>('/admin/tours', { method: 'POST', body: data })
      this.tours.unshift(res.data)
      return res.data
    },
    async update(id: string, data: Partial<TourFormData>): Promise<Tour> {
      const { apiFetch } = useApiFetch()
      const res = await apiFetch<{ success: true; data: Tour }>(`/admin/tours/${id}`, { method: 'PUT', body: data })
      const idx = this.tours.findIndex(t => t.id === id)
      if (idx !== -1) this.tours[idx] = res.data
      if (this.current?.id === id) this.current = res.data
      return res.data
    },
    async remove(id: string): Promise<void> {
      const { apiFetch } = useApiFetch()
      await apiFetch(`/admin/tours/${id}`, { method: 'DELETE' })
      this.tours = this.tours.filter(t => t.id !== id)
    },
    async addStop(tourId: string, data: object): Promise<TourStop> {
      const { apiFetch } = useApiFetch()
      const res = await apiFetch<{ success: true; data: TourStop }>(`/admin/tours/${tourId}/stops`, { method: 'POST', body: data })
      return res.data
    },
    async updateStop(tourId: string, stopId: string, data: object): Promise<void> {
      const { apiFetch } = useApiFetch()
      await apiFetch(`/admin/tours/${tourId}/stops/${stopId}`, { method: 'PUT', body: data })
    },
    async removeStop(tourId: string, stopId: string): Promise<void> {
      const { apiFetch } = useApiFetch()
      await apiFetch(`/admin/tours/${tourId}/stops/${stopId}`, { method: 'DELETE' })
    },
    async reorderStops(tourId: string, stops: { id: string; order: number }[]): Promise<void> {
      const { apiFetch } = useApiFetch()
      await apiFetch(`/admin/tours/${tourId}/stops/reorder`, { method: 'PUT', body: { stops } })
    },
  },
})
