import { z } from 'zod'

export const CreateTicketSchema = z.object({
  packageId: z.string().min(1, 'Package là bắt buộc'),
  guestName: z.string().min(1, 'Tên khách là bắt buộc').max(100),
  guestPhone: z.string().min(9).max(15).optional(),
  note: z.string().max(500).optional(),
})

export const ActivateTicketSchema = z.object({
  code: z.string().regex(/^NBG-[A-Z0-9]{6}$/, 'Mã vé không hợp lệ (dạng NBG-XXXXXX)'),
})

export const TicketQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
})
