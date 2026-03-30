'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/lib/i18n'

function FortuneTabBar() {
  const pathname = usePathname()
  const { t } = useTranslation()

  const tabs = [
    { href: '/fortune/daily', label: t('fortune.daily') },
    { href: '/fortune/weekly', label: t('fortune.weekly') },
    { href: '/fortune/monthly', label: t('fortune.monthly') },
    { href: '/fortune/yearly', label: t('fortune.yearly') },
    { href: '/fortune/decade', label: t('fortune.decade') },
    { href: '/fortune/lucky', label: t('fortune.luckyDays.tab') },
    { href: '/fortune/calendar', label: t('fortune.calendarView') },
    { href: '/fortune/startup', label: t('startup.navLabel') },
  ]

  return (
    <div className='border-b border-border bg-background sticky top-16 z-30'>
      <div className='mx-auto max-w-2xl px-4'>
        <div className='flex overflow-x-auto scrollbar-none gap-0 -mb-px'>
          {tabs.map(({ href, label }) => {
            const isActive = pathname === href || pathname.startsWith(href + '/')
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'shrink-0 px-4 py-3 text-sm font-medium transition-colors duration-200',
                  'border-b-2 whitespace-nowrap',
                  isActive
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                )}
              >
                {label}
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default function FortuneLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className='flex flex-col flex-1 min-h-0'>
      <FortuneTabBar />
      <div className='flex-1'>{children}</div>
    </div>
  )
}
