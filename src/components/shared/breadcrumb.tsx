'use client'

import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

interface BreadcrumbItem {
  label: string
  href?: string
}

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav className='mb-3 flex items-center gap-1 text-xs text-muted-foreground'>
      {items.map((item, i) => (
        <span key={i} className='flex items-center gap-1'>
          {i > 0 && <ChevronRight className='h-3 w-3' />}
          {item.href ? (
            <Link href={item.href} className='hover:text-foreground'>
              {item.label}
            </Link>
          ) : (
            <span className='text-foreground'>{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}
