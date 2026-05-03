import type { Role } from '@prisma/client'
import { UserRepo } from '../repositories/user.repo.js'
import { hashPassword } from '../lib/bcrypt.js'
import { NotFoundError, ConflictError, ForbiddenError } from '../lib/errors.js'

export class UserService {
  constructor(private readonly userRepo: UserRepo) {}

  async listUsers(opts?: { search?: string; role?: Role; page?: number; limit?: number }) {
    return this.userRepo.findAll(opts)
  }

  countByRole() {
    return this.userRepo.countByRole()
  }

  async createStaff(data: {
    email?: string
    phone?: string
    name: string
    password: string
    role: 'admin' | 'staff'
  }) {
    if (!data.email && !data.phone) {
      throw new ConflictError('Email hoặc số điện thoại là bắt buộc')
    }
    if (data.email) {
      const existing = await this.userRepo.findByEmail(data.email)
      if (existing) throw new ConflictError('Email đã tồn tại')
    }
    if (data.phone) {
      const existing = await this.userRepo.findByPhone(data.phone)
      if (existing) throw new ConflictError('Số điện thoại đã tồn tại')
    }
    const passwordHash = await hashPassword(data.password)
    return this.userRepo.create({
      email: data.email,
      phone: data.phone,
      passwordHash,
      name: data.name,
      role: data.role,
    })
  }

  async changeRole(targetId: string, newRole: Role, requesterId: string) {
    if (targetId === requesterId) {
      throw new ForbiddenError('Không thể thay đổi role của chính mình')
    }
    const user = await this.userRepo.findById(targetId)
    if (!user) throw new NotFoundError('User')
    return this.userRepo.updateRole(targetId, newRole)
  }

  async deleteUser(targetId: string, requesterId: string) {
    if (targetId === requesterId) {
      throw new ForbiddenError('Không thể xóa tài khoản của chính mình')
    }
    const user = await this.userRepo.findById(targetId)
    if (!user) throw new NotFoundError('User')
    await this.userRepo.deleteById(targetId)
  }
}
