import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/features/auth/AuthContext'
import { ThemeToggle } from '@/components/common/ThemeToggle'
import { LanguageToggle } from '@/components/common/LanguageToggle'
import { Button } from '@/components/ui/button'
import { Building2, LogOut, User } from 'lucide-react'
import { apiConfig } from '@/services/api/apiConfig'

export function PublicLayout() {
  const { t } = useTranslation()
  const { isAuthenticated, user, logout, isMockMode } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/rooms')
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[var(--color-background)]/95 backdrop-blur supports-[backdrop-filter]:bg-[var(--color-background)]/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link to="/rooms" className="flex items-center gap-2 font-semibold tracking-tight">
            <Building2 className="h-6 w-6 text-[var(--color-primary)]" />
            <span>{t('appName')}</span>
          </Link>

          <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
            <Link to="/rooms" className="text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors">
              {t('nav.rooms')}
            </Link>
            {isAuthenticated && (
              <Link to="/my-bookings" className="text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors">
                {t('nav.myBookings')}
              </Link>
            )}
            {user?.role === 'admin' && (
              <Link to="/admin" className="text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors">
                {t('nav.admin')}
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-2">
            {isMockMode && (
              <span className="hidden rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-900/40 dark:text-amber-200 sm:inline">
                Demo mode
              </span>
            )}
            <LanguageToggle />
            <ThemeToggle />
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/profile">
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline">{user?.name}</span>
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" onClick={handleLogout} title={t('nav.logout')}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/login">{t('nav.login')}</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link to="/register">{t('nav.register')}</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>

      <footer className="border-t border-[var(--color-border)] py-8 text-center text-sm text-[var(--color-muted-foreground)]">
        <p>
          {apiConfig.appName} — Meeting room reservation system
          {isMockMode && ' · Running with mock data'}
        </p>
      </footer>
    </div>
  )
}
