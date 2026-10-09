import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Users, MapPin } from 'lucide-react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { Room } from '@/types'

export function RoomCard({ room }: { room: Room }) {
  const { t } = useTranslation()

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-md">
      <div className="relative aspect-[16/10] overflow-hidden bg-[var(--color-muted)]">
        {room.imageUrl ? (
          <img
            src={room.imageUrl}
            alt={room.name}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-[var(--color-muted-foreground)]">
            No image
          </div>
        )}
        {room.isAvailable != null && (
          <div className="absolute end-3 top-3">
            <Badge variant={room.isAvailable ? 'success' : 'secondary'}>
              {room.isAvailable ? t('rooms.available') : t('rooms.unavailable')}
            </Badge>
          </div>
        )}
      </div>
      <CardContent className="space-y-2 p-5">
        <h3 className="text-lg font-semibold leading-tight">{room.name}</h3>
        <div className="flex flex-wrap gap-3 text-sm text-[var(--color-muted-foreground)]">
          <span className="inline-flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            {room.capacity} {t('rooms.people')}
          </span>
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            {room.location}
          </span>
        </div>
        {room.description && (
          <p className="line-clamp-2 text-sm text-[var(--color-muted-foreground)]">
            {room.description}
          </p>
        )}
      </CardContent>
      <CardFooter className="flex gap-2 p-5 pt-0">
        <Button variant="outline" size="sm" className="flex-1" asChild>
          <Link to={`/rooms/${room.id}`}>{t('rooms.viewDetails')}</Link>
        </Button>
        <Button size="sm" className="flex-1" asChild>
          <Link to={`/bookings/create?roomId=${room.id}`}>{t('rooms.bookNow')}</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
