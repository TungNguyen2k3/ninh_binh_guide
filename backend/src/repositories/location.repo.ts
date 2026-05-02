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
      }),
      this.prisma.location.count({ where }),
    ])
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
    })
  }
}
