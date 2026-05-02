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
        ticket: { expiresAt: { gt: new Date() } },
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

  async activateTicket(ticketId: string, userId: string) {
    return this.prisma.ticketUser.create({
      data: { ticketId, userId },
    })
  }

  async stats() {
    const now = new Date()
    const [total, active, expired, activatedCount] = await Promise.all([
      this.prisma.ticket.count(),
      this.prisma.ticket.count({ where: { expiresAt: { gt: now } } }),
      this.prisma.ticket.count({ where: { expiresAt: { lte: now } } }),
      this.prisma.ticketUser.count(),
    ])
    return { total, active, expired, activatedCount }
  }
}
