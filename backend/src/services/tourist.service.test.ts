import { describe, it, expect, vi, beforeEach } from 'vitest'
import { TouristService } from './tourist.service'
import type { LocationRepo } from '../repositories/location.repo'
import type { TicketRepo } from '../repositories/ticket.repo'
import { ForbiddenError, NotFoundError } from '../lib/errors'

// ---------------------------------------------------------------------------
// Mock repos
// ---------------------------------------------------------------------------
const mockLocationRepo = {
  findAll: vi.fn(),
  findById: vi.fn(),
  findBySlug: vi.fn(),
  findBySlugFull: vi.fn(),
  findByIds: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
  findByPackageId: vi.fn(),
} as unknown as LocationRepo

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

vi.mock('../lib/cache.js', () => ({
  cache: { get: vi.fn().mockReturnValue(undefined), set: vi.fn(), del: vi.fn() },
}))

// ---------------------------------------------------------------------------
// Service under test
// ---------------------------------------------------------------------------
const touristService = new TouristService(mockLocationRepo, mockTicketRepo)

beforeEach(() => vi.clearAllMocks())

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------
const tomorrow = new Date(Date.now() + 86400000)
const yesterday = new Date(Date.now() - 1000)

const makeTicketUser = (type: 'all_locations' | 'custom', locationIds: string[] = []) => ({
  ticket: {
    expiresAt: tomorrow,
    package: {
      type,
      locations: locationIds.map((id) => ({ locationId: id })),
    },
  },
})

const mockLocations = [
  {
    id: 'loc-1',
    slug: 'trang-an',
    nameVi: 'Tràng An',
    nameEn: 'Trang An',
    descriptionVi: 'Mô tả VI',
    descriptionEn: 'Desc EN',
    overviewVi: null,
    overviewEn: null,
    historyVi: null,
    historyEn: null,
    highlightsVi: null,
    highlightsEn: null,
    visitingGuideVi: null,
    visitingGuideEn: null,
    imageUrl: null,
    audioViUrl: null,
    audioEnUrl: null,
    latitude: 20.25,
    longitude: 105.84,
    displayOrder: 1,
    isActive: true,
    locationImages: [],
    spots: [],
  },
  {
    id: 'loc-2',
    slug: 'hang-mua',
    nameVi: 'Hang Múa',
    nameEn: 'Mua Cave',
    descriptionVi: 'Mô tả VI 2',
    descriptionEn: 'Desc EN 2',
    overviewVi: null,
    overviewEn: null,
    historyVi: null,
    historyEn: null,
    highlightsVi: null,
    highlightsEn: null,
    visitingGuideVi: null,
    visitingGuideEn: null,
    imageUrl: null,
    audioViUrl: 'https://cdn.cloudinary.com/audio.mp3',
    audioEnUrl: null,
    latitude: 20.22,
    longitude: 105.91,
    displayOrder: 2,
    isActive: true,
    locationImages: [],
    spots: [],
  },
]

// ===========================================================================
// TouristService.getLocationsForTourist
// ===========================================================================
describe('TouristService.getLocationsForTourist', () => {
  it('returns Vietnamese names when lang is vi', async () => {
    vi.mocked(mockTicketRepo.findActiveByUser).mockResolvedValue(makeTicketUser('all_locations') as any)
    vi.mocked(mockLocationRepo.findAll).mockResolvedValue([mockLocations, 2] as any)

    const result = await touristService.getLocationsForTourist('user-1', 'vi')

    expect(result[0].name).toBe('Tràng An')
    expect(result[1].hasAudioVi).toBe(true)
  })

  it('returns English names when lang is en', async () => {
    vi.mocked(mockTicketRepo.findActiveByUser).mockResolvedValue(makeTicketUser('all_locations') as any)
    vi.mocked(mockLocationRepo.findAll).mockResolvedValue([mockLocations, 2] as any)

    const result = await touristService.getLocationsForTourist('user-1', 'en')

    expect(result[0].name).toBe('Trang An')
  })

  it('filters by package locationIds for custom package', async () => {
    vi.mocked(mockTicketRepo.findActiveByUser).mockResolvedValue(
      makeTicketUser('custom', ['loc-1']) as any
    )
    vi.mocked(mockLocationRepo.findByIds).mockResolvedValue([mockLocations[0]] as any)

    const result = await touristService.getLocationsForTourist('user-1', 'vi')

    expect(mockLocationRepo.findByIds).toHaveBeenCalledWith(['loc-1'])
    expect(result.length).toBe(1)
  })

  it('throws ForbiddenError when tourist has no active ticket', async () => {
    vi.mocked(mockTicketRepo.findActiveByUser).mockResolvedValue(null)

    await expect(touristService.getLocationsForTourist('user-1', 'vi')).rejects.toThrow(
      ForbiddenError
    )
  })

  it('throws ForbiddenError when ticket is expired', async () => {
    const ticketUser = makeTicketUser('all_locations')
    ticketUser.ticket.expiresAt = yesterday

    vi.mocked(mockTicketRepo.findActiveByUser).mockResolvedValue(ticketUser as any)

    await expect(touristService.getLocationsForTourist('user-1', 'vi')).rejects.toThrow(
      ForbiddenError
    )
  })
})

// ===========================================================================
// TouristService.getLocationDetail
// ===========================================================================
describe('TouristService.getLocationDetail', () => {
  it('returns location detail with Vietnamese audio when lang is vi', async () => {
    vi.mocked(mockTicketRepo.findActiveByUser).mockResolvedValue(makeTicketUser('all_locations') as any)
    vi.mocked(mockLocationRepo.findBySlugFull).mockResolvedValue({
      ...mockLocations[1],
      descriptionVi: 'Mô tả',
      descriptionEn: 'Desc',
    } as any)

    const result = await touristService.getLocationDetail('hang-mua', 'user-1', 'vi') as any

    expect(result.audioUrl).toBe('https://cdn.cloudinary.com/audio.mp3')
    expect(result.name).toBe('Hang Múa')
  })

  it('returns null audioUrl when no audio available for lang', async () => {
    // loc-2 has audioViUrl but no audioEnUrl — lang=en should give null
    vi.mocked(mockTicketRepo.findActiveByUser).mockResolvedValue(makeTicketUser('all_locations') as any)
    vi.mocked(mockLocationRepo.findBySlugFull).mockResolvedValue(mockLocations[1] as any)

    const result = await touristService.getLocationDetail('hang-mua', 'user-1', 'en') as any

    expect(result.audioUrl).toBeNull()
  })

  it('throws NotFoundError when location slug not found', async () => {
    vi.mocked(mockLocationRepo.findBySlugFull).mockResolvedValue(null)

    await expect(
      touristService.getLocationDetail('nonexistent-slug', 'user-1', 'vi')
    ).rejects.toThrow(NotFoundError)
  })

  it('throws ForbiddenError for custom package when location not in package', async () => {
    // custom package only allows 'loc-other', but we look up loc-2 (id='loc-2')
    vi.mocked(mockTicketRepo.findActiveByUser).mockResolvedValue(
      makeTicketUser('custom', ['loc-other']) as any
    )
    vi.mocked(mockLocationRepo.findBySlugFull).mockResolvedValue(mockLocations[1] as any)

    await expect(
      touristService.getLocationDetail('hang-mua', 'user-1', 'vi')
    ).rejects.toThrow(ForbiddenError)
  })

  it('allows access for all_locations package regardless of location', async () => {
    vi.mocked(mockTicketRepo.findActiveByUser).mockResolvedValue(makeTicketUser('all_locations') as any)
    vi.mocked(mockLocationRepo.findBySlugFull).mockResolvedValue(mockLocations[1] as any)

    const result = await touristService.getLocationDetail('hang-mua', 'user-1', 'vi') as any

    expect(result).toBeDefined()
    expect(result.id).toBe('loc-2')
    expect(result.slug).toBe('hang-mua')
    expect(result.name).toBeDefined()
  })

  it('returns rich content fields (overview, history, highlights, visitingGuide)', async () => {
    const richLocation = {
      ...mockLocations[0],
      overviewVi: 'Tổng quan VI',
      overviewEn: 'Overview EN',
      historyVi: 'Lịch sử VI',
      historyEn: 'History EN',
      highlightsVi: 'Điểm nổi bật VI',
      highlightsEn: 'Highlights EN',
      visitingGuideVi: 'Hướng dẫn VI',
      visitingGuideEn: 'Guide EN',
    }
    vi.mocked(mockTicketRepo.findActiveByUser).mockResolvedValue(makeTicketUser('all_locations') as any)
    vi.mocked(mockLocationRepo.findBySlugFull).mockResolvedValue(richLocation as any)

    const resultVi = await touristService.getLocationDetail('trang-an', 'user-1', 'vi') as any
    expect(resultVi.overview).toBe('Tổng quan VI')
    expect(resultVi.history).toBe('Lịch sử VI')
    expect(resultVi.highlights).toBe('Điểm nổi bật VI')
    expect(resultVi.visitingGuide).toBe('Hướng dẫn VI')

    vi.mocked(mockLocationRepo.findBySlugFull).mockResolvedValue(richLocation as any)
    const resultEn = await touristService.getLocationDetail('trang-an', 'user-1', 'en') as any
    expect(resultEn.overview).toBe('Overview EN')
    expect(resultEn.history).toBe('History EN')
  })

  it('returns images and spots arrays in location detail', async () => {
    const locationWithContent = {
      ...mockLocations[0],
      locationImages: [
        { id: 'img-1', url: 'https://cdn.test/img1.jpg', caption: 'Cap 1' },
        { id: 'img-2', url: 'https://cdn.test/img2.jpg', caption: null },
      ],
      spots: [
        {
          id: 'spot-1',
          nameVi: 'Bến thuyền',
          nameEn: 'Boat dock',
          descriptionVi: 'Mô tả spot VI',
          descriptionEn: 'Spot desc EN',
          audioViUrl: 'https://cdn.test/spot-vi.mp3',
          audioEnUrl: null,
          images: [{ id: 'simg-1', url: 'https://cdn.test/spot-img.jpg' }],
        },
      ],
    }
    vi.mocked(mockTicketRepo.findActiveByUser).mockResolvedValue(makeTicketUser('all_locations') as any)
    vi.mocked(mockLocationRepo.findBySlugFull).mockResolvedValue(locationWithContent as any)

    const result = await touristService.getLocationDetail('trang-an', 'user-1', 'vi') as any

    expect(result.images).toHaveLength(2)
    expect(result.images[0]).toEqual({ id: 'img-1', url: 'https://cdn.test/img1.jpg', caption: 'Cap 1' })
    expect(result.spots).toHaveLength(1)
    expect(result.spots[0].name).toBe('Bến thuyền')
    expect(result.spots[0].audioUrl).toBe('https://cdn.test/spot-vi.mp3')
    expect(result.spots[0].images).toHaveLength(1)
    expect(result.spots[0].images[0].url).toBe('https://cdn.test/spot-img.jpg')
  })
})
