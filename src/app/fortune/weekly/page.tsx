'use client'

import { useState, useEffect, useCallback } from 'react'
import { useProfileStore } from '@/stores/profile'
import { useFortune } from '@/hooks/use-fortune'
import { useTranslation } from '@/lib/i18n'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { scoreColor } from '@/utils/score-colors'
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

function scoreBg(score: number) {
  if (score >= 80) return 'bg-emerald-500/10'
  if (score >= 60) return 'bg-sky-500/10'
  if (score >= 40) return 'bg-amber-500/10'
  if (score >= 20) return 'bg-orange-500/10'
  return 'bg-red-500/10'
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
  const { overall, level_name, level } = weekly.fortune

  return (
    <Card className='border border-border dark:border-primary/20'>
      <CardContent className='pt-6 pb-6 flex flex-col gap-4'>
        <div className='flex items-center gap-4'>
          <div className='flex flex-col items-center gap-1 shrink-0'>
            <span className={cn('text-5xl font-bold tabular-nums leading-none', scoreColor(overall))}>
              {overall}
            </span>
            <span className='text-xs text-muted-foreground'>{t('fortune.scoreSuffix')}</span>
          </div>
          <div className='flex flex-col gap-1'>
            <p className={cn('text-lg font-semibold', scoreColor(overall))}>
              {level_name || level || '—'}
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
                scoreBg(day.score),
                day.is_today && 'ring-1 ring-primary'
              )}
            >
              <span className='text-xs text-muted-foreground'>{weekdayLabel(day.date, locale)}</span>
              <span className='text-[10px] text-muted-foreground'>{shortDateLabel(day.date)}</span>
              <span className={cn('text-sm font-semibold tabular-nums', scoreColor(day.score))}>
                {day.score}
              </span>
              {day.special_day && (
                <span className='text-[9px] text-primary truncate w-full text-center'>{day.special_day}</span>
              )}
              {day.ryouhan_active && (
                <span className='text-[9px] text-orange-400'>{t('fortune.ryouhanShort')}</span>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function CategoryTipsCard({ weekly, t }: { weekly: WeeklyFortune; t: (key: string, params?: Record<string, string | number>) => string }) {
  if (!weekly.category_tips) return null
  const tips = weekly.category_tips

  return (
    <Card className='border border-border'>
      <CardContent className='pt-5 pb-5 flex flex-col gap-4'>
        <p className='text-xs font-medium text-muted-foreground tracking-widest uppercase'>
          {t('fortune.categoryTips')}
        </p>
        {[
          { label: t('fortune.career'), text: tips.career },
          { label: t('fortune.love'), text: tips.love },
          { label: t('fortune.health'), text: tips.health },
        ].map(({ label, text }) => text ? (
          <div key={label} className='flex gap-3'>
            <span className='text-xs text-muted-foreground w-10 shrink-0 pt-0.5'>{label}</span>
            <p className='text-xs text-muted-foreground leading-relaxed flex-1'>{text}</p>
          </div>
        ) : null)}
      </CardContent>
    </Card>
  )
}

function WeeklyLuckyCard({ weekly, t }: { weekly: WeeklyFortune; t: (key: string, params?: Record<string, string | number>) => string }) {
  const { lucky } = weekly
  if (!lucky) return null

  return (
    <Card className='border border-border'>
      <CardContent className='pt-5 pb-5 flex flex-col gap-3'>
        <p className='text-xs font-medium text-muted-foreground tracking-widest uppercase'>
          {t('fortune.weeklyLucky')}
        </p>
        <div className='grid grid-cols-2 gap-3'>
          <div className='flex flex-col items-center gap-1 p-3 rounded-md bg-muted/50'>
            <span className='text-xs text-muted-foreground'>{t('home.direction')}</span>
            <span className='text-sm font-medium text-foreground'>{lucky.direction}</span>
            <span className='text-xs text-muted-foreground'>{lucky.direction_reading}</span>
          </div>
          <div className='flex flex-col items-center gap-1 p-3 rounded-md bg-muted/50'>
            <span className='text-xs text-muted-foreground'>{t('home.luckyColor')}</span>
            <span
              className='h-5 w-5 rounded-full border border-border'
              style={{ backgroundColor: lucky.color_hex }}
              aria-label={lucky.color}
            />
            <span className='text-xs text-foreground'>{lucky.color}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

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
          <CategoryTipsCard weekly={weeklyFortune} t={t} />
          <WeeklyLuckyCard weekly={weeklyFortune} t={t} />
        </>
      )}
    </div>
  )
}
