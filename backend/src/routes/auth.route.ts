import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { RegisterSchema, LoginSchema } from '../schemas/auth.schema.js'
import { ActivateTicketSchema } from '../schemas/ticket.schema.js'
import { AuthService } from '../services/auth.service.js'
import { TicketService } from '../services/ticket.service.js'
import { authenticate } from '../middlewares/authenticate.js'
import { ok } from '../lib/response.js'
import { ValidationError } from '../lib/errors.js'
import { env } from '../lib/env.js'

const COOKIE_NAME = 'refreshToken'
const COOKIE_MAX_AGE = 7 * 24 * 3600 // 7 days in seconds

function getCookieOptions() {
  const isProd = env.NODE_ENV === 'production'
  return {
    httpOnly: true,
    secure: isProd,
    // Production (HTTPS, cross-domain Railway↔Vercel): SameSite=None requires Secure=true
    // Development (HTTP, same-origin via Nuxt proxy): SameSite=Lax is sufficient
    sameSite: (isProd ? 'none' : 'lax') as 'none' | 'lax',
    path: '/',
    maxAge: COOKIE_MAX_AGE,
  }
}

export async function authRoutes(
  fastify: FastifyInstance,
  options: { authService: AuthService; ticketService: TicketService }
): Promise<void> {
  const { authService, ticketService } = options

  // POST /register
  fastify.post('/register', async (request: FastifyRequest, reply: FastifyReply) => {
    const parsed = RegisterSchema.safeParse(request.body)
    if (!parsed.success) {
      throw new ValidationError('Validation failed', parsed.error.flatten())
    }

    const { user, accessToken, refreshToken } = await authService.register(parsed.data)

    reply.setCookie(COOKIE_NAME, refreshToken, getCookieOptions())
    return reply.status(201).send(ok({ user, accessToken }))
  })

  // POST /login — rate limited (configured at registration time in app.ts)
  fastify.post(
    '/login',
    {
      config: {
        rateLimit: {
          max: 5,
          timeWindow: 15 * 60 * 1000, // 15 minutes
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const parsed = LoginSchema.safeParse(request.body)
      if (!parsed.success) {
        throw new ValidationError('Validation failed', parsed.error.flatten())
      }

      const { user, accessToken, refreshToken } = await authService.login(parsed.data)

      reply.setCookie(COOKIE_NAME, refreshToken, getCookieOptions())
      return reply.send(ok({ user, accessToken }))
    }
  )

  // POST /refresh — reads refreshToken from httpOnly cookie
  fastify.post('/refresh', async (request: FastifyRequest, reply: FastifyReply) => {
    const oldToken = request.cookies[COOKIE_NAME]

    if (!oldToken) {
      // Clear potentially stale cookie and return error
      reply.clearCookie(COOKIE_NAME, { path: '/' })
      throw new ValidationError('Refresh token cookie is missing')
    }

    const { accessToken, refreshToken } = await authService.refreshToken(oldToken)

    reply.setCookie(COOKIE_NAME, refreshToken, getCookieOptions())
    return reply.send(ok({ accessToken }))
  })

  // POST /logout
  fastify.post('/logout', async (request: FastifyRequest, reply: FastifyReply) => {
    const token = request.cookies[COOKIE_NAME]

    if (token) {
      await authService.logout(token)
    }

    reply.clearCookie(COOKIE_NAME, { path: '/' })
    return reply.send(ok({ message: 'Logged out successfully' }))
  })

  // GET /me — requires authentication
  fastify.get('/me', { preHandler: [authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const user = await authService.getMe(request.user.userId)
    return reply.send(ok(user))
  })

  // POST /activate-ticket — tourist enters ticket code to activate a package
  fastify.post(
    '/activate-ticket',
    { preHandler: [authenticate] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const parsed = ActivateTicketSchema.safeParse(request.body)
      if (!parsed.success) throw new ValidationError('Validation failed', parsed.error.flatten())

      const { ticket, alreadyOwned } = await ticketService.activateTicket(
        parsed.data.code,
        request.user.userId
      )

      return reply.send(
        ok({
          ticket: {
            id: ticket.id,
            code: ticket.code,
            packageId: ticket.packageId,
            packageName: ticket.package.name,
            packageType: ticket.package.type,
            expiresAt: ticket.expiresAt,
          },
          alreadyOwned,
        })
      )
    }
  )

  // GET /my-ticket — tourist views their currently active ticket
  fastify.get(
    '/my-ticket',
    { preHandler: [authenticate] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const ticketUser = await ticketService.getActiveTicketForUser(request.user.userId)
      return reply.send(ok(ticketUser ?? null))
    }
  )
}
