import { z } from 'zod'

export const CreatePackageSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  type: z.enum(['all_locations', 'custom']),
  validityHours: z.number().int().min(1).default(24),
  price: z.number().int().min(0).default(0),
})

export const UpdatePackageSchema = CreatePackageSchema.partial()

export const AssignLocationsSchema = z.object({
  locationIds: z.array(z.string()).min(0),
})

export type CreatePackageDto = z.infer<typeof CreatePackageSchema>
export type UpdatePackageDto = z.infer<typeof UpdatePackageSchema>
export type AssignLocationsDto = z.infer<typeof AssignLocationsSchema>
