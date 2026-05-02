import type { FastifyRequest, FastifyReply } from 'fastify'
import { verifyAccessToken } from '../lib/jwt.js'
import { UnauthorizedError } from '../lib/errors.js'
import type { Role } from '@prisma/client'

export interface AuthUser {
  userId: string
  role: Role
}

// Extend FastifyRequest to include the user property
declare module 'fastify' {
  interface FastifyRequest {
    user: AuthUser
  }
}

export async function authenticate(request: FastifyRequest, _reply: FastifyReply): Promise<void> {
  const authHeader = request.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthorizedError('Missing or malformed authorization header')
  }

  const token = authHeader.slice(7)

  if (!token) {
    throw new UnauthorizedError('Missing access token')
  }

  const payload = verifyAccessToken(token)
  request.user = { userId: payload.userId, role: payload.role }
}
