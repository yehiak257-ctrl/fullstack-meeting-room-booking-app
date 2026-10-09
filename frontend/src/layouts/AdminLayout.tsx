import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/features/auth/AuthContext'
import { ThemeToggle } from '@/components/common/ThemeToggle'
import { LanguageToggle } from '@/components/common/LanguageToggle'
import { Button } from '@/components/ui/button'
import {
  Building2,
  LayoutDashboard,
  DoorOpen,
  CalendarDays,
  LogOut,
  ArrowLeft,
} from 'lucide-react'
import { cn } from '@/utils/cn'

const navItems = [
  { to: '/admin', labelKey: 'admin.dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/rooms', labelKey: 'admin.rooms', icon: DoorOpen },
  { to: '/admin/bookings', labelKey: 'admin.bookings', icon: CalendarDays },
]

export function AdminLayout() {
  const { t } = useTranslation()
  const { user, logout, isMockMode } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/rooms')
  }

  return (
    <div className="flex min-h-screen bg-[var(--color-background)]">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 start-0 z-30 hidden w-64 flex-col border-e border-[var(--color-border)] bg-[var(--color-card)] lg:flex">
        <div className="flex h-16 items-center gap-2 border-b border-[var(--color-border)] px-6">
          <Building2 className="h-6 w-6 text-[var(--color-primary)]" />
          <span className="font-semibold">{t('appName')} Admin</span>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => {
            const active = item.end
              ? location.pathname === item.to
              : location.pathname.startsWith(item.to)
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  active
                    ? 'bg-[var(--color-primary)] text-[var(--color-primary-foreground)]'
                    : 'text-[var(--color-muted-foreground)] hover:bg-[var(--color-accent)] hover:text-[var(--color-accent-foreground)]'
                )}
              >
                <item.icon className="h-4 w-4" />
                {t(item.labelKey)}
              </Link>
            )
          })}
        </nav>
        <div className="border-t border-[var(--color-border)] p-4">
          <Link
            to="/rooms"
            className="flex items-center gap-2 text-sm text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to app
          </Link>
        </div>
      </aside>

      {/* Main */}
      <div className="flex flex-1 flex-col lg:ps-64">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-background)]/95 px-4 backdrop-blur sm:px-6">
          <div className="flex items-center gap-2 lg:hidden">
            <Building2 className="h-5 w-5 text-[var(--color-primary)]" />
            <span className="font-semibold text-sm">Admin</span>
          </div>
          <div className="ms-auto flex items-center gap-2">
            {isMockMode && (
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-900/40 dark:text-amber-200">
                Demo
              </span>
            )}
            <LanguageToggle />
            <ThemeToggle />
            <span className="hidden text-sm text-[var(--color-muted-foreground)] sm:inline">
              {user?.name}
            </span>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </header>

        {/* Mobile nav */}
        <div className="flex gap-2 overflow-x-auto border-b border-[var(--color-border)] px-4 py-2 lg:hidden">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                'whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium',
                location.pathname.startsWith(item.to)
                  ? 'bg-[var(--color-primary)] text-[var(--color-primary-foreground)]'
                  : 'bg-[var(--color-secondary)] text-[var(--color-secondary-foreground)]'
              )}
            >
              {t(item.labelKey)}
            </Link>
          ))}
        </div>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
