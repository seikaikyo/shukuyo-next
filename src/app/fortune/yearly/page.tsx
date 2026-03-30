'use client'

import { useState, useEffect, useCallback } from 'react'
import { useProfileStore } from '@/stores/profile'
import { useFortune } from '@/hooks/use-fortune'
import { useTranslation } from '@/lib/i18n'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { scoreColor, scoreBorder } from '@/utils/score-colors'
import type { YearlyFortune } from '@/types/fortune'

// ---- Helpers ----

function scoreBg(score: number) {
  if (score >= 80) return 'bg-emerald-500/15'
  if (score >= 60) return 'bg-sky-500/15'
  if (score >= 40) return 'bg-amber-500/15'
  if (score >= 20) return 'bg-orange-500/15'
  return 'bg-red-500/15'
}

// ---- Sub-components ----

function YearNav({
  year,
  currentYear,
  onPrev,
  onNext,
  onToday,
  t,
}: {
  year: number
  currentYear: number
  onPrev: () => void
  onNext: () => void
  onToday: () => void
  t: (key: string, params?: Record<string, string | number>) => string
}) {
  return (
    <div className='flex items-center justify-center gap-2 py-4'>
      <button
        onClick={onPrev}
        aria-label={t('fortune.prevYear')}
        className='h-8 w-8 rounded-full flex items-center justify-center text-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-200'
      >
        ‹
      </button>
      <span className='text-sm font-medium text-foreground min-w-24 text-center'>
        {year} {t('fortune.yearSuffix')}
      </span>
      <button
        onClick={onNext}
        aria-label={t('fortune.nextYear')}
        className='h-8 w-8 rounded-full flex items-center justify-center text-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-200'
      >
        ›
      </button>
      {year !== currentYear && (
        <button
          onClick={onToday}
          className='text-xs text-primary hover:text-primary/80 underline-offset-2 hover:underline transition-colors duration-200 ml-1'
        >
          {t('fortune.thisYear')}
        </button>
      )}
    </div>
  )
}

function YearOverviewCard({ yearly, t }: { yearly: YearlyFortune; t: (key: string, params?: Record<string, string | number>) => string }) {
  const { overall, level_name, level } = yearly.fortune
  const star = yearly.kuyou_star

  return (
    <Card className={cn('border-2', scoreBorder(overall))}>
      <CardContent className='pt-6 pb-6 flex flex-col gap-4'>
        <div className='flex gap-4'>
          <div className='flex flex-col items-center gap-1 shrink-0'>
            <span className={cn('text-5xl font-bold tabular-nums leading-none', scoreColor(overall))}>
              {overall}
            </span>
            <span className='text-xs text-muted-foreground'>{t('fortune.scoreSuffix')}</span>
          </div>
          <div className='flex flex-col gap-1.5 flex-1'>
            <p className={cn('text-lg font-semibold', scoreColor(overall))}>
              {level_name || level || '—'}
            </p>
            <p className='text-xs text-muted-foreground'>
              {t('fortune.kuyouLabel')}:{star.name}({star.reading})
              <span className='mx-1'>·</span>
              {star.kazoe_age}{t('common.ageSuffix')}
            </p>
            {star.description && (
              <p className='text-xs text-muted-foreground leading-relaxed'>{star.description}</p>
            )}
          </div>
        </div>
        {yearly.theme && (
          <div className='px-3 py-2 rounded-md bg-primary/5 border border-primary/20'>
            <p className='text-xs font-medium text-primary mb-1'>{yearly.theme.title}</p>
            <p className='text-xs text-muted-foreground leading-relaxed'>{yearly.theme.description}</p>
          </div>
        )}
        {yearly.advice && (
          <p className='text-sm text-muted-foreground leading-relaxed'>{yearly.advice}</p>
        )}
      </CardContent>
    </Card>
  )
}

function MonthlyTrendCard({ yearly, t }: { yearly: YearlyFortune; t: (key: string, params?: Record<string, string | number>) => string }) {
  if (!yearly.monthly_trend?.length) return null
  const currentMonth = new Date().getMonth() + 1

  return (
    <Card className='border border-border'>
      <CardContent className='pt-5 pb-5 flex flex-col gap-3'>
        <p className='text-xs font-medium text-muted-foreground tracking-widest uppercase'>
          {t('fortune.monthlyTrend')}
        </p>
        <div className='grid grid-cols-6 gap-1.5 sm:grid-cols-12'>
          {yearly.monthly_trend.map((m) => (
            <div
              key={m.month}
              className={cn(
                'flex flex-col items-center gap-1 p-1.5 rounded-md',
                scoreBg(m.score),
                m.month === currentMonth && 'ring-1 ring-primary'
              )}
            >
              <span className='text-[10px] text-muted-foreground'>{m.month}{t('fortune.monthSuffix')}</span>
              <span className={cn('text-xs font-semibold tabular-nums', scoreColor(m.score))}>
                {m.score}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function CategoryCard({ yearly, t }: { yearly: YearlyFortune; t: (key: string, params?: Record<string, string | number>) => string }) {
  const cats = yearly.category_descriptions
  if (!cats) return null

  return (
    <Card className='border border-border'>
      <CardContent className='pt-5 pb-5 flex flex-col gap-4'>
        <p className='text-xs font-medium text-muted-foreground tracking-widest uppercase'>
          {t('fortune.categoryFortunes')}
        </p>
        {[
          { label: t('fortune.career'), key: 'career', score: yearly.fortune.career, desc: cats.career },
          { label: t('fortune.love'), key: 'love', score: yearly.fortune.love, desc: cats.love },
          { label: t('fortune.health'), key: 'health', score: yearly.fortune.health, desc: cats.health },
          { label: t('fortune.wealth'), key: 'wealth', score: yearly.fortune.wealth, desc: cats.wealth },
        ].map(({ label, key, score, desc }) => (
          <div key={key} className='flex flex-col gap-1.5'>
            <div className='flex items-center gap-3'>
              <span className='text-xs text-muted-foreground w-10 shrink-0'>{label}</span>
              <div className='flex-1 h-1.5 bg-muted rounded-full overflow-hidden'>
                <div
                  className='h-full rounded-full bg-primary transition-all duration-500'
                  style={{ width: `${score}%` }}
                />
              </div>
              <span className={cn('text-xs tabular-nums w-7 text-right', scoreColor(score))}>
                {score}
              </span>
            </div>
            {desc && (
              <p className='text-xs text-muted-foreground pl-[52px] leading-relaxed'>{desc}</p>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

function OpportunitiesCard({ yearly, t }: { yearly: YearlyFortune; t: (key: string, params?: Record<string, string | number>) => string }) {
  const hasOpp = yearly.opportunities?.length > 0
  const hasWarn = yearly.warnings?.length > 0
  if (!hasOpp && !hasWarn) return null

  return (
    <Card className='border border-border'>
      <CardContent className='pt-5 pb-5 flex flex-col gap-4'>
        {hasOpp && (
          <div className='flex flex-col gap-2'>
            <p className='text-xs font-medium text-muted-foreground tracking-widest uppercase'>
              {t('fortune.opportunities')}
            </p>
            <ul className='flex flex-col gap-1'>
              {yearly.opportunities.map((o, i) => (
                <li key={i} className='flex items-start gap-2 text-xs text-muted-foreground'>
                  <span className='text-emerald-500 shrink-0 mt-0.5'>+</span>
                  {o}
                </li>
              ))}
            </ul>
          </div>
        )}
        {hasWarn && (
          <div className='flex flex-col gap-2'>
            <p className='text-xs font-medium text-muted-foreground tracking-widest uppercase'>
              {t('fortune.warnings')}
            </p>
            <ul className='flex flex-col gap-1'>
              {yearly.warnings.map((w, i) => (
                <li key={i} className='flex items-start gap-2 text-xs text-muted-foreground'>
                  <span className='text-orange-400 shrink-0 mt-0.5'>!</span>
                  {w}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// ---- Page ----

export default function FortuneYearlyPage() {
  const birthDate = useProfileStore((s) => s.birthDate)
  const { t } = useTranslation()
  const currentYear = new Date().getFullYear()
  const [year, setYear] = useState(currentYear)
  const { yearlyFortune, loading, error, fetchYearly } = useFortune()

  const load = useCallback(() => {
    if (birthDate) fetchYearly(birthDate, year)
  }, [birthDate, year, fetchYearly])

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
      <YearNav
        year={year}
        currentYear={currentYear}
        onPrev={() => setYear(y => y - 1)}
        onNext={() => setYear(y => y + 1)}
        onToday={() => setYear(currentYear)}
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
            <CardContent className='pt-5 pb-5 flex flex-col gap-3'>
              <Skeleton className='h-3 w-16' />
              <div className='grid grid-cols-6 gap-1.5 sm:grid-cols-12'>
                {Array.from({ length: 12 }).map((_, i) => (
                  <Skeleton key={i} className='h-12 rounded-md' />
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {!loading && yearlyFortune && (
        <>
          <YearOverviewCard yearly={yearlyFortune} t={t} />
          <MonthlyTrendCard yearly={yearlyFortune} t={t} />
          <CategoryCard yearly={yearlyFortune} t={t} />
          <OpportunitiesCard yearly={yearlyFortune} t={t} />
        </>
      )}
    </div>
  )
}
