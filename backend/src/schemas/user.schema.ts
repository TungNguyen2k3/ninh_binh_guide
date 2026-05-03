import { z } from 'zod'

export const CreateUserSchema = z
  .object({
    email: z.string().email().optional(),
    phone: z.string().min(9).max(15).optional(),
    name: z.string().min(1).max(100),
    password: z.string().min(8),
    role: z.enum(['admin', 'staff']),
  })
  .refine((d) => d.email || d.phone, {
    message: 'Email hoặc số điện thoại là bắt buộc',
    path: ['email'],
  })

export const UpdateRoleSchema = z.object({
  role: z.enum(['admin', 'staff', 'tourist']),
})

export const UserQuerySchema = z.object({
  search: z.string().optional(),
  role: z.enum(['admin', 'staff', 'tourist']).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
})
