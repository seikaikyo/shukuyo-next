'use client'

import Link from 'next/link'
import { useTranslation } from '@/lib/i18n'

export function Footer() {
  const { t } = useTranslation()

  return (
    <footer className='border-t border-border bg-background py-8'>
      <div className='mx-auto max-w-5xl px-4 flex flex-col sm:flex-row items-center justify-between gap-3'>
        <p className='text-xs text-muted-foreground'>
          &copy; 2026 {t('header.title')} Shukuyodo
        </p>
        <nav className='flex items-center gap-4'>
          <Link
            href='/about'
            className='text-xs text-muted-foreground hover:text-foreground transition-colors duration-200'
          >
            About
          </Link>
          <Link
            href='/about/tech'
            className='text-xs text-muted-foreground hover:text-foreground transition-colors duration-200'
          >
            Tech
          </Link>
        </nav>
      </div>
    </footer>
  )
}
