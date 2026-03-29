'use client'

import { useState, useEffect, useCallback } from 'react'
import { useProfileStore } from '@/stores/profile'
import { useFortune } from '@/hooks/use-fortune'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import type { MonthlyFortune } from '@/types/fortune'

// ---- Helpers ----

function scoreColor(score: number) {
  if (score >= 80) return 'text-[var(--fortune-great)]'
  if (score >= 60) return 'text-[var(--fortune-good)]'
  if (score >= 40) return 'text-[var(--fortune-neutral)]'
  if (score >= 20) return 'text-[var(--fortune-caution)]'
  return 'text-[var(--fortune-bad)]'
}

function scoreBorder(score: number) {
  if (score >= 80) return 'border-[var(--fortune-great)]'
  if (score >= 60) return 'border-[var(--fortune-good)]'
  if (score >= 40) return 'border-[var(--fortune-neutral)]'
  if (score >= 20) return 'border-[var(--fortune-caution)]'
  return 'border-[var(--fortune-bad)]'
}

function scoreBg(score: number) {
  if (score >= 80) return 'bg-emerald-500/15'
  if (score >= 60) return 'bg-sky-500/15'
  if (score >= 40) return 'bg-amber-500/15'
  if (score >= 20) return 'bg-orange-500/15'
  return 'bg-red-500/15'
}

// ---- Sub-components ----

function MonthNav({
  year,
  month,
  onPrev,
  onNext,
  onToday,
}: {
  year: number
  month: number
  onPrev: () => void
  onNext: () => void
  onToday: () => void
}) {
  const now = new Date()
  const isCurrentMonth = year === now.getFullYear() && month === now.getMonth() + 1

  return (
    <div className='flex items-center justify-center gap-2 py-4'>
      <button
        onClick={onPrev}
        aria-label='上個月'
        className='h-8 w-8 rounded-full flex items-center justify-center text-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-200'
      >
        ‹
      </button>
      <span className='text-sm font-medium text-foreground min-w-32 text-center'>
        {year}年 {month}月
      </span>
      <button
        onClick={onNext}
        aria-label='下個月'
        className='h-8 w-8 rounded-full flex items-center justify-center text-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-200'
      >
        ›
      </button>
      {!isCurrentMonth && (
        <button
          onClick={onToday}
          className='text-xs text-primary hover:text-primary/80 underline-offset-2 hover:underline transition-colors duration-200 ml-1'
        >
          本月
        </button>
      )}
    </div>
  )
}

function MonthOverviewCard({ monthly }: { monthly: MonthlyFortune }) {
  const { overall, level_name, level } = monthly.fortune

  return (
    <Card className={cn('border-2', scoreBorder(overall))}>
      <CardContent className='pt-6 pb-6 flex gap-4'>
        <div className='flex flex-col items-center gap-1 shrink-0'>
          <span className={cn('text-5xl font-bold tabular-nums leading-none', scoreColor(overall))}>
            {overall}
          </span>
          <span className='text-xs text-muted-foreground'>分</span>
        </div>
        <div className='flex flex-col gap-2 flex-1'>
          <p className={cn('text-lg font-semibold', scoreColor(overall))}>
            {level_name || level || '—'}
          </p>
          <p className='text-xs text-muted-foreground'>
            月宿：{monthly.month_mansion.name_jp}（{monthly.month_mansion.reading}）
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

function WeeklyBreakdownCard({ monthly }: { monthly: MonthlyFortune }) {
  if (!monthly.weekly?.length) return null

  return (
    <Card className='border border-border'>
      <CardContent className='pt-5 pb-5 flex flex-col gap-4'>
        <p className='text-xs font-medium text-muted-foreground tracking-widest uppercase'>
          各週概覽
        </p>
        {monthly.weekly.map((week) => (
          <div key={week.week} className='flex flex-col gap-2'>
            <div className='flex items-center gap-3'>
              <span className='text-xs text-muted-foreground w-16 shrink-0'>
                第{week.week}週
              </span>
              <div className='flex-1 h-1.5 bg-muted rounded-full overflow-hidden'>
                <div
                  className='h-full rounded-full bg-primary transition-all duration-500'
                  style={{ width: `${week.score}%` }}
                />
              </div>
              <span className={cn('text-xs tabular-nums w-7 text-right shrink-0', scoreColor(week.score))}>
                {week.score}
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
                  className={cn('flex-1 h-6 rounded-sm flex items-center justify-center text-[9px] font-medium', scoreBg(day.score))}
                  title={`${day.date} ${day.weekday} ${day.score}分`}
                >
                  <span className={scoreColor(day.score)}>{day.score}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

function StrategyCard({ monthly }: { monthly: MonthlyFortune }) {
  const strategy = monthly.strategy
  if (!strategy) return null

  const bestDays = strategy.best_days?.slice(0, 5) || []
  const avoidDays = strategy.avoid_days?.slice(0, 3) || []

  if (!bestDays.length && !avoidDays.length) return null

  return (
    <Card className='border border-border'>
      <CardContent className='pt-5 pb-5 flex flex-col gap-4'>
        <p className='text-xs font-medium text-muted-foreground tracking-widest uppercase'>
          本月策略
        </p>
        {bestDays.length > 0 && (
          <div className='flex flex-col gap-2'>
            <p className='text-xs font-medium text-emerald-500'>吉日</p>
            <div className='flex flex-wrap gap-2'>
              {bestDays.map((d) => {
                const date = new Date(d.date + 'T00:00:00')
                return (
                  <div
                    key={d.date}
                    className='flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-md bg-emerald-500/10 min-w-12'
                  >
                    <span className='text-xs text-emerald-600 dark:text-emerald-400 font-medium'>
                      {date.getMonth() + 1}/{date.getDate()}
                    </span>
                    <span className='text-xs text-muted-foreground'>{d.weekday}</span>
                    <span className='text-xs font-semibold text-emerald-500 tabular-nums'>{d.score}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}
        {avoidDays.length > 0 && (
          <div className='flex flex-col gap-2'>
            <p className='text-xs font-medium text-orange-500'>需謹慎</p>
            <div className='flex flex-wrap gap-2'>
              {avoidDays.map((d) => {
                const date = new Date(d.date + 'T00:00:00')
                return (
                  <div
                    key={d.date}
                    className='flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-md bg-orange-500/10 min-w-12'
                  >
                    <span className='text-xs text-orange-600 dark:text-orange-400 font-medium'>
                      {date.getMonth() + 1}/{date.getDate()}
                    </span>
                    <span className='text-xs text-muted-foreground'>{d.weekday}</span>
                    <span className='text-xs font-semibold text-orange-500 tabular-nums'>{d.score}</span>
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

function SpecialDaysCard({ monthly }: { monthly: MonthlyFortune }) {
  if (!monthly.special_days?.length && !monthly.ryouhan_info?.affected_days) return null

  const kanroCount = monthly.special_days?.filter(d => d.type === 'kanro').length ?? 0
  const kongouCount = monthly.special_days?.filter(d => d.type === 'kongou').length ?? 0
  const rasetsuCount = monthly.special_days?.filter(d => d.type === 'rasetsu').length ?? 0

  return (
    <Card className='border border-border'>
      <CardContent className='pt-5 pb-5 flex flex-col gap-3'>
        <p className='text-xs font-medium text-muted-foreground tracking-widest uppercase'>
          特殊日
        </p>
        <div className='flex flex-wrap gap-2'>
          {kanroCount > 0 && (
            <div className='flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30'>
              <span className='h-2 w-2 rounded-full bg-emerald-500 shrink-0' />
              <span className='text-xs text-emerald-600 dark:text-emerald-400'>甘露日 {kanroCount}天</span>
            </div>
          )}
          {kongouCount > 0 && (
            <div className='flex items-center gap-1.5 px-2 py-1 rounded-full bg-amber-500/10 border border-amber-500/30'>
              <span className='h-2 w-2 rounded-full bg-amber-500 shrink-0' />
              <span className='text-xs text-amber-600 dark:text-amber-400'>金剛峯日 {kongouCount}天</span>
            </div>
          )}
          {rasetsuCount > 0 && (
            <div className='flex items-center gap-1.5 px-2 py-1 rounded-full bg-red-500/10 border border-red-500/30'>
              <span className='h-2 w-2 rounded-full bg-red-500 shrink-0' />
              <span className='text-xs text-red-600 dark:text-red-400'>羅刹日 {rasetsuCount}天</span>
            </div>
          )}
        </div>
        {monthly.ryouhan_info?.affected_days != null && (
          <p className='text-xs text-muted-foreground'>
            凌犯期：{monthly.ryouhan_info.affected_days} / {monthly.ryouhan_info.total_days} 天
            （{Math.round(monthly.ryouhan_info.ratio * 100)}%）
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
  const { birthDate } = useProfileStore()
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
          <p className='text-sm text-muted-foreground'>請先設定出生日期</p>
          <a
            href='/'
            className='inline-flex h-7 items-center rounded-lg border border-border bg-background px-2.5 text-[0.8rem] font-medium text-foreground hover:bg-muted transition-colors duration-200'
          >
            前往設定
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
      />

      {error && !loading && (
        <div className='flex flex-col items-center gap-3 py-12 text-center'>
          <p className='text-sm text-muted-foreground'>資料載入失敗，請稍後重試</p>
          <Button variant='outline' size='sm' onClick={load}>重試</Button>
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
          <MonthOverviewCard monthly={monthlyFortune} />
          <WeeklyBreakdownCard monthly={monthlyFortune} />
          <StrategyCard monthly={monthlyFortune} />
          <SpecialDaysCard monthly={monthlyFortune} />
        </>
      )}
    </div>
  )
}
