import type { LocationRepo } from '../repositories/location.repo.js'
import { uploadAudio, uploadImage } from '../lib/cloudinary.js'
import { cache } from '../lib/cache.js'
import { NotFoundError, ConflictError } from '../lib/errors.js'
import type { CreateLocationDto, UpdateLocationDto, CreateSpotDto, UpdateSpotDto } from '../schemas/location.schema.js'

export class LocationService {
  constructor(private readonly locationRepo: LocationRepo) {}

  async list(opts: { search?: string; page?: number; limit?: number; isActive?: boolean }) {
    const [locations, total] = await this.locationRepo.findAll(opts)
    return { locations, total }
  }

  async getById(id: string) {
    const loc = await this.locationRepo.findById(id)
    if (!loc) throw new NotFoundError('Location')
    return loc
  }

  async getByIdFull(id: string) {
    const loc = await this.locationRepo.findById(id)
    if (!loc) throw new NotFoundError('Location')
    // For admin: re-fetch with full relations via slug
    const full = await this.locationRepo.findBySlugFull(loc.slug)
    if (!full) throw new NotFoundError('Location')
    return full
  }

  async create(data: CreateLocationDto) {
    const existing = await this.locationRepo.findBySlug(data.slug)
    if (existing) throw new ConflictError(`Slug '${data.slug}' already exists`)
    const location = await this.locationRepo.create(data)
    cache.del('locations:all')
    return location
  }

  async update(id: string, data: UpdateLocationDto) {
    await this.getById(id)
    if (data.slug) {
      const existing = await this.locationRepo.findBySlug(data.slug)
      if (existing && existing.id !== id) throw new ConflictError(`Slug '${data.slug}' already exists`)
    }
    const updated = await this.locationRepo.update(id, data)
    cache.del('locations:all')
    cache.del(`location:slug:${updated.slug}`)
    cache.del(`location:detail:${updated.slug}:vi`)
    cache.del(`location:detail:${updated.slug}:en`)
    return updated
  }

  async delete(id: string) {
    const location = await this.getById(id)
    await this.locationRepo.delete(id)
    cache.del('locations:all')
    cache.del(`location:slug:${location.slug}`)
    cache.del(`location:detail:${location.slug}:vi`)
    cache.del(`location:detail:${location.slug}:en`)
  }

  async uploadAudioFile(id: string, lang: 'vi' | 'en', buffer: Buffer, filename: string) {
    const location = await this.getById(id)
    const url = await uploadAudio(buffer, `${location.slug}_${lang}_${Date.now()}`)
    const field = lang === 'vi' ? 'audioViUrl' : 'audioEnUrl'
    const updated = await this.locationRepo.update(id, { [field]: url })
    cache.del(`location:slug:${location.slug}`)
    cache.del(`location:detail:${location.slug}:vi`)
    cache.del(`location:detail:${location.slug}:en`)
    return updated
  }

  async uploadImageFile(id: string, buffer: Buffer, filename: string) {
    const location = await this.getById(id)
    const url = await uploadImage(buffer, `${location.slug}_${Date.now()}`)
    const updated = await this.locationRepo.update(id, { imageUrl: url })
    cache.del(`location:slug:${location.slug}`)
    cache.del(`location:detail:${location.slug}:vi`)
    cache.del(`location:detail:${location.slug}:en`)
    return updated
  }

  async uploadLocationImage(locationId: string, buffer: Buffer, filename: string) {
    const location = await this.getById(locationId)
    const url = await uploadImage(buffer, `loc-${locationId}-img-${Date.now()}`)
    const image = await this.locationRepo.addImage(locationId, { url })
    cache.del('locations:all')
    cache.del(`location:detail:${location.slug}:vi`)
    cache.del(`location:detail:${location.slug}:en`)
    return image
  }

  async deleteLocationImage(locationId: string, imageId: string) {
    const location = await this.getById(locationId)
    await this.locationRepo.deleteImage(imageId)
    cache.del(`location:detail:${location.slug}:vi`)
    cache.del(`location:detail:${location.slug}:en`)
  }

  async getSpotById(spotId: string) {
    const spot = await this.locationRepo.findSpotById(spotId)
    if (!spot) throw new NotFoundError('Spot')
    return spot
  }

  async createSpot(locationId: string, data: CreateSpotDto) {
    await this.getById(locationId)
    return this.locationRepo.createSpot(locationId, data)
  }

  async updateSpot(locationId: string, spotId: string, data: UpdateSpotDto) {
    const location = await this.getById(locationId)
    const updated = await this.locationRepo.updateSpot(spotId, data)
    cache.del(`location:detail:${location.slug}:vi`)
    cache.del(`location:detail:${location.slug}:en`)
    return updated
  }

  async deleteSpot(locationId: string, spotId: string) {
    const location = await this.getById(locationId)
    await this.locationRepo.deleteSpot(spotId)
    cache.del(`location:detail:${location.slug}:vi`)
    cache.del(`location:detail:${location.slug}:en`)
  }

  async uploadSpotAudio(
    locationId: string,
    spotId: string,
    lang: 'vi' | 'en',
    buffer: Buffer,
    filename: string
  ) {
    const location = await this.getById(locationId)
    const url = await uploadAudio(buffer, `spot-${spotId}-${lang}-${Date.now()}`)
    const field = lang === 'vi' ? 'audioViUrl' : 'audioEnUrl'
    const updated = await this.locationRepo.updateSpot(spotId, { [field]: url })
    cache.del(`location:detail:${location.slug}:vi`)
    cache.del(`location:detail:${location.slug}:en`)
    return updated
  }

  async uploadSpotImage(locationId: string, spotId: string, buffer: Buffer, filename: string) {
    const location = await this.getById(locationId)
    const url = await uploadImage(buffer, `spot-${spotId}-img-${Date.now()}`)
    const image = await this.locationRepo.addSpotImage(spotId, { url })
    cache.del(`location:detail:${location.slug}:vi`)
    cache.del(`location:detail:${location.slug}:en`)
    return image
  }

  async deleteSpotImage(locationId: string, spotId: string, imageId: string) {
    const location = await this.getById(locationId)
    await this.locationRepo.deleteSpotImage(imageId)
    cache.del(`location:detail:${location.slug}:vi`)
    cache.del(`location:detail:${location.slug}:en`)
  }
}
