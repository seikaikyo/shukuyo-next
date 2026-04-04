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
import { SankiCard } from '@/components/shared/sanki-card'
import { AuspiciousCard } from '@/components/shared/auspicious-card'
import Link from 'next/link'
import { levelColor, levelBorder, levelBg } from '@/utils/fortune-helpers'
import { specialDayBadgeClass, ryouhanBadgeClass } from '@/utils/special-day-colors'
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
  const { level_name, level } = fortune.fortune

  return (
    <Card className='border border-border dark:border-primary/20'>
      <CardContent className='flex flex-col items-center gap-3 pt-8 pb-8'>
        {/* level badge */}
        <div
          className={cn(
            'relative flex items-center justify-center rounded-full border-4 h-32 w-32',
            levelBorder(level),
            levelBg(level)
          )}
        >
          <span className={cn('text-2xl font-bold leading-none', levelColor(level))}>
            {level_name || (level ? t('fortune.levels.' + level) : '—')}
          </span>
        </div>

        {/* level label */}
        <p className={cn('text-xl font-serif font-semibold', levelColor(level))}>
          {level_name || (level ? t('fortune.levels.' + level) : '—')}
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

        {/* special day badge (CIS C1.7) */}
        {fortune.special_day && (
          <div className={cn('mt-1 px-3 py-1 rounded-full text-xs font-medium', specialDayBadgeClass(fortune.special_day.type))}>
            {fortune.special_day.name}
            {fortune.special_day.reading ? `(${fortune.special_day.reading})` : ''}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// CategoryCard (四領域) 和 LuckyCard (五行方位/色/數) 已移除 — 非原典內容

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
            <span className='text-xs font-medium text-[var(--ryouhan)]'>
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

          {/* auspicious + sanki skeleton */}
          <Card className='border border-border'>
            <CardContent className='pt-5 pb-5 flex flex-col gap-3'>
              <Skeleton className='h-3 w-20' />
              <div className='grid grid-cols-2 gap-2'>
                <Skeleton className='h-20 rounded-md' />
                <Skeleton className='h-20 rounded-md' />
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* data */}
      {!loading && dailyFortune && (
        <>
          <OverallScoreCard fortune={dailyFortune} t={t} />
          {dailyFortune.day_mansion?.day_fortune && (
            <AuspiciousCard dayFortune={dailyFortune.day_mansion.day_fortune} />
          )}
          {dailyFortune.sanki && (
            <SankiCard sanki={dailyFortune.sanki} />
          )}
          <SpecialInfoCard fortune={dailyFortune} t={t} />
        </>
      )}
    </div>
  )
}
