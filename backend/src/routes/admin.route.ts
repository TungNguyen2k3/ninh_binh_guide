import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { authenticate } from '../middlewares/authenticate.js'
import { requireRole } from '../middlewares/require-role.js'
import { LocationService } from '../services/location.service.js'
import { PackageService } from '../services/package.service.js'
import { TicketService } from '../services/ticket.service.js'
import { UserService } from '../services/user.service.js'
import { TourService } from '../services/tour.service.js'
import {
  CreateLocationSchema,
  UpdateLocationSchema,
  LocationQuerySchema,
  CreateSpotSchema,
  UpdateSpotSchema,
  AdmissionFeeSchema,
  UpdateAdmissionFeeSchema,
} from '../schemas/location.schema.js'
import {
  CreatePackageSchema,
  UpdatePackageSchema,
  AssignLocationsSchema,
} from '../schemas/package.schema.js'
import { TicketQuerySchema } from '../schemas/ticket.schema.js'
import { CreateUserSchema, UpdateRoleSchema, UserQuerySchema } from '../schemas/user.schema.js'
import {
  CreateTourSchema,
  UpdateTourSchema,
  CreateTourStopSchema,
  UpdateTourStopSchema,
  ReorderTourStopsSchema,
} from '../schemas/tour.schema.js'
import { ValidationError } from '../lib/errors.js'
import { ok, paginated } from '../lib/response.js'

interface AdminRouteOptions {
  locationService: LocationService
  packageService: PackageService
  ticketService: TicketService
  userService: UserService
  tourService: TourService
}

export async function adminRoutes(
  fastify: FastifyInstance,
  options: AdminRouteOptions
): Promise<void> {
  const { locationService, packageService, ticketService, userService, tourService } = options
  const preHandler = [authenticate, requireRole('admin')]

  // ─── Location Routes ─────────────────────────────────────────────────────────

  // GET /locations
  fastify.get('/locations', { preHandler }, async (req: FastifyRequest, reply: FastifyReply) => {
    const parsed = LocationQuerySchema.safeParse(req.query)
    if (!parsed.success) throw new ValidationError('Invalid query parameters', parsed.error.flatten())

    const { search, page, limit, isActive } = parsed.data
    const { locations, total } = await locationService.list({ search, page, limit, isActive })
    return reply.send(paginated(locations, total, page, limit))
  })

  // POST /locations
  fastify.post('/locations', { preHandler }, async (req: FastifyRequest, reply: FastifyReply) => {
    const parsed = CreateLocationSchema.safeParse(req.body)
    if (!parsed.success) throw new ValidationError('Validation failed', parsed.error.flatten())

    const location = await locationService.create(parsed.data)
    return reply.status(201).send(ok(location))
  })

  // GET /locations/:id — includes locationImages and spots.images
  fastify.get('/locations/:id', { preHandler }, async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as { id: string }
    const location = await locationService.getByIdFull(id)
    return reply.send(ok(location))
  })

  // PUT /locations/:id
  fastify.put('/locations/:id', { preHandler }, async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as { id: string }
    const parsed = UpdateLocationSchema.safeParse(req.body)
    if (!parsed.success) throw new ValidationError('Validation failed', parsed.error.flatten())

    const updated = await locationService.update(id, parsed.data)
    return reply.send(ok(updated))
  })

  // DELETE /locations/:id
  fastify.delete('/locations/:id', { preHandler }, async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as { id: string }
    await locationService.delete(id)
    return reply.status(204).send()
  })

  // POST /locations/:id/audio — multipart upload
  fastify.post('/locations/:id/audio', { preHandler }, async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as { id: string }
    const { lang } = req.query as { lang?: string }

    const data = await req.file()
    if (!data) throw new ValidationError('File is required')

    const audioLang: 'vi' | 'en' = lang === 'en' ? 'en' : 'vi'
    const buffer = await data.toBuffer()
    const updated = await locationService.uploadAudioFile(id, audioLang, buffer, data.filename)
    return reply.send(ok(updated))
  })

  // POST /locations/:id/image — multipart upload
  fastify.post('/locations/:id/image', { preHandler }, async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as { id: string }

    const data = await req.file()
    if (!data) throw new ValidationError('File is required')

    const buffer = await data.toBuffer()
    const updated = await locationService.uploadImageFile(id, buffer, data.filename)
    return reply.send(ok(updated))
  })

  // POST /locations/:id/images — upload gallery image
  fastify.post('/locations/:id/images', { preHandler }, async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as { id: string }

    const data = await req.file()
    if (!data) throw new ValidationError('File is required')

    const buffer = await data.toBuffer()
    const image = await locationService.uploadLocationImage(id, buffer, data.filename)
    return reply.status(201).send(ok(image))
  })

  // DELETE /locations/:id/images/:imageId
  fastify.delete('/locations/:id/images/:imageId', { preHandler }, async (req: FastifyRequest, reply: FastifyReply) => {
    const { id, imageId } = req.params as { id: string; imageId: string }
    await locationService.deleteLocationImage(id, imageId)
    return reply.status(204).send()
  })

  // POST /locations/:id/fees — add an admission fee entry
  fastify.post('/locations/:id/fees', { preHandler }, async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as { id: string }
    const parsed = AdmissionFeeSchema.safeParse(req.body)
    if (!parsed.success) throw new ValidationError('Validation failed', parsed.error.flatten())
    const fee = await locationService.addAdmissionFee(id, parsed.data)
    return reply.status(201).send(ok(fee))
  })

  // PUT /locations/:id/fees/:feeId — update an admission fee entry
  fastify.put('/locations/:id/fees/:feeId', { preHandler }, async (req: FastifyRequest, reply: FastifyReply) => {
    const { feeId } = req.params as { id: string; feeId: string }
    const parsed = UpdateAdmissionFeeSchema.safeParse(req.body)
    if (!parsed.success) throw new ValidationError('Validation failed', parsed.error.flatten())
    const fee = await locationService.updateAdmissionFee(feeId, parsed.data)
    return reply.send(ok(fee))
  })

  // DELETE /locations/:id/fees/:feeId — delete an admission fee entry
  fastify.delete('/locations/:id/fees/:feeId', { preHandler }, async (req: FastifyRequest, reply: FastifyReply) => {
    const { feeId } = req.params as { id: string; feeId: string }
    await locationService.deleteAdmissionFee(feeId)
    return reply.status(204).send()
  })

  // GET /locations/:id/spots/:spotId — get single spot with images
  fastify.get('/locations/:id/spots/:spotId', { preHandler }, async (req: FastifyRequest, reply: FastifyReply) => {
    const { spotId } = req.params as { id: string; spotId: string }
    const spot = await locationService.getSpotById(spotId)
    return reply.send(ok(spot))
  })

  // POST /locations/:id/spots — create a spot
  fastify.post('/locations/:id/spots', { preHandler }, async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as { id: string }
    const parsed = CreateSpotSchema.safeParse(req.body)
    if (!parsed.success) throw new ValidationError('Validation failed', parsed.error.flatten())

    const spot = await locationService.createSpot(id, parsed.data)
    return reply.status(201).send(ok(spot))
  })

  // PUT /locations/:id/spots/:spotId — update a spot
  fastify.put('/locations/:id/spots/:spotId', { preHandler }, async (req: FastifyRequest, reply: FastifyReply) => {
    const { id, spotId } = req.params as { id: string; spotId: string }
    const parsed = UpdateSpotSchema.safeParse(req.body)
    if (!parsed.success) throw new ValidationError('Validation failed', parsed.error.flatten())

    const spot = await locationService.updateSpot(id, spotId, parsed.data)
    return reply.send(ok(spot))
  })

  // DELETE /locations/:id/spots/:spotId
  fastify.delete('/locations/:id/spots/:spotId', { preHandler }, async (req: FastifyRequest, reply: FastifyReply) => {
    const { id, spotId } = req.params as { id: string; spotId: string }
    await locationService.deleteSpot(id, spotId)
    return reply.status(204).send()
  })

  // POST /locations/:id/spots/:spotId/audio — upload spot audio
  fastify.post('/locations/:id/spots/:spotId/audio', { preHandler }, async (req: FastifyRequest, reply: FastifyReply) => {
    const { id, spotId } = req.params as { id: string; spotId: string }
    const { lang } = req.query as { lang?: string }

    const data = await req.file()
    if (!data) throw new ValidationError('File is required')

    const audioLang: 'vi' | 'en' = lang === 'en' ? 'en' : 'vi'
    const buffer = await data.toBuffer()
    const spot = await locationService.uploadSpotAudio(id, spotId, audioLang, buffer, data.filename)
    return reply.send(ok(spot))
  })

  // POST /locations/:id/spots/:spotId/images — upload spot image
  fastify.post('/locations/:id/spots/:spotId/images', { preHandler }, async (req: FastifyRequest, reply: FastifyReply) => {
    const { id, spotId } = req.params as { id: string; spotId: string }

    const data = await req.file()
    if (!data) throw new ValidationError('File is required')

    const buffer = await data.toBuffer()
    const image = await locationService.uploadSpotImage(id, spotId, buffer, data.filename)
    return reply.status(201).send(ok(image))
  })

  // DELETE /locations/:id/spots/:spotId/images/:imageId
  fastify.delete('/locations/:id/spots/:spotId/images/:imageId', { preHandler }, async (req: FastifyRequest, reply: FastifyReply) => {
    const { id, spotId, imageId } = req.params as { id: string; spotId: string; imageId: string }
    await locationService.deleteSpotImage(id, spotId, imageId)
    return reply.status(204).send()
  })

  // ─── Package Routes ───────────────────────────────────────────────────────────

  // GET /packages
  fastify.get('/packages', { preHandler }, async (_req: FastifyRequest, reply: FastifyReply) => {
    const packages = await packageService.list()
    return reply.send(ok(packages))
  })

  // POST /packages
  fastify.post('/packages', { preHandler }, async (req: FastifyRequest, reply: FastifyReply) => {
    const parsed = CreatePackageSchema.safeParse(req.body)
    if (!parsed.success) throw new ValidationError('Validation failed', parsed.error.flatten())

    const pkg = await packageService.create(parsed.data)
    return reply.status(201).send(ok(pkg))
  })

  // GET /packages/:id
  fastify.get('/packages/:id', { preHandler }, async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as { id: string }
    const pkg = await packageService.getById(id)
    return reply.send(ok(pkg))
  })

  // PUT /packages/:id
  fastify.put('/packages/:id', { preHandler }, async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as { id: string }
    const parsed = UpdatePackageSchema.safeParse(req.body)
    if (!parsed.success) throw new ValidationError('Validation failed', parsed.error.flatten())

    const updated = await packageService.update(id, parsed.data)
    return reply.send(ok(updated))
  })

  // DELETE /packages/:id
  fastify.delete('/packages/:id', { preHandler }, async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as { id: string }
    await packageService.delete(id)
    return reply.status(204).send()
  })

  // POST /packages/:id/locations — assign locations to a package
  fastify.post('/packages/:id/locations', { preHandler }, async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as { id: string }
    const parsed = AssignLocationsSchema.safeParse(req.body)
    if (!parsed.success) throw new ValidationError('Validation failed', parsed.error.flatten())

    const pkg = await packageService.assignLocations(id, parsed.data.locationIds)
    return reply.send(ok(pkg))
  })

  // ─── Ticket Routes (admin view) ───────────────────────────────────────────────

  // GET /stats/tickets — overview stats
  fastify.get('/stats/tickets', { preHandler }, async (_req: FastifyRequest, reply: FastifyReply) => {
    const stats = await ticketService.getStats()
    return reply.send(ok(stats))
  })

  // GET /tickets — list all tickets with optional search + pagination
  fastify.get('/tickets', { preHandler }, async (req: FastifyRequest, reply: FastifyReply) => {
    const parsed = TicketQuerySchema.safeParse(req.query)
    if (!parsed.success) throw new ValidationError('Invalid query parameters', parsed.error.flatten())

    const { page, limit, search } = parsed.data
    const { tickets, total } = await ticketService.listAll({ page, limit, search })
    return reply.send(paginated(tickets, total, page, limit))
  })

  // ─── Stats Route ──────────────────────────────────────────────────────────────

  // GET /stats — aggregated stats across locations, packages, tickets, users
  fastify.get('/stats', { preHandler }, async (_req: FastifyRequest, reply: FastifyReply) => {
    const [locationTotal, locationActive, packageTotal, ticketStats, userStats] = await Promise.all([
      locationService.count(),
      locationService.count({ isActive: true }),
      packageService.count(),
      ticketService.getStats(),
      userService.countByRole(),
    ])
    return reply.send(
      ok({
        locations: { total: locationTotal, active: locationActive },
        packages: { total: packageTotal },
        tickets: ticketStats,
        users: userStats,
      })
    )
  })

  // ─── User Management Routes ───────────────────────────────────────────────────

  // GET /users — list users with pagination + search + role filter
  fastify.get('/users', { preHandler }, async (req: FastifyRequest, reply: FastifyReply) => {
    const parsed = UserQuerySchema.safeParse(req.query)
    if (!parsed.success) throw new ValidationError('Invalid query parameters', parsed.error.flatten())

    const { users, total } = await userService.listUsers(parsed.data)
    return reply.send(paginated(users, total, parsed.data.page, parsed.data.limit))
  })

  // POST /users — create admin or staff account
  fastify.post('/users', { preHandler }, async (req: FastifyRequest, reply: FastifyReply) => {
    const parsed = CreateUserSchema.safeParse(req.body)
    if (!parsed.success) throw new ValidationError('Validation failed', parsed.error.flatten())

    const user = await userService.createStaff(parsed.data)
    return reply.status(201).send(ok(user))
  })

  // PUT /users/:id/role — change a user's role
  fastify.put('/users/:id/role', { preHandler }, async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as { id: string }
    const parsed = UpdateRoleSchema.safeParse(req.body)
    if (!parsed.success) throw new ValidationError('Validation failed', parsed.error.flatten())

    const user = await userService.changeRole(id, parsed.data.role, req.user.userId)
    return reply.send(ok(user))
  })

  // DELETE /users/:id — delete a user account
  fastify.delete('/users/:id', { preHandler }, async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as { id: string }
    await userService.deleteUser(id, req.user.userId)
    return reply.status(204).send()
  })

  // ─── Tour Routes ──────────────────────────────────────────────────────────────

  fastify.get('/tours', { preHandler }, async (_req: FastifyRequest, reply: FastifyReply) => {
    const tours = await tourService.list()
    return reply.send(ok(tours))
  })

  fastify.post('/tours', { preHandler }, async (req: FastifyRequest, reply: FastifyReply) => {
    const parsed = CreateTourSchema.safeParse(req.body)
    if (!parsed.success) throw new ValidationError('Validation failed', parsed.error.flatten())
    const tour = await tourService.create(parsed.data)
    return reply.status(201).send(ok(tour))
  })

  fastify.get('/tours/:id', { preHandler }, async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as { id: string }
    const tour = await tourService.getById(id)
    return reply.send(ok(tour))
  })

  fastify.put('/tours/:id', { preHandler }, async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as { id: string }
    const parsed = UpdateTourSchema.safeParse(req.body)
    if (!parsed.success) throw new ValidationError('Validation failed', parsed.error.flatten())
    const tour = await tourService.update(id, parsed.data)
    return reply.send(ok(tour))
  })

  fastify.delete('/tours/:id', { preHandler }, async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as { id: string }
    await tourService.delete(id)
    return reply.status(204).send()
  })

  fastify.post('/tours/:id/stops', { preHandler }, async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as { id: string }
    const parsed = CreateTourStopSchema.safeParse(req.body)
    if (!parsed.success) throw new ValidationError('Validation failed', parsed.error.flatten())
    const stop = await tourService.addStop(id, parsed.data)
    return reply.status(201).send(ok(stop))
  })

  fastify.put('/tours/:id/stops/:stopId', { preHandler }, async (req: FastifyRequest, reply: FastifyReply) => {
    const { id, stopId } = req.params as { id: string; stopId: string }
    const parsed = UpdateTourStopSchema.safeParse(req.body)
    if (!parsed.success) throw new ValidationError('Validation failed', parsed.error.flatten())
    const stop = await tourService.updateStop(id, stopId, parsed.data)
    return reply.send(ok(stop))
  })

  fastify.delete('/tours/:id/stops/:stopId', { preHandler }, async (req: FastifyRequest, reply: FastifyReply) => {
    const { id, stopId } = req.params as { id: string; stopId: string }
    await tourService.deleteStop(id, stopId)
    return reply.status(204).send()
  })

  fastify.put('/tours/:id/stops/reorder', { preHandler }, async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as { id: string }
    const parsed = ReorderTourStopsSchema.safeParse(req.body)
    if (!parsed.success) throw new ValidationError('Validation failed', parsed.error.flatten())
    await tourService.reorderStops(id, parsed.data.stops)
    return reply.send(ok({ success: true }))
  })
}
