'use client'

import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { scoreColor, scoreBg } from '@/utils/score-colors'
import { useTranslation } from '@/lib/i18n'
import type { CalendarMonthData, CalendarDay } from '@/types/calendar'

function CalendarDayCell({
  day,
  isToday,
  onClick,
}: {
  day: CalendarDay | null
  isToday: boolean
  onClick?: (day: CalendarDay) => void
}) {
  if (!day) {
    return <div className='h-16' />
  }

  const score = day.personal?.fortune_score ?? 0
  const hasSpecial = !!day.special_day
  const hasRyouhan = day.ryouhan?.active
  const isDarkWeek = day.personal?.is_dark_week

  return (
    <button
      type='button'
      onClick={() => onClick?.(day)}
      className={cn(
        'h-16 w-full rounded-md flex flex-col items-center justify-center gap-0.5 transition-colors',
        scoreBg(score),
        isToday && 'ring-1 ring-primary',
        'hover:bg-muted/60'
      )}
    >
      <span className={cn(
        'text-xs',
        isToday ? 'font-bold text-primary' : 'text-muted-foreground'
      )}>
        {day.day}
      </span>
      <span className={cn('text-sm font-bold tabular-nums', scoreColor(score))}>
        {score}
      </span>
      <div className='flex gap-0.5'>
        {hasSpecial && <span className='w-1 h-1 rounded-full bg-amber-500' />}
        {hasRyouhan && <span className='w-1 h-1 rounded-full bg-purple-500' />}
        {isDarkWeek && <span className='w-1 h-1 rounded-full bg-slate-500' />}
      </div>
    </button>
  )
}

interface FortuneCalendarProps {
  data: CalendarMonthData
  today?: string
  onDayClick?: (day: CalendarDay) => void
}

export function FortuneCalendar({ data, today, onDayClick }: FortuneCalendarProps) {
  const { t, locale } = useTranslation()
  const WEEKDAY_HEADERS = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(2024, 0, i) // i=0 -> Dec 31 2023 (Sun), i=1 -> Jan 1 (Mon), ...
    return d.toLocaleDateString(locale, { weekday: 'narrow' })
  })

  // Build grid: find starting day of week
  const firstDay = data.days[0]
  if (!firstDay) return null

  const firstDate = new Date(firstDay.date + 'T00:00:00')
  const startWeekday = firstDate.getDay() // 0=Sun

  // Pad with nulls for days before first day
  const cells: (CalendarDay | null)[] = Array(startWeekday).fill(null)
  for (const day of data.days) {
    cells.push(day)
  }
  // Pad end to complete last row
  while (cells.length % 7 !== 0) {
    cells.push(null)
  }

  const rows: (CalendarDay | null)[][] = []
  for (let i = 0; i < cells.length; i += 7) {
    rows.push(cells.slice(i, i + 7))
  }

  return (
    <Card>
      <CardContent className='pt-4 pb-4'>
        {/* weekday headers */}
        <div className='grid grid-cols-7 gap-0.5 mb-1'>
          {WEEKDAY_HEADERS.map((w) => (
            <div key={w} className='text-center text-[10px] text-muted-foreground font-medium py-1'>
              {w}
            </div>
          ))}
        </div>

        {/* calendar grid */}
        <div className='flex flex-col gap-0.5'>
          {rows.map((row, ri) => (
            <div key={ri} className='grid grid-cols-7 gap-0.5'>
              {row.map((day, ci) => (
                <CalendarDayCell
                  key={ci}
                  day={day}
                  isToday={day?.date === today}
                  onClick={onDayClick}
                />
              ))}
            </div>
          ))}
        </div>

        {/* legend */}
        <div className='flex flex-wrap gap-3 mt-3 pt-2 border-t border-border'>
          <div className='flex items-center gap-1'>
            <span className='w-1.5 h-1.5 rounded-full bg-amber-500' />
            <span className='text-[10px] text-muted-foreground'>{t('fortune.specialDays')}</span>
          </div>
          <div className='flex items-center gap-1'>
            <span className='w-1.5 h-1.5 rounded-full bg-purple-500' />
            <span className='text-[10px] text-muted-foreground'>{t('fortune.ryouhanShort')}</span>
          </div>
          <div className='flex items-center gap-1'>
            <span className='w-1.5 h-1.5 rounded-full bg-slate-500' />
            <span className='text-[10px] text-muted-foreground'>{t('fortune.darkWeek')}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function FortuneCalendarSkeleton() {
  return (
    <Card>
      <CardContent className='pt-4 pb-4'>
        <div className='grid grid-cols-7 gap-0.5'>
          {Array.from({ length: 35 }).map((_, i) => (
            <Skeleton key={i} className='h-16 rounded-md' />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
