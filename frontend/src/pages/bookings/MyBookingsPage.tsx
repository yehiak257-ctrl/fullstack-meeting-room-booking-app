import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getMyBookings } from '@/services/bookings/bookingService'
import { BookingStatusBadge } from '@/components/bookings/BookingStatusBadge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import type { BookingFilters, BookingStatus } from '@/types'
import { Calendar, Clock, MapPin } from 'lucide-react'

export function MyBookingsPage() {
  const { t } = useTranslation()
  const [filters, setFilters] = useState<BookingFilters>({ page: 1, perPage: 10 })

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['my-bookings', filters],
    queryFn: () => getMyBookings(filters),
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{t('bookings.title')}</h1>
        </div>
        <Button asChild>
          <Link to="/bookings/create">{t('bookings.create')}</Link>
        </Button>
      </div>

      <div className="flex flex-wrap gap-3">
        <Input
          placeholder="Search…"
          className="max-w-xs"
          onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value, page: 1 }))}
        />
        <select
          className="h-10 rounded-md border border-[var(--color-input)] bg-transparent px-3 text-sm"
          value={filters.status ?? ''}
          onChange={(e) =>
            setFilters((f) => ({
              ...f,
              status: (e.target.value || undefined) as BookingStatus | undefined,
              page: 1,
            }))
          }
        >
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-xl bg-[var(--color-muted)]" />
          ))}
        </div>
      )}

      {isError && (
        <div className="rounded-xl border border-[var(--color-destructive)]/30 p-8 text-center">
          <p className="text-[var(--color-destructive)]">
            {(error as { message?: string })?.message || t('common.error')}
          </p>
          <Button className="mt-4" variant="outline" onClick={() => refetch()}>
            {t('common.retry')}
          </Button>
        </div>
      )}

      {data && data.data.length === 0 && (
        <div className="rounded-xl border border-dashed p-12 text-center">
          <p className="text-lg font-medium">{t('bookings.noBookings')}</p>
          <p className="mt-1 text-[var(--color-muted-foreground)]">{t('bookings.noBookingsHint')}</p>
          <Button className="mt-4" asChild>
            <Link to="/rooms">{t('nav.rooms')}</Link>
          </Button>
        </div>
      )}

      {data && data.data.length > 0 && (
        <div className="space-y-3">
          {data.data.map((b) => (
            <Card key={b.id} className="transition-shadow hover:shadow-md">
              <CardContent className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      to={`/my-bookings/${b.id}`}
                      className="font-semibold hover:underline"
                    >
                      {b.roomName}
                    </Link>
                    <BookingStatusBadge status={b.status} />
                  </div>
                  <div className="flex flex-wrap gap-3 text-sm text-[var(--color-muted-foreground)]">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {b.date}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {b.startTime} – {b.endTime}
                    </span>
                    {b.roomLocation && (
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {b.roomLocation}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[var(--color-muted-foreground)]">#{b.id}</p>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/my-bookings/${b.id}`}>Details</Link>
                </Button>
              </CardContent>
            </Card>
          ))}

          {data.meta.lastPage > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <Button
                variant="outline"
                size="sm"
                disabled={data.meta.currentPage <= 1}
                onClick={() => setFilters((f) => ({ ...f, page: (f.page ?? 1) - 1 }))}
              >
                Previous
              </Button>
              <span className="text-sm text-[var(--color-muted-foreground)]">
                {data.meta.currentPage} / {data.meta.lastPage}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={data.meta.currentPage >= data.meta.lastPage}
                onClick={() => setFilters((f) => ({ ...f, page: (f.page ?? 1) + 1 }))}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
