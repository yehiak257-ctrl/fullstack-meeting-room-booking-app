import { z } from 'zod'

export const createBookingSchema = z
  .object({
    roomId: z.union([z.string(), z.number()]).refine((v) => v !== '' && v != null, {
      message: 'Please select a room',
    }),
    date: z.string().min(1, 'Date is required'),
    startTime: z.string().min(1, 'Start time is required'),
    endTime: z.string().min(1, 'End time is required'),
    notes: z.string().max(500, 'Notes must be 500 characters or less').optional().or(z.literal('')),
  })
  .refine(
    (data) => {
      if (!data.startTime || !data.endTime) return true
      return data.endTime > data.startTime
    },
    {
      message: 'End time must be after start time',
      path: ['endTime'],
    }
  )

export type CreateBookingFormValues = z.infer<typeof createBookingSchema>
