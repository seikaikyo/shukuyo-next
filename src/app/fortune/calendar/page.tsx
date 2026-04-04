'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useProfileStore, useProfileHydrated } from '@/stores/profile'
import { useTranslation } from '@/lib/i18n'
import { useCalendar } from '@/hooks/use-calendar'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Breadcrumb } from '@/components/shared/breadcrumb'
import { DateNav } from '@/components/shared/date-nav'
import { FortuneBadge, levelToKey } from '@/components/shared/fortune-badge'
import { cn } from '@/lib/utils'
import type { CalendarDay } from '@/types/calendar'

const LEVEL_BG: Record<string, string> = {
  great: 'bg-[var(--fortune-great)]/12',
  good: 'bg-[var(--fortune-good)]/10',
  caution: 'bg-[var(--fortune-caution)]/10',
  bad: 'bg-[var(--fortune-bad)]/10',
}

const DOT_BG: Record<string, string> = {
  great: 'bg-[var(--fortune-great)]',
  good: 'bg-[var(--fortune-good)]',
  caution: 'bg-[var(--fortune-caution)]',
  bad: 'bg-[var(--fortune-bad)]',
}

function CalendarContent() {
  const { t, locale } = useTranslation()
  const birthDate = useProfileStore((s) => s.birthDate)!
  const { calendarData, loading, fetchCalendar } = useCalendar()

  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null)

  useEffect(() => {
    fetchCalendar(birthDate, year, month, locale)
    setSelectedDay(null)
  }, [birthDate, year, month, locale, fetchCalendar])

  function prevMonth() {
    if (month === 1) { setYear(year - 1); setMonth(12) }
    else setMonth(month - 1)
  }
  function nextMonth() {
    if (month === 12) { setYear(year + 1); setMonth(1) }
    else setMonth(month + 1)
  }

  if (loading || !calendarData) return <Skeleton className='h-60 w-full rounded-xl' />

  const days = calendarData.days || []
  const firstDayOfMonth = new Date(year, month - 1, 1).getDay()
  const adjustedFirst = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1
  const daysInMonth = new Date(year, month, 0).getDate()

  const weekdayHeaders = locale === 'en'
    ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    : ['\u4E00', '\u4E8C', '\u4E09', '\u56DB', '\u4E94', '\u516D', '\u65E5']

  return (
    <div className='space-y-3'>
      <Breadcrumb items={[
        { label: t('nav.home'), href: '/' },
        { label: t('nav.fortune'), href: '/fortune/daily' },
        { label: t('fortune.calendar') },
      ]} />

      <DateNav
        label={locale === 'en' ? `${year} / ${month}` : `${year}\u5E74 ${month}\u6708`}
        onPrev={prevMonth}
        onNext={nextMonth}
      />

      {/* Calendar grid */}
      <Card>
        <CardContent className='py-4'>
          <div className='mb-2 grid grid-cols-7'>
            {weekdayHeaders.map((h) => (
              <div key={h} className='text-center text-xs text-muted-foreground'>{h}</div>
            ))}
          </div>
          <div className='grid grid-cols-7 gap-1'>
            {/* Empty cells for offset */}
            {Array.from({ length: adjustedFirst }).map((_, i) => (
              <div key={`e-${i}`} className='aspect-square' />
            ))}
            {/* Day cells */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1
              const dayData = days.find((d) => d.day === dayNum)
              const level = dayData?.personal?.level || ''
              const key = level ? levelToKey(level) : ''
              const hasSpecial = !!dayData?.special_day
              const isSelected = selectedDay?.day === dayNum
              const todayNum = now.getFullYear() === year && now.getMonth() + 1 === month ? now.getDate() : -1

              return (
                <button
                  key={dayNum}
                  onClick={() => setSelectedDay(dayData || null)}
                  aria-label={`${month}月${dayNum}日`}
                  className={cn(
                    'flex aspect-square flex-col items-center justify-center rounded-md border border-transparent text-xs transition-all hover:border-border',
                    key && LEVEL_BG[key],
                    isSelected && 'ring-1 ring-primary',
                    dayNum === todayNum && 'font-bold text-primary',
                  )}
                >
                  <span className='font-semibold'>{dayNum}</span>
                  {hasSpecial && (
                    <span className={cn('mt-0.5 h-1 w-1 rounded-full', key ? DOT_BG[key] : 'bg-primary')} />
                  )}
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card>
        <CardContent className='py-3'>
          <h3 className='text-sm font-semibold'>{t('fortune.legend')}</h3>
          <div className='mt-2 flex flex-wrap gap-3'>
            {[
              { key: 'great', label: '\u5927\u5409' },
              { key: 'good', label: '\u5409' },
              { key: 'caution', label: '\u5C0F\u51F6' },
              { key: 'bad', label: '\u51F6' },
            ].map((l) => (
              <div key={l.key} className='flex items-center gap-1.5'>
                <span className={cn('h-3 w-3 rounded-sm border', LEVEL_BG[l.key])} style={{ borderColor: `var(--fortune-${l.key})` }} />
                <span className='text-xs'>{l.label}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Selected day detail */}
      {selectedDay && (
        <Card>
          <CardContent className='py-4'>
            <h3 className='text-sm font-semibold'>
              {month}\u6708{selectedDay.day}\u65E5（{selectedDay.weekday}）{t('fortune.detail')}
            </h3>
            <div className='mt-2 flex items-center gap-2'>
              {selectedDay.personal?.level && (
                <FortuneBadge label={selectedDay.personal.level_name || ''} level={selectedDay.personal.level} />
              )}
              {selectedDay.day_mansion && (
                <span className='text-xs text-muted-foreground'>
                  {selectedDay.day_mansion.name_jp}
                </span>
              )}
              {selectedDay.personal?.relation_name && (
                <span className='text-xs text-muted-foreground'>
                  {selectedDay.personal.relation_name}
                </span>
              )}
            </div>
            {selectedDay.special_day && (
              <div className='mt-2 flex gap-2'>
                <FortuneBadge label={selectedDay.special_day.name} special={selectedDay.special_day.type} />
              </div>
            )}
            {selectedDay.ryouhan?.active && (
              <div className='mt-2'>
                <FortuneBadge label={t('fortune.ryouhan')} special='ryouhan' />
              </div>
            )}
            <div className='mt-3'>
              <Link
                href={`/fortune/daily?date=${selectedDay.date}`}
                className='text-sm text-primary hover:underline'
              >
                {t('fortune.viewDailyDetail')} →
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default function CalendarPage() {
  const { t } = useTranslation()
  const hydrated = useProfileHydrated()
  const birthDate = useProfileStore((s) => s.birthDate)
  if (!hydrated) return <Skeleton className='h-60 w-full rounded-xl' />
  if (!birthDate) return <p className='py-12 text-center text-sm text-muted-foreground'>{t('setup.welcomeDesc')}</p>
  return <CalendarContent />
}
