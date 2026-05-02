import type { LocationRepo } from '../repositories/location.repo.js'
import { uploadAudio, uploadImage } from '../lib/cloudinary.js'
import { cache } from '../lib/cache.js'
import { NotFoundError, ConflictError } from '../lib/errors.js'
import type { CreateLocationDto, UpdateLocationDto } from '../schemas/location.schema.js'

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
    return updated
  }

  async delete(id: string) {
    await this.getById(id)
    await this.locationRepo.delete(id)
    cache.del('locations:all')
  }

  async uploadAudioFile(id: string, lang: 'vi' | 'en', buffer: Buffer, filename: string) {
    const location = await this.getById(id)
    const url = await uploadAudio(buffer, `${location.slug}_${lang}_${Date.now()}`)
    const field = lang === 'vi' ? 'audioViUrl' : 'audioEnUrl'
    const updated = await this.locationRepo.update(id, { [field]: url })
    cache.del(`location:slug:${location.slug}`)
    return updated
  }

  async uploadImageFile(id: string, buffer: Buffer, filename: string) {
    const location = await this.getById(id)
    const url = await uploadImage(buffer, `${location.slug}_${Date.now()}`)
    const updated = await this.locationRepo.update(id, { imageUrl: url })
    cache.del(`location:slug:${location.slug}`)
    return updated
  }
}
