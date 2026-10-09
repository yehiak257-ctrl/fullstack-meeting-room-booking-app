import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { createBookingSchema, type CreateBookingFormValues } from '@/schemas/bookingSchema'
import { getRooms } from '@/services/rooms/roomService'
import { createBooking } from '@/services/bookings/bookingService'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { isApiError } from '@/services/api/httpClient'

export function CreateBookingPage() {
  const { t } = useTranslation()
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const defaultRoomId = params.get('roomId') ?? ''

  const { data: roomsData } = useQuery({
    queryKey: ['rooms', { perPage: 100 }],
    queryFn: () => getRooms({ perPage: 100 }),
  })

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<CreateBookingFormValues>({
    resolver: zodResolver(createBookingSchema),
    defaultValues: {
      roomId: defaultRoomId,
      date: '',
      startTime: '',
      endTime: '',
      notes: '',
    },
  })

  const mutation = useMutation({
    mutationFn: createBooking,
    onSuccess: (booking) => {
      queryClient.invalidateQueries({ queryKey: ['my-bookings'] })
      toast.success('Booking request submitted successfully')
      navigate(`/my-bookings/${booking.id}`)
    },
    onError: (err) => {
      if (isApiError(err)) {
        toast.error(err.message)
        if (err.errors) {
          Object.entries(err.errors).forEach(([key, msgs]) => {
            const fieldMap: Record<string, keyof CreateBookingFormValues> = {
              room_id: 'roomId',
              start_time: 'startTime',
              end_time: 'endTime',
            }
            const field = fieldMap[key] ?? (key as keyof CreateBookingFormValues)
            setError(field, { message: msgs[0] })
          })
        }
      } else {
        toast.error('Failed to create booking')
      }
    },
  })

  const onSubmit = (values: CreateBookingFormValues) => {
    mutation.mutate({
      room_id: values.roomId,
      date: values.date,
      start_time: values.startTime,
      end_time: values.endTime,
      notes: values.notes || undefined,
    })
  }

  const watched = watch()

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t('bookings.create')}</h1>
        <p className="text-[var(--color-muted-foreground)]">
          Select a room, date and time for your reservation.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Booking details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="roomId">Room</Label>
              <select
                id="roomId"
                className="flex h-10 w-full rounded-md border border-[var(--color-input)] bg-transparent px-3 text-sm"
                {...register('roomId')}
              >
                <option value="">Select a room</option>
                {roomsData?.data.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} — {r.location} ({r.capacity} people)
                  </option>
                ))}
              </select>
              {errors.roomId && (
                <p className="text-sm text-[var(--color-destructive)]">{errors.roomId.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" {...register('date')} />
              {errors.date && (
                <p className="text-sm text-[var(--color-destructive)]">{errors.date.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startTime">Start time</Label>
                <Input id="startTime" type="time" {...register('startTime')} />
                {errors.startTime && (
                  <p className="text-sm text-[var(--color-destructive)]">
                    {errors.startTime.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="endTime">End time</Label>
                <Input id="endTime" type="time" {...register('endTime')} />
                {errors.endTime && (
                  <p className="text-sm text-[var(--color-destructive)]">{errors.endTime.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (optional)</Label>
              <Input id="notes" {...register('notes')} placeholder="Meeting purpose…" />
              {errors.notes && (
                <p className="text-sm text-[var(--color-destructive)]">{errors.notes.message}</p>
              )}
            </div>

            {/* Summary */}
            {watched.roomId && watched.date && watched.startTime && watched.endTime && (
              <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-muted)]/40 p-4 text-sm">
                <p className="font-medium">Summary</p>
                <p className="mt-1 text-[var(--color-muted-foreground)]">
                  {roomsData?.data.find((r) => String(r.id) === String(watched.roomId))?.name} on{' '}
                  {watched.date} from {watched.startTime} to {watched.endTime}
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <Button type="button" variant="outline" asChild>
                <Link to="/rooms">{t('common.cancel')}</Link>
              </Button>
              <Button type="submit" disabled={isSubmitting || mutation.isPending} className="flex-1">
                {isSubmitting || mutation.isPending ? t('common.loading') : 'Submit booking request'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
