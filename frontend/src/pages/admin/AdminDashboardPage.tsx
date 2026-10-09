import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { getDashboardStats } from '@/services/admin/adminService'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DoorOpen, CalendarDays, Clock, CheckCircle2 } from 'lucide-react'

export function AdminDashboardPage() {
  const { t } = useTranslation()
  const { data, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: getDashboardStats,
  })

  const cards = [
    { label: t('admin.totalRooms'), value: data?.totalRooms, icon: DoorOpen },
    { label: t('admin.totalBookings'), value: data?.totalBookings, icon: CalendarDays },
    { label: t('admin.pending'), value: data?.pendingBookings, icon: Clock },
    { label: t('admin.confirmed'), value: data?.confirmedBookings, icon: CheckCircle2 },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">{t('admin.overview')}</h1>
        {data?.isMock && (
          <p className="mt-1 text-sm text-amber-700 dark:text-amber-300">
            Showing mock statistics (demo mode)
          </p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c) => (
          <Card key={c.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-[var(--color-muted-foreground)]">
                {c.label}
              </CardTitle>
              <c.icon className="h-4 w-4 text-[var(--color-muted-foreground)]" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {isLoading ? '—' : (c.value ?? 0)}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
