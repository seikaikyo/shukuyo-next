'use client'

import { cn } from '@/lib/utils'

const LEVEL_STYLES: Record<string, string> = {
  great: 'bg-[var(--fortune-great)]/12 text-[var(--fortune-great)]',
  good: 'bg-[var(--fortune-good)]/10 text-[var(--fortune-good)]',
  caution: 'bg-[var(--fortune-caution)]/10 text-[var(--fortune-caution)]',
  bad: 'bg-[var(--fortune-bad)]/10 text-[var(--fortune-bad)]',
}

const SPECIAL_STYLES: Record<string, string> = {
  kanro: 'bg-[var(--kanro-bg)] text-[var(--kanro)]',
  kongou: 'bg-[var(--kongou-bg)] text-[var(--kongou)]',
  rasetsu: 'bg-[var(--fortune-bad)]/10 text-[var(--fortune-bad)]',
  ryouhan: 'bg-[var(--ryouhan-bg)] text-[var(--ryouhan)]',
}

export function levelToKey(level: string): string {
  const map: Record<string, string> = {
    'great_fortune': 'great',
    'good_fortune': 'good',
    'small_misfortune': 'caution',
    'misfortune': 'bad',
    'great_misfortune': 'bad',
  }
  return map[level] || 'good'
}

interface FortuneBadgeProps {
  label: string
  level?: string
  special?: string
  className?: string
}

export function FortuneBadge({ label, level, special, className }: FortuneBadgeProps) {
  const style = special
    ? SPECIAL_STYLES[special] || ''
    : level
      ? LEVEL_STYLES[levelToKey(level)] || ''
      : 'bg-primary/12 text-primary'

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold tracking-tight',
        style,
        className
      )}
    >
      {label}
    </span>
  )
}
