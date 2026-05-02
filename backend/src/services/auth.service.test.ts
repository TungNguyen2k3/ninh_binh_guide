import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AuthService } from './auth.service'
import type { UserRepo, PublicUser } from '../repositories/user.repo'
import type { RefreshTokenRepo } from '../repositories/refresh-token.repo'
import { hashPassword } from '../lib/bcrypt'
import { signRefreshToken } from '../lib/jwt'
import {
  ConflictError,
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from '../lib/errors'

// ---------------------------------------------------------------------------
// Mock repos — vi.fn() per method, cast to the interface type
// ---------------------------------------------------------------------------
const mockUserRepo = {
  findById: vi.fn(),
  findByIdWithHash: vi.fn(),
  findByEmail: vi.fn(),
  findByPhone: vi.fn(),
  create: vi.fn(),
} as unknown as UserRepo

const mockRefreshTokenRepo = {
  create: vi.fn(),
  findByToken: vi.fn(),
  deleteByToken: vi.fn(),
  deleteAllByUserId: vi.fn(),
  deleteExpired: vi.fn(),
} as unknown as RefreshTokenRepo

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------
const publicUser: PublicUser = {
  id: 'user-1',
  email: 'tourist@test.com',
  phone: null,
  name: 'Test User',
  role: 'tourist',
  createdAt: new Date('2025-01-01'),
}

// Full user row as returned by findByEmail / findByPhone (includes passwordHash)
const userWithHash = {
  ...publicUser,
  passwordHash: '', // set dynamically in tests that need real bcrypt
  updatedAt: new Date('2025-01-01'),
}

// A minimal stored RefreshToken shape
function makeStoredToken(token: string, expiresAt: Date) {
  return {
    id: 'rt-1',
    token,
    userId: 'user-1',
    expiresAt,
    createdAt: new Date(),
  }
}

// ---------------------------------------------------------------------------
// Service under test
// ---------------------------------------------------------------------------
let authService: AuthService

beforeEach(() => {
  vi.clearAllMocks()
  authService = new AuthService(mockUserRepo, mockRefreshTokenRepo)
})

// ===========================================================================
// AuthService.register
// ===========================================================================
describe('AuthService.register', () => {
  it('creates user and returns tokens when email is provided', async () => {
    vi.mocked(mockUserRepo.findByEmail).mockResolvedValue(null)
    vi.mocked(mockUserRepo.findByPhone).mockResolvedValue(null)
    vi.mocked(mockUserRepo.create).mockResolvedValue(publicUser)
    vi.mocked(mockRefreshTokenRepo.create).mockResolvedValue({} as any)

    const result = await authService.register({
      email: 'tourist@test.com',
      password: 'password123',
      name: 'Test User',
    })

    expect(result.user).toBeDefined()
    expect(result.accessToken).toBeDefined()
    expect(result.refreshToken).toBeDefined()
    expect((result.user as any).passwordHash).toBeUndefined()
    expect(mockUserRepo.findByEmail).toHaveBeenCalledWith('tourist@test.com')
    expect(mockUserRepo.create).toHaveBeenCalledOnce()
    expect(mockRefreshTokenRepo.create).toHaveBeenCalledOnce()
  })

  it('creates user and returns tokens when phone is provided', async () => {
    const phoneUser: PublicUser = {
      ...publicUser,
      email: null,
      phone: '0912345678',
    }
    vi.mocked(mockUserRepo.findByEmail).mockResolvedValue(null)
    vi.mocked(mockUserRepo.findByPhone).mockResolvedValue(null)
    vi.mocked(mockUserRepo.create).mockResolvedValue(phoneUser)
    vi.mocked(mockRefreshTokenRepo.create).mockResolvedValue({} as any)

    const result = await authService.register({
      phone: '0912345678',
      password: 'password123',
      name: 'Test User',
    })

    expect(result.user).toBeDefined()
    expect(result.accessToken).toBeDefined()
    expect(result.refreshToken).toBeDefined()
    expect((result.user as any).passwordHash).toBeUndefined()
    expect(mockUserRepo.findByPhone).toHaveBeenCalledWith('0912345678')
  })

  it('throws ValidationError when neither email nor phone is provided', async () => {
    await expect(
      authService.register({ password: 'password123', name: 'Test' })
    ).rejects.toThrow(ValidationError)
  })

  it('throws ConflictError when email already exists', async () => {
    vi.mocked(mockUserRepo.findByEmail).mockResolvedValue({
      ...userWithHash,
      passwordHash: 'hash',
    } as any)

    await expect(
      authService.register({ email: 'tourist@test.com', password: 'password123', name: 'Test' })
    ).rejects.toThrow(ConflictError)

    await expect(
      authService.register({ email: 'tourist@test.com', password: 'password123', name: 'Test' })
    ).rejects.toThrow(/Email/)
  })

  it('throws ConflictError when phone already exists', async () => {
    vi.mocked(mockUserRepo.findByPhone).mockResolvedValue({
      ...userWithHash,
      email: null,
      phone: '0912345678',
      passwordHash: 'hash',
    } as any)

    await expect(
      authService.register({ phone: '0912345678', password: 'password123', name: 'Test' })
    ).rejects.toThrow(ConflictError)

    await expect(
      authService.register({ phone: '0912345678', password: 'password123', name: 'Test' })
    ).rejects.toThrow(/Phone/)
  })
})

// ===========================================================================
// AuthService.login
// ===========================================================================
describe('AuthService.login', () => {
  it('returns tokens when credentials are valid (email)', async () => {
    const passwordHash = await hashPassword('pass123')
    vi.mocked(mockUserRepo.findByEmail).mockResolvedValue({
      ...userWithHash,
      passwordHash,
    } as any)
    vi.mocked(mockRefreshTokenRepo.deleteAllByUserId).mockResolvedValue(undefined)
    vi.mocked(mockRefreshTokenRepo.create).mockResolvedValue({} as any)

    const result = await authService.login({
      email: 'tourist@test.com',
      password: 'pass123',
    })

    expect(result.user).toBeDefined()
    expect(result.accessToken).toBeDefined()
    expect(result.refreshToken).toBeDefined()
    expect((result.user as any).passwordHash).toBeUndefined()
    expect(mockUserRepo.findByEmail).toHaveBeenCalledWith('tourist@test.com')
  })

  it('returns tokens when credentials are valid (phone)', async () => {
    const passwordHash = await hashPassword('pass123')
    vi.mocked(mockUserRepo.findByPhone).mockResolvedValue({
      ...userWithHash,
      email: null,
      phone: '0912345678',
      passwordHash,
    } as any)
    vi.mocked(mockRefreshTokenRepo.deleteAllByUserId).mockResolvedValue(undefined)
    vi.mocked(mockRefreshTokenRepo.create).mockResolvedValue({} as any)

    const result = await authService.login({
      phone: '0912345678',
      password: 'pass123',
    })

    expect(result.user).toBeDefined()
    expect(result.accessToken).toBeDefined()
    expect(result.refreshToken).toBeDefined()
    expect((result.user as any).passwordHash).toBeUndefined()
    expect(mockUserRepo.findByPhone).toHaveBeenCalledWith('0912345678')
  })

  it('throws ValidationError when neither email nor phone is provided', async () => {
    await expect(authService.login({ password: 'pass123' })).rejects.toThrow(ValidationError)
  })

  it('throws UnauthorizedError when user not found', async () => {
    vi.mocked(mockUserRepo.findByEmail).mockResolvedValue(null)

    await expect(
      authService.login({ email: 'ghost@test.com', password: 'pass123' })
    ).rejects.toThrow(UnauthorizedError)
  })

  it('throws UnauthorizedError when password is incorrect', async () => {
    const passwordHash = await hashPassword('correctpassword')
    vi.mocked(mockUserRepo.findByEmail).mockResolvedValue({
      ...userWithHash,
      passwordHash,
    } as any)

    await expect(
      authService.login({ email: 'tourist@test.com', password: 'wrongpassword' })
    ).rejects.toThrow(UnauthorizedError)
  })

  it('rotates refresh tokens on successful login', async () => {
    const passwordHash = await hashPassword('pass123')
    vi.mocked(mockUserRepo.findByEmail).mockResolvedValue({
      ...userWithHash,
      passwordHash,
    } as any)
    vi.mocked(mockRefreshTokenRepo.deleteAllByUserId).mockResolvedValue(undefined)
    vi.mocked(mockRefreshTokenRepo.create).mockResolvedValue({} as any)

    await authService.login({ email: 'tourist@test.com', password: 'pass123' })

    expect(mockRefreshTokenRepo.deleteAllByUserId).toHaveBeenCalledWith('user-1')
  })
})

// ===========================================================================
// AuthService.refreshToken
// ===========================================================================
describe('AuthService.refreshToken', () => {
  it('returns new token pair when refresh token is valid', async () => {
    const oldToken = signRefreshToken({ userId: 'user-1' })
    const futureDate = new Date(Date.now() + 7 * 24 * 3600 * 1000)

    vi.mocked(mockRefreshTokenRepo.findByToken).mockResolvedValue(
      makeStoredToken(oldToken, futureDate) as any
    )
    vi.mocked(mockUserRepo.findById).mockResolvedValue(publicUser)
    vi.mocked(mockRefreshTokenRepo.deleteByToken).mockResolvedValue(undefined)
    vi.mocked(mockRefreshTokenRepo.create).mockResolvedValue({} as any)

    const result = await authService.refreshToken(oldToken)

    expect(result.accessToken).toBeDefined()
    expect(result.refreshToken).toBeDefined()
    expect(typeof result.refreshToken).toBe('string')
    // Token rotation: old token deleted, new token stored
    expect(mockRefreshTokenRepo.deleteByToken).toHaveBeenCalledWith(oldToken)
    expect(mockRefreshTokenRepo.create).toHaveBeenCalledOnce()
  })

  it('throws UnauthorizedError when token not found in DB', async () => {
    const token = signRefreshToken({ userId: 'user-1' })
    vi.mocked(mockRefreshTokenRepo.findByToken).mockResolvedValue(null)

    await expect(authService.refreshToken(token)).rejects.toThrow(UnauthorizedError)
  })

  it('throws UnauthorizedError when token is expired in DB and cleans it up', async () => {
    const token = signRefreshToken({ userId: 'user-1' })
    const pastDate = new Date(Date.now() - 1000)

    vi.mocked(mockRefreshTokenRepo.findByToken).mockResolvedValue(
      makeStoredToken(token, pastDate) as any
    )
    vi.mocked(mockRefreshTokenRepo.deleteByToken).mockResolvedValue(undefined)

    await expect(authService.refreshToken(token)).rejects.toThrow(UnauthorizedError)
    expect(mockRefreshTokenRepo.deleteByToken).toHaveBeenCalledWith(token)
  })
})

// ===========================================================================
// AuthService.logout
// ===========================================================================
describe('AuthService.logout', () => {
  it('deletes refresh token from DB', async () => {
    vi.mocked(mockRefreshTokenRepo.deleteByToken).mockResolvedValue(undefined)

    await authService.logout('some-refresh-token')

    expect(mockRefreshTokenRepo.deleteByToken).toHaveBeenCalledWith('some-refresh-token')
  })

  it('does not throw when token does not exist', async () => {
    vi.mocked(mockRefreshTokenRepo.deleteByToken).mockResolvedValue(undefined)

    await expect(authService.logout('nonexistent-token')).resolves.not.toThrow()
  })
})

// ===========================================================================
// AuthService.getMe
// ===========================================================================
describe('AuthService.getMe', () => {
  it('returns public user without passwordHash', async () => {
    vi.mocked(mockUserRepo.findById).mockResolvedValue(publicUser)

    const result = await authService.getMe('user-1')

    expect(result.id).toBe('user-1')
    expect(result.email).toBe('tourist@test.com')
    expect(result.name).toBe('Test User')
    expect(result.role).toBe('tourist')
    expect((result as any).passwordHash).toBeUndefined()
    expect(mockUserRepo.findById).toHaveBeenCalledWith('user-1')
  })

  it('throws NotFoundError when user does not exist', async () => {
    vi.mocked(mockUserRepo.findById).mockResolvedValue(null)

    await expect(authService.getMe('ghost-id')).rejects.toThrow(NotFoundError)
  })
})
