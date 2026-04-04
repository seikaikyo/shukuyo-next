'use client'

import { cn } from '@/lib/utils'
import { levelToKey } from './fortune-badge'

const BAR_STYLES: Record<string, string> = {
  great: 'bg-[var(--fortune-great)]/12 text-[var(--fortune-great)]',
  good: 'bg-[var(--fortune-good)]/10 text-[var(--fortune-good)]',
  caution: 'bg-[var(--fortune-caution)]/10 text-[var(--fortune-caution)]',
  bad: 'bg-[var(--fortune-bad)]/10 text-[var(--fortune-bad)]',
}

const HEIGHT_MAP: Record<string, string> = {
  great: 'h-14',
  good: 'h-10',
  caution: 'h-7',
  bad: 'h-5',
}

interface LevelBarProps {
  level: string
  label: string
  isToday?: boolean
  className?: string
}

export function LevelBar({ level, label, isToday, className }: LevelBarProps) {
  const key = levelToKey(level)

  return (
    <div
      className={cn(
        'flex w-full items-center justify-center rounded text-[10px] font-semibold',
        BAR_STYLES[key],
        HEIGHT_MAP[key],
        isToday && 'ring-2 ring-primary',
        className
      )}
    >
      {label}
    </div>
  )
}
