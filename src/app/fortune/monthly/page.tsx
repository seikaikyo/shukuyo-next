'use client'

import { useState, useEffect, useCallback } from 'react'
import { useProfileStore, useProfileHydrated } from '@/stores/profile'
import { useTranslation } from '@/lib/i18n'
import { useFortune } from '@/hooks/use-fortune'
import { getYoseiFullName } from '@/utils/yosei'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { Breadcrumb } from '@/components/shared/breadcrumb'
import { DateNav } from '@/components/shared/date-nav'
import { LevelRing } from '@/components/shared/level-ring'
import { LevelBar } from '@/components/shared/level-bar'
import { FortuneBadge } from '@/components/shared/fortune-badge'
import { MansionTag } from '@/components/shared/mansion-tag'

function levelLabel(level: string, locale: string): string {
  const m: Record<string, Record<string, string>> = {
    great_fortune: { 'zh-TW': '\u5927\u5409', en: 'Great', ja: '\u5927\u5409' },
    good_fortune: { 'zh-TW': '\u5409', en: 'Good', ja: '\u5409' },
    small_misfortune: { 'zh-TW': '\u5C0F\u51F6', en: 'Caution', ja: '\u5C0F\u51F6' },
    misfortune: { 'zh-TW': '\u51F6', en: 'Bad', ja: '\u51F6' },
    great_misfortune: { 'zh-TW': '\u5927\u51F6', en: 'Bad', ja: '\u5927\u51F6' },
  }
  return m[level]?.[locale] || m[level]?.['zh-TW'] || level
}

function MonthlyContent() {
  const { t, locale } = useTranslation()
  const birthDate = useProfileStore((s) => s.birthDate)!
  const { monthlyFortune: mf, loading: monthlyLoading, fetchMonthly } = useFortune()

  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth() + 1)

  const load = useCallback(
    (y: number, m: number) => fetchMonthly(birthDate, y, m, locale),
    [birthDate, locale, fetchMonthly]
  )

  useEffect(() => { load(year, month) }, [year, month, load])

  function prevMonth() {
    if (month === 1) { setYear(year - 1); setMonth(12) }
    else setMonth(month - 1)
  }
  function nextMonth() {
    if (month === 12) { setYear(year + 1); setMonth(1) }
    else setMonth(month + 1)
  }
  function thisMonth() {
    setYear(now.getFullYear()); setMonth(now.getMonth() + 1)
  }

  if (monthlyLoading || !mf) return <Skeleton className='h-60 w-full rounded-xl' />

  const level = mf.fortune?.level || 'good_fortune'
  const levelName = mf.fortune?.level_name || ''

  return (
    <div className='space-y-3'>
      <Breadcrumb items={[
        { label: t('nav.home'), href: '/' },
        { label: t('nav.fortune'), href: '/fortune/daily' },
        { label: t('fortune.monthly') },
      ]} />

      <DateNav
        label={locale === 'en' ? `${year} / ${month}` : `${year}年 ${month}月`}
        onPrev={prevMonth}
        onNext={nextMonth}
        onToday={year !== now.getFullYear() || month !== now.getMonth() + 1 ? thisMonth : undefined}
        todayLabel={t('fortune.thisMonth')}
      />

      {/* Overview */}
      <Card>
        <CardContent className='flex flex-col items-center gap-2 py-6 text-center'>
          <LevelRing level={level} label={levelName} />
          <div className='mt-1 flex items-center gap-2'>
            <MansionTag
              yosei={mf.your_mansion.yosei}
              yoseiLabel={getYoseiFullName(mf.your_mansion.yosei, locale)}
              name={mf.your_mansion.name_jp}
            />
            <span className='text-xs text-muted-foreground'>x {mf.month_mansion?.name_jp}</span>
          </div>
          {mf.theme?.description && (
            <>
              <div className='mt-2 font-serif text-sm font-semibold'>
                {t('fortune.monthTheme')}: {mf.theme.description}
              </div>
            </>
          )}
          {mf.advice && <p className='mt-2 max-w-[400px] text-sm text-muted-foreground'>{mf.advice}</p>}
        </CardContent>
      </Card>

      {/* Weekly breakdown */}
      <Card>
        <CardContent className='py-4'>
          <h3 className='text-sm font-semibold'>{t('fortune.weeklyAnalysis')}</h3>
          <div className='mt-2 flex flex-col gap-3'>
            {mf.weekly.map((w, i) => (
              <div key={i}>
                {i > 0 && <Separator className='mb-3' />}
                <div className='mb-2 flex items-center justify-between'>
                  <span className='text-sm font-semibold'>
                    {t('fortune.weekN', { n: String(w.week) })} ({w.week_start?.slice(5)}-{w.week_end?.slice(5)})
                  </span>
                  <FortuneBadge label={levelLabel(w.level, locale)} level={w.level} />
                </div>
                <div className='mb-1 h-1.5 overflow-hidden rounded-full bg-muted'>
                  <div
                    className='h-full rounded-full'
                    style={{
                      width: `${w.level === 'great_fortune' ? 90 : w.level === 'good_fortune' ? 70 : w.level === 'small_misfortune' ? 35 : 20}%`,
                      background: `var(--fortune-${w.level === 'great_fortune' ? 'great' : w.level === 'good_fortune' ? 'good' : w.level === 'small_misfortune' ? 'caution' : 'bad'})`,
                    }}
                  />
                </div>
                <p className='text-xs text-muted-foreground'>{w.focus}</p>
                {w.daily_overview && (
                  <div className='mt-2 grid grid-cols-7 gap-0.5'>
                    {w.daily_overview.map((d) => (
                      <LevelBar key={d.date} level={d.level} label='' className='h-4 text-[0px]' />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Strategy */}
      {mf.strategy && (
        <Card>
          <CardContent className='py-4'>
            <h3 className='text-sm font-semibold'>{t('fortune.monthStrategy')}</h3>
            {mf.strategy.best_days.length > 0 && (
              <div className='mt-2'>
                <div className='mb-1 text-xs text-muted-foreground'>{t('fortune.recommendedDays')}</div>
                <div className='flex flex-wrap gap-1.5'>
                  {mf.strategy.best_days.map((d) => (
                    <FortuneBadge key={d.date} label={d.date.slice(5)} level='great_fortune' />
                  ))}
                </div>
              </div>
            )}
            {mf.strategy.avoid_days.length > 0 && (
              <div className='mt-3'>
                <div className='mb-1 text-xs text-muted-foreground'>{t('fortune.cautionDays')}</div>
                <div className='flex flex-wrap gap-1.5'>
                  {mf.strategy.avoid_days.map((d) => (
                    <FortuneBadge key={d.date} label={d.date.slice(5)} level='small_misfortune' />
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Special days */}
      {mf.special_days && mf.special_days.length > 0 && (
        <Card>
          <CardContent className='py-4'>
            <h3 className='text-sm font-semibold'>{t('fortune.specialDays')}</h3>
            <div className='mt-2 grid grid-cols-3 gap-2'>
              {[
                { key: 'kanro', label: '\u7518\u9732\u65E5', color: 'var(--kanro)', bg: 'var(--kanro-bg)' },
                { key: 'kongou', label: '\u91D1\u525B\u5CF0\u65E5', color: 'var(--kongou)', bg: 'var(--kongou-bg)' },
                { key: 'rasetsu', label: '\u7F85\u5239\u65E5', color: 'var(--fortune-bad)', bg: 'rgba(var(--fortune-bad), 0.1)' },
              ].map((s) => {
                const count = mf.special_days!.filter(d => d.type === s.key).length
                return (
                  <div key={s.key} className='rounded-lg p-3 text-center' style={{ background: s.bg }}>
                    <div className='text-xs' style={{ color: s.color }}>{s.label}</div>
                    <div className='text-xl font-bold' style={{ color: s.color }}>{count}</div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default function MonthlyPage() {
  const hydrated = useProfileHydrated()
  const birthDate = useProfileStore((s) => s.birthDate)
  if (!hydrated) return <Skeleton className='h-60 w-full rounded-xl' />
  if (!birthDate) return <p className='py-12 text-center text-sm text-muted-foreground'>Please set your birth date first.</p>
  return <MonthlyContent />
}
