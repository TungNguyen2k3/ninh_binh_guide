import { PrismaClient, type Role } from '@prisma/client'

export interface PublicUser {
  id: string
  email: string | null
  phone: string | null
  name: string
  role: Role
  createdAt: Date
}

export interface CreateUserData {
  email?: string
  phone?: string
  passwordHash: string
  name: string
  role?: Role
}

// Select object that always excludes passwordHash
const publicUserSelect = {
  id: true,
  email: true,
  phone: true,
  name: true,
  role: true,
  createdAt: true,
} as const

export class UserRepo {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<PublicUser | null> {
    return this.prisma.user.findUnique({
      where: { id },
      select: publicUserSelect,
    })
  }

  // Internal method — includes passwordHash for authentication
  async findByIdWithHash(id: string) {
    return this.prisma.user.findUnique({ where: { id } })
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } })
  }

  async findByPhone(phone: string) {
    return this.prisma.user.findUnique({ where: { phone } })
  }

  async create(data: CreateUserData): Promise<PublicUser> {
    return this.prisma.user.create({
      data: {
        email: data.email,
        phone: data.phone,
        passwordHash: data.passwordHash,
        name: data.name,
        role: data.role ?? 'tourist',
      },
      select: publicUserSelect,
    })
  }

  async countByRole() {
    const [admin, staff, tourist] = await Promise.all([
      this.prisma.user.count({ where: { role: 'admin' } }),
      this.prisma.user.count({ where: { role: 'staff' } }),
      this.prisma.user.count({ where: { role: 'tourist' } }),
    ])
    return { admin, staff, tourist, total: admin + staff + tourist }
  }

  async findAll(opts?: {
    search?: string
    role?: Role
    page?: number
    limit?: number
  }) {
    const { search = '', role, page = 1, limit = 20 } = opts ?? {}
    const where = {
      ...(role && { role }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { email: { contains: search, mode: 'insensitive' as const } },
          { phone: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
    }
    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        select: publicUserSelect,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.user.count({ where }),
    ])
    return { users, total }
  }

  updateRole(id: string, role: Role): Promise<PublicUser> {
    return this.prisma.user.update({
      where: { id },
      data: { role },
      select: publicUserSelect,
    })
  }

  deleteById(id: string) {
    return this.prisma.user.delete({ where: { id } })
  }
}
