import { z } from 'zod'

export const CreateTourSchema = z.object({
  nameVi: z.string().min(1),
  nameEn: z.string().min(1),
  duration: z.string().min(1),
  badgeVi: z.string().optional(),
  badgeEn: z.string().optional(),
  noteVi: z.string().optional(),
  noteEn: z.string().optional(),
  displayOrder: z.number().int().min(0).optional(),
})

export const UpdateTourSchema = CreateTourSchema.partial().extend({
  isActive: z.boolean().optional(),
})

export const CreateTourStopSchema = z.object({
  locationId: z.string().min(1),
  order: z.number().int().min(0).optional(),
  suggestedTime: z.string().optional(),
  suggestedDuration: z.string().optional(),
  noteVi: z.string().optional(),
  noteEn: z.string().optional(),
})

export const UpdateTourStopSchema = CreateTourStopSchema.partial()

export const ReorderTourStopsSchema = z.object({
  stops: z.array(
    z.object({
      id: z.string(),
      order: z.number().int().min(0),
    })
  ),
})

export type CreateTourDto = z.infer<typeof CreateTourSchema>
export type UpdateTourDto = z.infer<typeof UpdateTourSchema>
export type CreateTourStopDto = z.infer<typeof CreateTourStopSchema>
export type UpdateTourStopDto = z.infer<typeof UpdateTourStopSchema>
