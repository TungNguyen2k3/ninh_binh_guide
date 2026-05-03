import { LocationRepo } from '../repositories/location.repo.js'
import { TicketRepo } from '../repositories/ticket.repo.js'
import { cache } from '../lib/cache.js'
import { ForbiddenError, NotFoundError } from '../lib/errors.js'

type MappedLocation = ReturnType<typeof mapLocation>

function mapLocation(
  loc: {
    id: string
    slug: string
    nameVi: string
    nameEn: string
    descriptionVi: string | null
    descriptionEn: string | null
    imageUrl: string | null
    audioViUrl: string | null
    audioEnUrl: string | null
    latitude: number
    longitude: number
    displayOrder: number
    _count?: { spots: number }
    locationImages?: { url: string }[]
  },
  lang: 'vi' | 'en'
) {
  return {
    id: loc.id,
    slug: loc.slug,
    name: lang === 'vi' ? loc.nameVi : loc.nameEn,
    description: lang === 'vi' ? (loc.descriptionVi ?? '') : (loc.descriptionEn ?? ''),
    imageUrl: loc.imageUrl ?? loc.locationImages?.[0]?.url ?? null,
    hasAudioVi: !!loc.audioViUrl,
    hasAudioEn: !!loc.audioEnUrl,
    latitude: loc.latitude,
    longitude: loc.longitude,
    displayOrder: loc.displayOrder,
    spotsCount: loc._count?.spots ?? 0,
  }
}

export class TouristService {
  constructor(
    private readonly locationRepo: LocationRepo,
    private readonly ticketRepo: TicketRepo
  ) {}

  async getLocationsForTourist(userId: string, lang: 'vi' | 'en'): Promise<MappedLocation[]> {
    const cacheKey = `locations:tourist:${userId}:${lang}`
    const cached = cache.get<MappedLocation[]>(cacheKey)
    if (cached) return cached

    const ticketUser = await this.ticketRepo.findActiveByUser(userId)
    if (!ticketUser) throw new ForbiddenError('Bạn chưa kích hoạt vé tham quan')

    const { ticket } = ticketUser

    let locations: Awaited<ReturnType<LocationRepo['findByIds']>>

    if (ticket.package.type === 'all_locations') {
      const [allLocations] = await this.locationRepo.findAll({ isActive: true, limit: 1000 })
      locations = allLocations
    } else {
      const locationIds = ticket.package.locations.map((pl: any) => pl.locationId)
      locations = await this.locationRepo.findByIds(locationIds)
    }

    const result = locations.map((loc) => mapLocation(loc, lang))
    cache.set(cacheKey, result, 300)
    return result
  }

  async getLocationDetail(slug: string, userId: string, lang: 'vi' | 'en') {
    const cacheKey = `location:detail:${slug}:${lang}`
    const cached = cache.get<object>(cacheKey)
    if (cached) return cached

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const location = await this.locationRepo.findBySlugFull(slug) as any
    if (!location || !location.isActive) throw new NotFoundError('Location')

    const ticketUser = await this.ticketRepo.findActiveByUser(userId)
    if (!ticketUser) throw new ForbiddenError('Bạn chưa kích hoạt vé tham quan')

    const { ticket } = ticketUser

    if (ticket.package.type === 'custom') {
      const allowedIds = ticket.package.locations.map((pl: any) => pl.locationId)
      if (!allowedIds.includes(location.id)) {
        throw new ForbiddenError('Địa điểm này không có trong gói của bạn')
      }
    }

    const result = {
      id: location.id,
      slug: location.slug,
      name: lang === 'vi' ? location.nameVi : location.nameEn,
      description: lang === 'vi' ? (location.descriptionVi ?? '') : (location.descriptionEn ?? ''),
      overview: lang === 'vi' ? (location.overviewVi ?? null) : (location.overviewEn ?? null),
      history: lang === 'vi' ? (location.historyVi ?? null) : (location.historyEn ?? null),
      highlights: lang === 'vi' ? (location.highlightsVi ?? null) : (location.highlightsEn ?? null),
      openTime: location.openTime ?? null,
      closeTime: location.closeTime ?? null,
      admissionFee: location.admissionFee ?? null,
      estimatedDuration: location.estimatedDuration ?? null,
      address: location.address ?? null,
      bestTime: location.bestTime ?? null,
      imageUrl: location.imageUrl ?? null,
      audioUrl: lang === 'vi'
        ? (location.audioViUrl ?? location.audioEnUrl ?? null)
        : (location.audioEnUrl ?? location.audioViUrl ?? null),
      images: (location.locationImages ?? []).map((img: { id: string; url: string; caption: string | null }) => ({
        id: img.id,
        url: img.url,
        caption: img.caption,
      })),
      spots: (location.spots ?? []).map((spot: {
        id: string
        nameVi: string
        nameEn: string
        descriptionVi: string | null
        descriptionEn: string | null
        audioViUrl: string | null
        audioEnUrl: string | null
        images: Array<{ id: string; url: string }>
      }) => ({
        id: spot.id,
        name: lang === 'vi' ? spot.nameVi : spot.nameEn,
        description: lang === 'vi' ? (spot.descriptionVi ?? null) : (spot.descriptionEn ?? null),
        audioUrl: lang === 'vi'
          ? (spot.audioViUrl ?? spot.audioEnUrl ?? null)
          : (spot.audioEnUrl ?? spot.audioViUrl ?? null),
        images: spot.images.map((img: { id: string; url: string }) => ({ id: img.id, url: img.url })),
      })),
      latitude: location.latitude,
      longitude: location.longitude,
    }

    cache.set(cacheKey, result, 300)
    return result
  }
}
