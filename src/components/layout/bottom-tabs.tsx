'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const tabs = [
  { href: '/', label: '首頁', icon: '家' },
  { href: '/fortune', label: '運勢', icon: '星' },
  { href: '/compatibility', label: '相性', icon: '縁' },
  { href: '/knowledge', label: '知識', icon: '書' },
]

export function BottomTabs() {
  const pathname = usePathname()

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
