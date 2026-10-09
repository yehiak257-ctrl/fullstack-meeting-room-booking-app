import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/badge'
import type { BookingStatus } from '@/types'

const variantMap: Record<BookingStatus, 'warning' | 'success' | 'destructive' | 'secondary'> = {
  pending: 'warning',
  confirmed: 'success',
  cancelled: 'destructive',
  completed: 'secondary',
}

export function BookingStatusBadge({ status }: { status: BookingStatus }) {
  const { t } = useTranslation()
  return (
    <Badge variant={variantMap[status] ?? 'secondary'}>
      {t(`bookings.status.${status}`)}
    </Badge>
  )
}
