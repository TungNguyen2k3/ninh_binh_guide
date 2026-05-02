import jwt, { type SignOptions } from 'jsonwebtoken'
import { env } from './env.js'
import { UnauthorizedError } from './errors.js'
import type { Role } from '@prisma/client'

export interface AccessTokenPayload {
  userId: string
  role: Role
}

export interface RefreshTokenPayload {
  userId: string
}

interface AccessTokenClaims {
  userId: string
  role: Role
  sub: string
  iat: number
  exp: number
}

interface RefreshTokenClaims {
  userId: string
  sub: string
  iat: number
  exp: number
}

export function signAccessToken(payload: AccessTokenPayload): string {
  const options: SignOptions = {
    subject: payload.userId,
    expiresIn: env.JWT_ACCESS_TTL as SignOptions['expiresIn'],
  }
  return jwt.sign(
    { userId: payload.userId, role: payload.role },
    env.JWT_SECRET,
    options
  )
}

export function signRefreshToken(payload: RefreshTokenPayload): string {
  const options: SignOptions = {
    subject: payload.userId,
    expiresIn: env.JWT_REFRESH_TTL as SignOptions['expiresIn'],
  }
  return jwt.sign(
    { userId: payload.userId },
    env.JWT_REFRESH_SECRET,
    options
  )
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as AccessTokenClaims
    return { userId: decoded.userId, role: decoded.role }
  } catch {
    throw new UnauthorizedError('Invalid or expired access token')
  }
}

export function verifyRefreshToken(token: string): RefreshTokenPayload {
  try {
    const decoded = jwt.verify(token, env.JWT_REFRESH_SECRET) as RefreshTokenClaims
    return { userId: decoded.userId }
  } catch {
    throw new UnauthorizedError('Invalid or expired refresh token')
  }
}
