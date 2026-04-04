'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useProfileStore, useProfileHydrated } from '@/stores/profile'
import { useTranslation } from '@/lib/i18n'
import { useFortune } from '@/hooks/use-fortune'
import { useMansion } from '@/hooks/use-mansion'
import { getYoseiFullName } from '@/utils/yosei'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { LevelRing } from '@/components/shared/level-ring'
import { LevelBar } from '@/components/shared/level-bar'
import { FortuneBadge } from '@/components/shared/fortune-badge'
import { MansionTag } from '@/components/shared/mansion-tag'
import { DateNav } from '@/components/shared/date-nav'

function SetupCard() {
  const { t } = useTranslation()
  const setBirthDate = useProfileStore((s) => s.setBirthDate)
  const [date, setDate] = useState('')

  return (
    <Card className='mx-auto max-w-[400px]'>
      <CardContent className='flex flex-col items-center gap-3 pt-6'>
        <h2 className='font-serif text-base font-semibold'>{t('setup.welcome')}</h2>
        <p className='text-center text-sm text-muted-foreground'>{t('setup.welcomeDesc')}</p>
        <Input
          type='date'
          value={date}
          min='1920-01-01'
          max='2020-12-31'
          onChange={(e) => setDate(e.target.value)}
          className='text-center'
        />
        <Button
          className='w-full'
          disabled={!date || date.length !== 10}
          onClick={() => setBirthDate(date)}
        >
          {t('setup.start')}
        </Button>
      </CardContent>
    </Card>
  )
}

function formatDateLabel(dateStr: string, locale: string): string {
  const d = new Date(dateStr + 'T00:00:00')
  const weekdays: Record<string, string[]> = {
    'zh-TW': ['日', '一', '二', '三', '四', '五', '六'],
    en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    ja: ['日', '月', '火', '水', '木', '金', '土'],
  }
  const wd = (weekdays[locale] || weekdays['zh-TW'])[d.getDay()]
  if (locale === 'en') {
    return `${d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })} (${wd})`
  }
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日（${wd}）`
}

function addDays(dateStr: string, n: number): string {
  const d = new Date(dateStr + 'T00:00:00')
  d.setDate(d.getDate() + n)
  return d.toISOString().split('T')[0]
}

function HomeContent() {
  const { t, locale } = useTranslation()
  const birthDate = useProfileStore((s) => s.birthDate)!
  const { dailyFortune, weeklyFortune, dailyLoading, fetchDaily, fetchWeekly } = useFortune()
  const { myMansion, fetchMyMansion } = useMansion()

  const today = new Date().toISOString().split('T')[0]
  const [activeDate, setActiveDate] = useState(today)

  const load = useCallback(
    (date: string) => {
      fetchDaily(birthDate, date, locale)
      fetchWeekly(birthDate, date, locale)
      fetchMyMansion()
    },
    [birthDate, locale, fetchDaily, fetchWeekly, fetchMyMansion]
  )

  useEffect(() => {
    load(activeDate)
  }, [activeDate, load])

  const df = dailyFortune
  const levelName = df?.fortune?.level_name || ''
  const level = df?.fortune?.level || 'good_fortune'

  return (
    <div className='space-y-3'>
      {/* Mansion header */}
      {myMansion && (
        <Card>
          <CardContent className='flex items-center gap-3 py-3'>
            <MansionTag
              yosei={myMansion.yosei}
              yoseiLabel={getYoseiFullName(myMansion.yosei, locale)}
              name={myMansion.name_jp}
            />
            <div>
              <div className='text-sm font-semibold'>
                {myMansion.name_jp}（{myMansion.reading}）
              </div>
              <div className='text-xs text-muted-foreground'>
                {t('mansion.index', { index: String(myMansion.index) })} · {getYoseiFullName(myMansion.yosei, locale)}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Date navigation */}
      <DateNav
        label={formatDateLabel(activeDate, locale)}
        onPrev={() => setActiveDate(addDays(activeDate, -1))}
        onNext={() => setActiveDate(addDays(activeDate, 1))}
        onToday={activeDate !== today ? () => setActiveDate(today) : undefined}
      />

      {/* Overall score */}
      {dailyLoading ? (
        <Card>
          <CardContent className='flex flex-col items-center gap-3 py-6'>
            <Skeleton className='h-24 w-24 rounded-full' />
            <Skeleton className='h-4 w-40' />
          </CardContent>
        </Card>
      ) : df ? (
        <>
          <Card>
            <CardContent className='flex flex-col items-center gap-2 py-6 text-center'>
              <LevelRing level={level} label={levelName} />
              <p className='mt-2 text-sm text-muted-foreground'>
                {df.your_mansion.name_jp} x {df.day_mansion.name_jp} — {df.mansion_relation.name}（{df.mansion_relation.reading}）
              </p>
              {df.advice && (
                <p className='mt-2 max-w-[360px] text-sm text-muted-foreground'>
                  {df.advice}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Special day badges */}
          {(df.special_day || df.ryouhan?.active) && (
            <div className='flex flex-wrap justify-center gap-2'>
              {df.special_day && (
                <FortuneBadge
                  label={df.special_day.name}
                  special={df.special_day.type}
                />
              )}
              {df.ryouhan?.active && (
                <FortuneBadge label={t('fortune.ryouhan')} special='ryouhan' />
              )}
            </div>
          )}

          {/* Auspicious card */}
          {df.day_mansion.day_fortune && (
            <Card>
              <CardContent className='py-4'>
                <h3 className='text-sm font-semibold tracking-wide'>
                  {t('fortune.auspicious')}
                </h3>
                <div className='mt-2'>
                  <div className='mb-1 text-xs text-muted-foreground'>{t('fortune.suitable')}</div>
                  <div className='flex flex-wrap gap-1.5'>
                    {(df.day_mansion.day_fortune.auspicious || []).map((a, i) => (
                      <FortuneBadge key={i} label={a} level='great_fortune' />
                    ))}
                  </div>
                </div>
                {(df.day_mansion.day_fortune.inauspicious || []).length > 0 && (
                  <div className='mt-3'>
                    <div className='mb-1 text-xs text-muted-foreground'>
                      {t('fortune.unsuitable')}
                    </div>
                    <div className='flex flex-wrap gap-1.5'>
                      {(df.day_mansion.day_fortune.inauspicious || []).map((a, i) => (
                        <FortuneBadge key={i} label={a} level='small_misfortune' />
                      ))}
                    </div>
                  </div>
                )}
                <p className='mt-3 text-xs italic text-muted-foreground'>
                  {df.day_mansion.day_fortune.source || 'T21n1299'}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Sanki card */}
          {df.sanki && (
            <Card>
              <CardContent className='py-4'>
                <h3 className='text-sm font-semibold tracking-wide'>
                  {t('fortune.sanki')}
                </h3>
                <div className='mt-2 flex items-center gap-2'>
                  <FortuneBadge
                    label={`${df.sanki.period}（${df.sanki.period_reading}）`}
                  />
                  <span className='text-xs text-muted-foreground'>
                    {t('fortune.sankiDay', {
                      day: String(df.sanki.day_in_period),
                    })} · {df.sanki.day_type}
                  </span>
                </div>
                <p className='mt-2 text-sm text-muted-foreground'>
                  {df.sanki.day_description}
                </p>
                <p className='mt-2 text-xs italic text-muted-foreground'>
                  T21n1299 p.397c
                </p>
              </CardContent>
            </Card>
          )}
        </>
      ) : null}

      {/* Week preview */}
      {weeklyFortune && (
        <Card>
          <CardContent className='py-4'>
            <h3 className='text-sm font-semibold tracking-wide'>
              {t('fortune.weekPreview')}
            </h3>
            <div className='mt-2 grid grid-cols-7 gap-1'>
              {weeklyFortune.daily_overview.map((day) => {
                const isAct = day.date === activeDate
                return (
                  <div key={day.date} className='text-center'>
                    <div
                      className={
                        isAct
                          ? 'text-xs font-bold text-primary'
                          : 'text-xs text-muted-foreground'
                      }
                    >
                      {day.weekday}
                    </div>
                    <LevelBar
                      level={day.level}
                      label={levelLabel(day.level, locale)}
                      isToday={isAct}
                    />
                    {isAct && (
                      <div className='text-xs text-primary'>{t('common.today')}</div>
                    )}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick links */}
      <div className='grid grid-cols-2 gap-2'>
        {[
          { href: '/fortune/daily', titleKey: 'home.fortuneDetail', descKey: 'home.fortuneDetailDesc' },
          { href: '/compatibility', titleKey: 'home.compatibility', descKey: 'home.compatibilityDesc' },
          { href: '/company', titleKey: 'home.companyAnalysis', descKey: 'home.companyAnalysisDesc' },
          { href: '/knowledge', titleKey: 'home.knowledgeBase', descKey: 'home.knowledgeBaseDesc' },
        ].map((link) => (
          <Link key={link.href} href={link.href}>
            <Card className='cursor-pointer transition-colors hover:bg-card/80'>
              <CardContent className='py-3'>
                <div className='text-sm font-semibold'>{t(link.titleKey)}</div>
                <div className='text-xs text-muted-foreground'>{t(link.descKey)}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

function levelLabel(level: string, locale: string): string {
  const labels: Record<string, Record<string, string>> = {
    great_fortune: { 'zh-TW': '\u5927\u5409', en: 'Great', ja: '\u5927\u5409' },
    good_fortune: { 'zh-TW': '\u5409', en: 'Good', ja: '\u5409' },
    small_misfortune: { 'zh-TW': '\u5C0F\u51F6', en: 'Caution', ja: '\u5C0F\u51F6' },
    misfortune: { 'zh-TW': '\u51F6', en: 'Bad', ja: '\u51F6' },
    great_misfortune: { 'zh-TW': '\u5927\u51F6', en: 'Bad', ja: '\u5927\u51F6' },
  }
  return labels[level]?.[locale] || labels[level]?.['zh-TW'] || level
}

export default function HomePage() {
  const hydrated = useProfileHydrated()
  const birthDate = useProfileStore((s) => s.birthDate)

  if (!hydrated) {
    return (
      <div className='space-y-3'>
        <Skeleton className='h-16 w-full rounded-xl' />
        <Skeleton className='h-8 w-48 mx-auto' />
        <Skeleton className='h-40 w-full rounded-xl' />
      </div>
    )
  }

  if (!birthDate) {
    return <SetupCard />
  }

  return <HomeContent />
}
