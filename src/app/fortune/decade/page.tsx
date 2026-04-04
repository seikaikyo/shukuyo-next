'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useProfileStore, useProfileHydrated } from '@/stores/profile'
import { useTranslation } from '@/lib/i18n'
import { useFortune } from '@/hooks/use-fortune'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Breadcrumb } from '@/components/shared/breadcrumb'
import { DateNav } from '@/components/shared/date-nav'
import { FortuneBadge, levelToKey } from '@/components/shared/fortune-badge'
import { MansionTag } from '@/components/shared/mansion-tag'
import { cn } from '@/lib/utils'
import { levelLabel } from '@/utils/level-label'

const BORDER_COLORS: Record<string, string> = {
  great: 'border-l-[var(--fortune-great)]',
  good: 'border-l-[var(--fortune-good)]',
  caution: 'border-l-[var(--fortune-caution)]',
  bad: 'border-l-[var(--fortune-bad)]',
}

function DecadeContent() {
  const { t, locale } = useTranslation()
  const birthDate = useProfileStore((s) => s.birthDate)!
  const { yearlyRange, loading: rangeLoading, fetchYearlyRange } = useFortune()

  const thisYear = new Date().getFullYear()
  const [startYear, setStartYear] = useState(thisYear - 5)

  const load = useCallback(
    (s: number) => fetchYearlyRange(birthDate, s, s + 9, locale),
    [birthDate, locale, fetchYearlyRange]
  )

  useEffect(() => { load(startYear) }, [startYear, load])

  if (rangeLoading || yearlyRange.length === 0) return <Skeleton className='h-60 w-full rounded-xl' />

  return (
    <div className='space-y-3'>
      <Breadcrumb items={[
        { label: t('nav.home'), href: '/' },
        { label: t('nav.fortune'), href: '/fortune/daily' },
        { label: t('fortune.decade') },
      ]} />

      <DateNav
        label={`${startYear} \u2014 ${startYear + 9}`}
        onPrev={() => setStartYear(startYear - 10)}
        onNext={() => setStartYear(startYear + 10)}
      />

      <div className='flex flex-col gap-2'>
        {yearlyRange.map((yf) => {
          const level = yf.fortune?.level || 'good_fortune'
          const key = levelToKey(level)
          const isCurrent = yf.year === thisYear
          const isPast = yf.year < thisYear

          return (
            <Link key={yf.year} href={`/fortune/yearly?year=${yf.year}`}>
              <Card
                className={cn(
                  'cursor-pointer border-l-[3px] transition-colors hover:bg-card/80',
                  BORDER_COLORS[key],
                  isPast && 'opacity-50',
                  isCurrent && 'ring-1 ring-primary',
                )}
              >
                <CardContent className='flex items-center gap-3 py-3'>
                  <div className='min-w-[50px]'>
                    <div className={cn('text-sm font-bold', isCurrent && 'text-primary')}>
                      {yf.year}
                    </div>
                    <div className={cn('text-xs', isCurrent ? 'text-primary' : 'text-muted-foreground')}>
                      {yf.kuyou_star.kazoe_age}{locale === 'en' ? '' : '\u6B72'}
                    </div>
                  </div>
                  <div className='flex-1'>
                    <div className='flex items-center gap-2'>
                      <MansionTag
                        yosei={yf.your_mansion.yosei}
                        yoseiLabel=''
                        name={yf.your_mansion.name_jp}
                        className='text-xs'
                      />
                      <FortuneBadge label={levelLabel(level, locale)} level={level} />
                      {isCurrent && <FortuneBadge label={t('fortune.thisYear')} />}
                    </div>
                    <div className='mt-1 text-xs text-muted-foreground'>
                      {yf.kuyou_star.name} — {yf.theme?.title || yf.kuyou_star.description?.slice(0, 30)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default function DecadePage() {
  const { t } = useTranslation()
  const hydrated = useProfileHydrated()
  const birthDate = useProfileStore((s) => s.birthDate)
  if (!hydrated) return <Skeleton className='h-60 w-full rounded-xl' />
  if (!birthDate) return <p className='py-12 text-center text-sm text-muted-foreground'>{t('setup.welcomeDesc')}</p>
  return <DecadeContent />
}
