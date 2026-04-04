'use client'

import { useState, useEffect, useCallback } from 'react'
import { useProfileStore } from '@/stores/profile'
import { useFortune } from '@/hooks/use-fortune'
import { useTranslation } from '@/lib/i18n'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { levelColor, levelBg, getLevelHeight } from '@/utils/fortune-helpers'
import type { WeeklyFortune } from '@/types/fortune'

// ---- Helpers ----

function todayStr() {
  return new Date().toISOString().split('T')[0]
}

function offsetDate(dateStr: string, days: number) {
  const d = new Date(dateStr + 'T00:00:00')
  d.setDate(d.getDate() + days)
  return d.toISOString().split('T')[0]
}

function weekdayLabel(dateStr: string, locale: string) {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString(locale, { weekday: 'short' })
}

function shortDateLabel(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00')
  return `${d.getMonth() + 1}/${d.getDate()}`
}

function formatWeekRange(start: string, end: string, locale: string) {
  const s = new Date(start + 'T00:00:00')
  const e = new Date(end + 'T00:00:00')
  const opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' }
  const sLabel = s.toLocaleDateString(locale, { year: 'numeric', ...opts })
  const eLabel = e.toLocaleDateString(locale, opts)
  return `${sLabel} — ${eLabel}`
}

// ---- Sub-components ----

function WeekNav({
  centerDate,
  today,
  weekStart,
  weekEnd,
  onPrev,
  onNext,
  onToday,
  t,
  locale,
}: {
  centerDate: string
  today: string
  weekStart?: string
  weekEnd?: string
  onPrev: () => void
  onNext: () => void
  onToday: () => void
  t: (key: string, params?: Record<string, string | number>) => string
  locale: string
}) {
  const label = weekStart && weekEnd
    ? formatWeekRange(weekStart, weekEnd, locale)
    : centerDate

  return (
    <div className='flex items-center justify-center gap-2 py-4'>
      <button
        onClick={onPrev}
        aria-label={t('fortune.prevWeek')}
        className='h-8 w-8 rounded-full flex items-center justify-center text-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-200'
      >
        ‹
      </button>
      <span className='text-sm font-medium text-foreground min-w-40 sm:min-w-64 text-center'>
        {label}
      </span>
      <button
        onClick={onNext}
        aria-label={t('fortune.nextWeek')}
        className='h-8 w-8 rounded-full flex items-center justify-center text-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-200'
      >
        ›
      </button>
      {centerDate !== today && (
        <button
          onClick={onToday}
          className='text-xs text-primary hover:text-primary/80 underline-offset-2 hover:underline transition-colors duration-200 ml-1'
        >
          {t('fortune.weekly')}
        </button>
      )}
    </div>
  )
}

function WeekOverviewCard({ weekly, t }: { weekly: WeeklyFortune; t: (key: string, params?: Record<string, string | number>) => string }) {
  const { level_name, level } = weekly.fortune

  return (
    <Card className='border border-border dark:border-primary/20'>
      <CardContent className='pt-6 pb-6 flex flex-col gap-4'>
        <div className='flex items-center gap-4'>
          <div className='flex flex-col items-center gap-1 shrink-0'>
            <span className={cn('text-3xl font-bold leading-none', levelColor(level))}>
              {level_name || (level ? t('fortune.levels.' + level) : '—')}
            </span>
          </div>
          <div className='flex flex-col gap-1'>
            <p className={cn('text-lg font-semibold', levelColor(level))}>
              {level_name || (level ? t('fortune.levels.' + level) : '—')}
            </p>
            {weekly.your_mansion && (
              <p className='text-xs text-muted-foreground'>
                {t('fortune.yourMansion')}:{weekly.your_mansion.name_jp}({weekly.your_mansion.reading})
              </p>
            )}
            {weekly.focus && (
              <p className='text-xs text-muted-foreground leading-relaxed'>{weekly.focus}</p>
            )}
          </div>
        </div>
        {weekly.advice && (
          <p className='text-sm text-muted-foreground leading-relaxed'>{weekly.advice}</p>
        )}
      </CardContent>
    </Card>
  )
}

function DailyOverviewCard({ weekly, t, locale }: { weekly: WeeklyFortune; t: (key: string, params?: Record<string, string | number>) => string; locale: string }) {
  return (
    <Card className='border border-border'>
      <CardContent className='pt-5 pb-5 flex flex-col gap-3'>
        <p className='text-xs font-medium text-muted-foreground tracking-widest uppercase'>
          {t('fortune.dailyOverview')}
        </p>
        <div className='grid grid-cols-7 gap-1'>
          {weekly.daily_overview.map((day) => (
            <div
              key={day.date}
              className={cn(
                'flex flex-col items-center gap-1 p-2 rounded-md',
                levelBg(day.level),
                day.is_today && 'ring-1 ring-primary'
              )}
            >
              <span className='text-xs text-muted-foreground'>{weekdayLabel(day.date, locale)}</span>
              <span className='text-[10px] text-muted-foreground'>{shortDateLabel(day.date)}</span>
              <span className={cn('text-xs font-semibold', levelColor(day.level))}>
                {t('fortune.levels.' + day.level)}
              </span>
              {day.special_day && (
                <span className='text-[9px] text-primary truncate w-full text-center'>{day.special_day}</span>
              )}
              {day.ryouhan_active && (
                <span className='text-[9px] text-[var(--ryouhan)]'>{t('fortune.ryouhanShort')}</span>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function WeekSpecialDaysCard({ weekly, t }: { weekly: WeeklyFortune; t: (key: string, params?: Record<string, string | number>) => string }) {
  const counts = { kanro: 0, kongou: 0, rasetsu: 0, ryouhan: 0 }
  for (const day of weekly.daily_overview) {
    if (day.special_day) {
      const sd = typeof day.special_day === 'string' ? day.special_day : ''
      if (sd.includes('甘露')) counts.kanro++
      else if (sd.includes('金剛')) counts.kongou++
      else if (sd.includes('羅刹')) counts.rasetsu++
    }
    if (day.ryouhan_active) counts.ryouhan++
  }

  const hasAny = counts.kanro + counts.kongou + counts.rasetsu + counts.ryouhan > 0
  if (!hasAny) return null

  return (
    <Card className='border border-border'>
      <CardContent className='pt-5 pb-5 flex flex-col gap-3'>
        <p className='text-xs font-medium text-muted-foreground tracking-widest uppercase'>
          {t('fortune.specialDateInfo')}
        </p>
        <div className='grid grid-cols-3 gap-2'>
          <div className='flex flex-col items-center gap-1 p-3 rounded-md bg-[var(--kanro-bg)]'>
            <span className='text-[11px] text-[var(--kanro)]'>{t('fortune.kanroDay')}</span>
            <span className='text-lg font-bold text-[var(--kanro)]'>{counts.kanro}</span>
          </div>
          <div className='flex flex-col items-center gap-1 p-3 rounded-md bg-[var(--kongou-bg)]'>
            <span className='text-[11px] text-[var(--kongou)]'>{t('fortune.kongouDay')}</span>
            <span className='text-lg font-bold text-[var(--kongou)]'>{counts.kongou}</span>
          </div>
          <div className='flex flex-col items-center gap-1 p-3 rounded-md bg-[var(--fortune-bad)]/12'>
            <span className='text-[11px] text-[var(--fortune-bad)]'>{t('fortune.rasetsuDay')}</span>
            <span className='text-lg font-bold text-[var(--fortune-bad)]'>{counts.rasetsu}</span>
          </div>
        </div>
        {counts.ryouhan > 0 && (
          <p className='text-[11px] text-[var(--ryouhan)]'>
            {t('fortune.ryouhanShort')}: {counts.ryouhan} {t('fortune.sankiDays')}
          </p>
        )}
      </CardContent>
    </Card>
  )
}

// CategoryTipsCard (四領域) 和 WeeklyLuckyCard (五行方位/色) 已移除 — 非原典內容

// ---- Page ----

export default function FortuneWeeklyPage() {
  const birthDate = useProfileStore((s) => s.birthDate)
  const { t, locale } = useTranslation()
  const today = todayStr()
  const [centerDate, setCenterDate] = useState(today)
  const { weeklyFortune, loading, error, fetchWeekly } = useFortune()

  const load = useCallback(() => {
    if (birthDate) fetchWeekly(birthDate, centerDate)
  }, [birthDate, centerDate, fetchWeekly])

  useEffect(() => {
    load()
  }, [load])

  if (!birthDate) {
    return (
      <div className='flex-1 flex items-center justify-center py-24 px-4 text-center'>
        <div className='flex flex-col gap-3'>
          <p className='text-sm text-muted-foreground'>{t('startup.noBirthDate')}</p>
          <a
            href='/'
            className='inline-flex h-7 items-center rounded-lg border border-border bg-background px-2.5 text-[0.8rem] font-medium text-foreground hover:bg-muted transition-colors duration-200'
          >
            {t('fortune.goSetup')}
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className='mx-auto w-full max-w-2xl px-4 pb-12 flex flex-col gap-4'>
      <WeekNav
        centerDate={centerDate}
        today={today}
        weekStart={weeklyFortune?.week_start}
        weekEnd={weeklyFortune?.week_end}
        onPrev={() => setCenterDate((d) => offsetDate(d, -7))}
        onNext={() => setCenterDate((d) => offsetDate(d, 7))}
        onToday={() => setCenterDate(today)}
        t={t}
        locale={locale}
      />

      {error && !loading && (
        <div role='alert' className='flex flex-col items-center gap-3 py-12 text-center'>
          <p className='text-sm text-muted-foreground'>{t('error.fetchFailed')}</p>
          <Button variant='outline' size='sm' onClick={load}>{t('common.retry')}</Button>
        </div>
      )}

      {loading && (
        <>
          <Card className='border border-border'>
            <CardContent className='pt-6 pb-6 flex gap-4'>
              <Skeleton className='h-16 w-16 rounded-md shrink-0' />
              <div className='flex flex-col gap-2 flex-1'>
                <Skeleton className='h-5 w-24' />
                <Skeleton className='h-4 w-40' />
                <Skeleton className='h-4 w-full' />
              </div>
            </CardContent>
          </Card>
          <Card className='border border-border'>
            <CardContent className='pt-5 pb-5 flex flex-col gap-3'>
              <Skeleton className='h-3 w-16' />
              <div className='grid grid-cols-7 gap-1'>
                {Array.from({ length: 7 }).map((_, i) => (
                  <Skeleton key={i} className='h-20 rounded-md' />
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {!loading && weeklyFortune && (
        <>
          <WeekOverviewCard weekly={weeklyFortune} t={t} />
          <DailyOverviewCard weekly={weeklyFortune} t={t} locale={locale} />
          <WeekSpecialDaysCard weekly={weeklyFortune} t={t} />
        </>
      )}
    </div>
  )
}
