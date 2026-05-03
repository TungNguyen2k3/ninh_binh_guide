import { TicketRepo } from '../repositories/ticket.repo.js'
import { PackageRepo } from '../repositories/package.repo.js'
import { NotFoundError, ConflictError, ForbiddenError, ValidationError } from '../lib/errors.js'

// Generate ticket code NBG-XXXXXX (excludes ambiguous chars I, O, 0, 1)
function generateCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const rand = Array.from({ length: 6 }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join('')
  return `NBG-${rand}`
}

export class TicketService {
  constructor(
    private readonly ticketRepo: TicketRepo,
    private readonly packageRepo: PackageRepo
  ) {}

  async createTicket(data: {
    packageId: string
    guestName: string
    guestPhone?: string
    note?: string
    staffId: string
  }) {
    const pkg = await this.packageRepo.findById(data.packageId)
    if (!pkg) throw new NotFoundError('Package')
    if (!pkg.isActive) throw new ValidationError('Package không còn hoạt động')

    // Activation deadline: 30 days from creation
    const expiresAt = new Date(Date.now() + 30 * 24 * 3600 * 1000)

    // Generate unique code with retry
    let code: string = ''
    let attempts = 0
    do {
      code = generateCode()
      const existing = await this.ticketRepo.findByCode(code)
      if (!existing) break
      attempts++
      if (attempts > 5) throw new Error('Cannot generate unique ticket code')
    } while (true)

    return this.ticketRepo.create({
      code,
      packageId: data.packageId,
      guestName: data.guestName,
      guestPhone: data.guestPhone,
      note: data.note,
      expiresAt,
      createdById: data.staffId,
    })
  }

  async listByStaff(staffId: string, opts?: { page?: number; limit?: number }) {
    return this.ticketRepo.listByStaff(staffId, opts)
  }

  async listAll(opts?: { page?: number; limit?: number; search?: string }) {
    return this.ticketRepo.listAll(opts)
  }

  async getById(id: string) {
    const ticket = await this.ticketRepo.findById(id)
    if (!ticket) throw new NotFoundError('Ticket')
    return ticket
  }

  async activateTicket(code: string, userId: string) {
    const ticket = await this.ticketRepo.findByCode(code)
    if (!ticket) throw new NotFoundError('Ticket')
    if (ticket.isCancelled) throw new ForbiddenError('Ticket đã bị hủy')

    // Check activation deadline
    if (ticket.expiresAt < new Date()) throw new ForbiddenError('Ticket đã hết hạn')

    // Check already activated by a different user
    const alreadyActivated = ticket.ticketUsers.find((tu) => tu.userId !== userId)
    if (alreadyActivated) {
      throw new ConflictError('Ticket đã được kích hoạt bởi người dùng khác')
    }

    // Idempotent: already activated by this user
    const selfActivated = ticket.ticketUsers.find((tu) => tu.userId === userId)
    if (selfActivated) {
      return { ticket, alreadyOwned: true }
    }

    // Compute tour access expiry from now + package validity
    const expiresAt = new Date(Date.now() + ticket.package.validityHours * 3600 * 1000)
    await this.ticketRepo.activateTicket(ticket.id, userId, expiresAt)
    return { ticket, alreadyOwned: false }
  }

  async getActiveTicketForUser(userId: string) {
    return this.ticketRepo.findActiveByUser(userId)
  }

  async getStats() {
    return this.ticketRepo.stats()
  }
}
