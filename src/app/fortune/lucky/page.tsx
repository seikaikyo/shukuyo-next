'use client'

import { useState, useEffect, useCallback } from 'react'
import { useProfileStore } from '@/stores/profile'
import { useLuckyDays } from '@/hooks/use-lucky-days'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import type { LuckyDayCategoryResult, LuckyDay } from '@/types/lucky-days'

// ---- Helpers ----

function scoreColor(score: number) {
  if (score >= 80) return 'text-[var(--fortune-great)]'
  if (score >= 60) return 'text-[var(--fortune-good)]'
  if (score >= 40) return 'text-[var(--fortune-neutral)]'
  if (score >= 20) return 'text-[var(--fortune-caution)]'
  return 'text-[var(--fortune-bad)]'
}

function formatDay(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00')
  const weekdays = ['日', '一', '二', '三', '四', '五', '六']
  return `${d.getMonth() + 1}/${d.getDate()}（${weekdays[d.getDay()]}）`
}

// ---- Sub-components ----

function CategoryFilter({
  categories,
  selected,
  onToggle,
}: {
  categories: LuckyDayCategoryResult[]
  selected: string[]
  onToggle: (key: string) => void
}) {
  return (
    <div className='flex gap-1.5 overflow-x-auto pb-1 scrollbar-none'>
      {categories.map((cat) => (
        <button
          key={cat.key}
          onClick={() => onToggle(cat.key)}
          className={cn(
            'px-3 py-1 rounded-full border text-xs whitespace-nowrap transition-colors duration-200',
            selected.includes(cat.key)
              ? 'bg-primary text-primary-foreground border-primary'
              : 'bg-background text-muted-foreground border-border hover:border-primary/50'
          )}
        >
          {cat.name}
        </button>
      ))}
    </div>
  )
}

function LuckyDayItem({ day }: { day: LuckyDay }) {
  return (
    <div className='flex flex-col gap-1 px-3 py-2 rounded-md bg-muted/40'>
      <div className='flex items-center gap-2'>
        <span className='text-xs text-muted-foreground min-w-24'>{formatDay(day.date)}</span>
        <span className={cn('text-xs font-semibold tabular-nums', scoreColor(day.score))}>
          {day.score}
        </span>
        {day.rating && (
          <span className='text-xs text-muted-foreground'>{day.rating}</span>
        )}
      </div>
      {day.reason && (
        <p className='text-xs text-muted-foreground leading-relaxed'>{day.reason}</p>
      )}
      {(day.boosts?.length || day.conflicts?.length) && (
        <div className='flex flex-wrap gap-1 mt-0.5'>
          {day.boosts?.map((b) => (
            <span key={b} className='text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'>
              {b}
            </span>
          ))}
          {day.conflicts?.map((c) => (
            <span key={c} className='text-[10px] px-1.5 py-0.5 rounded bg-orange-500/10 text-orange-600 dark:text-orange-400'>
              {c}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

function CategoryCard({ category, selected }: { category: LuckyDayCategoryResult; selected: boolean }) {
  if (!selected) return null

  return (
    <Card className='border border-border'>
      <CardContent className='pt-5 pb-5 flex flex-col gap-4'>
        <p className='text-sm font-medium text-foreground'>{category.name}</p>
        {category.actions.map((action) => (
          <div key={action.key} className='flex flex-col gap-2'>
            <p className='text-xs font-medium text-muted-foreground border-b border-border pb-1'>
              {action.name}
            </p>
            {action.lucky_days.length > 0 ? (
              <div className='flex flex-col gap-1.5'>
                {action.lucky_days.map((day) => (
                  <LuckyDayItem key={day.date} day={day} />
                ))}
              </div>
            ) : (
              <p className='text-xs text-muted-foreground py-2 text-center'>本期無吉日</p>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

// ---- Page ----

export default function FortuneLuckyPage() {
  const { birthDate } = useProfileStore()
  const { luckyDaySummary, loading, error, fetchLuckyDaySummary } = useLuckyDays()
  const [selected, setSelected] = useState<string[]>([])

  const load = useCallback(() => {
    if (birthDate) fetchLuckyDaySummary(birthDate)
  }, [birthDate, fetchLuckyDaySummary])

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    if (luckyDaySummary && selected.length === 0) {
      setSelected(luckyDaySummary.categories.map(c => c.key))
    }
  }, [luckyDaySummary, selected.length])

  function toggleCategory(key: string) {
    setSelected(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    )
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
        <h2 className='text-base font-semibold text-foreground'>個人吉日</h2>
        <p className='text-xs text-muted-foreground'>
          依據宿曜道曆法推算，適合各類重要行事的吉日
        </p>
      </div>

      {error && !loading && (
        <div className='flex flex-col items-center gap-3 py-12 text-center'>
          <p className='text-sm text-muted-foreground'>資料載入失敗，請稍後重試</p>
          <Button variant='outline' size='sm' onClick={load}>重試</Button>
        </div>
      )}

      {loading && (
        <>
          <div className='flex gap-1.5 overflow-x-auto'>
            {[1, 2, 3, 4].map(i => (
              <Skeleton key={i} className='h-7 w-20 rounded-full shrink-0' />
            ))}
          </div>
          {[1, 2].map(i => (
            <Card key={i} className='border border-border'>
              <CardContent className='pt-5 pb-5 flex flex-col gap-4'>
                <Skeleton className='h-4 w-24' />
                {[1, 2].map(j => (
                  <div key={j} className='flex flex-col gap-2'>
                    <Skeleton className='h-3 w-20' />
                    {[1, 2, 3].map(k => (
                      <Skeleton key={k} className='h-14 rounded-md' />
                    ))}
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </>
      )}

      {!loading && luckyDaySummary && (
        <>
          <Card className='border border-border dark:border-primary/20'>
            <CardContent className='pt-4 pb-4'>
              <p className='text-xs text-muted-foreground mb-3'>
                本命宿：{luckyDaySummary.your_mansion.name_jp}（{luckyDaySummary.your_mansion.reading}）
              </p>
              <CategoryFilter
                categories={luckyDaySummary.categories}
                selected={selected}
                onToggle={toggleCategory}
              />
            </CardContent>
          </Card>

          {luckyDaySummary.categories.map((cat) => (
            <CategoryCard
              key={cat.key}
              category={cat}
              selected={selected.includes(cat.key)}
            />
          ))}

          <Card className='border border-border'>
            <CardContent className='pt-4 pb-4 text-center'>
              <p className='text-xs text-muted-foreground leading-relaxed'>
                依據《文殊師利菩薩及諸仙所說吉凶時日善惡宿曜經》推算
              </p>
              <a
                href='https://cbetaonline.dila.edu.tw/zh/T21n1299'
                target='_blank'
                rel='noopener noreferrer'
                className='text-xs text-primary hover:underline mt-1 inline-block'
              >
                查閱原典
              </a>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
