'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslation } from '@/lib/i18n'
import { cn } from '@/lib/utils'

const TABS = [
  { href: '/', matchPrefix: '/', labelKey: 'nav.home', icon: '\u5BB6' },
  { href: '/fortune/daily', matchPrefix: '/fortune', labelKey: 'nav.fortune', icon: '\u661F' },
  { href: '/compatibility', matchPrefix: '/compatibility', labelKey: 'nav.match', icon: '\u7E01' },
  { href: '/company', matchPrefix: '/company', labelKey: 'nav.company', icon: '\u793E' },
  { href: '/knowledge', matchPrefix: '/knowledge', labelKey: 'nav.knowledge', icon: '\u66F8' },
]

export function BottomTabs() {
  const pathname = usePathname()
  const { t } = useTranslation()

  function isActive(prefix: string) {
    if (prefix === '/') return pathname === '/'
    return pathname.startsWith(prefix)
  }

  return (
    <nav className='fixed bottom-0 left-0 right-0 z-50 flex border-t border-border bg-background/95 backdrop-blur-sm pb-[env(safe-area-inset-bottom,8px)] md:hidden'>
      {TABS.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          className={cn(
            'flex flex-1 flex-col items-center py-2 text-[10px] transition-colors',
            isActive(tab.matchPrefix)
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
