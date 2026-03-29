'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useProfileStore } from '@/stores/profile'
import { useFortune } from '@/hooks/use-fortune'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

// ---- Setup card (no birth date set) ----

function SetupCard() {
  const { setBirthDate } = useProfileStore()
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
            歡迎來到宿曜道
          </CardTitle>
          <p className='text-sm text-muted-foreground mt-2'>
            輸入出生日期，開始探索你的命運
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
            <div className='flex flex-col gap-1.5'>
              <label
                htmlFor='birth-date'
                className='text-sm font-medium text-foreground'
              >
                出生日期
              </label>
              <input
                id='birth-date'
                type='date'
                value={inputDate}
                onChange={(e) => setInputDate(e.target.value)}
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
              開始
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

// ---- Helpers ----

function formatDateLabel(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('zh-TW', {
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

function scoreColor(score: number) {
  if (score >= 80) return 'text-[var(--fortune-great)]'
  if (score >= 60) return 'text-[var(--fortune-good)]'
  if (score >= 40) return 'text-[var(--fortune-neutral)]'
  if (score >= 20) return 'text-[var(--fortune-caution)]'
  return 'text-[var(--fortune-bad)]'
}

function scoreBorder(score: number) {
  if (score >= 80) return 'border-[var(--fortune-great)]'
  if (score >= 60) return 'border-[var(--fortune-good)]'
  if (score >= 40) return 'border-[var(--fortune-neutral)]'
  if (score >= 20) return 'border-[var(--fortune-caution)]'
  return 'border-[var(--fortune-bad)]'
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

// ---- Main content when birth date is set ----

function HomeContent({ birthDate }: { birthDate: string }) {
  const today = todayStr()
  const [activeDate, setActiveDate] = useState(today)
  const { dailyFortune, loading, error, fetchDaily } = useFortune()

  useEffect(() => {
    fetchDaily(birthDate, activeDate)
  }, [birthDate, activeDate, fetchDaily])

  const fortune = dailyFortune

  return (
    <div className='flex-1 mx-auto w-full max-w-2xl px-4 py-8 flex flex-col gap-6'>
      {/* mansion header */}
      {fortune && (
        <div className='text-center'>
          <p className='text-xs text-muted-foreground tracking-widest uppercase mb-1'>
            本命宿
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
          aria-label='前一天'
          className='h-8 w-8 rounded-full flex items-center justify-center text-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-200'
        >
          ‹
        </button>
        <span className='text-sm font-medium text-foreground min-w-36 text-center'>
          {formatDateLabel(activeDate)}
        </span>
        <button
          onClick={() => setActiveDate((d) => offsetDate(d, 1))}
          aria-label='後一天'
          className='h-8 w-8 rounded-full flex items-center justify-center text-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-200'
        >
          ›
        </button>
        {activeDate !== today && (
          <button
            onClick={() => setActiveDate(today)}
            className='text-xs text-primary hover:text-primary/80 underline-offset-2 hover:underline transition-colors duration-200 ml-1'
          >
            今天
          </button>
        )}
      </div>

      {/* error state */}
      {error && !loading && (
        <div className='flex flex-col items-center gap-3 py-8 text-center'>
          <p className='text-sm text-muted-foreground'>資料載入失敗，請稍後重試</p>
          <Button
            variant='outline'
            size='sm'
            onClick={() => fetchDaily(birthDate, activeDate)}
          >
            重試
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

      {/* fortune descriptions */}
      {!loading && fortune?.fortune?.career_desc && (
        <Card className='border border-border'>
          <CardContent className='pt-5 pb-5 flex flex-col gap-4'>
            {[
              { label: '事業', desc: fortune.fortune.career_desc },
              { label: '感情', desc: fortune.fortune.love_desc },
              { label: '健康', desc: fortune.fortune.health_desc },
              { label: '財運', desc: fortune.fortune.wealth_desc },
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
      <div className='grid grid-cols-3 gap-3'>
        {[
          { href: '/fortune', label: '運勢詳情', glyph: '✦', desc: '日週月年運' },
          {
            href: '/compatibility',
            label: '人際相性',
            glyph: '◈',
            desc: '二十七宿相性',
          },
          { href: '/knowledge', label: '知識庫', glyph: '☯', desc: '宿曜道典籍' },
        ].map(({ href, label, glyph, desc }) => (
          <Link key={href} href={href}>
            <Card className='border border-border hover:border-primary/40 hover:shadow-sm transition-all duration-200 cursor-pointer h-full'>
              <CardContent className='flex flex-col items-center gap-1.5 pt-5 pb-5 text-center'>
                <span className='text-xl text-primary select-none'>{glyph}</span>
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

  if (!birthDate) {
    return <SetupCard />
  }

  return <HomeContent birthDate={birthDate} />
}
