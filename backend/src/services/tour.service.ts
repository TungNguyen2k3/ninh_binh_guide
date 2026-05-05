import type { TourRepo } from '../repositories/tour.repo.js'
import { NotFoundError } from '../lib/errors.js'
import type {
  CreateTourDto,
  UpdateTourDto,
  CreateTourStopDto,
  UpdateTourStopDto,
} from '../schemas/tour.schema.js'

export class TourService {
  constructor(private readonly tourRepo: TourRepo) {}

  async list(opts?: { isActive?: boolean }) {
    return this.tourRepo.findAll(opts)
  }

  async getById(id: string) {
    const tour = await this.tourRepo.findById(id)
    if (!tour) throw new NotFoundError('Tour')
    return tour
  }

  async create(data: CreateTourDto) {
    return this.tourRepo.create(data)
  }

  async update(id: string, data: UpdateTourDto) {
    await this.getById(id)
    return this.tourRepo.update(id, data)
  }

  async delete(id: string) {
    await this.getById(id)
    return this.tourRepo.delete(id)
  }

  async addStop(tourId: string, data: CreateTourStopDto) {
    await this.getById(tourId)
    return this.tourRepo.addStop(tourId, data)
  }

  async updateStop(tourId: string, stopId: string, data: UpdateTourStopDto) {
    await this.getById(tourId)
    return this.tourRepo.updateStop(stopId, data)
  }

  async deleteStop(tourId: string, stopId: string) {
    await this.getById(tourId)
    return this.tourRepo.deleteStop(stopId)
  }

  async reorderStops(tourId: string, stops: { id: string; order: number }[]) {
    await this.getById(tourId)
    return this.tourRepo.reorderStops(stops)
  }

  async getActiveTours() {
    return this.tourRepo.findActive()
  }
}
