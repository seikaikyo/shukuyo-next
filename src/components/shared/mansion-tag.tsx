'use client'

import { cn } from '@/lib/utils'

const YOSEI_COLORS: Record<string, string> = {
  fire: 'text-red-600 dark:text-red-400',
  water: 'text-blue-600 dark:text-sky-400',
  wood: 'text-green-600 dark:text-green-400',
  metal: 'text-yellow-600 dark:text-yellow-300',
  earth: 'text-stone-500 dark:text-stone-400',
  sun: 'text-orange-600 dark:text-orange-400',
  moon: 'text-violet-600 dark:text-violet-400',
}

interface MansionTagProps {
  yosei: string
  yoseiLabel: string
  name: string
  className?: string
}

export function MansionTag({ yosei, yoseiLabel, name, className }: MansionTagProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded border border-border bg-muted px-2 py-0.5 text-xs',
        className
      )}
    >
      <span className={cn('font-medium', YOSEI_COLORS[yosei] || '')}>
        {yoseiLabel}
      </span>
      <span>{name}</span>
    </span>
  )
}
