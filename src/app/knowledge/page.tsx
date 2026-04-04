'use client'

import { useState, useEffect } from 'react'
import { useProfileStore } from '@/stores/profile'
import { useTranslation } from '@/lib/i18n'
import { useKnowledge } from '@/hooks/use-knowledge'
import { useMansion } from '@/hooks/use-mansion'
import { getYoseiFullName } from '@/utils/yosei'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { Breadcrumb } from '@/components/shared/breadcrumb'
import { FortuneBadge } from '@/components/shared/fortune-badge'
import { cn } from '@/lib/utils'
import type { Mansion } from '@/types/mansion'

const YOSEI_COLORS: Record<string, string> = {
  fire: 'text-red-600 dark:text-red-400',
  water: 'text-blue-600 dark:text-sky-400',
  wood: 'text-green-600 dark:text-green-400',
  metal: 'text-yellow-600 dark:text-yellow-300',
  earth: 'text-stone-500 dark:text-stone-400',
  sun: 'text-orange-600 dark:text-orange-400',
  moon: 'text-violet-600 dark:text-violet-400',
}

function KnowledgeContent() {
  const { t, locale } = useTranslation()
  const birthDate = useProfileStore((s) => s.birthDate)
  const { mansions, relations, loading, loadAll } = useKnowledge()
  const { myMansion, fetchMyMansion } = useMansion()
  const [tab, setTab] = useState<'mansions' | 'relations' | 'history'>('mansions')
  const [selectedMansion, setSelectedMansion] = useState<Mansion | null>(null)

  useEffect(() => {
    loadAll()
    if (birthDate) fetchMyMansion()
  }, [loadAll, birthDate, fetchMyMansion])

  if (loading && mansions.length === 0) return <Skeleton className='h-60 w-full rounded-xl' />

  return (
    <div className='space-y-3'>
      <Breadcrumb items={[
        { label: t('nav.home'), href: '/' },
        { label: t('nav.knowledge') },
      ]} />

      {/* Tabs */}
      <div className='flex gap-0.5 rounded-lg border border-border bg-muted p-[3px]'>
        {(['mansions', 'relations', 'history'] as const).map((t2) => (
          <button
            key={t2}
            className={cn(
              'flex-1 rounded-md px-3 py-[7px] text-xs transition-all',
              tab === t2 ? 'bg-card font-semibold text-foreground shadow-sm' : 'text-muted-foreground'
            )}
            onClick={() => setTab(t2)}
          >
            {t(`knowledge.tab${t2.charAt(0).toUpperCase() + t2.slice(1)}`)}
          </button>
        ))}
      </div>

      {tab === 'mansions' && (
        <>
          <div className='grid grid-cols-3 gap-2'>
            {mansions.map((m) => {
              const isMyMansion = myMansion && m.index === myMansion.index
              return (
                <Card
                  key={m.index}
                  className={cn(
                    'relative cursor-pointer transition-colors hover:bg-card/80',
                    isMyMansion && 'ring-1 ring-primary'
                  )}
                  onClick={() => setSelectedMansion(m)}
                >
                  <CardContent className='p-3'>
                    <div className='mb-1 flex items-center gap-1.5'>
                      <span className={cn('text-xs font-semibold', YOSEI_COLORS[m.yosei] || '')}>
                        {getYoseiFullName(m.yosei, locale).slice(0, 1)}
                      </span>
                      <span className='text-xs text-muted-foreground'>#{m.index}</span>
                    </div>
                    <div className='font-serif text-sm font-bold'>{m.name_jp}</div>
                    <div className='text-xs text-muted-foreground'>{m.reading}</div>
                    {isMyMansion && (
                      <FortuneBadge label={t('knowledge.yourMansion')} className='absolute top-2 right-2 text-[9px]' />
                    )}
                    {m.keywords && m.keywords.length > 0 && (
                      <div className='mt-1.5 flex flex-wrap gap-1'>
                        {m.keywords.slice(0, 2).map((kw) => (
                          <span key={kw} className='rounded bg-muted px-1.5 py-0.5 text-[10px]'>{kw}</span>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Detail modal inline */}
          {selectedMansion && (
            <Card className='ring-1 ring-primary'>
              <CardContent className='py-4'>
                <div className='flex items-center justify-between'>
                  <h3 className='font-serif text-base font-semibold'>{selectedMansion.name_jp} {t('knowledge.detail')}</h3>
                  <button className='text-xs text-muted-foreground' aria-label='Close' onClick={() => setSelectedMansion(null)}>x</button>
                </div>
                <Separator className='my-2' />
                <div className='grid grid-cols-2 gap-2 text-sm'>
                  <div><span className='text-muted-foreground'>{t('knowledge.yosei')}: </span>{getYoseiFullName(selectedMansion.yosei, locale)}</div>
                  <div><span className='text-muted-foreground'>{t('knowledge.index')}: </span>{t('mansion.index', { index: String(selectedMansion.index) })}</div>
                </div>
                <Separator className='my-2' />
                <div className='text-sm'>
                  <span className='text-muted-foreground'>{t('knowledge.personality')}: </span>
                  {selectedMansion.personality}
                </div>
                {selectedMansion.keywords && (
                  <div className='mt-2 text-sm'>
                    <span className='text-muted-foreground'>{t('knowledge.keywords')}: </span>
                    {selectedMansion.keywords.join(' · ')}
                  </div>
                )}
                {selectedMansion.day_fortune && (
                  <>
                    <Separator className='my-2' />
                    <div className='text-sm'>
                      <span className='text-muted-foreground'>{t('fortune.suitable')}: </span>
                      {selectedMansion.day_fortune.auspicious.join('、')}
                    </div>
                    <div className='text-sm'>
                      <span className='text-muted-foreground'>{t('fortune.unsuitable')}: </span>
                      {selectedMansion.day_fortune.inauspicious.join('、')}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )}
        </>
      )}

      {tab === 'relations' && (
        <div className='flex flex-col gap-2'>
          {relations.map((r) => (
            <Card key={r.type} className='cursor-pointer'>
              <CardContent className='py-3'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <span className='font-serif text-sm font-bold'>{r.name}（{r.reading}）</span>
                    <FortuneBadge label={r.level || ''} level={r.level || ''} />
                  </div>
                </div>
                <p className='mt-2 text-sm text-muted-foreground'>{r.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {tab === 'history' && (
        <Card>
          <CardContent className='py-6'>
            <h3 className='font-serif text-base font-semibold'>{t('knowledge.historyTitle')}</h3>
            <p className='mt-2 text-sm text-muted-foreground'>
              {t('knowledge.historyContent')}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default function KnowledgePage() {
  return <KnowledgeContent />
}
