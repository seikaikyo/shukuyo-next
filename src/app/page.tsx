'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useProfileStore, useProfileHydrated } from '@/stores/profile'
import { useFortune } from '@/hooks/use-fortune'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { Star, Sparkles, BookOpen, CalendarDays, Briefcase } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'
import { scoreColor, scoreBorder } from '@/utils/score-colors'
import type { DailyFortune, WeeklyFortune } from '@/types/fortune'

// ---- Setup card (no birth date set) ----

function SetupCard() {
  const { setBirthDate } = useProfileStore()
  const { t } = useTranslation()
  const [inputDate, setInputDate] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!inputDate) return
    setSubmitting(true)
    setBirthDate(inputDate)
    setSubmitting(false)
  }

  return (
    <div className='flex flex-1 items-center justify-center py-24 px-4'>
      <Card className='w-full max-w-md border border-border shadow-sm'>
        <CardHeader className='text-center pb-4'>
          <CardTitle className='font-serif text-2xl font-semibold tracking-wide text-foreground'>
            {t('welcome.title')}
          </CardTitle>
          <p className='text-sm text-muted-foreground mt-2'>
            {t('home.setupSubtitle')}
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
            <div className='flex flex-col gap-1.5'>
              <label
                htmlFor='birth-date'
                className='text-sm font-medium text-foreground'
              >
                {t('setup.birthDate')}
              </label>
              <input
                id='birth-date'
                type='date'
                value={inputDate}
                onChange={(e) => setInputDate(e.target.value)}
                min='1900-01-01'
                max={new Date().toISOString().split('T')[0]}
                required
                className={cn(
                  'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1',
                  'text-sm text-foreground shadow-sm transition-colors',
                  'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
                  'disabled:cursor-not-allowed disabled:opacity-50'
                )}
              />
            </div>
            <Button
              type='submit'
              disabled={!inputDate || submitting}
              className='w-full mt-2'
            >
              {t('home.start')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

// ---- Helpers ----

function formatDateLabel(dateStr: string, locale: string) {
  const d = new Date(dateStr + 'T00:00:00')
  const loc = locale === 'zh-TW' ? 'zh-TW' : locale === 'ja' ? 'ja-JP' : 'en-US'
  return d.toLocaleDateString(loc, {
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  })
}

function offsetDate(dateStr: string, days: number) {
  const d = new Date(dateStr + 'T00:00:00')
  d.setDate(d.getDate() + days)
  return d.toISOString().split('T')[0]
}

function todayStr() {
  // 用本地時區，避免 UTC 在 UTC+8 凌晨時顯示前一天
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}


// ---- Skeleton placeholders ----

function ScoreSkeleton() {
  return (
    <Card className='border border-border'>
      <CardContent className='flex flex-col items-center gap-3 pt-8 pb-8'>
        <Skeleton className='h-28 w-28 rounded-full' />
        <Skeleton className='h-5 w-20 mt-1' />
        <Skeleton className='h-4 w-52' />
        <Skeleton className='h-4 w-40' />
      </CardContent>
    </Card>
  )
}

function DetailSkeleton() {
  return (
    <Card className='border border-border'>
      <CardContent className='pt-5 pb-5 flex flex-col gap-3'>
        <Skeleton className='h-3 w-20' />
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className='flex items-center gap-3'>
            <Skeleton className='h-3 w-10 shrink-0' />
            <Skeleton className='h-1.5 flex-1' />
            <Skeleton className='h-3 w-7' />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

// ---- 今日特殊日 ----

function TodaySpecialDays({ fortune }: { fortune: DailyFortune }) {
  const badges: { label: string; color: string }[] = []

  if (fortune.special_day) {
    const sdColors: Record<string, string> = {
      kanro: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
      kongou: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
      rasetsu: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30',
    }
    badges.push({
      label: fortune.special_day.name,
      color: sdColors[fortune.special_day.type] || 'bg-muted/50 text-muted-foreground border-border',
    })
  }

  if (fortune.ryouhan?.active) {
    badges.push({
      label: '両半',
      color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30',
    })
  }

  if (fortune.sanki?.is_dark_week) {
    badges.push({
      label: '暗週',
      color: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/30',
    })
  }

  if (fortune.compound_analysis?.length) {
    for (const c of fortune.compound_analysis) {
      badges.push({
        label: c.name,
        color: c.severity >= 3
          ? 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30'
          : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
      })
    }
  }

  if (!badges.length) return null

  return (
    <div className='flex flex-wrap justify-center gap-1.5'>
      {badges.map((b) => (
        <span
          key={b.label}
          className={cn('text-[11px] px-2 py-0.5 rounded-full border', b.color)}
        >
          {b.label}
        </span>
      ))}
    </div>
  )
}

// ---- 今日行動建議 ----

function TodayActions({ fortune }: { fortune: DailyFortune }) {
  const { t } = useTranslation()
  const items: { label: string; value: string; color?: string }[] = []

  if (fortune.lucky) {
    items.push(
      { label: t('home.direction'), value: fortune.lucky.direction },
      { label: t('home.luckyColor'), value: fortune.lucky.color, color: fortune.lucky.color_hex },
      { label: t('home.luckyNumber'), value: fortune.lucky.numbers.join(', ') },
    )
  }

  if (fortune.day_mansion.day_fortune?.is_most_auspicious) {
    items.push({ label: t('fortune.dayMansion'), value: t('home.dayMansionBest') })
  }

  if (!items.length) return null

  return (
    <div className='flex flex-wrap justify-center gap-x-4 gap-y-1'>
      {items.map((item) => (
        <div key={item.label} className='flex items-center gap-1'>
          <span className='text-[10px] text-muted-foreground'>{item.label}</span>
          {item.color && (
            <span
              className='inline-block w-2.5 h-2.5 rounded-full border border-border'
              style={{ backgroundColor: item.color }}
            />
          )}
          <span className='text-xs font-medium text-foreground'>{item.value}</span>
        </div>
      ))}
    </div>
  )
}

// ---- 週運預覽 ----

function WeekPreview({ weeklyFortune, activeDate }: { weeklyFortune: WeeklyFortune; activeDate: string }) {
  const { t } = useTranslation()

  return (
    <Card className='border border-border'>
      <CardContent className='pt-4 pb-4'>
        <div className='flex items-center gap-1.5 mb-2'>
          <CalendarDays className='size-3.5 text-muted-foreground' aria-hidden='true' />
          <p className='text-[10px] font-medium text-muted-foreground uppercase tracking-widest'>{t('home.weekPreview')}</p>
        </div>
        <div className='flex justify-between gap-0.5'>
          {weeklyFortune.daily_overview.map((day) => {
            const isActive = day.date === activeDate
            return (
              <div
                key={day.date}
                className={cn(
                  'flex flex-col items-center gap-0.5 flex-1 py-1.5 rounded-md transition-colors',
                  isActive && 'bg-primary/10'
                )}
              >
                <span className='text-[10px] text-muted-foreground'>{day.weekday}</span>
                <span className={cn(
                  'text-sm font-bold tabular-nums',
                  scoreColor(day.score)
                )}>
                  {day.score}
                </span>
                {day.special_day && (
                  <span className='w-1.5 h-1.5 rounded-full bg-amber-500' />
                )}
                {day.ryouhan_active && !day.special_day && (
                  <span className='w-1.5 h-1.5 rounded-full bg-purple-500' />
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

// ---- Main content when birth date is set ----

function HomeContent({ birthDate }: { birthDate: string }) {
  const today = todayStr()
  const [activeDate, setActiveDate] = useState(today)
  const { dailyFortune, weeklyFortune, loading, error, fetchDaily, fetchWeekly } = useFortune()
  const { t, locale } = useTranslation()

  useEffect(() => {
    fetchDaily(birthDate, activeDate)
    fetchWeekly(birthDate, activeDate)
  }, [birthDate, activeDate, fetchDaily, fetchWeekly])

  const fortune = dailyFortune

  return (
    <div className='flex-1 mx-auto w-full max-w-2xl px-4 py-8 flex flex-col gap-6'>
      {/* mansion header */}
      {fortune && (
        <div className='text-center'>
          <p className='text-xs text-muted-foreground tracking-widest uppercase mb-1'>
            {t('fortune.yourMansion')}
          </p>
          <h2 className='font-serif text-xl font-semibold text-primary'>
            {fortune.your_mansion.name_jp}
            <span className='font-sans text-sm text-muted-foreground ml-2'>
              {fortune.your_mansion.reading}
            </span>
          </h2>
        </div>
      )}

      {/* date navigation */}
      <div className='flex items-center justify-center gap-2'>
        <button
          onClick={() => setActiveDate((d) => offsetDate(d, -1))}
          aria-label={t('common.previousDay')}
          className='h-8 w-8 rounded-full flex items-center justify-center text-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-200'
        >
          ‹
        </button>
        <span className='text-sm font-medium text-foreground min-w-36 text-center'>
          {formatDateLabel(activeDate, locale)}
        </span>
        <button
          onClick={() => setActiveDate((d) => offsetDate(d, 1))}
          aria-label={t('common.nextDay')}
          className='h-8 w-8 rounded-full flex items-center justify-center text-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-200'
        >
          ›
        </button>
        {activeDate !== today && (
          <button
            onClick={() => setActiveDate(today)}
            className='text-xs text-primary hover:text-primary/80 underline-offset-2 hover:underline transition-colors duration-200 ml-1'
          >
            {t('home.today')}
          </button>
        )}
      </div>

      {/* error state */}
      {error && !loading && (
        <div role='alert' className='flex flex-col items-center gap-3 py-8 text-center'>
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

      {/* overall score card */}
      {loading ? (
        <ScoreSkeleton />
      ) : fortune ? (
        <Card className='border border-border dark:border-primary/20'>
          <CardContent className='flex flex-col items-center gap-3 pt-8 pb-8'>
            <div
              className={cn(
                'relative flex items-center justify-center rounded-full border-4 h-28 w-28',
                scoreBorder(fortune.fortune.overall)
              )}
            >
              <span
                className={cn(
                  'text-4xl font-bold tabular-nums',
                  scoreColor(fortune.fortune.overall)
                )}
              >
                {fortune.fortune.overall}
              </span>
            </div>
            <p
              className={cn(
                'text-lg font-serif font-semibold',
                scoreColor(fortune.fortune.overall)
              )}
            >
              {fortune.fortune.level_name || fortune.fortune.level || '—'}
            </p>
            {fortune.advice && (
              <p className='text-sm text-muted-foreground text-center max-w-xs leading-relaxed'>
                {fortune.advice}
              </p>
            )}
          </CardContent>
        </Card>
      ) : null}

      {/* today special days + actions */}
      {!loading && fortune && (
        <>
          <TodaySpecialDays fortune={fortune} />
          <TodayActions fortune={fortune} />
        </>
      )}

      {/* week preview */}
      {!loading && weeklyFortune && (
        <WeekPreview weeklyFortune={weeklyFortune} activeDate={activeDate} />
      )}

      {/* fortune descriptions */}
      {!loading && fortune?.fortune?.career_desc && (
        <Card className='border border-border'>
          <CardContent className='pt-5 pb-5 flex flex-col gap-4'>
            {[
              { label: t('fortune.career'), desc: fortune.fortune.career_desc },
              { label: t('fortune.love'), desc: fortune.fortune.love_desc },
              { label: t('fortune.health'), desc: fortune.fortune.health_desc },
              { label: t('fortune.wealth'), desc: fortune.fortune.wealth_desc },
            ].filter(({ desc }) => desc).map(({ label, desc }) => (
              <div key={label}>
                <p className='text-xs font-medium text-primary mb-1'>{label}</p>
                <p className='text-sm text-muted-foreground leading-relaxed'>{desc}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* quick action links */}
      <div className='grid grid-cols-2 sm:grid-cols-4 gap-3'>
        {[
          { href: '/fortune', label: t('home.fortuneDetail'), icon: <Star className='size-5 text-primary' aria-hidden='true' />, desc: t('home.fortuneDetailDesc') },
          { href: '/compatibility', label: t('home.compatibility'), icon: <Sparkles className='size-5 text-primary' aria-hidden='true' />, desc: t('home.compatibilityDesc') },
          { href: '/company', label: t('home.companyAnalysis'), icon: <Briefcase className='size-5 text-primary' aria-hidden='true' />, desc: t('home.companyAnalysisDesc') },
          { href: '/knowledge', label: t('home.knowledgeBase'), icon: <BookOpen className='size-5 text-primary' aria-hidden='true' />, desc: t('home.knowledgeBaseDesc') },
        ].map(({ href, label, icon, desc }) => (
          <Link key={href} href={href}>
            <Card className='border border-border hover:border-primary/40 hover:shadow-sm transition-all duration-200 cursor-pointer h-full'>
              <CardContent className='flex flex-col items-center gap-1.5 pt-5 pb-5 text-center'>
                {icon}
                <span className='text-xs font-medium text-foreground'>{label}</span>
                <span className='text-xs text-muted-foreground'>{desc}</span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

// ---- Root export ----

export default function HomePage() {
  const { birthDate } = useProfileStore()
  const hydrated = useProfileHydrated()

  // SSR hydration 完成前顯示 loading，避免閃爍
  if (!hydrated) {
    return (
      <div className='flex flex-1 items-center justify-center py-24'>
        <Skeleton className='h-64 w-full max-w-md rounded-xl' />
      </div>
    )
  }

  if (!birthDate) {
    return <SetupCard />
  }

  return <HomeContent birthDate={birthDate} />
}
