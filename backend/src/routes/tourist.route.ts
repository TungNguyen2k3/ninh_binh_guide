import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { authenticate } from '../middlewares/authenticate.js'
import { TouristService } from '../services/tourist.service.js'
import { ok } from '../lib/response.js'

interface TouristRouteOptions {
  touristService: TouristService
}

function getLang(request: FastifyRequest): 'vi' | 'en' {
  const accept = request.headers['accept-language'] ?? ''
  return accept.toLowerCase().startsWith('en') ? 'en' : 'vi'
}

export async function touristRoutes(
  fastify: FastifyInstance,
  options: TouristRouteOptions
): Promise<void> {
  const { touristService } = options
  const preHandler = [authenticate]

  // GET /locations — list locations in tourist's package
  fastify.get(
    '/locations',
    { preHandler },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const lang = getLang(request)
      const locations = await touristService.getLocationsForTourist(request.user.userId, lang)
      return reply.send(ok(locations))
    }
  )

  // GET /locations/:slug — location detail + audio URL
  fastify.get(
    '/locations/:slug',
    { preHandler },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { slug } = request.params as { slug: string }
      const lang = getLang(request)
      const location = await touristService.getLocationDetail(slug, request.user.userId, lang)
      return reply.send(ok(location))
    }
  )
}
