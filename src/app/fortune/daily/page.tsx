'use client'

import { useState, useEffect } from 'react'
import { useProfileStore } from '@/stores/profile'
import { useFortune } from '@/hooks/use-fortune'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import type { DailyFortune } from '@/types/fortune'

// ---- Helpers ----

function todayStr() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function offsetDate(dateStr: string, days: number) {
  const d = new Date(dateStr + 'T00:00:00')
  d.setDate(d.getDate() + days)
  return d.toISOString().split('T')[0]
}

function formatDateLabel(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  })
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

// ---- Sub-components ----

function DateNav({
  activeDate,
  today,
  onPrev,
  onNext,
  onToday,
}: {
  activeDate: string
  today: string
  onPrev: () => void
  onNext: () => void
  onToday: () => void
}) {
  return (
    <div className='flex items-center justify-center gap-2 py-4'>
      <button
        onClick={onPrev}
        aria-label='前一天'
        className='h-8 w-8 rounded-full flex items-center justify-center text-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-200'
      >
        ‹
      </button>
      <span className='text-sm font-medium text-foreground min-w-48 text-center'>
        {formatDateLabel(activeDate)}
      </span>
      <button
        onClick={onNext}
        aria-label='後一天'
        className='h-8 w-8 rounded-full flex items-center justify-center text-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-200'
      >
        ›
      </button>
      {activeDate !== today && (
        <button
          onClick={onToday}
          className='text-xs text-primary hover:text-primary/80 underline-offset-2 hover:underline transition-colors duration-200 ml-1'
        >
          今天
        </button>
      )}
    </div>
  )
}

function OverallScoreCard({ fortune }: { fortune: DailyFortune }) {
  const { overall, level_name, level } = fortune.fortune

  return (
    <Card className='border border-border dark:border-primary/20'>
      <CardContent className='flex flex-col items-center gap-3 pt-8 pb-8'>
        {/* circular score ring */}
        <div
          className={cn(
            'relative flex items-center justify-center rounded-full border-4 h-32 w-32',
            scoreBorder(overall)
          )}
        >
          <div className='flex flex-col items-center'>
            <span className={cn('text-4xl font-bold tabular-nums leading-none', scoreColor(overall))}>
              {overall}
            </span>
            <span className='text-xs text-muted-foreground mt-0.5'>分</span>
          </div>
        </div>

        {/* level label */}
        <p className={cn('text-xl font-serif font-semibold', scoreColor(overall))}>
          {level_name || level || '—'}
        </p>

        {/* day mansion relation */}
        {fortune.mansion_relation && (
          <p className='text-xs text-muted-foreground'>
            今日宿：{fortune.day_mansion.name_jp}（{fortune.day_mansion.reading}）
            <span className='mx-1'>·</span>
            {fortune.mansion_relation.name}
          </p>
        )}

        {/* advice */}
        {fortune.advice && (
          <p className='text-sm text-muted-foreground text-center max-w-sm leading-relaxed px-2'>
            {fortune.advice}
          </p>
        )}

        {/* special day badge */}
        {fortune.special_day && (
          <div className='mt-1 px-3 py-1 rounded-full border border-primary/40 bg-primary/5 text-xs text-primary font-medium'>
            {fortune.special_day.name}
            {fortune.special_day.reading ? `（${fortune.special_day.reading}）` : ''}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function CategoryCard({ fortune }: { fortune: DailyFortune }) {
  const cats = [
    {
      label: '事業',
      score: fortune.fortune.career,
      desc: fortune.fortune.career_desc,
    },
    {
      label: '感情',
      score: fortune.fortune.love,
      desc: fortune.fortune.love_desc,
    },
    {
      label: '健康',
      score: fortune.fortune.health,
      desc: fortune.fortune.health_desc,
    },
    {
      label: '財運',
      score: fortune.fortune.wealth,
      desc: fortune.fortune.wealth_desc,
    },
  ]

  const filtered = cats.filter(({ desc }) => desc)
  if (filtered.length === 0) return null

  return (
    <Card className='border border-border'>
      <CardContent className='pt-5 pb-5 flex flex-col gap-4'>
        {filtered.map(({ label, desc }) => (
          <div key={label}>
            <p className='text-xs font-medium text-primary mb-1'>{label}</p>
            <p className='text-sm text-muted-foreground leading-relaxed'>{desc}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

function LuckyCard({ fortune }: { fortune: DailyFortune }) {
  const { lucky } = fortune

  return (
    <Card className='border border-border'>
      <CardContent className='pt-5 pb-5 flex flex-col gap-3'>
        <p className='text-xs font-medium text-muted-foreground tracking-widest uppercase'>
          今日開運
        </p>
        <div className='grid grid-cols-3 gap-3'>
          <div className='flex flex-col items-center gap-1 p-3 rounded-md bg-muted/50'>
            <span className='text-xs text-muted-foreground'>方位</span>
            <span className='text-sm font-medium text-foreground'>
              {lucky.direction}
            </span>
            <span className='text-xs text-muted-foreground'>{lucky.direction_reading}</span>
          </div>
          <div className='flex flex-col items-center gap-1 p-3 rounded-md bg-muted/50'>
            <span className='text-xs text-muted-foreground'>顏色</span>
            <span
              className='h-5 w-5 rounded-full border border-border'
              style={{ backgroundColor: lucky.color_hex }}
              aria-label={lucky.color}
            />
            <span className='text-xs text-foreground'>{lucky.color}</span>
          </div>
          <div className='flex flex-col items-center gap-1 p-3 rounded-md bg-muted/50'>
            <span className='text-xs text-muted-foreground'>數字</span>
            <span className='text-sm font-medium text-foreground'>
              {lucky.numbers.join('・')}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function SpecialInfoCard({ fortune }: { fortune: DailyFortune }) {
  const hasSanki = !!fortune.sanki
  const hasRyouhan = fortune.ryouhan?.active
  const hasCompound = fortune.compound_analysis && fortune.compound_analysis.length > 0

  if (!hasSanki && !hasRyouhan && !hasCompound) return null

  return (
    <Card className='border border-border'>
      <CardContent className='pt-5 pb-5 flex flex-col gap-3'>
        <p className='text-xs font-medium text-muted-foreground tracking-widest uppercase'>
          特殊日期資訊
        </p>

        {hasSanki && fortune.sanki && (
          <div className='flex flex-col gap-1'>
            <span className='text-xs font-medium text-foreground'>
              三期：{fortune.sanki.period}（{fortune.sanki.period_reading}）
            </span>
            <span className='text-xs text-muted-foreground leading-relaxed'>
              {fortune.sanki.day_description}
            </span>
          </div>
        )}

        {hasRyouhan && fortune.ryouhan && (
          <div className='flex flex-col gap-1'>
            <span className='text-xs font-medium text-[var(--fortune-caution)]'>
              両半：{fortune.ryouhan.period_label || '活躍中'}
            </span>
            <span className='text-xs text-muted-foreground leading-relaxed'>
              {fortune.ryouhan.description}
            </span>
          </div>
        )}

        {hasCompound &&
          fortune.compound_analysis!.map((ca) => (
            <div key={ca.pattern} className='flex flex-col gap-1'>
              <span className='text-xs font-medium text-foreground'>{ca.name}</span>
              <span className='text-xs text-muted-foreground leading-relaxed'>
                {ca.description}
              </span>
            </div>
          ))}
      </CardContent>
    </Card>
  )
}

// ---- Page ----

export default function FortuneDailyPage() {
  const { birthDate } = useProfileStore()
  const today = todayStr()
  const [activeDate, setActiveDate] = useState(today)
  const { dailyFortune, loading, error, fetchDaily } = useFortune()

  useEffect(() => {
    if (birthDate) {
      fetchDaily(birthDate, activeDate)
    }
  }, [birthDate, activeDate, fetchDaily])

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
      <DateNav
        activeDate={activeDate}
        today={today}
        onPrev={() => setActiveDate((d) => offsetDate(d, -1))}
        onNext={() => setActiveDate((d) => offsetDate(d, 1))}
        onToday={() => setActiveDate(today)}
      />

      {/* error */}
      {error && !loading && (
        <div className='flex flex-col items-center gap-3 py-12 text-center'>
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

      {/* loading */}
      {loading && (
        <>
          {/* score skeleton */}
          <Card className='border border-border'>
            <CardContent className='flex flex-col items-center gap-3 pt-8 pb-8'>
              <Skeleton className='h-32 w-32 rounded-full' />
              <Skeleton className='h-6 w-20' />
              <Skeleton className='h-4 w-52' />
              <Skeleton className='h-4 w-44' />
            </CardContent>
          </Card>

          {/* category skeleton */}
          <Card className='border border-border'>
            <CardContent className='pt-5 pb-5 flex flex-col gap-4'>
              <Skeleton className='h-3 w-20' />
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className='flex flex-col gap-1.5'>
                  <div className='flex items-center gap-3'>
                    <Skeleton className='h-3 w-10 shrink-0' />
                    <Skeleton className='h-1.5 flex-1' />
                    <Skeleton className='h-3 w-7' />
                  </div>
                  <Skeleton className='h-3 w-3/4 ml-[52px]' />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* lucky skeleton */}
          <Card className='border border-border'>
            <CardContent className='pt-5 pb-5 flex flex-col gap-3'>
              <Skeleton className='h-3 w-16' />
              <div className='grid grid-cols-3 gap-3'>
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className='h-20 rounded-md' />
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* data */}
      {!loading && dailyFortune && (
        <>
          <OverallScoreCard fortune={dailyFortune} />
          <CategoryCard fortune={dailyFortune} />
          <LuckyCard fortune={dailyFortune} />
          <SpecialInfoCard fortune={dailyFortune} />
        </>
      )}
    </div>
  )
}
