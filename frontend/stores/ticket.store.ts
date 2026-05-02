import { defineStore } from 'pinia'

export interface Ticket {
  id: string
  code: string
  packageId: string
  guestName: string
  guestPhone: string | null
  note: string | null
  expiresAt: string
  createdAt: string
  package: { name: string; type: string }
  ticketUsers: Array<{ userId: string }>
  createdBy?: { name: string }
}

export interface TicketFormData {
  packageId: string
  guestName: string
  guestPhone?: string
  note?: string
}

interface TicketState {
  tickets: Ticket[]
  total: number
  isLoading: boolean
  lastCreated: Ticket | null
}

export const useTicketStore = defineStore('ticket', {
  state: (): TicketState => ({
    tickets: [],
    total: 0,
    isLoading: false,
    lastCreated: null
  }),

  actions: {
    async fetchMyTickets(opts?: { page?: number; limit?: number }): Promise<void> {
      this.isLoading = true
      try {
        const { useApiFetch } = await import('~/utils/api')
        const { apiFetch } = useApiFetch()
        const params: Record<string, unknown> = {}
        if (opts?.page) params.page = opts.page
        if (opts?.limit) params.limit = opts.limit

        const res = await apiFetch<{
          success: true
          data: Ticket[]
          meta?: { pagination?: { total: number } }
        }>('/staff/tickets', { params })

        this.tickets = res.data
        this.total = res.meta?.pagination?.total ?? res.data.length
      } finally {
        this.isLoading = false
      }
    },

    async fetchAllTickets(opts?: {
      page?: number
      limit?: number
      search?: string
    }): Promise<void> {
      this.isLoading = true
      try {
        const { useApiFetch } = await import('~/utils/api')
        const { apiFetch } = useApiFetch()
        const params: Record<string, unknown> = {}
        if (opts?.page) params.page = opts.page
        if (opts?.limit) params.limit = opts.limit
        if (opts?.search) params.search = opts.search

        const res = await apiFetch<{
          success: true
          data: Ticket[]
          meta?: { pagination?: { total: number } }
        }>('/admin/tickets', { params })

        this.tickets = res.data
        this.total = res.meta?.pagination?.total ?? res.data.length
      } finally {
        this.isLoading = false
      }
    },

    async createTicket(data: TicketFormData): Promise<Ticket> {
      const { useApiFetch } = await import('~/utils/api')
      const { apiFetch } = useApiFetch()
      const res = await apiFetch<{ success: true; data: { ticket: Ticket } }>('/staff/tickets', {
        method: 'POST',
        body: data
      })
      const ticket = res.data.ticket
      this.lastCreated = ticket
      return ticket
    },

    async activateTicket(code: string): Promise<void> {
      const { useApiFetch } = await import('~/utils/api')
      const { apiFetch } = useApiFetch()
      await apiFetch('/auth/activate-ticket', {
        method: 'POST',
        body: { code }
      })
    },

    async fetchMyActiveTicket(): Promise<void> {
      const { useApiFetch } = await import('~/utils/api')
      const { apiFetch } = useApiFetch()
      const res = await apiFetch<{ success: true; data: Ticket }>('/auth/my-ticket')
      if (res.data) {
        this.lastCreated = res.data
      }
    }
  }
})
