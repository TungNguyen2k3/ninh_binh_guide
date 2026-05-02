import { describe, it, expect, vi, beforeEach } from 'vitest'
import { LocationService } from './location.service'
import type { LocationRepo } from '../repositories/location.repo'
import { ConflictError, NotFoundError } from '../lib/errors'

// ---------------------------------------------------------------------------
// Mock repos — vi.fn() per method, cast to the interface type
// ---------------------------------------------------------------------------
const mockLocationRepo = {
  findAll: vi.fn(),
  findById: vi.fn(),
  findBySlug: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
  findByPackageId: vi.fn(),
} as unknown as LocationRepo

// Mock cloudinary and cache so no real credentials are needed
vi.mock('../lib/cloudinary.js', () => ({
  uploadAudio: vi.fn().mockResolvedValue('https://cloudinary.com/audio.mp3'),
  uploadImage: vi.fn().mockResolvedValue('https://cloudinary.com/image.jpg'),
}))

vi.mock('../lib/cache.js', () => ({
  cache: { get: vi.fn(), set: vi.fn(), del: vi.fn() },
}))

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------
const mockLocation = {
  id: 'loc-1',
  slug: 'trang-an',
  nameVi: 'Tràng An',
  nameEn: 'Trang An',
  descriptionVi: 'Mô tả tràng an',
  descriptionEn: 'Trang An description',
  latitude: 20.2539,
  longitude: 105.9054,
  displayOrder: 1,
  imageUrl: null,
  audioViUrl: null,
  audioEnUrl: null,
  isActive: true,
  createdAt: new Date('2025-01-01'),
  updatedAt: new Date('2025-01-01'),
}

// ---------------------------------------------------------------------------
// Service under test
// ---------------------------------------------------------------------------
const locationService = new LocationService(mockLocationRepo)

beforeEach(() => vi.clearAllMocks())

// ===========================================================================
// LocationService.create
// ===========================================================================
describe('LocationService.create', () => {
  it('creates location when slug is unique', async () => {
    vi.mocked(mockLocationRepo.findBySlug).mockResolvedValue(null)
    vi.mocked(mockLocationRepo.create).mockResolvedValue(mockLocation)

    const { cache } = await import('../lib/cache.js')

    const result = await locationService.create({
      nameVi: 'Tràng An',
      nameEn: 'Trang An',
      slug: 'trang-an',
      latitude: 20.2539,
      longitude: 105.9054,
    })

    expect(result).toEqual(mockLocation)
    expect(mockLocationRepo.findBySlug).toHaveBeenCalledWith('trang-an')
    expect(mockLocationRepo.create).toHaveBeenCalledOnce()
    expect(cache.del).toHaveBeenCalledWith('locations:all')
  })

  it('throws ConflictError when slug already exists', async () => {
    vi.mocked(mockLocationRepo.findBySlug).mockResolvedValue(mockLocation as any)

    await expect(
      locationService.create({
        nameVi: 'Tràng An',
        nameEn: 'Trang An',
        slug: 'trang-an',
        latitude: 20.2539,
        longitude: 105.9054,
      })
    ).rejects.toThrow(ConflictError)

    expect(mockLocationRepo.create).not.toHaveBeenCalled()
  })

  it('creates location with minimal required fields', async () => {
    const minimalLocation = { ...mockLocation, descriptionVi: null, descriptionEn: null }
    vi.mocked(mockLocationRepo.findBySlug).mockResolvedValue(null)
    vi.mocked(mockLocationRepo.create).mockResolvedValue(minimalLocation)

    await expect(
      locationService.create({
        nameVi: 'Địa điểm mới',
        nameEn: 'New Location',
        slug: 'dia-diem-moi',
        latitude: 20.0,
        longitude: 106.0,
      })
    ).resolves.not.toThrow()

    expect(mockLocationRepo.create).toHaveBeenCalledOnce()
  })
})

// ===========================================================================
// LocationService.update
// ===========================================================================
describe('LocationService.update', () => {
  it('updates location successfully', async () => {
    const updatedLocation = { ...mockLocation, nameVi: 'Tràng An Mới' }
    vi.mocked(mockLocationRepo.findById).mockResolvedValue(mockLocation)
    vi.mocked(mockLocationRepo.findBySlug).mockResolvedValue(null)
    vi.mocked(mockLocationRepo.update).mockResolvedValue(updatedLocation)

    const result = await locationService.update('loc-1', { nameVi: 'Tràng An Mới' })

    expect(result).toEqual(updatedLocation)
    expect(mockLocationRepo.update).toHaveBeenCalledWith('loc-1', { nameVi: 'Tràng An Mới' })
  })

  it('throws NotFoundError when location does not exist', async () => {
    vi.mocked(mockLocationRepo.findById).mockResolvedValue(null)

    await expect(
      locationService.update('nonexistent-id', { nameVi: 'Tên mới' })
    ).rejects.toThrow(NotFoundError)

    expect(mockLocationRepo.update).not.toHaveBeenCalled()
  })

  it('throws ConflictError when new slug is taken by another location', async () => {
    const anotherLocation = { ...mockLocation, id: 'loc-2', slug: 'bich-dong' }
    vi.mocked(mockLocationRepo.findById).mockResolvedValue(mockLocation)
    vi.mocked(mockLocationRepo.findBySlug).mockResolvedValue(anotherLocation as any)

    await expect(
      locationService.update('loc-1', { slug: 'bich-dong' })
    ).rejects.toThrow(ConflictError)

    expect(mockLocationRepo.update).not.toHaveBeenCalled()
  })

  it('allows updating to same slug (own slug)', async () => {
    const sameSluglLocation = { ...mockLocation, id: 'loc-1', slug: 'trang-an' }
    vi.mocked(mockLocationRepo.findById).mockResolvedValue(mockLocation)
    vi.mocked(mockLocationRepo.findBySlug).mockResolvedValue(sameSluglLocation as any)
    vi.mocked(mockLocationRepo.update).mockResolvedValue(mockLocation)

    await expect(
      locationService.update('loc-1', { slug: 'trang-an' })
    ).resolves.not.toThrow()

    expect(mockLocationRepo.update).toHaveBeenCalledWith('loc-1', { slug: 'trang-an' })
  })
})

// ===========================================================================
// LocationService.delete
// ===========================================================================
describe('LocationService.delete', () => {
  it('deletes location successfully', async () => {
    vi.mocked(mockLocationRepo.findById).mockResolvedValue(mockLocation)
    vi.mocked(mockLocationRepo.delete).mockResolvedValue(mockLocation)

    await locationService.delete('loc-1')

    expect(mockLocationRepo.delete).toHaveBeenCalledWith('loc-1')
  })

  it('throws NotFoundError when location does not exist', async () => {
    vi.mocked(mockLocationRepo.findById).mockResolvedValue(null)

    await expect(locationService.delete('nonexistent-id')).rejects.toThrow(NotFoundError)

    expect(mockLocationRepo.delete).not.toHaveBeenCalled()
  })
})

// ===========================================================================
// LocationService.uploadAudioFile
// ===========================================================================
describe('LocationService.uploadAudioFile', () => {
  it('uploads vi audio and updates audioViUrl', async () => {
    const updatedLocation = { ...mockLocation, audioViUrl: 'https://cloudinary.com/audio.mp3' }
    vi.mocked(mockLocationRepo.findById).mockResolvedValue(mockLocation)
    vi.mocked(mockLocationRepo.update).mockResolvedValue(updatedLocation)

    const result = await locationService.uploadAudioFile(
      'loc-1',
      'vi',
      Buffer.from('fake-audio'),
      'audio.mp3'
    )

    expect(mockLocationRepo.update).toHaveBeenCalledWith(
      'loc-1',
      expect.objectContaining({ audioViUrl: 'https://cloudinary.com/audio.mp3' })
    )
    // Must NOT update audioEnUrl
    expect(mockLocationRepo.update).not.toHaveBeenCalledWith(
      'loc-1',
      expect.objectContaining({ audioEnUrl: expect.anything() })
    )
    expect(result.audioViUrl).toBe('https://cloudinary.com/audio.mp3')
  })

  it('uploads en audio and updates audioEnUrl', async () => {
    const updatedLocation = { ...mockLocation, audioEnUrl: 'https://cloudinary.com/audio.mp3' }
    vi.mocked(mockLocationRepo.findById).mockResolvedValue(mockLocation)
    vi.mocked(mockLocationRepo.update).mockResolvedValue(updatedLocation)

    const result = await locationService.uploadAudioFile(
      'loc-1',
      'en',
      Buffer.from('fake-audio'),
      'audio.mp3'
    )

    expect(mockLocationRepo.update).toHaveBeenCalledWith(
      'loc-1',
      expect.objectContaining({ audioEnUrl: 'https://cloudinary.com/audio.mp3' })
    )
    expect(result.audioEnUrl).toBe('https://cloudinary.com/audio.mp3')
  })
})
