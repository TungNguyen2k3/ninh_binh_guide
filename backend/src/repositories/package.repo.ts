import type { PrismaClient } from '@prisma/client'

export class PackageRepo {
  constructor(private readonly prisma: PrismaClient) {}

  findAll() {
    return this.prisma.package.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        locations: {
          include: {
            location: {
              select: { id: true, nameVi: true, nameEn: true, slug: true },
            },
          },
        },
      },
    })
  }

  findById(id: string) {
    return this.prisma.package.findUnique({
      where: { id },
      include: { locations: { include: { location: true } } },
    })
  }

  create(data: {
    name: string
    description?: string
    type: 'all_locations' | 'custom'
    validityHours: number
    price?: number
  }) {
    return this.prisma.package.create({ data })
  }

  update(
    id: string,
    data: Partial<{
      name: string
      description: string
      type: 'all_locations' | 'custom'
      validityHours: number
      price: number
      isActive: boolean
    }>
  ) {
    return this.prisma.package.update({ where: { id }, data })
  }

  setLocations(packageId: string, locationIds: string[]) {
    return this.prisma.$transaction([
      this.prisma.packageLocation.deleteMany({ where: { packageId } }),
      this.prisma.packageLocation.createMany({
        data: locationIds.map((locationId) => ({ packageId, locationId })),
        skipDuplicates: true,
      }),
    ])
  }

  delete(id: string) {
    return this.prisma.package.delete({ where: { id } })
  }
}
