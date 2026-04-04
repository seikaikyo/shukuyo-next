'use client'

import { cn } from '@/lib/utils'
import { useTranslation } from '@/lib/i18n'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { formatDate, getWeekdayName } from '@/utils/date'
import { levelColor } from '@/utils/fortune-helpers'
import type { PairLuckyDaysResult, LuckyDay } from '@/types/lucky-days'

function ratingBadge(rating: string) {
  const map: Record<string, string> = {
    '大吉': 'bg-[var(--fortune-great)]/12 text-[var(--fortune-great)] border-[var(--fortune-great)]/30',
    '吉': 'bg-[var(--fortune-good)]/12 text-[var(--fortune-good)] border-[var(--fortune-good)]/30',
    '小凶': 'bg-[var(--fortune-caution)]/12 text-[var(--fortune-caution)] border-[var(--fortune-caution)]/30',
    '凶': 'bg-[var(--fortune-bad)]/12 text-[var(--fortune-bad)] border-[var(--fortune-bad)]/30',
  }
  return map[rating] || 'bg-muted/50 text-muted-foreground border-border'
}

function LuckyDayItem({ day, locale }: { day: LuckyDay; locale: string }) {
  return (
    <div className='flex items-start gap-3 py-2 border-b border-border last:border-0'>
      <div className='flex flex-col items-center shrink-0 w-14'>
        <span className='text-sm font-medium text-foreground tabular-nums'>{formatDate(day.date)}</span>
        <span className='text-[10px] text-muted-foreground'>({getWeekdayName(day.date, locale)})</span>
      </div>
      <div className='flex-1 flex flex-col gap-1 min-w-0'>
        <div className='flex items-center gap-2 flex-wrap'>
          <span className={cn('text-sm font-bold', levelColor(day.level))}>{day.level}</span>
          {day.rating && (
            <span className={cn('text-[10px] px-1.5 py-0.5 rounded border', ratingBadge(day.rating))}>
              {day.rating}
            </span>
          )}
          {day.boosts?.map((b) => (
            <span key={b} className='text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary'>
              {b}
            </span>
          ))}
        </div>
        <p className='text-xs text-muted-foreground leading-relaxed'>{day.reason}</p>
        {day.tip && (
          <p className='text-xs text-muted-foreground/70 italic'>{day.tip}</p>
        )}
      </div>
    </div>
  )
}

interface PairLuckyDaysProps {
  result: PairLuckyDaysResult
  locale?: string
}

export function PairLuckyDays({ result, locale = 'zh-TW' }: PairLuckyDaysProps) {
  const { t } = useTranslation()
  if (!result?.actions) return null
  const { actions, compatibility } = result

  if (!actions.length) {
    return (
      <Card>
        <CardContent className='pt-5 pb-5 text-center'>
          <p className='text-sm text-muted-foreground'>{t('v3.match.noPairLucky')}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className='flex flex-col gap-3'>
      <div className='flex items-center justify-between'>
        <p className='text-xs font-medium text-muted-foreground uppercase tracking-widest'>{t('v3.match.pairLucky')}</p>
        <span className='text-xs text-muted-foreground'>{compatibility.relation}</span>
      </div>

      {actions.map((action) => (
        <Card key={action.action}>
          <CardContent className='pt-4 pb-3'>
            <p className='text-sm font-semibold text-foreground mb-2'>{action.name}</p>
            {action.lucky_days.length === 0 ? (
              <p className='text-xs text-muted-foreground'>{t('v3.match.noPairLucky')}</p>
            ) : (
              <div className='flex flex-col'>
                {action.lucky_days.slice(0, 5).map((day) => (
                  <LuckyDayItem key={day.date} day={day} locale={locale} />
                ))}
                {action.lucky_days.length > 5 && (
                  <p className='text-xs text-muted-foreground text-center pt-2'>
                    +{t('common.nDays', { n: action.lucky_days.length - 5 })}
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      <p className='text-[10px] text-muted-foreground text-right'>
        {t('compat.luckyDaysSource')}{' '}
        <a
          href='https://cbetaonline.dila.edu.tw/zh/T21n1299'
          target='_blank'
          rel='noopener noreferrer'
          className='underline text-primary/70 hover:text-primary'
        >
          T21n1299
        </a>
      </p>
    </div>
  )
}

export function PairLuckyDaysSkeleton() {
  return (
    <div className='flex flex-col gap-3'>
      <Skeleton className='h-4 w-24' />
      <Skeleton className='h-40 rounded-lg' />
      <Skeleton className='h-40 rounded-lg' />
    </div>
  )
}
