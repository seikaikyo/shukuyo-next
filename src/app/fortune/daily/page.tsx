'use client'

import { useState, useEffect, useCallback } from 'react'
import { useProfileStore, useProfileHydrated } from '@/stores/profile'
import { useTranslation } from '@/lib/i18n'
import { useFortune } from '@/hooks/use-fortune'
import { getYoseiFullName } from '@/utils/yosei'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Breadcrumb } from '@/components/shared/breadcrumb'
import { DateNav } from '@/components/shared/date-nav'
import { LevelRing } from '@/components/shared/level-ring'
import { FortuneBadge } from '@/components/shared/fortune-badge'
import { MansionTag } from '@/components/shared/mansion-tag'

function addDays(dateStr: string, n: number): string {
  const d = new Date(dateStr + 'T00:00:00')
  d.setDate(d.getDate() + n)
  return d.toISOString().split('T')[0]
}

function formatDate(dateStr: string, locale: string): string {
  const d = new Date(dateStr + 'T00:00:00')
  const wd: Record<string, string[]> = {
    'zh-TW': ['日', '一', '二', '三', '四', '五', '六'],
    en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    ja: ['日', '月', '火', '水', '木', '金', '土'],
  }
  const w = (wd[locale] || wd['zh-TW'])[d.getDay()]
  if (locale === 'en') return `${d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })} (${w})`
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日（${w}）`
}

function DailyContent() {
  const { t, locale } = useTranslation()
  const birthDate = useProfileStore((s) => s.birthDate)!
  const { dailyFortune: df, dailyLoading, error, fetchDaily } = useFortune()

  const today = new Date().toISOString().split('T')[0]
  const [activeDate, setActiveDate] = useState(today)

  const load = useCallback(
    (date: string) => fetchDaily(birthDate, date, locale),
    [birthDate, locale, fetchDaily]
  )

  useEffect(() => { load(activeDate) }, [activeDate, load])

  if (dailyLoading || !df) {
    return (
      <div className='space-y-3'>
        <Skeleton className='h-40 w-full rounded-xl' />
        <Skeleton className='h-24 w-full rounded-xl' />
      </div>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className='py-8 text-center'>
          <p className='text-sm text-destructive'>{t('error.fetchFailed')}</p>
          <Button variant='outline' size='sm' className='mt-3' onClick={() => load(activeDate)}>
            {t('common.retry')}
          </Button>
        </CardContent>
      </Card>
    )
  }

  const level = df.fortune?.level || 'good_fortune'
  const levelName = df.fortune?.level_name || ''

  return (
    <div className='space-y-3'>
      <Breadcrumb items={[
        { label: t('nav.home'), href: '/' },
        { label: t('nav.fortune'), href: '/fortune/daily' },
        { label: t('fortune.daily') },
      ]} />

      <DateNav
        label={formatDate(activeDate, locale)}
        onPrev={() => setActiveDate(addDays(activeDate, -1))}
        onNext={() => setActiveDate(addDays(activeDate, 1))}
        onToday={activeDate !== today ? () => setActiveDate(today) : undefined}
      />

      {/* Overall */}
      <Card>
        <CardContent className='flex flex-col items-center gap-2 py-6 text-center'>
          <LevelRing level={level} label={levelName} size='lg' />
          <div className='mt-2 font-serif font-semibold'>
            {df.your_mansion.name_jp} x {df.day_mansion.name_jp}
          </div>
          <div className='text-sm text-muted-foreground'>
            {df.mansion_relation.name}{df.mansion_relation.reading ? `（${df.mansion_relation.reading}）` : ''}{df.mansion_relation.description ? ` — ${df.mansion_relation.description}` : ''}
          </div>
          {(df.special_day || df.ryouhan?.active) && (
            <div className='mt-2 flex flex-wrap justify-center gap-2'>
              {df.special_day && (
                <FortuneBadge label={df.special_day.name} special={df.special_day.type} />
              )}
              {df.ryouhan?.active && (
                <FortuneBadge label={t('fortune.ryouhan')} special='ryouhan' />
              )}
            </div>
          )}
          {df.advice && (
            <p className='mt-3 max-w-[400px] text-sm text-muted-foreground'>{df.advice}</p>
          )}
        </CardContent>
      </Card>

      {/* Sanki */}
      {df.sanki && (
        <Card>
          <CardContent className='py-4'>
            <h3 className='text-sm font-semibold'>{t('fortune.sanki')}</h3>
            <div className='mt-2 flex items-center gap-2'>
              <FortuneBadge label={df.sanki.period ? `${df.sanki.period}${df.sanki.period_reading ? `（${df.sanki.period_reading}）` : ''}` : t('fortune.sanki')} />
              <span className='text-xs text-muted-foreground'>
                {t('fortune.sankiDay', { day: String(df.sanki.day_in_period) })} · {df.sanki.day_type}
              </span>
            </div>
            <p className='mt-2 text-sm text-muted-foreground'>{df.sanki.day_description}</p>
          </CardContent>
        </Card>
      )}

      {/* Auspicious */}
      {df.day_mansion.day_fortune && (
        <Card>
          <CardContent className='py-4'>
            <h3 className='text-sm font-semibold'>{t('fortune.auspicious')}</h3>
            <div className='mt-2 grid grid-cols-2 gap-3'>
              <div className='rounded-lg bg-muted p-3'>
                <div className='mb-1 text-xs text-muted-foreground'>{t('fortune.suitable')}</div>
                {(df.day_mansion.day_fortune.auspicious || []).map((a, i) => (
                  <div key={i} className='text-sm' style={{ color: 'var(--fortune-great)' }}>{a}</div>
                ))}
              </div>
              <div className='rounded-lg bg-muted p-3'>
                <div className='mb-1 text-xs text-muted-foreground'>{t('fortune.unsuitable')}</div>
                {(df.day_mansion.day_fortune.inauspicious || []).map((a, i) => (
                  <div key={i} className='text-sm' style={{ color: 'var(--fortune-caution)' }}>{a}</div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Special day info */}
      {df.special_day && (
        <Card>
          <CardContent className='py-4'>
            <h3 className='text-sm font-semibold'>{t('fortune.specialDayInfo')}</h3>
            <div
              className='mt-2 rounded-lg border-l-[3px] p-3 text-sm'
              style={{
                borderLeftColor: `var(--${df.special_day.type === 'kanro' ? 'kanro' : df.special_day.type === 'kongou' ? 'kongou' : 'fortune-bad'})`,
                background: 'var(--muted)',
              }}
            >
              <span className='font-semibold' style={{
                color: `var(--${df.special_day.type === 'kanro' ? 'kanro' : df.special_day.type === 'kongou' ? 'kongou' : 'fortune-bad'})`
              }}>
                {df.special_day.name}（{df.special_day.reading}）
              </span>
              <br />
              <span className='text-muted-foreground'>{df.special_day.description}</span>
            </div>
            {df.ryouhan?.active && (
              <div className='mt-2 rounded-lg border-l-[3px] border-l-border bg-muted p-3 text-sm'>
                <span className='font-semibold'>{t('fortune.ryouhan')}</span>
                <br />
                <span className='text-muted-foreground'>{df.ryouhan.description}</span>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default function DailyPage() {
  const { t } = useTranslation()
  const hydrated = useProfileHydrated()
  const birthDate = useProfileStore((s) => s.birthDate)

  if (!hydrated) return <Skeleton className='h-60 w-full rounded-xl' />
  if (!birthDate) return <p className='py-12 text-center text-sm text-muted-foreground'>{t('setup.welcomeDesc')}</p>

  return <DailyContent />
}
