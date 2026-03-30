'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useProfileStore } from '@/stores/profile'
import { useFortune } from '@/hooks/use-fortune'
import { useTranslation } from '@/lib/i18n'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { scoreColor, scoreBorderLeft } from '@/utils/score-colors'
import type { YearlyFortune } from '@/types/fortune'

// ---- Helpers ----

const RANGE = 10

// ---- Sub-components ----

function DecadeNav({
  startYear,
  endYear,
  onPrev,
  onNext,
  t,
}: {
  startYear: number
  endYear: number
  onPrev: () => void
  onNext: () => void
  t: (key: string, params?: Record<string, string | number>) => string
}) {
  return (
    <div className='flex items-center justify-center gap-2 py-4'>
      <button
        onClick={onPrev}
        aria-label={t('fortune.prevDecade')}
        className='h-8 w-8 rounded-full flex items-center justify-center text-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-200'
      >
        ‹
      </button>
      <span className='text-sm font-medium text-foreground min-w-32 text-center'>
        {startYear} — {endYear}
      </span>
      <button
        onClick={onNext}
        aria-label={t('fortune.nextDecade')}
        className='h-8 w-8 rounded-full flex items-center justify-center text-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-200'
      >
        ›
      </button>
    </div>
  )
}

function DecadeCard({
  yearly,
  isCurrentYear,
  isPast,
  onClick,
  t,
}: {
  yearly: YearlyFortune
  isCurrentYear: boolean
  isPast: boolean
  onClick: () => void
  t: (key: string, params?: Record<string, string | number>) => string
}) {
  const score = yearly.fortune.overall
  const star = yearly.kuyou_star

  return (
    <button
      onClick={onClick}
      className={cn(
        'flex flex-col gap-1 p-3 rounded-lg border border-border bg-card text-left',
        'hover:border-primary/50 hover:shadow-sm transition-all duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
        isCurrentYear && 'ring-2 ring-primary',
        isPast && 'opacity-60',
        'border-l-4',
        scoreBorderLeft(score)
      )}
    >
      <span className='text-sm font-semibold text-foreground'>{yearly.year}{t('fortune.yearSuffix')}</span>
      <span className='text-xs text-muted-foreground'>{star.name}</span>
      <span className={cn('text-2xl font-bold tabular-nums', scoreColor(score))}>
        {score}
      </span>
      <span className='text-xs text-muted-foreground'>{star.kazoe_age}{t('common.ageSuffix')}</span>
    </button>
  )
}

// ---- Page ----

export default function FortuneDecadePage() {
  const birthDate = useProfileStore((s) => s.birthDate)
  const { t } = useTranslation()
  const router = useRouter()
  const currentYear = new Date().getFullYear()
  const [startYear, setStartYear] = useState(currentYear - 5)
  const endYear = startYear + RANGE - 1
  const [loaded, setLoaded] = useState(false)
  const { yearlyRange, loading, error, fetchYearlyRange } = useFortune()

  const load = useCallback(() => {
    if (birthDate) fetchYearlyRange(birthDate, startYear, endYear)
  }, [birthDate, startYear, endYear, fetchYearlyRange])

  useEffect(() => {
    if (!loaded) {
      setLoaded(true)
      load()
    }
  }, [load, loaded])

  useEffect(() => {
    if (loaded) load()
  }, [startYear]) // eslint-disable-line react-hooks/exhaustive-deps

  function goPrev() {
    setStartYear(y => y - RANGE)
  }

  function goNext() {
    setStartYear(y => y + RANGE)
  }

  function goToYearly(year: number) {
    router.push(`/fortune/yearly?year=${year}`)
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
      <DecadeNav
        startYear={startYear}
        endYear={endYear}
        onPrev={goPrev}
        onNext={goNext}
        t={t}
      />

      {error && !loading && (
        <div role='alert' className='flex flex-col items-center gap-3 py-12 text-center'>
          <p className='text-sm text-muted-foreground'>{t('error.fetchFailed')}</p>
          <Button variant='outline' size='sm' onClick={load}>{t('common.retry')}</Button>
        </div>
      )}

      {loading && (
        <Card className='border border-border'>
          <CardContent className='pt-5 pb-5 flex flex-col gap-3'>
            <Skeleton className='h-3 w-48 mb-1' />
            <div className='grid grid-cols-2 gap-3 sm:grid-cols-5'>
              {Array.from({ length: RANGE }).map((_, i) => (
                <Skeleton key={i} className='h-28 rounded-lg' />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {!loading && yearlyRange.length > 0 && (
        <Card className='border border-border'>
          <CardContent className='pt-5 pb-5 flex flex-col gap-4'>
            <p className='text-xs text-muted-foreground leading-relaxed border-l-2 border-primary/40 pl-3'>
              {t('fortune.kuyouOverview')}
            </p>
            <div className='grid grid-cols-2 gap-3 sm:grid-cols-5'>
              {yearlyRange.map((y) => (
                <DecadeCard
                  key={y.year}
                  yearly={y}
                  isCurrentYear={y.year === currentYear}
                  isPast={y.year < currentYear}
                  onClick={() => goToYearly(y.year)}
                  t={t}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
