import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { getRoomById } from '@/services/rooms/roomService'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Users, MapPin, ArrowLeft } from 'lucide-react'

export function RoomDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const { t } = useTranslation()

  const { data: room, isLoading, isError, error } = useQuery({
    queryKey: ['room', id],
    queryFn: () => getRoomById(id!),
    enabled: !!id,
  })

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 animate-pulse rounded bg-[var(--color-muted)]" />
        <div className="aspect-video animate-pulse rounded-xl bg-[var(--color-muted)]" />
      </div>
    )
  }

  if (isError || !room) {
    return (
      <div className="rounded-xl border border-[var(--color-destructive)]/30 p-8 text-center">
        <p className="font-medium text-[var(--color-destructive)]">
          {(error as { message?: string })?.message || 'Room not found'}
        </p>
        <Button className="mt-4" variant="outline" asChild>
          <Link to="/rooms">{t('common.back')}</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <Button variant="ghost" size="sm" asChild>
        <Link to="/rooms">
          <ArrowLeft className="h-4 w-4" />
          {t('common.back')}
        </Link>
      </Button>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="aspect-[4/3] overflow-hidden rounded-xl bg-[var(--color-muted)]">
          {room.imageUrl ? (
            <img src={room.imageUrl} alt={room.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-[var(--color-muted-foreground)]">
              No image
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <h1 className="text-3xl font-bold tracking-tight">{room.name}</h1>
              {room.isAvailable != null && (
                <Badge variant={room.isAvailable ? 'success' : 'secondary'}>
                  {room.isAvailable ? t('rooms.available') : t('rooms.unavailable')}
                </Badge>
              )}
            </div>
            <div className="mt-3 flex flex-wrap gap-4 text-[var(--color-muted-foreground)]">
              <span className="inline-flex items-center gap-1.5">
                <Users className="h-4 w-4" />
                {room.capacity} {t('rooms.people')}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                {room.location}
              </span>
            </div>
          </div>

          {room.description && (
            <p className="leading-relaxed text-[var(--color-muted-foreground)]">
              {room.description}
            </p>
          )}

          {room.amenities && room.amenities.length > 0 && (
            <div>
              <h2 className="mb-2 font-semibold">Amenities</h2>
              <div className="flex flex-wrap gap-2">
                {room.amenities.map((a) => (
                  <Badge key={a} variant="outline">
                    {a}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <Button size="lg" asChild>
            <Link to={`/bookings/create?roomId=${room.id}`}>{t('rooms.bookNow')}</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
