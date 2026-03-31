'use client'

import { cn } from '@/lib/utils'

const YOSEI_COLORS: Record<string, { text: string; bg: string; border: string }> = {
  '\u706b': { text: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-950/30', border: 'border-red-200 dark:border-red-800' },
  '\u6c34': { text: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-950/30', border: 'border-blue-200 dark:border-blue-800' },
  '\u6728': { text: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-950/30', border: 'border-green-200 dark:border-green-800' },
  '\u91d1': { text: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-50 dark:bg-yellow-950/30', border: 'border-yellow-200 dark:border-yellow-800' },
  '\u571f': { text: 'text-amber-700 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/30', border: 'border-amber-200 dark:border-amber-800' },
  '\u65e5': { text: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-950/30', border: 'border-orange-200 dark:border-orange-800' },
  '\u6708': { text: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-950/30', border: 'border-indigo-200 dark:border-indigo-800' },
}

const YOSEI_NAMES: Record<string, string> = {
  '\u706b': '\u706b\u66dc', '\u6c34': '\u6c34\u66dc', '\u6728': '\u6728\u66dc',
  '\u91d1': '\u91d1\u66dc', '\u571f': '\u571f\u66dc', '\u65e5': '\u65e5\u66dc', '\u6708': '\u6708\u66dc',
}

interface YoseiTagProps {
  yosei?: string | null
  reading?: string
  className?: string
}

export function YoseiTag({ yosei, reading, className }: YoseiTagProps) {
  if (!yosei) return null

  const colors = YOSEI_COLORS[yosei] || { text: 'text-muted-foreground', bg: 'bg-muted/50', border: 'border-border' }
  const displayName = YOSEI_NAMES[yosei] || yosei

  return (
    <span className={cn('inline-flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded border', colors.text, colors.bg, colors.border, className)}>
      <span>{displayName}</span>
      {reading && <span className='opacity-70 text-[9px]'>{reading}</span>}
    </span>
  )
}
