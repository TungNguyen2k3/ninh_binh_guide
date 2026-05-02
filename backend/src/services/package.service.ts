import type { PackageRepo } from '../repositories/package.repo.js'
import type { LocationRepo } from '../repositories/location.repo.js'
import { NotFoundError, ValidationError } from '../lib/errors.js'
import { cache } from '../lib/cache.js'
import type { CreatePackageDto, UpdatePackageDto } from '../schemas/package.schema.js'

export class PackageService {
  constructor(
    private readonly packageRepo: PackageRepo,
    private readonly locationRepo: LocationRepo
  ) {}

  async list() {
    return this.packageRepo.findAll()
  }

  async getById(id: string) {
    const pkg = await this.packageRepo.findById(id)
    if (!pkg) throw new NotFoundError('Package')
    return pkg
  }

  async create(data: CreatePackageDto) {
    const pkg = await this.packageRepo.create(data)
    cache.del('packages:all')
    return pkg
  }

  async update(id: string, data: UpdatePackageDto) {
    await this.getById(id)
    const updated = await this.packageRepo.update(id, data)
    cache.del('packages:all')
    return updated
  }

  async assignLocations(packageId: string, locationIds: string[]) {
    const pkg = await this.getById(packageId)
    if (pkg.type === 'all_locations' && locationIds.length > 0) {
      throw new ValidationError('Package of type all_locations does not support assigning specific locations')
    }
    await this.packageRepo.setLocations(packageId, locationIds)
    cache.del('packages:all')
    return this.packageRepo.findById(packageId)
  }

  async delete(id: string) {
    await this.getById(id)
    await this.packageRepo.delete(id)
    cache.del('packages:all')
  }
}
