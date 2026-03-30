'use client'

import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav aria-label='breadcrumb' className={cn('flex items-center gap-1 text-xs text-muted-foreground', className)}>
      {items.map((item, i) => {
        const isLast = i === items.length - 1
        return (
          <span key={item.label} className='flex items-center gap-1'>
            {i > 0 && <ChevronRight className='size-3 shrink-0' aria-hidden='true' />}
            {isLast || !item.href ? (
              <span className={cn(isLast && 'text-foreground font-medium')}>{item.label}</span>
            ) : (
              <Link href={item.href} className='hover:text-foreground transition-colors'>
                {item.label}
              </Link>
            )}
          </span>
        )
      })}
    </nav>
  )
}
