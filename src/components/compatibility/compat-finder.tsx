'use client'

import { useEffect } from 'react'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/lib/i18n'
import { Skeleton } from '@/components/ui/skeleton'
import { useCompatibilityFinder } from '@/hooks/use-compatibility'
import type { CompatibilityFinderResult } from '@/types/compatibility'

type RelationKey = keyof Omit<CompatibilityFinderResult, 'your_mansion'>
const RELATION_ORDER: RelationKey[] = ['mei', 'gyotai', 'eishin', 'yusui', 'ankai', 'kisei']

function relationBorderColor(key: string) {
  if (key === 'mei') return 'border-l-emerald-500'
  if (key === 'gyotai') return 'border-l-green-500'
  if (key === 'eishin') return 'border-l-sky-500'
  if (key === 'yusui') return 'border-l-slate-400'
  if (key === 'kisei') return 'border-l-amber-500'
  if (key === 'ankai') return 'border-l-red-500'
  return 'border-l-border'
}

function relationScoreColor(key: string) {
  if (key === 'mei') return 'text-emerald-600 dark:text-emerald-400'
  if (key === 'gyotai') return 'text-green-600 dark:text-green-400'
  if (key === 'eishin') return 'text-sky-600 dark:text-sky-400'
  if (key === 'yusui') return 'text-slate-500'
  if (key === 'kisei') return 'text-amber-600 dark:text-amber-400'
  if (key === 'ankai') return 'text-red-600 dark:text-red-400'
  return 'text-muted-foreground'
}

export function CompatFinder() {
  const { t } = useTranslation()
  const { finder, loading, fetchFinder } = useCompatibilityFinder()

  useEffect(() => {
    if (!finder) fetchFinder()
  }, [finder, fetchFinder])

  if (loading) {
    return (
      <div className='flex flex-col gap-3'>
        <Skeleton className='h-24 rounded-xl' />
        {[1, 2, 3].map((i) => <Skeleton key={i} className='h-20 rounded-lg' />)}
      </div>
    )
  }

  if (!finder) {
    return (
      <p className='text-sm text-muted-foreground text-center py-8'>
        {t('v3.match.noFinderData')}
      </p>
    )
  }

  return (
    <div className='flex flex-col gap-4'>
      {/* 我的宿 */}
      <div className='rounded-xl border border-border bg-card px-4 py-4 flex flex-col gap-2'>
        <div className='flex items-center gap-2 flex-wrap'>
          <h3 className='text-base font-semibold text-foreground'>{finder.your_mansion.name_jp}</h3>
          <span className='text-xs text-muted-foreground'>（{finder.your_mansion.reading}）</span>
          <span className='text-xs px-2 py-0.5 rounded bg-primary/10 text-primary'>{finder.your_mansion.yosei}</span>
        </div>
        <p className='text-xs text-muted-foreground'>{t('v3.match.suggestedMansions')}</p>
      </div>

      {/* 各關係分組 */}
      {RELATION_ORDER.map((relKey) => {
        const group = finder[relKey]
        if (!group) return null
        return (
          <div
            key={relKey}
            className={cn(
              'rounded-lg border border-border bg-card border-l-4 overflow-hidden',
              relationBorderColor(relKey)
            )}
          >
            <div className='px-4 py-3 flex flex-col gap-1'>
              <div className='flex items-center gap-2 flex-wrap'>
                <span className='text-sm font-semibold text-foreground'>{group.relation}</span>
                <span className='text-xs text-muted-foreground'>（{group.reading}）</span>
                <span className={cn('text-sm font-bold tabular-nums ml-auto', relationScoreColor(relKey))}>
                  {group.level}
                </span>
              </div>
              <p className='text-xs text-muted-foreground leading-relaxed'>{group.description}</p>
            </div>

            {/* 宿列表 */}
            <div className='px-4 pb-3 flex flex-wrap gap-1.5'>
              {(group.mansions || []).map((m) => (
                <div
                  key={m.index}
                  className='flex items-center gap-1 px-2 py-1 rounded bg-muted/40 text-xs'
                >
                  <span className='font-medium text-foreground'>{m.name_jp}</span>
                  <span className='text-muted-foreground'>（{m.reading}）</span>
                  <span className='text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary'>{m.yosei}</span>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
