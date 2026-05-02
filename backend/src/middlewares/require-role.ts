import type { FastifyRequest, FastifyReply } from 'fastify'
import { ForbiddenError } from '../lib/errors.js'
import type { Role } from '@prisma/client'

/**
 * Factory function that returns a Fastify preHandler hook which enforces role-based access.
 * Must be used AFTER the `authenticate` middleware.
 */
export function requireRole(...roles: Role[]) {
  return async function (request: FastifyRequest, _reply: FastifyReply): Promise<void> {
    if (!request.user) {
      throw new ForbiddenError('Authentication required')
    }

    if (!roles.includes(request.user.role)) {
      throw new ForbiddenError(`Requires role: ${roles.join(' or ')}`)
    }
  }
}
