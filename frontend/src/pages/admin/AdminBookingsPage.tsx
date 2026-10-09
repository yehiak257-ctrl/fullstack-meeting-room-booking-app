import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getAdminBookings } from '@/services/bookings/bookingService'
import { BookingStatusBadge } from '@/components/bookings/BookingStatusBadge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { BookingFilters, BookingStatus } from '@/types'

export function AdminBookingsPage() {
  const { t } = useTranslation()
  const [filters, setFilters] = useState<BookingFilters>({ page: 1, perPage: 15 })

  const { data, isLoading } = useQuery({
    queryKey: ['admin-bookings', filters],
    queryFn: () => getAdminBookings(filters),
  })

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t('admin.bookings')}</h1>

      <div className="flex flex-wrap gap-3">
        <Input
          placeholder="Search by room or ID…"
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

      <div className="overflow-x-auto rounded-xl border border-[var(--color-border)]">
        <table className="w-full text-sm">
          <thead className="border-b border-[var(--color-border)] bg-[var(--color-muted)]/50">
            <tr>
              <th className="px-4 py-3 text-start font-medium">ID</th>
              <th className="px-4 py-3 text-start font-medium">Room</th>
              <th className="px-4 py-3 text-start font-medium">Date</th>
              <th className="px-4 py-3 text-start font-medium">Time</th>
              <th className="px-4 py-3 text-start font-medium">Status</th>
              <th className="px-4 py-3 text-end font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-[var(--color-muted-foreground)]">
                  Loading…
                </td>
              </tr>
            )}
            {data?.data.map((b) => (
              <tr key={b.id} className="border-b border-[var(--color-border)] last:border-0">
                <td className="px-4 py-3">#{b.id}</td>
                <td className="px-4 py-3 font-medium">{b.roomName}</td>
                <td className="px-4 py-3">{b.date}</td>
                <td className="px-4 py-3">
                  {b.startTime} – {b.endTime}
                </td>
                <td className="px-4 py-3">
                  <BookingStatusBadge status={b.status} />
                </td>
                <td className="px-4 py-3 text-end">
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/admin/bookings/${b.id}`}>View</Link>
                  </Button>
                </td>
              </tr>
            ))}
            {data && data.data.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-[var(--color-muted-foreground)]">
                  No bookings found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
