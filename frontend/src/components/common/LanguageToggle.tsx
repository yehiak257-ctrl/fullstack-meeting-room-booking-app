import { useTranslation } from 'react-i18next'
import { setLanguage } from '@/i18n'
import { Button } from '@/components/ui/button'

export function LanguageToggle() {
  const { i18n } = useTranslation()
  const isAr = i18n.language === 'ar'

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setLanguage(isAr ? 'en' : 'ar')}
      className="min-w-[2.5rem] font-medium"
    >
      {isAr ? 'EN' : 'عر'}
    </Button>
  )
}
