'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const tabs = [
  { href: '/fortune/daily', label: '日運' },
  { href: '/fortune/weekly', label: '週運' },
  { href: '/fortune/monthly', label: '月運' },
  { href: '/fortune/yearly', label: '年運' },
  { href: '/fortune/decade', label: '十年運' },
  { href: '/fortune/lucky', label: '吉日' },
  { href: '/fortune/startup', label: '創業運' },
]

function FortuneTabBar() {
  const pathname = usePathname()

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
