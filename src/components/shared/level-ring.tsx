'use client'

import { cn } from '@/lib/utils'
import { levelToKey } from './fortune-badge'

const RING_STYLES: Record<string, string> = {
  great: 'border-[var(--fortune-great)] text-[var(--fortune-great)]',
  good: 'border-[var(--fortune-good)] text-[var(--fortune-good)]',
  caution: 'border-[var(--fortune-caution)] text-[var(--fortune-caution)]',
  bad: 'border-[var(--fortune-bad)] text-[var(--fortune-bad)]',
}

interface LevelRingProps {
  level: string
  label: string
  sublabel?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function LevelRing({ level, label, sublabel, size = 'md', className }: LevelRingProps) {
  const key = levelToKey(level)
  const sizeClass = {
    sm: 'h-20 w-20 text-base',
    md: 'h-24 w-24 text-xl',
    lg: 'h-[120px] w-[120px] text-2xl',
  }[size]

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-full border-[3px] font-serif font-bold',
        RING_STYLES[key],
        sizeClass,
        className
      )}
    >
      <span>{label}</span>
      {sublabel && <span className='mt-0.5 text-xs font-normal text-muted-foreground'>{sublabel}</span>}
    </div>
  )
}
