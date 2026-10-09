import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { registerSchema, type RegisterFormValues } from '@/schemas/authSchema'
import { useAuth } from '@/features/auth/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { isApiError } from '@/services/api/httpClient'

export function RegisterPage() {
  const { t } = useTranslation()
  const { register: doRegister } = useAuth()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      await doRegister({
        name: values.name,
        email: values.email,
        password: values.password,
        password_confirmation: values.passwordConfirmation,
      })
      toast.success('Account created successfully')
      navigate('/rooms')
    } catch (err) {
      if (isApiError(err)) {
        toast.error(err.message)
        if (err.errors) {
          Object.entries(err.errors).forEach(([key, msgs]) => {
            const field = key === 'password_confirmation' ? 'passwordConfirmation' : key
            setError(field as keyof RegisterFormValues, { message: msgs[0] })
          })
        }
      } else {
        toast.error('Registration failed')
      }
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">{t('auth.registerTitle')}</CardTitle>
          <CardDescription>{t('auth.registerSubtitle')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t('auth.name')}</Label>
              <Input id="name" {...register('name')} />
              {errors.name && (
                <p className="text-sm text-[var(--color-destructive)]">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t('auth.email')}</Label>
              <Input id="email" type="email" {...register('email')} />
              {errors.email && (
                <p className="text-sm text-[var(--color-destructive)]">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t('auth.password')}</Label>
              <Input id="password" type="password" {...register('password')} />
              {errors.password && (
                <p className="text-sm text-[var(--color-destructive)]">{errors.password.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="passwordConfirmation">{t('auth.confirmPassword')}</Label>
              <Input
                id="passwordConfirmation"
                type="password"
                {...register('passwordConfirmation')}
              />
              {errors.passwordConfirmation && (
                <p className="text-sm text-[var(--color-destructive)]">
                  {errors.passwordConfirmation.message}
                </p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? t('common.loading') : t('auth.register')}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-[var(--color-muted-foreground)]">
            {t('auth.hasAccount')}{' '}
            <Link to="/login" className="font-medium text-[var(--color-primary)] hover:underline">
              {t('auth.login')}
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
