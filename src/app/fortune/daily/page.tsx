'use client'

import { useState, useEffect } from 'react'
import { useProfileStore } from '@/stores/profile'
import { useFortune } from '@/hooks/use-fortune'
import { useTranslation } from '@/lib/i18n'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { Breadcrumb } from '@/components/shared/breadcrumb'
import Link from 'next/link'
import { scoreColor, scoreBorder } from '@/utils/score-colors'
import type { DailyFortune } from '@/types/fortune'

// ---- Helpers ----

function todayStr() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function offsetDate(dateStr: string, days: number) {
  const d = new Date(dateStr + 'T00:00:00')
  d.setDate(d.getDate() + days)
  return d.toISOString().split('T')[0]
}

function formatDateLabel(dateStr: string, locale: string) {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  })
}


// ---- Sub-components ----

function DateNav({
  activeDate,
  today,
  onPrev,
  onNext,
  onToday,
  t,
  locale,
}: {
  activeDate: string
  today: string
  onPrev: () => void
  onNext: () => void
  onToday: () => void
  t: (key: string, params?: Record<string, string | number>) => string
  locale: string
}) {
  return (
    <div className='flex items-center justify-center gap-2 py-4'>
      <button
        onClick={onPrev}
        aria-label={t('common.previousDay')}
        className='h-8 w-8 rounded-full flex items-center justify-center text-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-200'
      >
        ‹
      </button>
      <span className='text-sm font-medium text-foreground min-w-48 text-center'>
        {formatDateLabel(activeDate, locale)}
      </span>
      <button
        onClick={onNext}
        aria-label={t('common.nextDay')}
        className='h-8 w-8 rounded-full flex items-center justify-center text-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-200'
      >
        ›
      </button>
      {activeDate !== today && (
        <button
          onClick={onToday}
          className='text-xs text-primary hover:text-primary/80 underline-offset-2 hover:underline transition-colors duration-200 ml-1'
        >
          {t('fortune.today')}
        </button>
      )}
    </div>
  )
}

function OverallScoreCard({ fortune, t }: { fortune: DailyFortune; t: (key: string, params?: Record<string, string | number>) => string }) {
  const { overall, level_name, level } = fortune.fortune

  return (
    <Card className='border border-border dark:border-primary/20'>
      <CardContent className='flex flex-col items-center gap-3 pt-8 pb-8'>
        {/* circular score ring */}
        <div
          className={cn(
            'relative flex items-center justify-center rounded-full border-4 h-32 w-32',
            scoreBorder(overall)
          )}
        >
          <div className='flex flex-col items-center'>
            <span className={cn('text-4xl font-bold tabular-nums leading-none', scoreColor(overall))}>
              {overall}
            </span>
            <span className='text-xs text-muted-foreground mt-0.5'>{t('fortune.scoreSuffix')}</span>
          </div>
        </div>

        {/* level label */}
        <p className={cn('text-xl font-serif font-semibold', scoreColor(overall))}>
          {level_name || level || '—'}
        </p>

        {/* day mansion relation */}
        {fortune.mansion_relation && (
          <p className='text-xs text-muted-foreground'>
            {t('fortune.dayMansion')}:{fortune.day_mansion.name_jp}({fortune.day_mansion.reading})
            <span className='mx-1'>·</span>
            {fortune.mansion_relation.name}
          </p>
        )}

        {/* advice */}
        {fortune.advice && (
          <p className='text-sm text-muted-foreground text-center max-w-sm leading-relaxed px-2'>
            {fortune.advice}
          </p>
        )}

        {/* special day badge */}
        {fortune.special_day && (
          <div className='mt-1 px-3 py-1 rounded-full border border-primary/40 bg-primary/5 text-xs text-primary font-medium'>
            {fortune.special_day.name}
            {fortune.special_day.reading ? `(${fortune.special_day.reading})` : ''}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function CategoryCard({ fortune, t }: { fortune: DailyFortune; t: (key: string, params?: Record<string, string | number>) => string }) {
  const cats = [
    {
      label: t('fortune.career'),
      score: fortune.fortune.career,
      desc: fortune.fortune.career_desc,
    },
    {
      label: t('fortune.love'),
      score: fortune.fortune.love,
      desc: fortune.fortune.love_desc,
    },
    {
      label: t('fortune.health'),
      score: fortune.fortune.health,
      desc: fortune.fortune.health_desc,
    },
    {
      label: t('fortune.wealth'),
      score: fortune.fortune.wealth,
      desc: fortune.fortune.wealth_desc,
    },
  ]

  const filtered = cats.filter(({ desc }) => desc)
  if (filtered.length === 0) return null

  return (
    <Card className='border border-border'>
      <CardContent className='pt-5 pb-5 flex flex-col gap-4'>
        {filtered.map(({ label, desc }) => (
          <div key={label}>
            <p className='text-xs font-medium text-primary mb-1'>{label}</p>
            <p className='text-sm text-muted-foreground leading-relaxed'>{desc}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

function LuckyCard({ fortune, t }: { fortune: DailyFortune; t: (key: string, params?: Record<string, string | number>) => string }) {
  const { lucky } = fortune

  return (
    <Card className='border border-border'>
      <CardContent className='pt-5 pb-5 flex flex-col gap-3'>
        <p className='text-xs font-medium text-muted-foreground tracking-widest uppercase'>
          {t('fortune.todayLucky')}
        </p>
        <div className='grid grid-cols-3 gap-3'>
          <div className='flex flex-col items-center gap-1 p-3 rounded-md bg-muted/50'>
            <span className='text-xs text-muted-foreground'>{t('home.direction')}</span>
            <span className='text-sm font-medium text-foreground'>
              {lucky.direction}
            </span>
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
          <div className='flex flex-col items-center gap-1 p-3 rounded-md bg-muted/50'>
            <span className='text-xs text-muted-foreground'>{t('home.luckyNumber')}</span>
            <span className='text-sm font-medium text-foreground'>
              {lucky.numbers.join('・')}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function SpecialInfoCard({ fortune, t }: { fortune: DailyFortune; t: (key: string, params?: Record<string, string | number>) => string }) {
  const hasSanki = !!fortune.sanki
  const hasRyouhan = fortune.ryouhan?.active
  const hasCompound = fortune.compound_analysis && fortune.compound_analysis.length > 0

  if (!hasSanki && !hasRyouhan && !hasCompound) return null

  return (
    <Card className='border border-border'>
      <CardContent className='pt-5 pb-5 flex flex-col gap-3'>
        <p className='text-xs font-medium text-muted-foreground tracking-widest uppercase'>
          {t('fortune.specialDateInfo')}
        </p>

        {hasSanki && fortune.sanki && (
          <div className='flex flex-col gap-1'>
            <span className='text-xs font-medium text-foreground'>
              {t('fortune.sankiTitle')}:{fortune.sanki.period}({fortune.sanki.period_reading})
            </span>
            <span className='text-xs text-muted-foreground leading-relaxed'>
              {fortune.sanki.day_description}
            </span>
          </div>
        )}

        {hasRyouhan && fortune.ryouhan && (
          <div className='flex flex-col gap-1'>
            <span className='text-xs font-medium text-[var(--fortune-caution)]'>
              {t('fortune.ryouhanPeriod')}:{fortune.ryouhan.period_label || t('fortune.ryouhanActive')}
            </span>
            <span className='text-xs text-muted-foreground leading-relaxed'>
              {fortune.ryouhan.description}
            </span>
          </div>
        )}

        {hasCompound &&
          fortune.compound_analysis!.map((ca) => (
            <div key={ca.pattern} className='flex flex-col gap-1'>
              <span className='text-xs font-medium text-foreground'>{ca.name}</span>
              <span className='text-xs text-muted-foreground leading-relaxed'>
                {ca.description}
              </span>
            </div>
          ))}
      </CardContent>
    </Card>
  )
}

// ---- Page ----

export default function FortuneDailyPage() {
  const birthDate = useProfileStore((s) => s.birthDate)
  const { t, locale } = useTranslation()
  const today = todayStr()
  const [activeDate, setActiveDate] = useState(today)
  const { dailyFortune, loading, error, fetchDaily } = useFortune()

  useEffect(() => {
    if (birthDate) {
      fetchDaily(birthDate, activeDate)
    }
  }, [birthDate, activeDate, fetchDaily])

  if (!birthDate) {
    return (
      <div className='flex-1 flex items-center justify-center py-24 px-4 text-center'>
        <div className='flex flex-col gap-3'>
          <p className='text-sm text-muted-foreground'>{t('startup.noBirthDate')}</p>
          <Link
            href='/'
            className='inline-flex h-7 items-center rounded-lg border border-border bg-background px-2.5 text-[0.8rem] font-medium text-foreground hover:bg-muted transition-colors duration-200'
          >
            {t('fortune.goSetup')}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className='mx-auto w-full max-w-2xl px-4 pb-12 flex flex-col gap-4'>
      <Breadcrumb
        items={[
          { label: t('nav.home'), href: '/' },
          { label: t('nav.fortune'), href: '/fortune' },
          { label: t('fortune.daily') },
        ]}
        className='pt-2'
      />
      <DateNav
        activeDate={activeDate}
        today={today}
        onPrev={() => setActiveDate((d) => offsetDate(d, -1))}
        onNext={() => setActiveDate((d) => offsetDate(d, 1))}
        onToday={() => setActiveDate(today)}
        t={t}
        locale={locale}
      />

      {/* error */}
      {error && !loading && (
        <div role='alert' className='flex flex-col items-center gap-3 py-12 text-center'>
          <p className='text-sm text-muted-foreground'>{t('error.fetchFailed')}</p>
          <Button
            variant='outline'
            size='sm'
            onClick={() => fetchDaily(birthDate, activeDate)}
          >
            {t('common.retry')}
          </Button>
        </div>
      )}

      {/* loading */}
      {loading && (
        <>
          {/* score skeleton */}
          <Card className='border border-border'>
            <CardContent className='flex flex-col items-center gap-3 pt-8 pb-8'>
              <Skeleton className='h-32 w-32 rounded-full' />
              <Skeleton className='h-6 w-20' />
              <Skeleton className='h-4 w-52' />
              <Skeleton className='h-4 w-44' />
            </CardContent>
          </Card>

          {/* category skeleton */}
          <Card className='border border-border'>
            <CardContent className='pt-5 pb-5 flex flex-col gap-4'>
              <Skeleton className='h-3 w-20' />
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className='flex flex-col gap-1.5'>
                  <div className='flex items-center gap-3'>
                    <Skeleton className='h-3 w-10 shrink-0' />
                    <Skeleton className='h-1.5 flex-1' />
                    <Skeleton className='h-3 w-7' />
                  </div>
                  <Skeleton className='h-3 w-3/4 ml-[52px]' />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* lucky skeleton */}
          <Card className='border border-border'>
            <CardContent className='pt-5 pb-5 flex flex-col gap-3'>
              <Skeleton className='h-3 w-16' />
              <div className='grid grid-cols-3 gap-3'>
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className='h-20 rounded-md' />
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* data */}
      {!loading && dailyFortune && (
        <>
          <OverallScoreCard fortune={dailyFortune} t={t} />
          <CategoryCard fortune={dailyFortune} t={t} />
          <LuckyCard fortune={dailyFortune} t={t} />
          <SpecialInfoCard fortune={dailyFortune} t={t} />
        </>
      )}
    </div>
  )
}
