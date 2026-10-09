import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getRooms } from '@/services/rooms/roomService'
import { RoomCard } from '@/components/rooms/RoomCard'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, SlidersHorizontal } from 'lucide-react'
import type { RoomFilters } from '@/types'

export function RoomsPage() {
  const { t } = useTranslation()
  const [filters, setFilters] = useState<RoomFilters>({ page: 1, perPage: 9 })
  const [searchInput, setSearchInput] = useState('')

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['rooms', filters],
    queryFn: () => getRooms(filters),
  })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setFilters((f) => ({ ...f, search: searchInput, page: 1 }))
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('rooms.title')}</h1>
        <p className="mt-2 text-[var(--color-muted-foreground)]">{t('rooms.subtitle')}</p>
      </div>

      <form onSubmit={handleSearch} className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-muted-foreground)]" />
          <Input
            className="ps-10"
            placeholder={t('rooms.searchPlaceholder')}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <select
            className="h-10 rounded-md border border-[var(--color-input)] bg-transparent px-3 text-sm"
            value={filters.minCapacity ?? ''}
            onChange={(e) =>
              setFilters((f) => ({
                ...f,
                minCapacity: e.target.value ? Number(e.target.value) : undefined,
                page: 1,
              }))
            }
          >
            <option value="">Any capacity</option>
            <option value="4">4+</option>
            <option value="8">8+</option>
            <option value="12">12+</option>
            <option value="20">20+</option>
          </select>
          <select
            className="h-10 rounded-md border border-[var(--color-input)] bg-transparent px-3 text-sm"
            value={filters.sortBy ?? ''}
            onChange={(e) =>
              setFilters((f) => ({
                ...f,
                sortBy: e.target.value || undefined,
                sortDir: 'asc',
                page: 1,
              }))
            }
          >
            <option value="">Sort by</option>
            <option value="name">Name</option>
            <option value="capacity">Capacity</option>
          </select>
          <Button type="submit" variant="secondary">
            <SlidersHorizontal className="h-4 w-4" />
            {t('common.filter')}
          </Button>
        </div>
      </form>

      {isLoading && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-80 animate-pulse rounded-xl border border-[var(--color-border)] bg-[var(--color-muted)]"
            />
          ))}
        </div>
      )}

      {isError && (
        <div className="rounded-xl border border-[var(--color-destructive)]/30 bg-[var(--color-destructive)]/5 p-8 text-center">
          <p className="font-medium text-[var(--color-destructive)]">
            {(error as { message?: string })?.message || t('common.error')}
          </p>
          <Button className="mt-4" variant="outline" onClick={() => refetch()}>
            {t('common.retry')}
          </Button>
        </div>
      )}

      {data && data.data.length === 0 && (
        <div className="rounded-xl border border-dashed border-[var(--color-border)] p-12 text-center">
          <p className="text-lg font-medium">{t('rooms.noRooms')}</p>
          <p className="mt-1 text-[var(--color-muted-foreground)]">{t('rooms.noRoomsHint')}</p>
        </div>
      )}

      {data && data.data.length > 0 && (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.data.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>

          {data.meta.lastPage > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={data.meta.currentPage <= 1}
                onClick={() => setFilters((f) => ({ ...f, page: (f.page ?? 1) - 1 }))}
              >
                Previous
              </Button>
              <span className="text-sm text-[var(--color-muted-foreground)]">
                Page {data.meta.currentPage} of {data.meta.lastPage}
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
        </>
      )}
    </div>
  )
}
