import { useParams, Link, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { getBookingById, cancelBooking } from '@/services/bookings/bookingService'
import { BookingStatusBadge } from '@/components/bookings/BookingStatusBadge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { isApiError } from '@/services/api/httpClient'
import { ArrowLeft } from 'lucide-react'
import { useState } from 'react'

export function BookingDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [confirming, setConfirming] = useState(false)

  const { data: booking, isLoading, isError, error } = useQuery({
    queryKey: ['booking', id],
    queryFn: () => getBookingById(id!),
    enabled: !!id,
  })

  const cancelMutation = useMutation({
    mutationFn: () => cancelBooking(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['booking', id] })
      queryClient.invalidateQueries({ queryKey: ['my-bookings'] })
      toast.success('Booking cancelled')
      setConfirming(false)
    },
    onError: (err) => {
      toast.error(isApiError(err) ? err.message : 'Cancellation failed')
      setConfirming(false)
    },
  })

  if (isLoading) {
    return <div className="h-48 animate-pulse rounded-xl bg-[var(--color-muted)]" />
  }

  if (isError || !booking) {
    return (
      <div className="rounded-xl border border-[var(--color-destructive)]/30 p-8 text-center">
        <p className="text-[var(--color-destructive)]">
          {(error as { message?: string })?.message || 'Booking not found'}
        </p>
        <Button className="mt-4" variant="outline" asChild>
          <Link to="/my-bookings">{t('common.back')}</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link to="/my-bookings">
          <ArrowLeft className="h-4 w-4" />
          {t('common.back')}
        </Link>
      </Button>

      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div>
            <CardTitle className="text-xl">{booking.roomName}</CardTitle>
            <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
              Booking #{booking.id}
            </p>
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
            {booking.roomLocation && (
              <div>
                <dt className="text-[var(--color-muted-foreground)]">Location</dt>
                <dd className="font-medium">{booking.roomLocation}</dd>
              </div>
            )}
            {booking.createdAt && (
              <div>
                <dt className="text-[var(--color-muted-foreground)]">Created</dt>
                <dd className="font-medium">
                  {new Date(booking.createdAt).toLocaleString()}
                </dd>
              </div>
            )}
            {booking.notes && (
              <div className="sm:col-span-2">
                <dt className="text-[var(--color-muted-foreground)]">Notes</dt>
                <dd className="font-medium">{booking.notes}</dd>
              </div>
            )}
          </dl>

          {booking.canCancel && (
            <div className="border-t border-[var(--color-border)] pt-4">
              {!confirming ? (
                <Button variant="destructive" onClick={() => setConfirming(true)}>
                  {t('bookings.cancel')}
                </Button>
              ) : (
                <div className="flex flex-wrap items-center gap-3">
                  <p className="text-sm">Are you sure you want to cancel this booking?</p>
                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={cancelMutation.isPending}
                    onClick={() => cancelMutation.mutate()}
                  >
                    {cancelMutation.isPending ? t('common.loading') : t('common.confirm')}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setConfirming(false)}>
                    {t('common.cancel')}
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
