'use client'

import { useState, useEffect, useCallback } from 'react'
import { useProfileStore } from '@/stores/profile'
import { useFortune } from '@/hooks/use-fortune'
import { useTranslation } from '@/lib/i18n'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { levelColor, levelBorder, levelBg, getLevelHeight } from '@/utils/fortune-helpers'
import type { MonthlyFortune } from '@/types/fortune'

// ---- Helpers ----

// ---- Sub-components ----

function MonthNav({
  year,
  month,
  onPrev,
  onNext,
  onToday,
  t,
}: {
  year: number
  month: number
  onPrev: () => void
  onNext: () => void
  onToday: () => void
  t: (key: string, params?: Record<string, string | number>) => string
}) {
  const now = new Date()
  const isCurrentMonth = year === now.getFullYear() && month === now.getMonth() + 1

  return (
    <div className='flex items-center justify-center gap-2 py-4'>
      <button
        onClick={onPrev}
        aria-label={t('common.previousMonth')}
        className='h-8 w-8 rounded-full flex items-center justify-center text-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-200'
      >
        ‹
      </button>
      <span className='text-sm font-medium text-foreground min-w-32 text-center'>
        {t('common.yearMonth', { year, month })}
      </span>
      <button
        onClick={onNext}
        aria-label={t('common.nextMonth')}
        className='h-8 w-8 rounded-full flex items-center justify-center text-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-200'
      >
        ›
      </button>
      {!isCurrentMonth && (
        <button
          onClick={onToday}
          className='text-xs text-primary hover:text-primary/80 underline-offset-2 hover:underline transition-colors duration-200 ml-1'
        >
          {t('fortune.thisMonth')}
        </button>
      )}
    </div>
  )
}

function MonthOverviewCard({ monthly, t }: { monthly: MonthlyFortune; t: (key: string, params?: Record<string, string | number>) => string }) {
  const { level_name, level } = monthly.fortune

  return (
    <Card className={cn('border-2', levelBorder(level))}>
      <CardContent className='pt-6 pb-6 flex gap-4'>
        <div className='flex flex-col items-center gap-1 shrink-0'>
          <span className={cn('text-3xl font-bold leading-none', levelColor(level))}>
            {level_name || (level ? t('fortune.levels.' + level) : '—')}
          </span>
        </div>
        <div className='flex flex-col gap-2 flex-1'>
          <p className={cn('text-lg font-semibold', levelColor(level))}>
            {level_name || (level ? t('fortune.levels.' + level) : '—')}
          </p>
          <p className='text-xs text-muted-foreground'>
            {t('fortune.monthMansion')}:{monthly.month_mansion.name_jp}({monthly.month_mansion.reading})
            <span className='mx-1'>·</span>
            {monthly.relation.name}
          </p>
          {monthly.theme?.description && (
            <p className='text-xs text-muted-foreground leading-relaxed'>{monthly.theme.description}</p>
          )}
          {monthly.advice && (
            <p className='text-sm text-muted-foreground leading-relaxed'>{monthly.advice}</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function WeeklyBreakdownCard({ monthly, t }: { monthly: MonthlyFortune; t: (key: string, params?: Record<string, string | number>) => string }) {
  if (!monthly.weekly?.length) return null

  return (
    <Card className='border border-border'>
      <CardContent className='pt-5 pb-5 flex flex-col gap-4'>
        <p className='text-xs font-medium text-muted-foreground tracking-widest uppercase'>
          {t('fortune.weeklyBreakdown')}
        </p>
        {monthly.weekly.map((week) => (
          <div key={week.week} className='flex flex-col gap-2'>
            <div className='flex items-center gap-3'>
              <span className='text-xs text-muted-foreground w-16 shrink-0'>
                {t('fortune.weekN', { n: week.week })}
              </span>
              <div className='flex-1 h-1.5 bg-muted rounded-full overflow-hidden'>
                <div
                  className='h-full rounded-full bg-primary transition-all duration-500'
                  style={{ width: `${getLevelHeight(week.level)}%` }}
                />
              </div>
              <span className={cn('text-xs w-12 text-right shrink-0', levelColor(week.level))}>
                {t('fortune.levels.' + week.level)}
              </span>
            </div>
            {week.focus && (
              <p className='text-xs text-muted-foreground pl-[76px] leading-relaxed'>{week.focus}</p>
            )}
            {/* daily mini-bars */}
            <div className='pl-[76px] flex gap-1'>
              {week.daily_overview.map((day) => (
                <div
                  key={day.date}
                  className={cn('flex-1 h-6 rounded-sm flex items-center justify-center text-[9px] font-medium', levelBg(day.level))}
                  title={`${day.date} ${day.weekday}`}
                >
                  <span className={levelColor(day.level)}>{t('fortune.levels.' + day.level)}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

function StrategyCard({ monthly, t }: { monthly: MonthlyFortune; t: (key: string, params?: Record<string, string | number>) => string }) {
  const strategy = monthly.strategy
  if (!strategy) return null

  const bestDays = strategy.best_days?.slice(0, 5) || []
  const avoidDays = strategy.avoid_days?.slice(0, 3) || []

  if (!bestDays.length && !avoidDays.length) return null

  return (
    <Card className='border border-border'>
      <CardContent className='pt-5 pb-5 flex flex-col gap-4'>
        <p className='text-xs font-medium text-muted-foreground tracking-widest uppercase'>
          {t('fortune.monthlyStrategy')}
        </p>
        {bestDays.length > 0 && (
          <div className='flex flex-col gap-2'>
            <p className='text-xs font-medium text-[var(--fortune-great)]'>{t('fortune.recommendedDays')}</p>
            <div className='flex flex-wrap gap-2'>
              {bestDays.map((d) => {
                const date = new Date(d.date + 'T00:00:00')
                return (
                  <div
                    key={d.date}
                    className='flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-md bg-[var(--fortune-great)]/12 min-w-12'
                  >
                    <span className='text-xs text-[var(--fortune-great)] font-medium'>
                      {date.getMonth() + 1}/{date.getDate()}
                    </span>
                    <span className='text-xs text-muted-foreground'>{d.weekday}</span>
                    <span className={cn('text-xs font-semibold', levelColor(d.level))}>{t('fortune.levels.' + d.level)}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}
        {avoidDays.length > 0 && (
          <div className='flex flex-col gap-2'>
            <p className='text-xs font-medium text-[var(--fortune-caution)]'>{t('fortune.avoidDays')}</p>
            <div className='flex flex-wrap gap-2'>
              {avoidDays.map((d) => {
                const date = new Date(d.date + 'T00:00:00')
                return (
                  <div
                    key={d.date}
                    className='flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-md bg-[var(--fortune-caution)]/12 min-w-12'
                  >
                    <span className='text-xs text-[var(--fortune-caution)] font-medium'>
                      {date.getMonth() + 1}/{date.getDate()}
                    </span>
                    <span className='text-xs text-muted-foreground'>{d.weekday}</span>
                    <span className={cn('text-xs font-semibold', levelColor(d.level))}>{t('fortune.levels.' + d.level)}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function SpecialDaysCard({ monthly, t }: { monthly: MonthlyFortune; t: (key: string, params?: Record<string, string | number>) => string }) {
  if (!monthly.special_days?.length && !monthly.ryouhan_info?.affected_days) return null

  const kanroCount = monthly.special_days?.filter(d => d.type === 'kanro').length ?? 0
  const kongouCount = monthly.special_days?.filter(d => d.type === 'kongou').length ?? 0
  const rasetsuCount = monthly.special_days?.filter(d => d.type === 'rasetsu').length ?? 0

  return (
    <Card className='border border-border'>
      <CardContent className='pt-5 pb-5 flex flex-col gap-3'>
        <p className='text-xs font-medium text-muted-foreground tracking-widest uppercase'>
          {t('fortune.specialDays')}
        </p>
        <div className='flex flex-wrap gap-2'>
          {kanroCount > 0 && (
            <div className='flex items-center gap-1.5 px-2 py-1 rounded-full bg-[var(--kanro-bg)] border border-[var(--kanro)]/30'>
              <span className='h-2 w-2 rounded-full bg-[var(--kanro)] shrink-0' />
              <span className='text-xs text-[var(--kanro)]'>{t('fortune.kanroDay')} {t('common.nDays', { n: kanroCount })}</span>
            </div>
          )}
          {kongouCount > 0 && (
            <div className='flex items-center gap-1.5 px-2 py-1 rounded-full bg-[var(--kongou-bg)] border border-[var(--kongou)]/30'>
              <span className='h-2 w-2 rounded-full bg-[var(--kongou)] shrink-0' />
              <span className='text-xs text-[var(--kongou)]'>{t('fortune.kongouDay')} {t('common.nDays', { n: kongouCount })}</span>
            </div>
          )}
          {rasetsuCount > 0 && (
            <div className='flex items-center gap-1.5 px-2 py-1 rounded-full bg-[var(--fortune-bad)]/12 border border-[var(--fortune-bad)]/30'>
              <span className='h-2 w-2 rounded-full bg-[var(--fortune-bad)] shrink-0' />
              <span className='text-xs text-[var(--fortune-bad)]'>{t('fortune.rasetsuDay')} {t('common.nDays', { n: rasetsuCount })}</span>
            </div>
          )}
        </div>
        {monthly.ryouhan_info?.affected_days != null && (
          <p className='text-xs text-muted-foreground'>
            {t('fortune.ryouhanDaysInfo', { affected: monthly.ryouhan_info.affected_days, total: monthly.ryouhan_info.total_days })}
            ({Math.round(monthly.ryouhan_info.ratio * 100)}%)
          </p>
        )}
        {monthly.month_warnings?.filter(w =>
          !w.startsWith('甘露日') && !w.startsWith('羅刹日') && !w.startsWith('金剛峯日')
        ).map((w, i) => (
          <p key={i} className='text-xs text-muted-foreground leading-relaxed'>{w}</p>
        ))}
      </CardContent>
    </Card>
  )
}

// ---- Page ----

export default function FortuneMonthlyPage() {
  const birthDate = useProfileStore((s) => s.birthDate)
  const { t } = useTranslation()
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth() + 1)
  const { monthlyFortune, loading, error, fetchMonthly } = useFortune()

  const load = useCallback(() => {
    if (birthDate) fetchMonthly(birthDate, year, month)
  }, [birthDate, year, month, fetchMonthly])

  useEffect(() => {
    load()
  }, [load])

  function goPrev() {
    if (month === 1) { setYear(y => y - 1); setMonth(12) }
    else setMonth(m => m - 1)
  }

  function goNext() {
    if (month === 12) { setYear(y => y + 1); setMonth(1) }
    else setMonth(m => m + 1)
  }

  function goToday() {
    const n = new Date()
    setYear(n.getFullYear())
    setMonth(n.getMonth() + 1)
  }

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
      <MonthNav
        year={year}
        month={month}
        onPrev={goPrev}
        onNext={goNext}
        onToday={goToday}
        t={t}
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
                <Skeleton className='h-4 w-52' />
                <Skeleton className='h-4 w-full' />
              </div>
            </CardContent>
          </Card>
          <Card className='border border-border'>
            <CardContent className='pt-5 pb-5 flex flex-col gap-4'>
              <Skeleton className='h-3 w-16' />
              {[1, 2, 3, 4].map(i => (
                <div key={i} className='flex flex-col gap-1.5'>
                  <div className='flex items-center gap-3'>
                    <Skeleton className='h-3 w-16 shrink-0' />
                    <Skeleton className='h-1.5 flex-1' />
                    <Skeleton className='h-3 w-7' />
                  </div>
                  <div className='pl-[76px] flex gap-1'>
                    {Array.from({ length: 7 }).map((_, j) => (
                      <Skeleton key={j} className='flex-1 h-6 rounded-sm' />
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </>
      )}

      {!loading && monthlyFortune && (
        <>
          <MonthOverviewCard monthly={monthlyFortune} t={t} />
          <WeeklyBreakdownCard monthly={monthlyFortune} t={t} />
          <StrategyCard monthly={monthlyFortune} t={t} />
          <SpecialDaysCard monthly={monthlyFortune} t={t} />
        </>
      )}
    </div>
  )
}
