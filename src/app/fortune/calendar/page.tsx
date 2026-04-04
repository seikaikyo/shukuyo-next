'use client'

import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useProfileStore } from '@/stores/profile'
import { useCalendar } from '@/hooks/use-calendar'
import { useTranslation } from '@/lib/i18n'
import { FortuneCalendar, FortuneCalendarSkeleton } from '@/components/calendar/fortune-calendar'
import Link from 'next/link'
import { Breadcrumb } from '@/components/shared/breadcrumb'
import { levelColor } from '@/utils/fortune-helpers'
import type { CalendarDay } from '@/types/calendar'

function todayStr() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export default function FortuneCalendarPage() {
  const { birthDate, locale: profileLocale } = useProfileStore()
  const { t, locale } = useTranslation()
  const { calendarData, loading, error, fetchCalendar } = useCalendar()
  const today = todayStr()

  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null)

  const load = useCallback(() => {
    if (birthDate) fetchCalendar(birthDate, year, month, profileLocale)
  }, [birthDate, year, month, profileLocale, fetchCalendar])

  useEffect(() => { load() }, [load])

  function prevMonth() {
    if (month === 1) { setYear(y => y - 1); setMonth(12) }
    else setMonth(m => m - 1)
    setSelectedDay(null)
  }

  function nextMonth() {
    if (month === 12) { setYear(y => y + 1); setMonth(1) }
    else setMonth(m => m + 1)
    setSelectedDay(null)
  }

  function goToday() {
    setYear(now.getFullYear())
    setMonth(now.getMonth() + 1)
    setSelectedDay(null)
  }

  if (!birthDate) {
    return (
      <div className='flex-1 flex items-center justify-center py-24 px-4 text-center'>
        <div className='flex flex-col gap-3'>
          <p className='text-sm text-muted-foreground'>{t('startup.noBirthDate')}</p>
          <Link href='/' className='text-xs text-primary hover:underline'>{t('fortune.goSetup')}</Link>
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
          { label: t('fortune.calendarView') },
        ]}
        className='pt-2'
      />

      <div className='py-2 flex flex-col gap-1'>
        <h2 className='text-base font-semibold text-foreground'>{t('fortune.calendarTitle')}</h2>
        <p className='text-xs text-muted-foreground'>{t('fortune.calendarDesc')}</p>
      </div>

      {/* month navigation */}
      <div className='flex items-center justify-center gap-3'>
        <button
          onClick={prevMonth}
          className='h-8 w-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors'
        >
          <ChevronLeft className='size-4' />
        </button>
        <span className='text-sm font-semibold text-foreground min-w-28 text-center'>
          {t('common.yearMonth', { year, month })}
        </span>
        <button
          onClick={nextMonth}
          className='h-8 w-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors'
        >
          <ChevronRight className='size-4' />
        </button>
        {(year !== now.getFullYear() || month !== now.getMonth() + 1) && (
          <button
            onClick={goToday}
            className='text-xs text-primary hover:underline ml-1'
          >
            {t('fortune.thisMonth')}
          </button>
        )}
      </div>

      {error && !loading && (
        <div role='alert' className='flex flex-col items-center gap-3 py-8'>
          <p className='text-sm text-muted-foreground'>{t('error.fetchFailed')}</p>
          <Button variant='outline' size='sm' onClick={load}>{t('common.retry')}</Button>
        </div>
      )}

      {loading && <FortuneCalendarSkeleton />}

      {!loading && calendarData && (
        <FortuneCalendar
          data={calendarData}
          today={today}
          onDayClick={setSelectedDay}
        />
      )}

      {/* day detail panel */}
      {selectedDay && selectedDay.personal && (
        <Card className='border-l-4 border-l-primary'>
          <CardContent className='pt-4 pb-4 flex flex-col gap-2'>
            <div className='flex items-center justify-between'>
              <p className='text-sm font-semibold text-foreground'>
                {month}/{selectedDay.day}（{selectedDay.weekday}）
              </p>
              <span className={cn('text-2xl font-bold', levelColor(selectedDay.personal.level))}>
                {selectedDay.personal.level_name || selectedDay.personal.level || selectedDay.personal.fortune_score}
              </span>
            </div>
            <div className='flex flex-wrap gap-2 text-xs text-muted-foreground'>
              <span>{t('fortune.dayMansion')}:{selectedDay.day_mansion.name_jp}</span>
              <span>{t('fortune.mansionRelation')}:{selectedDay.personal.relation_name}</span>
              {selectedDay.personal.level_name && (
                <span>{t('fortune.levelLabel')}:{selectedDay.personal.level_name}</span>
              )}
            </div>
            <div className='flex flex-wrap gap-2 text-xs text-muted-foreground'>
              <span>{t('fortune.sankiTitle')}:{selectedDay.personal.sanki_period}</span>
              {selectedDay.personal.sanki_day_type && (
                <span>{selectedDay.personal.sanki_day_type}</span>
              )}
            </div>
            {selectedDay.special_day && (
              <div className='flex items-center gap-1.5'>
                <span className='w-1.5 h-1.5 rounded-full bg-[var(--kanro)]' />
                <span className='text-xs font-medium text-[var(--kanro)]'>
                  {selectedDay.special_day.name}
                </span>
              </div>
            )}
            {selectedDay.ryouhan?.active && (
              <div className='flex items-center gap-1.5'>
                <span className='w-1.5 h-1.5 rounded-full bg-[var(--ryouhan)]' />
                <span className='text-xs text-[var(--ryouhan)]'>{t('fortune.ryouhanPeriod')}</span>
              </div>
            )}
            {selectedDay.personal.is_dark_week && (
              <div className='flex items-center gap-1.5'>
                <span className='w-1.5 h-1.5 rounded-full bg-muted-foreground' />
                <span className='text-xs text-muted-foreground'>{t('fortune.darkWeek')}</span>
              </div>
            )}
            <Link
              href={`/fortune/daily?date=${selectedDay.date}`}
              className='text-xs text-primary hover:underline self-start mt-1'
            >
              {t('fortune.viewFullDaily')}
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
