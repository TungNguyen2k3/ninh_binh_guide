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
  findBySlugFull: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
  findByPackageId: vi.fn(),
  addImage: vi.fn(),
  deleteImage: vi.fn(),
  createSpot: vi.fn(),
  updateSpot: vi.fn(),
  deleteSpot: vi.fn(),
  addSpotImage: vi.fn(),
  deleteSpotImage: vi.fn(),
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
  overviewVi: null,
  overviewEn: null,
  historyVi: null,
  historyEn: null,
  highlightsVi: null,
  highlightsEn: null,
  visitingGuideVi: null,
  visitingGuideEn: null,
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

// ===========================================================================
// LocationService.uploadLocationImage
// ===========================================================================
describe('LocationService.uploadLocationImage', () => {
  it('uploads gallery image and returns the created record', async () => {
    const mockImage = { id: 'img-1', locationId: 'loc-1', url: 'https://cloudinary.com/image.jpg', caption: null, order: 0, createdAt: new Date() }
    vi.mocked(mockLocationRepo.findById).mockResolvedValue(mockLocation)
    vi.mocked(mockLocationRepo.addImage).mockResolvedValue(mockImage)

    const { cache } = await import('../lib/cache.js')

    const result = await locationService.uploadLocationImage('loc-1', Buffer.from('img'), 'photo.jpg')

    expect(mockLocationRepo.addImage).toHaveBeenCalledWith('loc-1', expect.objectContaining({ url: 'https://cloudinary.com/image.jpg' }))
    expect(cache.del).toHaveBeenCalledWith('locations:all')
    expect(result).toEqual(mockImage)
  })

  it('throws NotFoundError when location does not exist', async () => {
    vi.mocked(mockLocationRepo.findById).mockResolvedValue(null)

    await expect(
      locationService.uploadLocationImage('nonexistent', Buffer.from('img'), 'photo.jpg')
    ).rejects.toThrow(NotFoundError)

    expect(mockLocationRepo.addImage).not.toHaveBeenCalled()
  })
})

// ===========================================================================
// LocationService.deleteLocationImage
// ===========================================================================
describe('LocationService.deleteLocationImage', () => {
  it('deletes image after verifying location exists', async () => {
    vi.mocked(mockLocationRepo.findById).mockResolvedValue(mockLocation)
    vi.mocked(mockLocationRepo.deleteImage).mockResolvedValue({ id: 'img-1' } as any)

    await locationService.deleteLocationImage('loc-1', 'img-1')

    expect(mockLocationRepo.deleteImage).toHaveBeenCalledWith('img-1')
  })

  it('throws NotFoundError when location not found', async () => {
    vi.mocked(mockLocationRepo.findById).mockResolvedValue(null)

    await expect(locationService.deleteLocationImage('bad-id', 'img-1')).rejects.toThrow(NotFoundError)
    expect(mockLocationRepo.deleteImage).not.toHaveBeenCalled()
  })
})

// ===========================================================================
// LocationService.createSpot
// ===========================================================================
describe('LocationService.createSpot', () => {
  it('creates a spot for existing location', async () => {
    const mockSpot = { id: 'spot-1', locationId: 'loc-1', nameVi: 'Bến thuyền', nameEn: 'Boat dock', descriptionVi: null, descriptionEn: null, audioViUrl: null, audioEnUrl: null, order: 0, createdAt: new Date(), updatedAt: new Date() }
    vi.mocked(mockLocationRepo.findById).mockResolvedValue(mockLocation)
    vi.mocked(mockLocationRepo.createSpot).mockResolvedValue(mockSpot)

    const result = await locationService.createSpot('loc-1', { nameVi: 'Bến thuyền', nameEn: 'Boat dock' })

    expect(mockLocationRepo.createSpot).toHaveBeenCalledWith('loc-1', { nameVi: 'Bến thuyền', nameEn: 'Boat dock' })
    expect(result.id).toBe('spot-1')
  })

  it('throws NotFoundError when location does not exist', async () => {
    vi.mocked(mockLocationRepo.findById).mockResolvedValue(null)

    await expect(
      locationService.createSpot('bad-id', { nameVi: 'X', nameEn: 'X' })
    ).rejects.toThrow(NotFoundError)

    expect(mockLocationRepo.createSpot).not.toHaveBeenCalled()
  })
})

// ===========================================================================
// LocationService.updateSpot
// ===========================================================================
describe('LocationService.updateSpot', () => {
  it('updates spot and invalidates detail cache', async () => {
    const mockSpot = { id: 'spot-1', locationId: 'loc-1', nameVi: 'Cập nhật', nameEn: 'Updated', descriptionVi: null, descriptionEn: null, audioViUrl: null, audioEnUrl: null, order: 0, createdAt: new Date(), updatedAt: new Date() }
    vi.mocked(mockLocationRepo.findById).mockResolvedValue(mockLocation)
    vi.mocked(mockLocationRepo.updateSpot).mockResolvedValue(mockSpot)

    const { cache } = await import('../lib/cache.js')

    await locationService.updateSpot('loc-1', 'spot-1', { nameVi: 'Cập nhật' })

    expect(mockLocationRepo.updateSpot).toHaveBeenCalledWith('spot-1', { nameVi: 'Cập nhật' })
    expect(cache.del).toHaveBeenCalledWith('location:detail:trang-an:vi')
    expect(cache.del).toHaveBeenCalledWith('location:detail:trang-an:en')
  })
})

// ===========================================================================
// LocationService.deleteSpot
// ===========================================================================
describe('LocationService.deleteSpot', () => {
  it('deletes spot and invalidates detail cache', async () => {
    vi.mocked(mockLocationRepo.findById).mockResolvedValue(mockLocation)
    vi.mocked(mockLocationRepo.deleteSpot).mockResolvedValue({ id: 'spot-1' } as any)

    const { cache } = await import('../lib/cache.js')

    await locationService.deleteSpot('loc-1', 'spot-1')

    expect(mockLocationRepo.deleteSpot).toHaveBeenCalledWith('spot-1')
    expect(cache.del).toHaveBeenCalledWith('location:detail:trang-an:vi')
  })
})

// ===========================================================================
// LocationService.uploadSpotAudio
// ===========================================================================
describe('LocationService.uploadSpotAudio', () => {
  it('uploads vi audio for spot and sets audioViUrl', async () => {
    const mockSpot = { id: 'spot-1', locationId: 'loc-1', nameVi: 'X', nameEn: 'X', descriptionVi: null, descriptionEn: null, audioViUrl: 'https://cloudinary.com/audio.mp3', audioEnUrl: null, order: 0, createdAt: new Date(), updatedAt: new Date() }
    vi.mocked(mockLocationRepo.findById).mockResolvedValue(mockLocation)
    vi.mocked(mockLocationRepo.updateSpot).mockResolvedValue(mockSpot)

    const result = await locationService.uploadSpotAudio('loc-1', 'spot-1', 'vi', Buffer.from('audio'), 'a.mp3')

    expect(mockLocationRepo.updateSpot).toHaveBeenCalledWith('spot-1', expect.objectContaining({ audioViUrl: 'https://cloudinary.com/audio.mp3' }))
    expect(result.audioViUrl).toBe('https://cloudinary.com/audio.mp3')
  })

  it('uploads en audio for spot and sets audioEnUrl', async () => {
    const mockSpot = { id: 'spot-1', locationId: 'loc-1', nameVi: 'X', nameEn: 'X', descriptionVi: null, descriptionEn: null, audioViUrl: null, audioEnUrl: 'https://cloudinary.com/audio.mp3', order: 0, createdAt: new Date(), updatedAt: new Date() }
    vi.mocked(mockLocationRepo.findById).mockResolvedValue(mockLocation)
    vi.mocked(mockLocationRepo.updateSpot).mockResolvedValue(mockSpot)

    const result = await locationService.uploadSpotAudio('loc-1', 'spot-1', 'en', Buffer.from('audio'), 'a.mp3')

    expect(mockLocationRepo.updateSpot).toHaveBeenCalledWith('spot-1', expect.objectContaining({ audioEnUrl: 'https://cloudinary.com/audio.mp3' }))
    expect(result.audioEnUrl).toBe('https://cloudinary.com/audio.mp3')
  })
})

// ===========================================================================
// LocationService.uploadSpotImage / deleteSpotImage
// ===========================================================================
describe('LocationService.uploadSpotImage', () => {
  it('uploads image for spot and returns the record', async () => {
    const mockSpotImg = { id: 'simg-1', spotId: 'spot-1', url: 'https://cloudinary.com/image.jpg', order: 0, createdAt: new Date() }
    vi.mocked(mockLocationRepo.findById).mockResolvedValue(mockLocation)
    vi.mocked(mockLocationRepo.addSpotImage).mockResolvedValue(mockSpotImg)

    const result = await locationService.uploadSpotImage('loc-1', 'spot-1', Buffer.from('img'), 'p.jpg')

    expect(mockLocationRepo.addSpotImage).toHaveBeenCalledWith('spot-1', expect.objectContaining({ url: 'https://cloudinary.com/image.jpg' }))
    expect(result).toEqual(mockSpotImg)
  })
})

describe('LocationService.deleteSpotImage', () => {
  it('deletes spot image after verifying location', async () => {
    vi.mocked(mockLocationRepo.findById).mockResolvedValue(mockLocation)
    vi.mocked(mockLocationRepo.deleteSpotImage).mockResolvedValue({ id: 'simg-1' } as any)

    await locationService.deleteSpotImage('loc-1', 'spot-1', 'simg-1')

    expect(mockLocationRepo.deleteSpotImage).toHaveBeenCalledWith('simg-1')
  })
})
