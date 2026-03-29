'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { ThemeToggle } from '@/components/theme-toggle'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/', label: '首頁' },
  { href: '/fortune', label: '運勢' },
  { href: '/compatibility', label: '相性' },
  { href: '/knowledge', label: '知識' },
]

const locales = [
  { code: 'zh', label: '中' },
  { code: 'en', label: 'EN' },
  { code: 'ja', label: '日' },
]

function NavLink({ href, label, onClick }: { href: string; label: string; onClick?: () => void }) {
  const pathname = usePathname()
  const isActive = pathname === href || (href !== '/' && pathname.startsWith(href))

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        'relative text-sm font-medium transition-colors duration-200',
        'hover:text-foreground',
        isActive
          ? 'text-foreground after:absolute after:-bottom-1 after:left-0 after:w-full after:h-px after:bg-primary'
          : 'text-muted-foreground'
      )}
    >
      {label}
    </Link>
  )
}

function LocaleSwitcher() {
  const [active, setActive] = useState('zh')

  return (
    <div className='flex items-center gap-0.5'>
      {locales.map((locale) => (
        <button
          key={locale.code}
          onClick={() => setActive(locale.code)}
          className={cn(
            'px-2 py-1 text-xs rounded transition-colors duration-200',
            active === locale.code
              ? 'text-primary font-medium'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          {locale.label}
        </button>
      ))}
    </div>
  )
}

function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <div className='flex flex-col justify-center items-center w-5 h-5 gap-1'>
      <span
        className={cn(
          'block h-px w-5 bg-current transition-all duration-200',
          open ? 'rotate-45 translate-y-[6px]' : ''
        )}
      />
      <span
        className={cn(
          'block h-px w-5 bg-current transition-all duration-200',
          open ? 'opacity-0' : ''
        )}
      />
      <span
        className={cn(
          'block h-px w-5 bg-current transition-all duration-200',
          open ? '-rotate-45 -translate-y-[6px]' : ''
        )}
      />
    </div>
  )
}

export function Navbar() {
  const [sheetOpen, setSheetOpen] = useState(false)

  return (
    <header className='fixed top-0 inset-x-0 z-40 h-16 border-b border-border bg-background/95 backdrop-blur-sm'>
      <nav className='mx-auto max-w-5xl h-full px-4 flex items-center justify-between gap-4'>
        {/* logo */}
        <Link
          href='/'
          className='font-serif text-xl font-semibold tracking-wide shrink-0 text-foreground dark:text-primary transition-colors duration-200'
        >
          宿曜道
        </Link>

        {/* center nav — desktop only */}
        <div className='hidden md:flex items-center gap-6'>
          {navLinks.map((link) => (
            <NavLink key={link.href} href={link.href} label={link.label} />
          ))}
        </div>

        {/* right controls */}
        <div className='flex items-center gap-1'>
          <div className='hidden md:flex'>
            <LocaleSwitcher />
          </div>
          <ThemeToggle />

          {/* hamburger — mobile only */}
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger
              aria-label='開啟選單'
              className={cn(
                'md:hidden inline-flex items-center justify-center',
                'w-9 h-9 rounded-md text-foreground',
                'hover:bg-muted transition-colors duration-200',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
              )}
            >
              <HamburgerIcon open={sheetOpen} />
            </SheetTrigger>
            <SheetContent side='right' className='w-64 pt-12 px-6'>
              <SheetHeader>
                <SheetTitle className='font-serif text-lg text-primary'>宿曜道</SheetTitle>
              </SheetHeader>
              <div className='mt-6 flex flex-col gap-5'>
                {navLinks.map((link) => (
                  <NavLink
                    key={link.href}
                    href={link.href}
                    label={link.label}
                    onClick={() => setSheetOpen(false)}
                  />
                ))}
              </div>
              <div className='mt-8 pt-6 border-t border-border'>
                <LocaleSwitcher />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  )
}
