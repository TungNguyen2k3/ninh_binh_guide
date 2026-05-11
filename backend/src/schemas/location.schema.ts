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
  overviewVi: z.string().optional(),
  overviewEn: z.string().optional(),
  historyVi: z.string().optional(),
  historyEn: z.string().optional(),
  highlightsVi: z.string().optional(),
  highlightsEn: z.string().optional(),
  openTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Định dạng HH:MM').nullish(),
  closeTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Định dạng HH:MM').nullish(),
  estimatedDuration: z.number().int().min(0).nullish(),
  address: z.string().optional(),
  bestTime: z.string().optional(),
})

export const AdmissionFeeSchema = z.object({
  labelVi: z.string().min(1),
  labelEn: z.string().min(1),
  price: z.number().int().min(0),
  order: z.number().int().min(0).optional().default(0),
})

export const UpdateAdmissionFeeSchema = AdmissionFeeSchema.partial()

export const CreateSpotSchema = z.object({
  nameVi: z.string().min(1),
  nameEn: z.string().min(1),
  descriptionVi: z.string().optional(),
  descriptionEn: z.string().optional(),
  latitude: z.number().min(-90).max(90).nullish(),
  longitude: z.number().min(-180).max(180).nullish(),
  order: z.number().int().min(0).optional(),
})

export const UpdateSpotSchema = CreateSpotSchema.partial()

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
export type CreateSpotDto = z.infer<typeof CreateSpotSchema>
export type UpdateSpotDto = z.infer<typeof UpdateSpotSchema>
export type AdmissionFeeDto = z.infer<typeof AdmissionFeeSchema>
export type UpdateAdmissionFeeDto = z.infer<typeof UpdateAdmissionFeeSchema>
