'use client'

import * as Sentry from '@sentry/nextjs'
import { useEffect } from 'react'

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
            {'\u767C\u751F\u672A\u9810\u671F\u7684\u932F\u8AA4'}
          </h2>
          <p className='text-sm text-muted-foreground'>
            {error.message || '\u9801\u9762\u8F09\u5165\u6642\u767C\u751F\u554F\u984C\uFF0C\u8ACB\u91CD\u8A66\u3002'}
          </p>
          <button
            onClick={reset}
            className='rounded-lg border border-border px-4 py-2 text-sm font-medium'
          >
            {'\u91CD\u8A66'}
          </button>
        </div>
      </body>
    </html>
  )
}
