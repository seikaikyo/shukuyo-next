'use client'

import { useState, useEffect, useCallback } from 'react'
import { useProfileStore, useProfileHydrated } from '@/stores/profile'
import { useTranslation } from '@/lib/i18n'
import { useFortune } from '@/hooks/use-fortune'
import { getYoseiFullName } from '@/utils/yosei'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Breadcrumb } from '@/components/shared/breadcrumb'
import { DateNav } from '@/components/shared/date-nav'
import { LevelRing } from '@/components/shared/level-ring'
import { LevelBar } from '@/components/shared/level-bar'
import { FortuneBadge } from '@/components/shared/fortune-badge'
import { MansionTag } from '@/components/shared/mansion-tag'

function addDays(dateStr: string, n: number): string {
  const d = new Date(dateStr + 'T00:00:00')
  d.setDate(d.getDate() + n)
  return d.toISOString().split('T')[0]
}

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

function WeeklyContent() {
  const { t, locale } = useTranslation()
  const birthDate = useProfileStore((s) => s.birthDate)!
  const { weeklyFortune: wf, weeklyLoading, fetchWeekly } = useFortune()

  const today = new Date().toISOString().split('T')[0]
  const [centerDate, setCenterDate] = useState(today)

  const load = useCallback(
    (date: string) => fetchWeekly(birthDate, date, locale),
    [birthDate, locale, fetchWeekly]
  )

  useEffect(() => { load(centerDate) }, [centerDate, load])

  if (weeklyLoading || !wf) {
    return <Skeleton className='h-60 w-full rounded-xl' />
  }

  const level = wf.fortune?.level || 'good_fortune'
  const levelName = wf.fortune?.level_name || ''

  return (
    <div className='space-y-3'>
      <Breadcrumb items={[
        { label: t('nav.home'), href: '/' },
        { label: t('nav.fortune'), href: '/fortune/daily' },
        { label: t('fortune.weekly') },
      ]} />

      <DateNav
        label={`${wf.week_start?.slice(5)} \u2014 ${wf.week_end?.slice(5)}`}
        onPrev={() => setCenterDate(addDays(centerDate, -7))}
        onNext={() => setCenterDate(addDays(centerDate, 7))}
        onToday={centerDate !== today ? () => setCenterDate(today) : undefined}
        todayLabel={t('fortune.thisWeek')}
      />

      {/* Overview */}
      <Card>
        <CardContent className='flex flex-col items-center gap-2 py-6 text-center'>
          <LevelRing level={level} label={levelName} />
          <MansionTag
            yosei={wf.your_mansion.yosei}
            yoseiLabel={getYoseiFullName(wf.your_mansion.yosei, locale)}
            name={wf.your_mansion.name_jp}
          />
          {wf.focus && (
            <div className='mt-2 font-serif text-sm font-semibold'>
              {t('fortune.weekFocus')}: {wf.focus}
            </div>
          )}
          {wf.advice && (
            <p className='mt-2 max-w-[400px] text-sm text-muted-foreground'>{wf.advice}</p>
          )}
        </CardContent>
      </Card>

      {/* Daily overview grid */}
      <Card>
        <CardContent className='py-4'>
          <h3 className='text-sm font-semibold'>{t('fortune.dailyOverview')}</h3>
          <div className='mt-2 grid grid-cols-7 gap-1.5'>
            {wf.daily_overview.map((day) => (
              <div key={day.date} className='text-center'>
                <div className={day.is_today ? 'text-xs font-bold text-primary' : 'text-xs text-muted-foreground'}>
                  {day.weekday}
                </div>
                <div className='text-xs text-muted-foreground'>{day.date.slice(5)}</div>
                <LevelBar
                  level={day.level}
                  label={levelLabel(day.level, locale)}
                  isToday={day.is_today}
                  className='mt-1'
                />
                {day.special_day && (
                  <div className='mt-0.5 text-[10px]' style={{
                    color: day.special_day === 'rasetsu' ? 'var(--fortune-bad)' : `var(--${day.special_day})`
                  }}>
                    {day.special_day === 'kanro' ? '\u7518\u9732' : day.special_day === 'kongou' ? '\u91D1\u525B' : day.special_day === 'rasetsu' ? '\u7F85\u5239' : day.special_day}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Special days count */}
      <Card>
        <CardContent className='py-4'>
          <h3 className='text-sm font-semibold'>{t('fortune.specialDays')}</h3>
          <div className='mt-2 grid grid-cols-3 gap-2'>
            {[
              { key: 'kanro', label: '\u7518\u9732\u65E5', color: 'var(--kanro)', bg: 'var(--kanro-bg)' },
              { key: 'kongou', label: '\u91D1\u525B\u5CF0\u65E5', color: 'var(--kongou)', bg: 'var(--kongou-bg)' },
              { key: 'rasetsu', label: '\u7F85\u5239\u65E5', color: 'var(--fortune-bad)', bg: 'var(--fortune-bad)/10' },
            ].map((s) => {
              const count = wf.daily_overview.filter(d => d.special_day === s.key).length
              return (
                <div key={s.key} className='rounded-lg p-3 text-center' style={{ background: s.bg }}>
                  <div className='text-xs' style={{ color: s.color }}>{s.label}</div>
                  <div className='text-lg font-bold' style={{ color: s.color }}>{count}</div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function WeeklyPage() {
  const hydrated = useProfileHydrated()
  const birthDate = useProfileStore((s) => s.birthDate)

  if (!hydrated) return <Skeleton className='h-60 w-full rounded-xl' />
  if (!birthDate) return <p className='py-12 text-center text-sm text-muted-foreground'>Please set your birth date first.</p>

  return <WeeklyContent />
}
