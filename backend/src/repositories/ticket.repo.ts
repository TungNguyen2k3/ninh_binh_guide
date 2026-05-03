import type { PrismaClient } from '@prisma/client'

export class TicketRepo {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: {
    code: string
    packageId: string
    guestName: string
    guestPhone?: string
    note?: string
    expiresAt: Date
    createdById: string
  }) {
    return this.prisma.ticket.create({
      data,
      include: {
        package: { select: { id: true, name: true, type: true, validityHours: true } },
        createdBy: { select: { id: true, name: true, email: true } },
      },
    })
  }

  async findByCode(code: string) {
    return this.prisma.ticket.findUnique({
      where: { code },
      include: {
        package: { include: { locations: { include: { location: true } } } },
        ticketUsers: { include: { user: true } },
      },
    })
  }

  async findById(id: string) {
    return this.prisma.ticket.findUnique({
      where: { id },
      include: {
        package: { select: { id: true, name: true, type: true } },
        ticketUsers: { select: { userId: true, activatedAt: true } },
      },
    })
  }

  async listByStaff(staffId: string, opts?: { page?: number; limit?: number }) {
    const page = opts?.page ?? 1
    const limit = opts?.limit ?? 20
    const where = { createdById: staffId }
    const [tickets, total] = await Promise.all([
      this.prisma.ticket.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          package: { select: { name: true, type: true } },
          ticketUsers: { select: { userId: true } },
        },
      }),
      this.prisma.ticket.count({ where }),
    ])
    return { tickets, total }
  }

  async listAll(opts?: { page?: number; limit?: number; search?: string }) {
    const page = opts?.page ?? 1
    const limit = opts?.limit ?? 20
    const where = opts?.search
      ? {
          OR: [
            { code: { contains: opts.search, mode: 'insensitive' as const } },
            { guestName: { contains: opts.search, mode: 'insensitive' as const } },
            { guestPhone: { contains: opts.search, mode: 'insensitive' as const } },
          ],
        }
      : {}
    const [tickets, total] = await Promise.all([
      this.prisma.ticket.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          package: { select: { name: true, type: true } },
          createdBy: { select: { name: true } },
          ticketUsers: { select: { userId: true } },
        },
      }),
      this.prisma.ticket.count({ where }),
    ])
    return { tickets, total }
  }

  async findActiveByUser(userId: string) {
    return this.prisma.ticketUser.findFirst({
      where: {
        userId,
        expiresAt: { gt: new Date() },
      },
      include: {
        ticket: {
          include: {
            package: { include: { locations: { include: { location: true } } } },
          },
        },
      },
      orderBy: { activatedAt: 'desc' },
    })
  }

  async activateTicket(ticketId: string, userId: string, expiresAt: Date) {
    return this.prisma.ticketUser.create({
      data: { ticketId, userId, expiresAt },
    })
  }

  async stats() {
    const now = new Date()
    const [total, activatedCount] = await Promise.all([
      this.prisma.ticket.count(),
      this.prisma.ticketUser.count(),
    ])

    // Recent tickets (last 5)
    const recentTickets = await this.prisma.ticket.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        package: { select: { name: true } },
        createdBy: { select: { name: true } },
        ticketUsers: { select: { userId: true } },
      },
    })

    // Chart data: last 30 days, group by day
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 3600 * 1000)
    const [ticketsLast30, usersLast30] = await Promise.all([
      this.prisma.ticket.findMany({
        where: { createdAt: { gte: thirtyDaysAgo } },
        select: { createdAt: true },
      }),
      this.prisma.user.findMany({
        where: { createdAt: { gte: thirtyDaysAgo } },
        select: { createdAt: true },
      }),
    ])

    function buildChartData(days: number) {
      const buckets: Record<string, { tickets: number; users: number }> = {}
      const cutoff = new Date(now.getTime() - days * 24 * 3600 * 1000)
      for (let i = days - 1; i >= 0; i--) {
        const d = new Date(now)
        d.setDate(d.getDate() - i)
        const key = d.toISOString().slice(0, 10)
        buckets[key] = { tickets: 0, users: 0 }
      }
      for (const t of ticketsLast30) {
        if (t.createdAt >= cutoff) {
          const key = t.createdAt.toISOString().slice(0, 10)
          if (buckets[key]) buckets[key].tickets++
        }
      }
      for (const u of usersLast30) {
        if (u.createdAt >= cutoff) {
          const key = u.createdAt.toISOString().slice(0, 10)
          if (buckets[key]) buckets[key].users++
        }
      }
      return Object.entries(buckets).map(([date, v]) => ({ date, ...v }))
    }

    return {
      total,
      activatedCount,
      recentTickets,
      chart: {
        '7d': buildChartData(7),
        '30d': buildChartData(30),
      },
    }
  }
}
