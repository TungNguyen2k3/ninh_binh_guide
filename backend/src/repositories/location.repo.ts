import type { PrismaClient } from '@prisma/client'

export class LocationRepo {
  constructor(private readonly prisma: PrismaClient) {}

  findAll(opts?: { search?: string; page?: number; limit?: number; isActive?: boolean }) {
    const { search = '', page = 1, limit = 20, isActive } = opts ?? {}
    const where = {
      ...(isActive !== undefined && { isActive }),
      ...(search && {
        OR: [
          { nameVi: { contains: search, mode: 'insensitive' as const } },
          { nameEn: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
    }
    return Promise.all([
      this.prisma.location.findMany({
        where,
        orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }],
        skip: (page - 1) * limit,
        take: limit,
        include: {
          // @ts-ignore -- Prisma client type lags schema
          _count: { select: { spots: true } },
          locationImages: { orderBy: { order: 'asc' as const }, take: 1 },
          admissionFees: { orderBy: { order: 'asc' as const } },
        },
      }),
      this.prisma.location.count({ where }),
    ])
  }

  count(opts?: { isActive?: boolean }) {
    const where = opts?.isActive !== undefined ? { isActive: opts.isActive } : {}
    return this.prisma.location.count({ where })
  }

  findById(id: string) {
    return this.prisma.location.findUnique({ where: { id } })
  }

  findBySlug(slug: string) {
    return this.prisma.location.findUnique({
      where: { slug },
      include: { packages: { include: { package: true } } },
    })
  }

  create(data: {
    slug: string
    nameVi: string
    nameEn: string
    descriptionVi?: string
    descriptionEn?: string
    latitude: number
    longitude: number
    displayOrder?: number
    imageUrl?: string
    audioViUrl?: string
    audioEnUrl?: string
  }) {
    return this.prisma.location.create({ data })
  }

  update(
    id: string,
    data: Partial<{
      slug: string
      nameVi: string
      nameEn: string
      descriptionVi: string
      descriptionEn: string
      overviewVi: string
      overviewEn: string
      historyVi: string
      historyEn: string
      highlightsVi: string
      highlightsEn: string
      openTime: Date | null
      closeTime: Date | null
      estimatedDuration: number | null
      address: string
      bestTime: string
      latitude: number
      longitude: number
      displayOrder: number
      imageUrl: string
      audioViUrl: string
      audioEnUrl: string
      isActive: boolean
    }>
  ) {
    return this.prisma.location.update({ where: { id }, data })
  }

  delete(id: string) {
    return this.prisma.location.delete({ where: { id } })
  }

  findByPackageId(packageId: string) {
    return this.prisma.location.findMany({
      where: { packages: { some: { packageId } }, isActive: true },
      orderBy: { displayOrder: 'asc' },
    })
  }

  findByIds(ids: string[]) {
    return this.prisma.location.findMany({
      where: { id: { in: ids }, isActive: true },
      orderBy: { displayOrder: 'asc' },
      include: {
        // @ts-ignore -- Prisma client type lags schema
        _count: { select: { spots: true } },
        locationImages: { orderBy: { order: 'asc' as const }, take: 1 },
        admissionFees: { orderBy: { order: 'asc' as const } },
      },
    })
  }

  findBySlugFull(slug: string) {
    return this.prisma.location.findUnique({
      where: { slug },
      include: {
        locationImages: { orderBy: { order: 'asc' } },
        admissionFees: { orderBy: { order: 'asc' } },
        spots: {
          orderBy: { order: 'asc' },
          include: { images: { orderBy: { order: 'asc' } } },
        },
      },
    })
  }

  addAdmissionFee(
    locationId: string,
    data: { labelVi: string; labelEn: string; price: number; order: number }
  ) {
    return this.prisma.locationAdmissionFee.create({ data: { locationId, ...data } })
  }

  updateAdmissionFee(
    feeId: string,
    data: Partial<{ labelVi: string; labelEn: string; price: number; order: number }>
  ) {
    return this.prisma.locationAdmissionFee.update({ where: { id: feeId }, data })
  }

  deleteAdmissionFee(feeId: string) {
    return this.prisma.locationAdmissionFee.delete({ where: { id: feeId } })
  }

  addImage(locationId: string, data: { url: string; caption?: string; order?: number }) {
    return this.prisma.locationImage.create({ data: { locationId, ...data } })
  }

  deleteImage(imageId: string) {
    return this.prisma.locationImage.delete({ where: { id: imageId } })
  }

  findSpotById(spotId: string) {
    return this.prisma.locationSpot.findUnique({
      where: { id: spotId },
      include: { images: { orderBy: { order: 'asc' } } },
    })
  }

  createSpot(
    locationId: string,
    data: {
      nameVi: string
      nameEn: string
      descriptionVi?: string
      descriptionEn?: string
      latitude?: number | null
      longitude?: number | null
      order?: number
    }
  ) {
    return this.prisma.locationSpot.create({ data: { locationId, ...data } })
  }

  updateSpot(
    spotId: string,
    data: Partial<{
      nameVi: string
      nameEn: string
      descriptionVi: string
      descriptionEn: string
      audioViUrl: string
      audioEnUrl: string
      latitude: number | null
      longitude: number | null
      order: number
    }>
  ) {
    return this.prisma.locationSpot.update({ where: { id: spotId }, data })
  }

  deleteSpot(spotId: string) {
    return this.prisma.locationSpot.delete({ where: { id: spotId } })
  }

  addSpotImage(spotId: string, data: { url: string; order?: number }) {
    return this.prisma.locationSpotImage.create({ data: { spotId, ...data } })
  }

  deleteSpotImage(imageId: string) {
    return this.prisma.locationSpotImage.delete({ where: { id: imageId } })
  }
}
