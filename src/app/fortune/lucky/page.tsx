'use client'

import { useState, useEffect, useCallback } from 'react'
import { useProfileStore } from '@/stores/profile'
import { useLuckyDays } from '@/hooks/use-lucky-days'
import { useTranslation } from '@/lib/i18n'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { levelColor } from '@/utils/fortune-helpers'
import Link from 'next/link'
import type { LuckyDayCategoryResult, LuckyDay } from '@/types/lucky-days'

function formatDay(dateStr: string, locale: string) {
  const d = new Date(dateStr + 'T00:00:00')
  const wd = d.toLocaleDateString(locale, { weekday: 'short' })
  return `${d.getMonth() + 1}/${d.getDate()}(${wd})`
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

function LuckyDayItem({ day, locale }: { day: LuckyDay; locale: string }) {
  return (
    <div className='flex flex-col gap-1 px-3 py-2 rounded-md bg-muted/40'>
      <div className='flex items-center gap-2'>
        <span className='text-xs text-muted-foreground min-w-24'>{formatDay(day.date, locale)}</span>
        <span className={cn('text-xs font-semibold', levelColor(day.level))}>
          {day.level}
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
            <span key={b} className='text-[10px] px-1.5 py-0.5 rounded bg-[var(--fortune-great)]/12 text-[var(--fortune-great)]'>
              {b}
            </span>
          ))}
          {day.conflicts?.map((c) => (
            <span key={c} className='text-[10px] px-1.5 py-0.5 rounded bg-[var(--fortune-caution)]/12 text-[var(--fortune-caution)]'>
              {c}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

function LuckyCategoryCard({ category, selected, t, locale }: { category: LuckyDayCategoryResult; selected: boolean; t: (key: string, params?: Record<string, string | number>) => string; locale: string }) {
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
                  <LuckyDayItem key={day.date} day={day} locale={locale} />
                ))}
              </div>
            ) : (
              <p className='text-xs text-muted-foreground py-2 text-center'>{t('fortune.luckyDays.noLuckyDays')}</p>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

// ---- Page ----

export default function FortuneLuckyPage() {
  const birthDate = useProfileStore((s) => s.birthDate)
  const { t, locale } = useTranslation()
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
          <p className='text-sm text-muted-foreground'>{t('startup.noBirthDate')}</p>
          <Link
            href='/'
            className='inline-flex h-7 items-center rounded-lg border border-border bg-background px-2.5 text-[0.8rem] font-medium text-foreground hover:bg-muted transition-colors duration-200'
          >
            {t('fortune.goSetup')}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className='mx-auto w-full max-w-2xl px-4 pb-12 flex flex-col gap-4'>
      <div className='py-4 flex flex-col gap-1'>
        <h2 className='text-base font-semibold text-foreground'>{t('fortune.luckyDaysTitle')}</h2>
        <p className='text-xs text-muted-foreground'>
          {t('fortune.luckyDaysDesc')}
        </p>
      </div>

      {error && !loading && (
        <div role='alert' className='flex flex-col items-center gap-3 py-12 text-center'>
          <p className='text-sm text-muted-foreground'>{t('error.fetchFailed')}</p>
          <Button variant='outline' size='sm' onClick={load}>{t('common.retry')}</Button>
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
                {t('fortune.yourMansion')}:{luckyDaySummary.your_mansion.name_jp}({luckyDaySummary.your_mansion.reading})
              </p>
              <CategoryFilter
                categories={luckyDaySummary.categories}
                selected={selected}
                onToggle={toggleCategory}
              />
            </CardContent>
          </Card>

          {luckyDaySummary.categories.map((cat) => (
            <LuckyCategoryCard
              key={cat.key}
              category={cat}
              selected={selected.includes(cat.key)}
              t={t}
              locale={locale}
            />
          ))}

          <Card className='border border-border'>
            <CardContent className='pt-4 pb-4 text-center'>
              <p className='text-xs text-muted-foreground leading-relaxed'>
                {t('fortune.luckyDays.sutraNote')}
              </p>
              <a
                href='https://cbetaonline.dila.edu.tw/zh/T21n1299'
                target='_blank'
                rel='noopener noreferrer'
                className='text-xs text-primary hover:underline mt-1 inline-block'
              >
                {t('fortune.luckyDays.sutraLink')}
              </a>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
