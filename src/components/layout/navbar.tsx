'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslation } from '@/lib/i18n'
import { useProfileStore } from '@/stores/profile'
import { ThemeToggle } from '@/components/theme-toggle'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { href: '/', labelKey: 'nav.home' },
  { href: '/fortune/daily', labelKey: 'nav.fortune' },
  { href: '/compatibility', labelKey: 'nav.compatibility' },
  { href: '/company', labelKey: 'nav.company' },
  { href: '/knowledge', labelKey: 'nav.knowledge' },
]

const LOCALES = [
  { code: 'zh-TW', label: '中' },
  { code: 'en', label: 'EN' },
  { code: 'ja', label: '日' },
]

export function Navbar() {
  const pathname = usePathname()
  const { t } = useTranslation()
  const locale = useProfileStore((s) => s.locale)
  const setLocale = useProfileStore((s) => s.setLocale)

  function isActive(href: string) {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <header className='fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm'>
      <nav className='mx-auto flex h-12 max-w-2xl items-center justify-between px-4'>
        <Link
          href='/'
          className='font-serif text-lg font-bold tracking-wider text-foreground dark:text-primary'
        >
          {t('app.title')}
        </Link>

        <div className='hidden items-center gap-4 text-[13px] md:flex'>
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'relative text-muted-foreground transition-colors hover:text-foreground',
                isActive(item.href) &&
                  'text-foreground after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:bg-primary'
              )}
            >
              {t(item.labelKey)}
            </Link>
          ))}
        </div>

        <div className='flex items-center gap-1'>
          {LOCALES.map((l) => (
            <button
              key={l.code}
              onClick={() => setLocale(l.code)}
              className={cn(
                'px-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground',
                locale === l.code && 'font-semibold text-foreground'
              )}
            >
              {l.label}
            </button>
          ))}
          <ThemeToggle />
        </div>
      </nav>
    </header>
  )
}
