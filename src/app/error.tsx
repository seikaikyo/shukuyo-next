'use client'

import * as Sentry from '@sentry/nextjs'
import { useEffect } from 'react'
import { useTranslation } from '@/lib/i18n'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const { t } = useTranslation()

  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <div className='flex flex-1 items-center justify-center py-24 px-4'>
      <div className='flex flex-col items-center gap-4 text-center max-w-sm'>
        <h2 className='text-lg font-semibold text-foreground'>{t('error.renderError')}</h2>
        <p className='text-sm text-muted-foreground'>
          {error.message || t('error.renderErrorDesc')}
        </p>
        <button
          onClick={reset}
          className='rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted'
        >
          {t('common.retry')}
        </button>
      </div>
    </div>
  )
}
