'use client'

import { useTranslation } from '@/lib/i18n'

export function Footer() {
  const { t } = useTranslation()

  return (
    <footer className='hidden border-t border-border py-6 text-center text-xs text-muted-foreground md:block'>
      <p>{t('footer.source')}</p>
    </footer>
  )
}
