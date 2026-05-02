import { UserRepo, type PublicUser } from '../repositories/user.repo.js'
import { RefreshTokenRepo } from '../repositories/refresh-token.repo.js'
import { hashPassword, comparePassword } from '../lib/bcrypt.js'
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../lib/jwt.js'
import {
  ConflictError,
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from '../lib/errors.js'
import { env } from '../lib/env.js'

export interface RegisterInput {
  email?: string
  phone?: string
  password: string
  name: string
}

export interface LoginInput {
  email?: string
  phone?: string
  password: string
}

export interface AuthResult {
  user: PublicUser
  accessToken: string
  refreshToken: string
}

// Parse JWT_REFRESH_TTL (e.g. '7d') into milliseconds for computing expiresAt
function parseRefreshTtlMs(): number {
  const ttl = env.JWT_REFRESH_TTL
  const match = ttl.match(/^(\d+)([smhd])$/)
  if (!match) return 7 * 24 * 3600 * 1000 // default 7 days

  const value = parseInt(match[1], 10)
  const unit = match[2]

  const multipliers: Record<string, number> = {
    s: 1000,
    m: 60 * 1000,
    h: 3600 * 1000,
    d: 24 * 3600 * 1000,
  }

  return value * multipliers[unit]
}

export class AuthService {
  constructor(
    private readonly userRepo: UserRepo,
    private readonly refreshTokenRepo: RefreshTokenRepo
  ) {}

  async register(input: RegisterInput): Promise<AuthResult> {
    const { email, phone, password, name } = input

    if (!email && !phone) {
      throw new ValidationError('Either email or phone is required')
    }

    // Check for duplicates
    if (email) {
      const existing = await this.userRepo.findByEmail(email)
      if (existing) throw new ConflictError('Email already in use')
    }

    if (phone) {
      const existing = await this.userRepo.findByPhone(phone)
      if (existing) throw new ConflictError('Phone number already in use')
    }

    const passwordHash = await hashPassword(password)
    const user = await this.userRepo.create({ email, phone, passwordHash, name })

    const accessToken = signAccessToken({ userId: user.id, role: user.role })
    const refreshToken = signRefreshToken({ userId: user.id })

    const expiresAt = new Date(Date.now() + parseRefreshTtlMs())
    await this.refreshTokenRepo.create({ token: refreshToken, userId: user.id, expiresAt })

    return { user, accessToken, refreshToken }
  }

  async login(input: LoginInput): Promise<AuthResult> {
    const { email, phone, password } = input

    if (!email && !phone) {
      throw new ValidationError('Either email or phone is required')
    }

    const userWithHash = email
      ? await this.userRepo.findByEmail(email)
      : await this.userRepo.findByPhone(phone!)

    if (!userWithHash) {
      throw new NotFoundError('User')
    }

    const isValid = await comparePassword(password, userWithHash.passwordHash)
    if (!isValid) {
      throw new UnauthorizedError('Invalid credentials')
    }

    // Rotate: delete all old refresh tokens for this user
    await this.refreshTokenRepo.deleteAllByUserId(userWithHash.id)

    const accessToken = signAccessToken({ userId: userWithHash.id, role: userWithHash.role })
    const refreshToken = signRefreshToken({ userId: userWithHash.id })

    const expiresAt = new Date(Date.now() + parseRefreshTtlMs())
    await this.refreshTokenRepo.create({
      token: refreshToken,
      userId: userWithHash.id,
      expiresAt,
    })

    // Return public user (no passwordHash)
    const user: PublicUser = {
      id: userWithHash.id,
      email: userWithHash.email,
      phone: userWithHash.phone,
      name: userWithHash.name,
      role: userWithHash.role,
      createdAt: userWithHash.createdAt,
    }

    return { user, accessToken, refreshToken }
  }

  async refreshToken(oldToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    // Verify JWT signature + expiry
    const payload = verifyRefreshToken(oldToken)

    // Check token exists in DB (not revoked)
    const stored = await this.refreshTokenRepo.findByToken(oldToken)
    if (!stored) {
      throw new UnauthorizedError('Refresh token not found or already revoked')
    }

    // Check DB-level expiry
    if (stored.expiresAt < new Date()) {
      await this.refreshTokenRepo.deleteByToken(oldToken)
      throw new UnauthorizedError('Refresh token expired')
    }

    // Verify userId matches
    if (stored.userId !== payload.userId) {
      throw new UnauthorizedError('Refresh token mismatch')
    }

    const user = await this.userRepo.findById(payload.userId)
    if (!user) {
      throw new UnauthorizedError('User no longer exists')
    }

    // Rotate: delete old token, issue new pair
    await this.refreshTokenRepo.deleteByToken(oldToken)

    const accessToken = signAccessToken({ userId: user.id, role: user.role })
    const newRefreshToken = signRefreshToken({ userId: user.id })

    const expiresAt = new Date(Date.now() + parseRefreshTtlMs())
    await this.refreshTokenRepo.create({
      token: newRefreshToken,
      userId: user.id,
      expiresAt,
    })

    return { accessToken, refreshToken: newRefreshToken }
  }

  async logout(refreshToken: string): Promise<void> {
    await this.refreshTokenRepo.deleteByToken(refreshToken)
  }

  async getMe(userId: string): Promise<PublicUser> {
    const user = await this.userRepo.findById(userId)
    if (!user) throw new NotFoundError('User')
    return user
  }
}
