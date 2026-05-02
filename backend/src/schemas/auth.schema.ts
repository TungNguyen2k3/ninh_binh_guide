import { z } from 'zod'

export const RegisterSchema = z
  .object({
    email: z.string().email('Invalid email address').optional(),
    phone: z.string().min(9, 'Phone number too short').max(15, 'Phone number too long').optional(),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  })
  .refine((data) => data.email !== undefined || data.phone !== undefined, {
    message: 'Either email or phone is required',
    path: ['email'],
  })

export const LoginSchema = z
  .object({
    email: z.string().email('Invalid email address').optional(),
    phone: z.string().optional(),
    password: z.string().min(1, 'Password is required'),
  })
  .refine((data) => data.email !== undefined || data.phone !== undefined, {
    message: 'Either email or phone is required',
    path: ['email'],
  })

export type RegisterDto = z.infer<typeof RegisterSchema>
export type LoginDto = z.infer<typeof LoginSchema>
