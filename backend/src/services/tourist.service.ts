import { LocationRepo } from '../repositories/location.repo.js'
import { TicketRepo } from '../repositories/ticket.repo.js'
import { cache } from '../lib/cache.js'
import { ForbiddenError, NotFoundError } from '../lib/errors.js'

/** Format a TIME Date object to "HH:MM" string */
function formatTime(d: Date | null | undefined): string | null {
  if (!d) return null
  const h = d.getUTCHours().toString().padStart(2, '0')
  const m = d.getUTCMinutes().toString().padStart(2, '0')
  return `${h}:${m}`
}

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

  async getLocationsForTourist(userId: string | null, lang: 'vi' | 'en'): Promise<MappedLocation[]> {
    const cacheKey = `locations:tourist:${userId ?? 'guest'}:${lang}`
    const cached = cache.get<MappedLocation[]>(cacheKey)
    if (cached) return cached

    const ticketUser = userId ? await this.ticketRepo.findActiveByUser(userId) : null

    let locations: Awaited<ReturnType<LocationRepo['findByIds']>>

    // Guests and users without a ticket both see all active locations; audio remains gated
    if (!ticketUser) {
      const [allLocations] = await this.locationRepo.findAll({ isActive: true, limit: 1000 })
      locations = allLocations
    } else {
      const { ticket } = ticketUser
      if (ticket.package.type === 'all_locations') {
        const [allLocations] = await this.locationRepo.findAll({ isActive: true, limit: 1000 })
        locations = allLocations
      } else {
        const locationIds = ticket.package.locations.map((pl: any) => pl.locationId)
        locations = await this.locationRepo.findByIds(locationIds)
      }
    }

    const result = locations.map((loc) => mapLocation(loc, lang))
    cache.set(cacheKey, result, 300)
    return result
  }

  async getLocationDetail(slug: string, userId: string | null, lang: 'vi' | 'en') {
    // Check ticket first — determines audio access (guests always get hasTicket=false)
    const ticketUser = userId ? await this.ticketRepo.findActiveByUser(userId) : null
    const hasTicket = !!ticketUser

    // Cache full location data (with audio) separately from restricted (no audio)
    const cacheKey = `location:detail:${slug}:${lang}`
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let locationData = cache.get<any>(cacheKey)

    if (!locationData) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const location = await this.locationRepo.findBySlugFull(slug) as any
      if (!location || !location.isActive) throw new NotFoundError('Location')

      locationData = {
        id: location.id,
        slug: location.slug,
        name: lang === 'vi' ? location.nameVi : location.nameEn,
        description: lang === 'vi' ? (location.descriptionVi ?? '') : (location.descriptionEn ?? ''),
        overview: lang === 'vi' ? (location.overviewVi ?? null) : (location.overviewEn ?? null),
        history: lang === 'vi' ? (location.historyVi ?? null) : (location.historyEn ?? null),
        highlights: lang === 'vi' ? (location.highlightsVi ?? null) : (location.highlightsEn ?? null),
        openTime: formatTime(location.openTime),
        closeTime: formatTime(location.closeTime),
        admissionFees: (location.admissionFees ?? []).map((f: { labelVi: string; labelEn: string; price: number }) => ({
          labelVi: f.labelVi,
          labelEn: f.labelEn,
          price: f.price,
        })),
        estimatedDuration: location.estimatedDuration ?? null,
        address: location.address ?? null,
        bestTime: location.bestTime ?? null,
        imageUrl: location.imageUrl ?? null,
        _audioUrl: lang === 'vi'
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
          _audioUrl: lang === 'vi'
            ? (spot.audioViUrl ?? spot.audioEnUrl ?? null)
            : (spot.audioEnUrl ?? spot.audioViUrl ?? null),
          images: spot.images.map((img: { id: string; url: string }) => ({ id: img.id, url: img.url })),
        })),
        latitude: location.latitude,
        longitude: location.longitude,
      }

      cache.set(cacheKey, locationData, 300)
    }

    // Check custom package access
    if (ticketUser) {
      const { ticket } = ticketUser
      if (ticket.package.type === 'custom') {
        const allowedIds = ticket.package.locations.map((pl: any) => pl.locationId)
        if (!allowedIds.includes(locationData.id)) {
          throw new ForbiddenError('Địa điểm này không có trong gói của bạn')
        }
      }
    }

    // Gate audio: only expose URLs when user has an active ticket
    return {
      ...locationData,
      audioGated: !hasTicket,
      audioUrl: hasTicket ? locationData._audioUrl : null,
      spots: locationData.spots.map((s: any) => ({
        ...s,
        audioUrl: hasTicket ? s._audioUrl : null,
      })),
    }
  }
}
