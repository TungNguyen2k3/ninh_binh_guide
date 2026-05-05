import type { PrismaClient } from '@prisma/client'
import type {
  CreateTourDto,
  UpdateTourDto,
  CreateTourStopDto,
  UpdateTourStopDto,
} from '../schemas/tour.schema.js'

const STOP_INCLUDE = {
  location: {
    select: {
      id: true,
      nameVi: true,
      nameEn: true,
      slug: true,
      latitude: true,
      longitude: true,
      imageUrl: true,
      audioViUrl: true,
      audioEnUrl: true,
    },
  },
} as const

export class TourRepo {
  constructor(private readonly prisma: PrismaClient) {}

  findAll(opts?: { isActive?: boolean }) {
    const where = opts?.isActive !== undefined ? { isActive: opts.isActive } : {}
    return this.prisma.tour.findMany({
      where,
      orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }],
      include: { stops: { orderBy: { order: 'asc' }, include: STOP_INCLUDE } },
    })
  }

  findById(id: string) {
    return this.prisma.tour.findUnique({
      where: { id },
      include: { stops: { orderBy: { order: 'asc' }, include: STOP_INCLUDE } },
    })
  }

  create(data: CreateTourDto) {
    return this.prisma.tour.create({ data, include: { stops: true } })
  }

  update(id: string, data: UpdateTourDto) {
    return this.prisma.tour.update({
      where: { id },
      data,
      include: { stops: { orderBy: { order: 'asc' }, include: STOP_INCLUDE } },
    })
  }

  delete(id: string) {
    return this.prisma.tour.delete({ where: { id } })
  }

  addStop(tourId: string, data: CreateTourStopDto) {
    return this.prisma.tourStop.create({
      data: { tourId, ...data },
      include: STOP_INCLUDE,
    })
  }

  updateStop(stopId: string, data: UpdateTourStopDto) {
    return this.prisma.tourStop.update({
      where: { id: stopId },
      data,
      include: STOP_INCLUDE,
    })
  }

  deleteStop(stopId: string) {
    return this.prisma.tourStop.delete({ where: { id: stopId } })
  }

  async reorderStops(stops: { id: string; order: number }[]) {
    await Promise.all(
      stops.map(({ id, order }) =>
        this.prisma.tourStop.update({ where: { id }, data: { order } })
      )
    )
  }

  findActive() {
    return this.prisma.tour.findMany({
      where: { isActive: true },
      orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }],
      include: { stops: { orderBy: { order: 'asc' }, include: STOP_INCLUDE } },
    })
  }
}
