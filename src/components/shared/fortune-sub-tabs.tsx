'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslation } from '@/lib/i18n'
import { cn } from '@/lib/utils'

const FORTUNE_TABS = [
  { href: '/fortune/daily', labelKey: 'fortune.daily' },
  { href: '/fortune/weekly', labelKey: 'fortune.weekly' },
  { href: '/fortune/monthly', labelKey: 'fortune.monthly' },
  { href: '/fortune/yearly', labelKey: 'fortune.yearly' },
  { href: '/fortune/decade', labelKey: 'fortune.decade' },
  { href: '/fortune/lucky', labelKey: 'fortune.lucky' },
  { href: '/fortune/calendar', labelKey: 'fortune.calendar' },
  { href: '/fortune/startup', labelKey: 'fortune.startup' },
]

export function FortuneSubTabs() {
  const pathname = usePathname()
  const { t } = useTranslation()

  return (
    <div className='mb-4 flex gap-0.5 overflow-x-auto rounded-lg border border-border bg-muted p-[3px]'>
      {FORTUNE_TABS.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          className={cn(
            'flex-1 whitespace-nowrap rounded-md px-2.5 py-[7px] text-center text-xs text-muted-foreground transition-all',
            'min-w-[48px]',
            pathname === tab.href &&
              'bg-card font-semibold text-foreground shadow-sm'
          )}
        >
          {t(tab.labelKey)}
        </Link>
      ))}
    </div>
  )
}
