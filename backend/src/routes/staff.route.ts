import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { authenticate } from '../middlewares/authenticate.js'
import { requireRole } from '../middlewares/require-role.js'
import { TicketService } from '../services/ticket.service.js'
import { CreateTicketSchema, TicketQuerySchema } from '../schemas/ticket.schema.js'
import { ValidationError } from '../lib/errors.js'
import { ok, paginated } from '../lib/response.js'

interface StaffRouteOptions {
  ticketService: TicketService
}

export async function staffRoutes(
  fastify: FastifyInstance,
  options: StaffRouteOptions
): Promise<void> {
  const { ticketService } = options
  const preHandler = [authenticate, requireRole('staff', 'admin')]

  // POST /tickets — create a ticket for a guest
  fastify.post('/tickets', { preHandler }, async (req: FastifyRequest, reply: FastifyReply) => {
    const parsed = CreateTicketSchema.safeParse(req.body)
    if (!parsed.success) throw new ValidationError('Validation failed', parsed.error.flatten())

    const ticket = await ticketService.createTicket({
      ...parsed.data,
      staffId: req.user.userId,
    })
    return reply.status(201).send(ok(ticket))
  })

  // GET /tickets — list tickets created by the logged-in staff
  fastify.get('/tickets', { preHandler }, async (req: FastifyRequest, reply: FastifyReply) => {
    const parsed = TicketQuerySchema.safeParse(req.query)
    if (!parsed.success) throw new ValidationError('Invalid query parameters', parsed.error.flatten())

    const { page, limit } = parsed.data
    const { tickets, total } = await ticketService.listByStaff(req.user.userId, { page, limit })
    return reply.send(paginated(tickets, total, page, limit))
  })

  // GET /tickets/:id — detail of a single ticket
  fastify.get('/tickets/:id', { preHandler }, async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as { id: string }
    const ticket = await ticketService.getById(id)
    return reply.send(ok(ticket))
  })
}
