'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/lib/i18n'
import { InfoHint } from './info-hint'
import { LEVEL_GLOSSARY, getKnowledgeLink } from '@/utils/glossary'

const LEVEL_MAP: Record<string, { textKey: string; color: string; bg: string }> = {
  daikichi: { textKey: 'fortune.levels.daikichi', color: 'text-[var(--fortune-great)]', bg: 'bg-[var(--fortune-great)]/12' },
  kichi: { textKey: 'fortune.levels.kichi', color: 'text-[var(--fortune-good)]', bg: 'bg-[var(--fortune-good)]/12' },
  shokyo: { textKey: 'fortune.levels.shokyo', color: 'text-[var(--fortune-caution)]', bg: 'bg-[var(--fortune-caution)]/12' },
  kyo: { textKey: 'fortune.levels.kyo', color: 'text-[var(--fortune-bad)]', bg: 'bg-[var(--fortune-bad)]/12' },
  suekichi: { textKey: 'fortune.levels.suekichi', color: 'text-[var(--fortune-caution)]', bg: 'bg-[var(--fortune-caution)]/12' },
  hankichi: { textKey: 'fortune.levels.hankichi', color: 'text-[var(--fortune-caution)]', bg: 'bg-[var(--fortune-caution)]/12' },
  daikyo: { textKey: 'fortune.levels.daikyo', color: 'text-[var(--fortune-bad)]', bg: 'bg-[var(--fortune-bad)]/12' },
}

// CJK aliases
const CJK_MAP: Record<string, string> = {
  '\u5927\u5409': 'daikichi', '\u5409': 'kichi', '\u672b\u5409': 'suekichi',
  '\u5c0f\u51f6': 'shokyo', '\u51f6': 'kyo', '\u5927\u51f6': 'daikyo',
  '\u534a\u5409': 'hankichi',
}

interface FortuneBadgeProps {
  level?: string
  size?: 'small' | 'normal' | 'large'
  className?: string
}

export function FortuneBadge({ level, size = 'normal', className }: FortuneBadgeProps) {
  const { t } = useTranslation()

  const key = level ? (CJK_MAP[level] || level) : ''
  const entry = LEVEL_MAP[key]
  const text = entry ? t(entry.textKey) : '--'
  const color = entry?.color || 'text-muted-foreground'
  const bg = entry?.bg || 'bg-muted/50'

  const sizeClass = size === 'small' ? 'text-[10px] px-1.5 py-0.5' :
    size === 'large' ? 'text-base px-3 py-1.5' : 'text-xs px-2 py-0.5'

  const glossary = key ? LEVEL_GLOSSARY[key] : undefined

  return (
    <span className='inline-flex items-center gap-1'>
      <span className={cn('rounded-md font-medium', sizeClass, color, bg, className)}>
        {text}
      </span>
      {glossary && (
        <InfoHint text={t(glossary.i18nKey)} anchor={glossary.anchor} />
      )}
    </span>
  )
}
