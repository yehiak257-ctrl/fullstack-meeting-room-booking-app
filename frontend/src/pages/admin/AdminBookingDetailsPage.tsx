import { useParams, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getBookingById, updateBookingStatus } from '@/services/bookings/bookingService'
import { BookingStatusBadge } from '@/components/bookings/BookingStatusBadge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { isApiError } from '@/services/api/httpClient'
import { ArrowLeft } from 'lucide-react'
import type { BookingStatus } from '@/types'

export function AdminBookingDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const queryClient = useQueryClient()

  const { data: booking, isLoading, isError } = useQuery({
    queryKey: ['booking', id],
    queryFn: () => getBookingById(id!),
    enabled: !!id,
  })

  const statusMutation = useMutation({
    mutationFn: (status: BookingStatus) => updateBookingStatus(id!, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['booking', id] })
      queryClient.invalidateQueries({ queryKey: ['admin-bookings'] })
      toast.success('Status updated')
    },
    onError: (err) => toast.error(isApiError(err) ? err.message : 'Update failed'),
  })

  if (isLoading) return <div className="h-48 animate-pulse rounded-xl bg-[var(--color-muted)]" />
  if (isError || !booking) {
    return (
      <div className="p-8 text-center">
        <p>Booking not found</p>
        <Button className="mt-4" variant="outline" asChild>
          <Link to="/admin/bookings">Back</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link to="/admin/bookings">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
      </Button>

      <Card>
        <CardHeader className="flex flex-row items-start justify-between">
          <div>
            <CardTitle>{booking.roomName}</CardTitle>
            <p className="text-sm text-[var(--color-muted-foreground)]">#{booking.id}</p>
          </div>
          <BookingStatusBadge status={booking.status} />
        </CardHeader>
        <CardContent className="space-y-4">
          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-[var(--color-muted-foreground)]">Date</dt>
              <dd className="font-medium">{booking.date}</dd>
            </div>
            <div>
              <dt className="text-[var(--color-muted-foreground)]">Time</dt>
              <dd className="font-medium">
                {booking.startTime} – {booking.endTime}
              </dd>
            </div>
            {booking.userName && (
              <div>
                <dt className="text-[var(--color-muted-foreground)]">User</dt>
                <dd className="font-medium">{booking.userName}</dd>
              </div>
            )}
            {booking.notes && (
              <div className="sm:col-span-2">
                <dt className="text-[var(--color-muted-foreground)]">Notes</dt>
                <dd className="font-medium">{booking.notes}</dd>
              </div>
            )}
          </dl>

          <div className="flex flex-wrap gap-2 border-t border-[var(--color-border)] pt-4">
            {booking.canConfirm && (
              <Button
                size="sm"
                disabled={statusMutation.isPending}
                onClick={() => statusMutation.mutate('confirmed')}
              >
                Confirm
              </Button>
            )}
            {booking.canComplete && (
              <Button
                size="sm"
                variant="secondary"
                disabled={statusMutation.isPending}
                onClick={() => statusMutation.mutate('completed')}
              >
                Mark completed
              </Button>
            )}
            {booking.canCancel && (
              <Button
                size="sm"
                variant="destructive"
                disabled={statusMutation.isPending}
                onClick={() => statusMutation.mutate('cancelled')}
              >
                Cancel
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
