'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslation } from '@/lib/i18n'
import { cn } from '@/lib/utils'

const tabDefs = [
  { href: '/', key: 'nav.home', icon: '家' },
  { href: '/fortune', key: 'nav.fortune', icon: '星' },
  { href: '/compatibility', key: 'nav.match', icon: '縁' },
  { href: '/company', key: 'nav.company', icon: '社' },
  { href: '/knowledge', key: 'nav.knowledge', icon: '書' },
]

export function BottomTabs() {
  const pathname = usePathname()
  const { t } = useTranslation()

  const tabs = tabDefs.map((d) => ({ ...d, label: t(d.key) }))

  return (
    <nav className='fixed bottom-0 inset-x-0 z-40 h-16 border-t border-border bg-background/95 backdrop-blur-sm md:hidden'>
      <div className='flex h-full'>
        {tabs.map((tab) => {
          const isActive =
            pathname === tab.href ||
            (tab.href !== '/' && pathname.startsWith(tab.href))

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                'flex flex-1 flex-col items-center justify-center gap-0.5',
                'text-center transition-colors duration-200',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <span
                className={cn(
                  'font-serif text-lg leading-none transition-transform duration-200',
                  isActive ? 'scale-110' : ''
                )}
              >
                {tab.icon}
              </span>
              <span className='text-[10px] font-medium leading-none'>
                {tab.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
