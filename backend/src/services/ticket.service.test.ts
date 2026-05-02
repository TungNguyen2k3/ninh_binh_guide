import { describe, it, expect, vi, beforeEach } from 'vitest'
import { TicketService } from './ticket.service'
import type { TicketRepo } from '../repositories/ticket.repo'
import type { PackageRepo } from '../repositories/package.repo'
import { NotFoundError, ValidationError, ConflictError, ForbiddenError } from '../lib/errors'

// ---------------------------------------------------------------------------
// Mock repos
// ---------------------------------------------------------------------------
const mockTicketRepo = {
  create: vi.fn(),
  findByCode: vi.fn(),
  findById: vi.fn(),
  listByStaff: vi.fn(),
  listAll: vi.fn(),
  findActiveByUser: vi.fn(),
  activateTicket: vi.fn(),
  stats: vi.fn(),
} as unknown as TicketRepo

const mockPackageRepo = {
  findAll: vi.fn(),
  findById: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  setLocations: vi.fn(),
  delete: vi.fn(),
} as unknown as PackageRepo

// ---------------------------------------------------------------------------
// Service under test
// ---------------------------------------------------------------------------
const ticketService = new TicketService(mockTicketRepo, mockPackageRepo)

beforeEach(() => vi.clearAllMocks())

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------
const mockPackage = {
  id: 'pkg-1',
  name: 'Gói cơ bản',
  type: 'custom' as const,
  validityHours: 24,
  isActive: true,
}

const mockTicket = {
  id: 'ticket-1',
  code: 'NBG-ABCDEF',
  packageId: 'pkg-1',
  guestName: 'Nguyễn Văn A',
  guestPhone: '0901234567',
  note: null,
  expiresAt: new Date(Date.now() + 86400000),
  createdById: 'staff-1',
  ticketUsers: [] as Array<{ userId: string }>,
}

// ===========================================================================
// TicketService.createTicket
// ===========================================================================
describe('TicketService.createTicket', () => {
  it('creates ticket when package exists and is active', async () => {
    vi.mocked(mockPackageRepo.findById).mockResolvedValue(mockPackage as any)
    vi.mocked(mockTicketRepo.findByCode).mockResolvedValue(null)
    vi.mocked(mockTicketRepo.create).mockResolvedValue(mockTicket as any)

    const result = await ticketService.createTicket({
      packageId: 'pkg-1',
      guestName: 'Nguyễn Văn A',
      guestPhone: '0901234567',
      staffId: 'staff-1',
    })

    expect(mockPackageRepo.findById).toHaveBeenCalledWith('pkg-1')
    expect(mockTicketRepo.create).toHaveBeenCalledOnce()

    const createCall = vi.mocked(mockTicketRepo.create).mock.calls[0][0]
    expect(createCall.code).toMatch(/^NBG-/)
    expect(createCall.packageId).toBe('pkg-1')
    expect(createCall.guestName).toBe('Nguyễn Văn A')
    expect(createCall.expiresAt).toBeInstanceOf(Date)
    expect(createCall.expiresAt.getTime()).toBeGreaterThan(Date.now())

    expect(result.code).toBe('NBG-ABCDEF')
  })

  it('throws NotFoundError when package does not exist', async () => {
    vi.mocked(mockPackageRepo.findById).mockResolvedValue(null)

    await expect(
      ticketService.createTicket({
        packageId: 'nonexistent',
        guestName: 'Khách',
        staffId: 'staff-1',
      })
    ).rejects.toThrow(NotFoundError)

    expect(mockTicketRepo.create).not.toHaveBeenCalled()
  })

  it('throws ValidationError when package is inactive', async () => {
    vi.mocked(mockPackageRepo.findById).mockResolvedValue({ ...mockPackage, isActive: false } as any)

    await expect(
      ticketService.createTicket({
        packageId: 'pkg-1',
        guestName: 'Khách',
        staffId: 'staff-1',
      })
    ).rejects.toThrow(ValidationError)

    expect(mockTicketRepo.create).not.toHaveBeenCalled()
  })
})

// ===========================================================================
// TicketService.activateTicket
// ===========================================================================
describe('TicketService.activateTicket', () => {
  it('activates ticket successfully for new user', async () => {
    const ticket = { ...mockTicket, ticketUsers: [] }
    vi.mocked(mockTicketRepo.findByCode).mockResolvedValue(ticket as any)
    vi.mocked(mockTicketRepo.activateTicket).mockResolvedValue(undefined as any)

    const result = await ticketService.activateTicket('NBG-ABCDEF', 'user-1')

    expect(mockTicketRepo.activateTicket).toHaveBeenCalledWith('ticket-1', 'user-1')
    expect(result.alreadyOwned).toBe(false)
  })

  it('returns alreadyOwned=true when same user already activated', async () => {
    const ticket = { ...mockTicket, ticketUsers: [{ userId: 'user-1' }] }
    vi.mocked(mockTicketRepo.findByCode).mockResolvedValue(ticket as any)

    const result = await ticketService.activateTicket('NBG-ABCDEF', 'user-1')

    expect(mockTicketRepo.activateTicket).not.toHaveBeenCalled()
    expect(result.alreadyOwned).toBe(true)
  })

  it('throws ConflictError when ticket activated by different user', async () => {
    const ticket = { ...mockTicket, ticketUsers: [{ userId: 'other-user' }] }
    vi.mocked(mockTicketRepo.findByCode).mockResolvedValue(ticket as any)

    await expect(
      ticketService.activateTicket('NBG-ABCDEF', 'user-1')
    ).rejects.toThrow(ConflictError)

    expect(mockTicketRepo.activateTicket).not.toHaveBeenCalled()
  })

  it('throws ForbiddenError when ticket is expired', async () => {
    const ticket = {
      ...mockTicket,
      expiresAt: new Date(Date.now() - 1000),
      ticketUsers: [],
    }
    vi.mocked(mockTicketRepo.findByCode).mockResolvedValue(ticket as any)

    await expect(
      ticketService.activateTicket('NBG-ABCDEF', 'user-1')
    ).rejects.toThrow(ForbiddenError)

    expect(mockTicketRepo.activateTicket).not.toHaveBeenCalled()
  })

  it('throws NotFoundError when ticket code does not exist', async () => {
    vi.mocked(mockTicketRepo.findByCode).mockResolvedValue(null)

    await expect(
      ticketService.activateTicket('NBG-ZZZZZZ', 'user-1')
    ).rejects.toThrow(NotFoundError)

    expect(mockTicketRepo.activateTicket).not.toHaveBeenCalled()
  })
})

// ===========================================================================
// TicketService.getStats
// ===========================================================================
describe('TicketService.getStats', () => {
  it('returns stats from repo', async () => {
    const mockStats = { total: 10, active: 7, expired: 3, activatedCount: 5 }
    vi.mocked(mockTicketRepo.stats).mockResolvedValue(mockStats)

    const result = await ticketService.getStats()

    expect(mockTicketRepo.stats).toHaveBeenCalledOnce()
    expect(result).toEqual(mockStats)
  })
})
