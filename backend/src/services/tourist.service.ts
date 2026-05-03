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
  },
  lang: 'vi' | 'en'
) {
  return {
    id: loc.id,
    slug: loc.slug,
    name: lang === 'vi' ? loc.nameVi : loc.nameEn,
    description: lang === 'vi' ? (loc.descriptionVi ?? '') : (loc.descriptionEn ?? ''),
    imageUrl: loc.imageUrl ?? null,
    hasAudioVi: !!loc.audioViUrl,
    hasAudioEn: !!loc.audioEnUrl,
    latitude: loc.latitude,
    longitude: loc.longitude,
    displayOrder: loc.displayOrder,
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
    if (ticket.expiresAt < new Date()) throw new ForbiddenError('Vé đã hết hạn')

    let locations: Awaited<ReturnType<LocationRepo['findByIds']>>

    if (ticket.package.type === 'all_locations') {
      const [allLocations] = await this.locationRepo.findAll({ isActive: true, limit: 1000 })
      locations = allLocations
    } else {
      const locationIds = ticket.package.locations.map((pl) => pl.locationId)
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

    const location = await this.locationRepo.findBySlugFull(slug)
    if (!location || !location.isActive) throw new NotFoundError('Location')

    const ticketUser = await this.ticketRepo.findActiveByUser(userId)
    if (!ticketUser) throw new ForbiddenError('Bạn chưa kích hoạt vé tham quan')

    const { ticket } = ticketUser
    if (ticket.expiresAt < new Date()) throw new ForbiddenError('Vé đã hết hạn')

    if (ticket.package.type === 'custom') {
      const allowedIds = ticket.package.locations.map((pl) => pl.locationId)
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
      visitingGuide: lang === 'vi' ? (location.visitingGuideVi ?? null) : (location.visitingGuideEn ?? null),
      imageUrl: location.imageUrl ?? null,
      audioUrl: lang === 'vi' ? (location.audioViUrl ?? null) : (location.audioEnUrl ?? null),
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
        audioUrl: lang === 'vi' ? (spot.audioViUrl ?? null) : (spot.audioEnUrl ?? null),
        images: spot.images.map((img: { id: string; url: string }) => ({ id: img.id, url: img.url })),
      })),
      latitude: location.latitude,
      longitude: location.longitude,
    }

    cache.set(cacheKey, result, 300)
    return result
  }
}
