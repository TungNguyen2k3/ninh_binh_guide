import { describe, it, expect, vi, beforeEach } from 'vitest'
import { PackageService } from './package.service'
import type { PackageRepo } from '../repositories/package.repo'
import type { LocationRepo } from '../repositories/location.repo'
import { NotFoundError, ValidationError } from '../lib/errors'

// ---------------------------------------------------------------------------
// Mock repos — vi.fn() per method, cast to the interface type
// ---------------------------------------------------------------------------
const mockPackageRepo = {
  findAll: vi.fn(),
  findById: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  setLocations: vi.fn(),
  delete: vi.fn(),
} as unknown as PackageRepo

const mockLocationRepo = {
  findAll: vi.fn(),
  findById: vi.fn(),
  findBySlug: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
  findByPackageId: vi.fn(),
} as unknown as LocationRepo

vi.mock('../lib/cache.js', () => ({
  cache: { get: vi.fn(), set: vi.fn(), del: vi.fn() },
}))

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------
const mockPackageAllLocations = {
  id: 'pkg-all',
  name: 'Gói Toàn Bộ',
  description: 'Truy cập toàn bộ địa điểm',
  type: 'all_locations' as const,
  validityHours: 24,
  price: 150000,
  isActive: true,
  createdAt: new Date('2025-01-01'),
  updatedAt: new Date('2025-01-01'),
  locations: [],
}

const mockPackageCustom = {
  id: 'pkg-custom',
  name: 'Gói Tùy Chọn',
  description: 'Truy cập địa điểm đã chọn',
  type: 'custom' as const,
  validityHours: 12,
  price: 80000,
  isActive: true,
  createdAt: new Date('2025-01-01'),
  updatedAt: new Date('2025-01-01'),
  locations: [],
}

// ---------------------------------------------------------------------------
// Service under test
// ---------------------------------------------------------------------------
const packageService = new PackageService(mockPackageRepo, mockLocationRepo)

beforeEach(() => vi.clearAllMocks())

// ===========================================================================
// PackageService.create
// ===========================================================================
describe('PackageService.create', () => {
  it('creates package with type all_locations', async () => {
    vi.mocked(mockPackageRepo.create).mockResolvedValue(mockPackageAllLocations)

    const result = await packageService.create({
      name: 'Gói Toàn Bộ',
      type: 'all_locations',
      validityHours: 24,
      price: 150000,
    })

    expect(result).toEqual(mockPackageAllLocations)
    expect(mockPackageRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'all_locations' })
    )
  })

  it('creates package with type custom', async () => {
    vi.mocked(mockPackageRepo.create).mockResolvedValue(mockPackageCustom)

    const result = await packageService.create({
      name: 'Gói Tùy Chọn',
      type: 'custom',
      validityHours: 12,
      price: 80000,
    })

    expect(result).toEqual(mockPackageCustom)
    expect(mockPackageRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'custom' })
    )
  })
})

// ===========================================================================
// PackageService.assignLocations
// ===========================================================================
describe('PackageService.assignLocations', () => {
  it('assigns locations to custom package', async () => {
    const updatedPackage = {
      ...mockPackageCustom,
      locations: [
        { locationId: 'loc-1', packageId: 'pkg-custom', location: { id: 'loc-1' } },
        { locationId: 'loc-2', packageId: 'pkg-custom', location: { id: 'loc-2' } },
      ],
    }
    vi.mocked(mockPackageRepo.findById)
      .mockResolvedValueOnce(mockPackageCustom as any)
      .mockResolvedValueOnce(updatedPackage as any)
    vi.mocked(mockPackageRepo.setLocations).mockResolvedValue([{}, {}] as any)

    const result = await packageService.assignLocations('pkg-custom', ['loc-1', 'loc-2'])

    expect(mockPackageRepo.setLocations).toHaveBeenCalledWith('pkg-custom', ['loc-1', 'loc-2'])
    expect(result).toEqual(updatedPackage)
  })

  it('throws ValidationError when assigning locations to all_locations package', async () => {
    vi.mocked(mockPackageRepo.findById).mockResolvedValue(mockPackageAllLocations as any)

    await expect(
      packageService.assignLocations('pkg-all', ['loc-1'])
    ).rejects.toThrow(ValidationError)

    await expect(
      packageService.assignLocations('pkg-all', ['loc-1'])
    ).rejects.toThrow(/all_locations/)

    expect(mockPackageRepo.setLocations).not.toHaveBeenCalled()
  })

  it('allows clearing locations from custom package (empty array)', async () => {
    vi.mocked(mockPackageRepo.findById)
      .mockResolvedValueOnce(mockPackageCustom as any)
      .mockResolvedValueOnce({ ...mockPackageCustom, locations: [] } as any)
    vi.mocked(mockPackageRepo.setLocations).mockResolvedValue([{}, {}] as any)

    await expect(
      packageService.assignLocations('pkg-custom', [])
    ).resolves.not.toThrow()

    expect(mockPackageRepo.setLocations).toHaveBeenCalledWith('pkg-custom', [])
  })
})

// ===========================================================================
// PackageService.delete
// ===========================================================================
describe('PackageService.delete', () => {
  it('deletes package successfully', async () => {
    vi.mocked(mockPackageRepo.findById).mockResolvedValue(mockPackageCustom as any)
    vi.mocked(mockPackageRepo.delete).mockResolvedValue(mockPackageCustom as any)

    await packageService.delete('pkg-custom')

    expect(mockPackageRepo.delete).toHaveBeenCalledWith('pkg-custom')
  })

  it('throws NotFoundError when package does not exist', async () => {
    vi.mocked(mockPackageRepo.findById).mockResolvedValue(null)

    await expect(packageService.delete('nonexistent-id')).rejects.toThrow(NotFoundError)

    expect(mockPackageRepo.delete).not.toHaveBeenCalled()
  })
})

// ===========================================================================
// PackageService.update
// ===========================================================================
describe('PackageService.update', () => {
  it('throws NotFoundError when package does not exist', async () => {
    vi.mocked(mockPackageRepo.findById).mockResolvedValue(null)

    await expect(
      packageService.update('nonexistent-id', { name: 'New Name' })
    ).rejects.toThrow(NotFoundError)

    expect(mockPackageRepo.update).not.toHaveBeenCalled()
  })

  it('updates package successfully when it exists', async () => {
    const updatedPackage = { ...mockPackageCustom, name: 'Gói Cập Nhật' }
    vi.mocked(mockPackageRepo.findById).mockResolvedValue(mockPackageCustom as any)
    vi.mocked(mockPackageRepo.update).mockResolvedValue(updatedPackage as any)

    const result = await packageService.update('pkg-custom', { name: 'Gói Cập Nhật' })

    expect(result).toEqual(updatedPackage)
    expect(mockPackageRepo.update).toHaveBeenCalledWith('pkg-custom', { name: 'Gói Cập Nhật' })
  })
})
