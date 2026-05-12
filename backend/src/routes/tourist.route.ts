import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { verifyAccessToken } from '../lib/jwt.js'
import { TouristService } from '../services/tourist.service.js'
import { TourService } from '../services/tour.service.js'
import { ok } from '../lib/response.js'
import { NotFoundError } from '../lib/errors.js'

interface TouristRouteOptions {
  touristService: TouristService
  tourService: TourService
}

function getLang(request: FastifyRequest): 'vi' | 'en' {
  const accept = request.headers['accept-language'] ?? ''
  return accept.toLowerCase().startsWith('en') ? 'en' : 'vi'
}

function getOptionalUserId(request: FastifyRequest): string | null {
  const authHeader = request.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) return null
  const token = authHeader.slice(7)
  if (!token) return null
  try {
    const payload = verifyAccessToken(token)
    return payload.userId
  } catch {
    return null
  }
}

export async function touristRoutes(
  fastify: FastifyInstance,
  options: TouristRouteOptions
): Promise<void> {
  const { touristService, tourService } = options

  // GET /locations — list locations (guests see all active; ticket holders see package locations)
  fastify.get(
    '/locations',
    async (request: FastifyRequest, reply: FastifyReply) => {
      const lang = getLang(request)
      const userId = getOptionalUserId(request)
      const locations = await touristService.getLocationsForTourist(userId, lang)
      return reply.send(ok(locations))
    }
  )

  // GET /locations/:slug — location detail + audio URL (audio gated behind ticket)
  fastify.get(
    '/locations/:slug',
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { slug } = request.params as { slug: string }
      const lang = getLang(request)
      const userId = getOptionalUserId(request)
      const location = await touristService.getLocationDetail(slug, userId, lang)
      return reply.send(ok(location))
    }
  )

  // GET /tours — active tours (no auth needed)
  fastify.get('/tours', async (_req: FastifyRequest, reply: FastifyReply) => {
    const tours = await tourService.getActiveTours()
    return reply.send(ok(tours))
  })

  // GET /tours/:id — single tour detail (stops + location data, no auth needed)
  fastify.get('/tours/:id', async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as { id: string }
    const tour = await tourService.getById(id)
    if (!tour.isActive) throw new NotFoundError('Tour')
    return reply.send(ok(tour))
  })
}
