'use client'

import { useState, useEffect, useCallback } from 'react'
import { useProfileStore } from '@/stores/profile'
import { useStartup } from '@/hooks/use-startup'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import type { IndustryRecommendation } from '@/types/startup'
import type { LuckyCalendarData, LuckyCalendarDay } from '@/types/lucky-days'

// ---- Helpers ----

function scoreColor(score: number) {
  if (score >= 80) return 'text-[var(--fortune-great)]'
  if (score >= 60) return 'text-[var(--fortune-good)]'
  if (score >= 40) return 'text-[var(--fortune-neutral)]'
  if (score >= 20) return 'text-[var(--fortune-caution)]'
  return 'text-[var(--fortune-bad)]'
}

function scoreBg(score: number) {
  if (score >= 80) return 'bg-emerald-500/10'
  if (score >= 60) return 'bg-sky-500/10'
  if (score >= 40) return 'bg-amber-500/10'
  if (score >= 20) return 'bg-orange-500/10'
  return 'bg-red-500/10'
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month - 1, 1).getDay()
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00')
  const weekdays = ['日', '一', '二', '三', '四', '五', '六']
  return `${d.getMonth() + 1}月${d.getDate()}日（${weekdays[d.getDay()]}）`
}

// ---- Sub-components ----

function IndustryCard({ recs }: { recs: IndustryRecommendation }) {
  const [showAll, setShowAll] = useState(false)
  const visible = showAll ? recs.favorable_mansions : recs.favorable_mansions.slice(0, 3)

  return (
    <Card className='border border-border dark:border-primary/20'>
      <CardContent className='pt-5 pb-5 flex flex-col gap-4'>
        <div className='flex items-baseline gap-3'>
          <span className='text-xl font-bold text-foreground'>{recs.mansion.name_jp}</span>
          <span className='text-sm text-muted-foreground'>{recs.mansion.reading}</span>
        </div>
        {recs.career_tags.length > 0 && (
          <div className='flex flex-wrap gap-1.5'>
            {recs.career_tags.map((tag) => (
              <span
                key={tag}
                className='px-2.5 py-0.5 rounded-full border border-primary/30 text-xs text-foreground'
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        {recs.career_description && (
          <p className='text-sm text-muted-foreground leading-relaxed'>{recs.career_description}</p>
        )}

        {recs.favorable_mansions.length > 0 && (
          <div className='flex flex-col gap-2'>
            <p className='text-xs font-medium text-muted-foreground tracking-widest uppercase'>
              適合共同創業的宿（{recs.favorable_mansions.length}）
            </p>
            <div className='flex flex-col gap-2'>
              {visible.map((fm) => (
                <div key={fm.index} className='flex flex-col gap-0.5 px-3 py-2 rounded-md bg-muted/40'>
                  <div className='flex items-baseline gap-2'>
                    <span className='text-sm font-medium text-foreground'>{fm.name_jp}</span>
                    <span className='text-xs text-muted-foreground'>{fm.reading}</span>
                  </div>
                  {fm.summary && (
                    <p className='text-xs text-muted-foreground leading-relaxed'>{fm.summary}</p>
                  )}
                </div>
              ))}
            </div>
            {recs.favorable_mansions.length > 3 && (
              <button
                onClick={() => setShowAll(v => !v)}
                className='text-xs text-primary hover:underline self-start'
              >
                {showAll ? '收起' : `顯示全部 ${recs.favorable_mansions.length} 個`}
              </button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function CalendarView({
  calendar,
  year,
  month,
  onPrev,
  onNext,
}: {
  calendar: LuckyCalendarData
  year: number
  month: number
  onPrev: () => void
  onNext: () => void
}) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDayOfMonth(year, month)
  const weekdays = ['日', '一', '二', '三', '四', '五', '六']

  const selectedEntries: LuckyCalendarDay[] = selectedDate ? (calendar.days[selectedDate] || []) : []

  return (
    <Card className='border border-border'>
      <CardContent className='pt-5 pb-5 flex flex-col gap-4'>
        <div className='flex items-center justify-between'>
          <p className='text-xs font-medium text-muted-foreground tracking-widest uppercase'>
            開業吉日月曆
          </p>
          <div className='flex items-center gap-1'>
            <button
              onClick={onPrev}
              aria-label='上個月'
              className='h-6 w-6 flex items-center justify-center rounded text-muted-foreground hover:text-foreground hover:bg-muted text-sm transition-colors'
            >
              ‹
            </button>
            <span className='text-xs font-medium text-foreground min-w-16 text-center'>
              {year}/{month}
            </span>
            <button
              onClick={onNext}
              aria-label='下個月'
              className='h-6 w-6 flex items-center justify-center rounded text-muted-foreground hover:text-foreground hover:bg-muted text-sm transition-colors'
            >
              ›
            </button>
          </div>
        </div>

        {/* weekday headers */}
        <div className='grid grid-cols-7 gap-0.5'>
          {weekdays.map((wd) => (
            <div key={wd} className='text-center text-[10px] text-muted-foreground py-1'>
              {wd}
            </div>
          ))}
          {/* empty cells */}
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`e-${i}`} />
          ))}
          {/* days */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1
            const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
            const entries = calendar.days[dateStr]
            const hasLucky = entries && entries.length > 0
            const topScore = hasLucky ? Math.max(...entries.map(e => e.score)) : 0
            const isSelected = selectedDate === dateStr

            return (
              <button
                key={dateStr}
                onClick={() => setSelectedDate(isSelected ? null : dateStr)}
                className={cn(
                  'relative flex flex-col items-center py-1.5 rounded-md transition-all duration-150',
                  hasLucky ? scoreBg(topScore) : '',
                  isSelected && 'ring-1 ring-primary',
                  'hover:opacity-80'
                )}
              >
                <span className={cn(
                  'text-xs tabular-nums',
                  hasLucky ? scoreColor(topScore) : 'text-muted-foreground'
                )}>
                  {day}
                </span>
                {hasLucky && (
                  <span className={cn('text-[9px] font-medium tabular-nums', scoreColor(topScore))}>
                    {topScore}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {selectedDate && selectedEntries.length > 0 && (
          <div className='flex flex-col gap-3 border-t border-border pt-3'>
            <p className='text-xs font-medium text-foreground'>
              {formatDate(selectedDate)} 開業建議
            </p>
            {selectedEntries.map((entry, i) => (
              <div key={i} className='flex flex-col gap-1.5 px-3 py-2 rounded-md bg-muted/40'>
                <div className='flex items-center gap-2'>
                  <span className='text-xs font-medium text-foreground'>{entry.action_name}</span>
                  <span className={cn('text-xs font-semibold tabular-nums', scoreColor(entry.score))}>
                    {entry.score}
                  </span>
                </div>
                {entry.reason && (
                  <p className='text-xs text-muted-foreground leading-relaxed'>{entry.reason}</p>
                )}
                {entry.advice && (
                  <div className='flex flex-col gap-0.5 mt-1'>
                    {entry.advice.summary && (
                      <p className='text-xs text-muted-foreground'>{entry.advice.summary}</p>
                    )}
                    {entry.advice.do.length > 0 && (
                      <p className='text-xs text-emerald-500'>
                        宜：{entry.advice.do.join('、')}
                      </p>
                    )}
                    {entry.advice.avoid.length > 0 && (
                      <p className='text-xs text-orange-400'>
                        忌：{entry.advice.avoid.join('、')}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {selectedDate && selectedEntries.length === 0 && (
          <p className='text-xs text-muted-foreground text-center py-2 border-t border-border pt-3'>
            此日無特別開業吉兆
          </p>
        )}
      </CardContent>
    </Card>
  )
}

// ---- Page ----

type View = 'industry' | 'calendar'

export default function FortuneStartupPage() {
  const { birthDate } = useProfileStore()
  const {
    industryRecs,
    startupCalendar,
    industryLoading,
    calendarLoading,
    error,
    fetchIndustryRecommendations,
    fetchStartupCalendar,
  } = useStartup()

  const now = new Date()
  const [calYear, setCalYear] = useState(now.getFullYear())
  const [calMonth, setCalMonth] = useState(now.getMonth() + 1)
  const [view, setView] = useState<View>('industry')

  const loadIndustry = useCallback(() => {
    if (birthDate) fetchIndustryRecommendations(birthDate)
  }, [birthDate, fetchIndustryRecommendations])

  const loadCalendar = useCallback(() => {
    if (birthDate) fetchStartupCalendar(birthDate, calYear, calMonth)
  }, [birthDate, calYear, calMonth, fetchStartupCalendar])

  useEffect(() => {
    loadIndustry()
  }, [loadIndustry])

  useEffect(() => {
    if (view === 'calendar') loadCalendar()
  }, [view, loadCalendar])

  function changeMonth(delta: number) {
    let m = calMonth + delta
    let y = calYear
    if (m > 12) { m = 1; y++ }
    if (m < 1) { m = 12; y-- }
    setCalMonth(m)
    setCalYear(y)
  }

  if (!birthDate) {
    return (
      <div className='flex-1 flex items-center justify-center py-24 px-4 text-center'>
        <div className='flex flex-col gap-3'>
          <p className='text-sm text-muted-foreground'>請先設定出生日期</p>
          <a
            href='/'
            className='inline-flex h-7 items-center rounded-lg border border-border bg-background px-2.5 text-[0.8rem] font-medium text-foreground hover:bg-muted transition-colors duration-200'
          >
            前往設定
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className='mx-auto w-full max-w-2xl px-4 pb-12 flex flex-col gap-4'>
      <div className='py-4 flex flex-col gap-1'>
        <h2 className='text-base font-semibold text-foreground'>創業運勢</h2>
        <p className='text-xs text-muted-foreground'>
          依本命宿推算適合的行業與開業吉日
        </p>
      </div>

      {/* view toggle */}
      <div className='flex gap-1 p-1 bg-muted rounded-lg'>
        {(['industry', 'calendar'] as View[]).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={cn(
              'flex-1 text-xs py-1.5 rounded-md transition-all duration-200',
              view === v
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {v === 'industry' ? '行業建議' : '開業吉日'}
          </button>
        ))}
      </div>

      {error && !industryLoading && !calendarLoading && (
        <div className='flex flex-col items-center gap-3 py-12 text-center'>
          <p className='text-sm text-muted-foreground'>資料載入失敗，請稍後重試</p>
          <Button variant='outline' size='sm' onClick={view === 'industry' ? loadIndustry : loadCalendar}>
            重試
          </Button>
        </div>
      )}

      {view === 'industry' && (
        <>
          {industryLoading && (
            <Card className='border border-border'>
              <CardContent className='pt-5 pb-5 flex flex-col gap-4'>
                <Skeleton className='h-6 w-32' />
                <div className='flex gap-1.5'>
                  {[1, 2, 3].map(i => <Skeleton key={i} className='h-6 w-16 rounded-full' />)}
                </div>
                <Skeleton className='h-16 w-full' />
              </CardContent>
            </Card>
          )}
          {!industryLoading && industryRecs && <IndustryCard recs={industryRecs} />}
        </>
      )}

      {view === 'calendar' && (
        <>
          {calendarLoading && (
            <Card className='border border-border'>
              <CardContent className='pt-5 pb-5 flex flex-col gap-3'>
                <Skeleton className='h-3 w-24' />
                <div className='grid grid-cols-7 gap-0.5'>
                  {Array.from({ length: 35 }).map((_, i) => (
                    <Skeleton key={i} className='h-8 rounded-md' />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
          {!calendarLoading && startupCalendar && (
            <CalendarView
              calendar={startupCalendar}
              year={calYear}
              month={calMonth}
              onPrev={() => changeMonth(-1)}
              onNext={() => changeMonth(1)}
            />
          )}
        </>
      )}
    </div>
  )
}
