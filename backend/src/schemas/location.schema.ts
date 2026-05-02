import { z } from 'zod'

export const CreateLocationSchema = z.object({
  nameVi: z.string().min(1),
  nameEn: z.string().min(1),
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers and hyphens'),
  descriptionVi: z.string().optional(),
  descriptionEn: z.string().optional(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  displayOrder: z.number().int().min(0).optional(),
})

export const UpdateLocationSchema = CreateLocationSchema.partial().extend({
  isActive: z.boolean().optional(),
})

export const LocationQuerySchema = z.object({
  search: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  isActive: z
    .enum(['true', 'false'])
    .transform((v) => v === 'true')
    .optional(),
})

export type CreateLocationDto = z.infer<typeof CreateLocationSchema>
export type UpdateLocationDto = z.infer<typeof UpdateLocationSchema>
export type LocationQuery = z.infer<typeof LocationQuerySchema>
