'use client'

import * as Sentry from '@sentry/nextjs'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <html lang='zh-TW'>
      <body className='min-h-screen flex items-center justify-center bg-background text-foreground'>
        <div className='flex flex-col items-center gap-4 text-center max-w-sm px-4'>
          <h2 className='text-lg font-semibold'>
            發生未預期的錯誤
          </h2>
          <p className='text-sm text-muted-foreground'>
            {error.message || '頁面載入時發生問題，請重試。'}
          </p>
          <Button variant='outline' onClick={reset}>
            重試
          </Button>
        </div>
      </body>
    </html>
  )
}
