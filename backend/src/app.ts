import './lib/env.js' // Validate env vars at startup — will throw if invalid
import Fastify from 'fastify'
import fastifyCookie from '@fastify/cookie'
import fastifyCors from '@fastify/cors'
import fastifyHelmet from '@fastify/helmet'
import fastifyRateLimit from '@fastify/rate-limit'
import { ZodError } from 'zod'
import { PrismaClient } from '@prisma/client'
import { env } from './lib/env.js'
import { AppError } from './lib/errors.js'
import { UserRepo } from './repositories/user.repo.js'
import { RefreshTokenRepo } from './repositories/refresh-token.repo.js'
import { AuthService } from './services/auth.service.js'
import { authRoutes } from './routes/auth.route.js'

export function buildApp() {
  const fastify = Fastify({
    logger: { level: env.NODE_ENV === 'test' ? 'silent' : 'info' },
  })

  // ─── Plugins ────────────────────────────────────────────────────────────────

  fastify.register(fastifyHelmet, {
    contentSecurityPolicy: false, // Handled by frontend
  })

  fastify.register(fastifyCors, {
    origin: env.CORS_ORIGIN,
    credentials: true,
  })

  fastify.register(fastifyCookie)

  fastify.register(fastifyRateLimit, {
    global: false, // Only apply per-route where explicitly configured
    max: 100,
    timeWindow: 60 * 1000, // 1 minute fallback
  })

  // ─── Infrastructure ──────────────────────────────────────────────────────────

  const prisma = new PrismaClient()

  // Repositories
  const userRepo = new UserRepo(prisma)
  const refreshTokenRepo = new RefreshTokenRepo(prisma)

  // Services
  const authService = new AuthService(userRepo, refreshTokenRepo)

  // ─── Routes ──────────────────────────────────────────────────────────────────

  // Health check
  fastify.get('/health', async (_request, reply) => {
    return reply.send({ status: 'ok', timestamp: new Date().toISOString() })
  })

  // API routes
  fastify.register(authRoutes, { prefix: '/api/v1/auth', authService })

  // ─── Global Error Handler ─────────────────────────────────────────────────────

  fastify.setErrorHandler((error, request, reply) => {
    // AppError subclasses (our known errors)
    if (error instanceof AppError) {
      return reply.status(error.statusCode).send({
        success: false,
        error: {
          code: error.code,
          message: error.message,
          ...(error.details !== undefined && { details: error.details }),
        },
      })
    }

    // Zod validation errors (if thrown directly, not via ValidationError)
    if (error instanceof ZodError) {
      return reply.status(422).send({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Validation failed',
          details: error.flatten(),
        },
      })
    }

    // Fastify built-in validation errors (JSON schema)
    if (error.validation) {
      return reply.status(422).send({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Validation failed',
          details: error.validation,
        },
      })
    }

    // @fastify/rate-limit errors
    if (error.statusCode === 429) {
      return reply.status(429).send({
        success: false,
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: error.message,
        },
      })
    }

    // Unknown/unexpected errors
    request.log.error({ err: error }, 'Unhandled error')

    return reply.status(500).send({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: env.NODE_ENV === 'production' ? 'Internal server error' : error.message,
      },
    })
  })

  // Graceful shutdown
  const shutdown = async () => {
    fastify.log.info('Shutting down server...')
    await fastify.close()
    await prisma.$disconnect()
    process.exit(0)
  }

  process.on('SIGTERM', shutdown)
  process.on('SIGINT', shutdown)

  return fastify
}

async function start() {
  const app = buildApp()

  try {
    await app.listen({ port: env.PORT, host: '0.0.0.0' })
    app.log.info(`Server running on port ${env.PORT}`)
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()
