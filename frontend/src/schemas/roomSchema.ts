import { z } from 'zod'

export const roomSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  capacity: z.coerce.number().int().min(1, 'Capacity must be at least 1'),
  location: z.string().min(2, 'Location is required'),
  description: z.string().max(2000).optional().or(z.literal('')),
  amenities: z.string().optional(), // comma-separated in form
})

export type RoomFormValues = z.infer<typeof roomSchema>
