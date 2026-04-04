'use client'

import { useState, useEffect, useCallback } from 'react'
import { useProfileStore, useProfileHydrated } from '@/stores/profile'
import { useTranslation } from '@/lib/i18n'
import { useLuckyDays } from '@/hooks/use-lucky-days'
import { useMansion } from '@/hooks/use-mansion'
import { getYoseiFullName } from '@/utils/yosei'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Breadcrumb } from '@/components/shared/breadcrumb'
import { FortuneBadge } from '@/components/shared/fortune-badge'
import { MansionTag } from '@/components/shared/mansion-tag'
import { cn } from '@/lib/utils'

function LuckyContent() {
  const { t, locale } = useTranslation()
  const birthDate = useProfileStore((s) => s.birthDate)!
  const { luckyDaySummary, loading, error, fetchLuckyDaySummary } = useLuckyDays()
  const { myMansion, fetchMyMansion } = useMansion()
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  useEffect(() => {
    fetchLuckyDaySummary(birthDate, locale)
    fetchMyMansion()
  }, [birthDate, locale, fetchLuckyDaySummary, fetchMyMansion])

  if (loading || !luckyDaySummary) return <Skeleton className='h-60 w-full rounded-xl' />

  if (error) {
    return (
      <Card>
        <CardContent className='py-8 text-center'>
          <p className='text-sm text-destructive'>{t('error.fetchFailed')}</p>
          <Button variant='outline' size='sm' className='mt-3' onClick={() => fetchLuckyDaySummary(birthDate, locale)}>
            {t('common.retry')}
          </Button>
        </CardContent>
      </Card>
    )
  }

  const categories = luckyDaySummary.categories || []
  const filtered = activeCategory
    ? categories.filter((c) => c.key === activeCategory)
    : categories

  return (
    <div className='space-y-3'>
      <Breadcrumb items={[
        { label: t('nav.home'), href: '/' },
        { label: t('nav.fortune'), href: '/fortune/daily' },
        { label: t('fortune.lucky') },
      ]} />

      <h1 className='font-serif text-[22px] font-bold'>{t('fortune.luckyTitle')}</h1>
      <p className='text-sm text-muted-foreground'>{t('fortune.luckyDesc')}</p>

      {myMansion && (
        <Card>
          <CardContent className='flex items-center gap-3 py-3'>
            <MansionTag
              yosei={myMansion.yosei}
              yoseiLabel={getYoseiFullName(myMansion.yosei, locale)}
              name={myMansion.name_jp}
            />
            <span className='text-sm text-muted-foreground'>{myMansion.reading}</span>
          </CardContent>
        </Card>
      )}

      {/* Category filter */}
      <Card>
        <CardContent className='py-3'>
          <h3 className='text-sm font-semibold'>{t('fortune.filterCategory')}</h3>
          <div className='mt-2 flex flex-wrap gap-2'>
            <Button
              size='sm'
              variant={!activeCategory ? 'default' : 'outline'}
              className='text-xs'
              onClick={() => setActiveCategory(null)}
            >
              {t('common.all')}
            </Button>
            {categories.map((c) => (
              <Button
                key={c.key}
                size='sm'
                variant={activeCategory === c.key ? 'default' : 'outline'}
                className='text-xs'
                onClick={() => setActiveCategory(c.key)}
              >
                {c.name}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {filtered.map((cat) => (
        <div key={cat.key}>
          {cat.actions.map((action) => (
            <Card key={action.key} className='mb-3'>
              <CardContent className='py-4'>
                <h3 className='text-sm font-semibold'>
                  {cat.name} — {action.name}
                </h3>
                <div className='mt-2 flex flex-col gap-2.5'>
                  {(action.lucky_days || []).map((day) => (
                    <div
                      key={day.date}
                      className='rounded-lg bg-muted p-3'
                    >
                      <div className='flex items-center justify-between'>
                        <span className='text-sm font-semibold'>
                          {day.date.slice(5)} ({day.weekday})
                        </span>
                        <FortuneBadge label={day.rating || ''} level={day.level} />
                      </div>
                      <p className='mt-1 text-xs text-muted-foreground'>{day.reason}</p>
                      {(day.boosts?.length || day.conflicts?.length) ? (
                        <div className='mt-2 flex flex-wrap gap-1.5'>
                          {day.boosts?.map((b, i) => (
                            <FortuneBadge key={`b-${i}`} label={b} level='great_fortune' />
                          ))}
                          {day.conflicts?.map((c, i) => (
                            <FortuneBadge key={`c-${i}`} label={c} level='small_misfortune' />
                          ))}
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ))}
    </div>
  )
}

export default function LuckyPage() {
  const { t } = useTranslation()
  const hydrated = useProfileHydrated()
  const birthDate = useProfileStore((s) => s.birthDate)
  if (!hydrated) return <Skeleton className='h-60 w-full rounded-xl' />
  if (!birthDate) return <p className='py-12 text-center text-sm text-muted-foreground'>{t('setup.welcomeDesc')}</p>
  return <LuckyContent />
}
