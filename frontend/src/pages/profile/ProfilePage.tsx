import { useForm } from 'react-hook-form'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { getProfile, updateProfile } from '@/services/auth/authService'
import { useAuth } from '@/features/auth/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { isApiError } from '@/services/api/httpClient'
import { apiConfig } from '@/services/api/apiConfig'

export function ProfilePage() {
  const { t } = useTranslation()
  const { refreshUser, isMockMode } = useAuth()
  const queryClient = useQueryClient()

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
  })

  const {
    register,
    handleSubmit,
    formState: { isDirty },
    reset,
  } = useForm({
    values: { name: profile?.name ?? '', email: profile?.email ?? '' },
  })

  const mutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['profile'] })
      await refreshUser()
      toast.success('Profile updated')
    },
    onError: (err) => {
      toast.error(isApiError(err) ? err.message : 'Update failed')
    },
  })

  if (isLoading) {
    return <div className="h-48 animate-pulse rounded-xl bg-[var(--color-muted)]" />
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <h1 className="text-2xl font-bold">{t('nav.profile')}</h1>
      {isMockMode && (
        <p className="text-sm text-amber-700 dark:text-amber-300">
          Profile updates are simulated in demo mode.
        </p>
      )}
      <Card>
        <CardHeader>
          <CardTitle>Account information</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit((values) => mutation.mutate(values))}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" {...register('name')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register('email')} />
            </div>
            <div className="flex gap-3">
              <Button type="submit" disabled={!isDirty || mutation.isPending}>
                {mutation.isPending ? t('common.loading') : t('common.save')}
              </Button>
              <Button type="button" variant="outline" onClick={() => reset()} disabled={!isDirty}>
                {t('common.cancel')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      <p className="text-xs text-[var(--color-muted-foreground)]">
        API mode: {apiConfig.useMockData ? 'Mock' : 'Live'} · Auth: {apiConfig.authMode}
      </p>
    </div>
  )
}
