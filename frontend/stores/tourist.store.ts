import { defineStore } from 'pinia'

export interface TouristLocation {
  id: string
  slug: string
  name: string
  description: string
  imageUrl: string | null
  hasAudioVi: boolean
  hasAudioEn: boolean
  latitude: number
  longitude: number
  displayOrder: number
  spotsCount?: number
}

export interface TouristSpotImage {
  id: string
  url: string
}

export interface TouristSpot {
  id: string
  name: string
  description: string | null
  audioUrl: string | null
  images: TouristSpotImage[]
}

export interface TouristLocationImage {
  id: string
  url: string
  caption: string | null
}

export interface TouristLocationDetail extends TouristLocation {
  audioUrl: string | null
  overview: string | null
  history: string | null
  highlights: string | null
  openTime: string | null
  closeTime: string | null
  admissionFee: number | null
  estimatedDuration: number | null
  address: string | null
  bestTime: string | null
  images: TouristLocationImage[]
  spots: TouristSpot[]
}

interface TouristState {
  locations: TouristLocation[]
  currentLocation: TouristLocationDetail | null
  isLoading: boolean
  isLoadingDetail: boolean
}

export const useTouristStore = defineStore('tourist', {
  state: (): TouristState => ({
    locations: [],
    currentLocation: null,
    isLoading: false,
    isLoadingDetail: false
  }),

  actions: {
    async fetchLocations(lang: string = 'vi'): Promise<void> {
      if (this.isLoading) return
      this.isLoading = true
      try {
        const { useApiFetch } = await import('~/utils/api')
        const { apiFetch } = useApiFetch()
        const res = await apiFetch<{ success: true; data: TouristLocation[] }>('/locations', {
          headers: { 'Accept-Language': lang }
        })
        this.locations = res.data
      } finally {
        this.isLoading = false
      }
    },

    async fetchLocationDetail(slug: string, lang: string = 'vi'): Promise<void> {
      this.isLoadingDetail = true
      this.currentLocation = null
      try {
        const { useApiFetch } = await import('~/utils/api')
        const { apiFetch } = useApiFetch()
        const res = await apiFetch<{ success: true; data: TouristLocationDetail }>(`/locations/${slug}`, {
          headers: { 'Accept-Language': lang }
        })
        this.currentLocation = res.data
      } finally {
        this.isLoadingDetail = false
      }
    }
  }
})
