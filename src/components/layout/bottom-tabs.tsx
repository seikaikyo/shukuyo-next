'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslation } from '@/lib/i18n'
import { cn } from '@/lib/utils'

const TABS = [
  { href: '/', labelKey: 'nav.home', icon: '\u5BB6' },
  { href: '/fortune/daily', labelKey: 'nav.fortune', icon: '\u661F' },
  { href: '/compatibility', labelKey: 'nav.match', icon: '\u7E01' },
  { href: '/company', labelKey: 'nav.company', icon: '\u793E' },
  { href: '/knowledge', labelKey: 'nav.knowledge', icon: '\u66F8' },
]

export function BottomTabs() {
  const pathname = usePathname()
  const { t } = useTranslation()

  function isActive(href: string) {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <nav className='fixed bottom-0 left-0 right-0 z-50 flex border-t border-border bg-background/95 backdrop-blur-sm pb-[env(safe-area-inset-bottom,8px)] md:hidden'>
      {TABS.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          className={cn(
            'flex flex-1 flex-col items-center py-2 text-[10px] transition-colors',
            isActive(tab.href)
              ? 'text-primary'
              : 'text-muted-foreground'
          )}
        >
          <span className='font-serif text-lg leading-none'>{tab.icon}</span>
          {t(tab.labelKey)}
        </Link>
      ))}
    </nav>
  )
}
