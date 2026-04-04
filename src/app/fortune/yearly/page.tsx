'use client'

import { useState, useEffect, useCallback } from 'react'
import { useProfileStore, useProfileHydrated } from '@/stores/profile'
import { useTranslation } from '@/lib/i18n'
import { useFortune } from '@/hooks/use-fortune'
import { levelLabel } from '@/utils/level-label'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Breadcrumb } from '@/components/shared/breadcrumb'
import { DateNav } from '@/components/shared/date-nav'
import { LevelRing } from '@/components/shared/level-ring'
import { LevelBar } from '@/components/shared/level-bar'
import { FortuneBadge } from '@/components/shared/fortune-badge'

function YearlyContent() {
  const { t, locale } = useTranslation()
  const birthDate = useProfileStore((s) => s.birthDate)!
  const { yearlyFortune: yf, loading: yearlyLoading, fetchYearly } = useFortune()

  const thisYear = new Date().getFullYear()
  const [year, setYear] = useState(thisYear)

  const load = useCallback(
    (y: number) => fetchYearly(birthDate, y, locale),
    [birthDate, locale, fetchYearly]
  )

  useEffect(() => { load(year) }, [year, load])

  if (yearlyLoading || !yf) return <Skeleton className='h-60 w-full rounded-xl' />

  const level = yf.fortune?.level || 'good_fortune'
  const levelName = yf.fortune?.level_name || ''
  const star = yf.kuyou_star

  return (
    <div className='space-y-3'>
      <Breadcrumb items={[
        { label: t('nav.home'), href: '/' },
        { label: t('nav.fortune'), href: '/fortune/daily' },
        { label: t('fortune.yearly') },
      ]} />

      <DateNav
        label={`${year}年`}
        onPrev={() => setYear(year - 1)}
        onNext={() => setYear(year + 1)}
        onToday={year !== thisYear ? () => setYear(thisYear) : undefined}
        todayLabel={t('fortune.thisYear')}
      />

      {/* Overview with kuyou star */}
      <Card>
        <CardContent className='flex flex-col items-center gap-2 py-6 text-center'>
          <LevelRing level={level} label={levelName} sublabel={star?.name} size='lg' />
          <div className='mt-2 font-serif font-semibold'>
            {star?.name}（{star?.reading}）
          </div>
          <div className='text-xs text-muted-foreground'>
            {t('fortune.kazoeAge')} {star?.kazoe_age || ''}{t('common.ageSuffix')} · {star?.fortune_name}
          </div>
          {yf.theme?.title && (
            <div className='mt-2 font-serif text-sm font-semibold'>
              {t('fortune.yearTheme')}: {yf.theme.title}
            </div>
          )}
          {yf.advice && (
            <p className='mt-2 max-w-[400px] text-sm text-muted-foreground'>{yf.advice}</p>
          )}
        </CardContent>
      </Card>

      {/* Monthly trend grid */}
      <Card>
        <CardContent className='py-4'>
          <h3 className='text-sm font-semibold'>{t('fortune.monthlyTrend')}</h3>
          <div className='mt-2 grid grid-cols-6 gap-1.5'>
            {(yf.monthly_trend || []).map((m) => {
              const isCurrent = m.month === new Date().getMonth() + 1 && year === thisYear
              return (
                <div key={m.month} className='text-center'>
                  <div className={isCurrent ? 'text-xs font-semibold text-primary' : 'text-xs text-muted-foreground'}>
                    {m.month}{locale === 'en' ? '' : '\u6708'}
                  </div>
                  <LevelBar
                    level={m.level}
                    label={levelLabel(m.level, locale)}
                    isToday={isCurrent}
                    className='mt-1'
                  />
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Kuyou advice */}
      <Card>
        <CardContent className='py-4'>
          <h3 className='text-sm font-semibold'>{t('fortune.kuyouAdvice')}</h3>
          {star?.description && (
            <p className='mt-2 text-sm text-muted-foreground'>{star.description}</p>
          )}
          {yf.strategy && (
            <div className='mt-3 grid grid-cols-2 gap-3'>
              <div className='rounded-lg bg-muted p-3'>
                <div className='mb-1 text-xs text-muted-foreground'>{t('fortune.bestMonths')}</div>
                <div className='flex flex-wrap gap-1.5'>
                  {(yf.strategy?.best_months || []).map((m) => (
                    <FortuneBadge key={m.month} label={`${m.month}\u6708`} level='great_fortune' />
                  ))}
                </div>
              </div>
              <div className='rounded-lg bg-muted p-3'>
                <div className='mb-1 text-xs text-muted-foreground'>{t('fortune.cautionMonths')}</div>
                <div className='flex flex-wrap gap-1.5'>
                  {(yf.strategy?.caution_months || []).map((m) => (
                    <FortuneBadge key={m.month} label={`${m.month}\u6708`} level='misfortune' />
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default function YearlyPage() {
  const { t } = useTranslation()
  const hydrated = useProfileHydrated()
  const birthDate = useProfileStore((s) => s.birthDate)
  if (!hydrated) return <Skeleton className='h-60 w-full rounded-xl' />
  if (!birthDate) return <p className='py-12 text-center text-sm text-muted-foreground'>{t('setup.welcomeDesc')}</p>
  return <YearlyContent />
}
