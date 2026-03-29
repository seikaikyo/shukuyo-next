'use client'

import { useState, useEffect, useCallback } from 'react'
import { useProfileStore } from '@/stores/profile'
import { useKnowledge } from '@/hooks/use-knowledge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import type { Mansion } from '@/types/mansion'
import type { RelationType } from '@/types/compatibility'

// ---- Helpers ----

const ELEMENT_COLORS: Record<string, string> = {
  '木': 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
  '火': 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30',
  '土': 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
  '金': 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/30',
  '水': 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/30',
}

function elementClass(element: string) {
  return ELEMENT_COLORS[element] || 'bg-muted/50 text-muted-foreground border-border'
}

const RELATION_COLORS: Record<string, string> = {
  mei: 'text-emerald-500',
  gyotai: 'text-amber-500',
  eishin: 'text-sky-500',
  yusui: 'text-violet-500',
  ankai: 'text-rose-500',
  kisei: 'text-orange-500',
}

function relationColorByType(type: string) {
  return RELATION_COLORS[type] || 'text-muted-foreground'
}

// ---- Sub-components ----

type KnowledgeTab = 'mansions' | 'relations' | 'history'

function TabNav({
  active,
  onChange,
}: {
  active: KnowledgeTab
  onChange: (t: KnowledgeTab) => void
}) {
  const tabs: { key: KnowledgeTab; label: string }[] = [
    { key: 'mansions', label: '二十七宿' },
    { key: 'relations', label: '六種關係' },
    { key: 'history', label: '典故' },
  ]

  return (
    <div className='flex border-b border-border'>
      {tabs.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          role='tab'
          aria-selected={active === key}
          className={cn(
            'px-4 py-2.5 text-sm font-medium border-b-2 transition-colors duration-200 -mb-px',
            active === key
              ? 'text-primary border-primary'
              : 'text-muted-foreground border-transparent hover:text-foreground'
          )}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

function MansionCard({
  mansion,
  isYours,
  onClick,
}: {
  mansion: Mansion
  isYours: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex flex-col gap-2 p-3 rounded-lg border text-left transition-all duration-200',
        'hover:border-primary/50 hover:shadow-sm',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
        isYours ? 'border-primary bg-primary/5' : 'border-border bg-card'
      )}
    >
      <div className='flex items-center justify-between'>
        <span className={cn(
          'text-[10px] px-1.5 py-0.5 rounded border',
          elementClass(mansion.element)
        )}>
          {mansion.element}
        </span>
        <span className='text-[10px] text-muted-foreground tabular-nums'>#{mansion.index}</span>
      </div>
      <div className='flex flex-col gap-0.5'>
        <span className='text-base font-semibold text-foreground'>{mansion.name_jp}</span>
        <span className='text-xs text-muted-foreground'>{mansion.reading}</span>
      </div>
      {isYours && (
        <span className='text-[10px] text-primary font-medium'>本命宿</span>
      )}
      {mansion.keywords?.length > 0 && (
        <div className='flex flex-wrap gap-1'>
          {mansion.keywords.slice(0, 2).map((kw) => (
            <span key={kw} className='text-[10px] text-muted-foreground'>{kw}</span>
          ))}
        </div>
      )}
    </button>
  )
}

function MansionDetailPanel({
  mansion,
  onClose,
}: {
  mansion: Mansion
  onClose: () => void
}) {
  return (
    <div className='fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4'>
      <div
        className='absolute inset-0 bg-background/80 backdrop-blur-sm'
        onClick={onClose}
      />
      <Card className='relative z-10 w-full max-w-md max-h-[80vh] overflow-y-auto border border-border dark:border-primary/30'>
        <CardContent className='pt-5 pb-5 flex flex-col gap-4'>
          <div className='flex items-start justify-between gap-2'>
            <div className='flex flex-col gap-1'>
              <div className='flex items-center gap-2'>
                <h3 className='text-xl font-bold text-foreground'>{mansion.name_jp}</h3>
                <span className={cn(
                  'text-xs px-1.5 py-0.5 rounded border',
                  elementClass(mansion.element)
                )}>
                  {mansion.element}
                </span>
              </div>
              <p className='text-sm text-muted-foreground'>{mansion.reading}</p>
            </div>
            <button
              onClick={onClose}
              className='text-muted-foreground hover:text-foreground text-xl leading-none'
              aria-label='關閉'
            >
              ×
            </button>
          </div>

          {mansion.personality && (
            <div className='flex flex-col gap-1'>
              <p className='text-xs font-medium text-muted-foreground'>性格特質</p>
              <p className='text-sm text-muted-foreground leading-relaxed'>{mansion.personality}</p>
            </div>
          )}

          {mansion.keywords?.length > 0 && (
            <div className='flex flex-wrap gap-1.5'>
              {mansion.keywords.map((kw) => (
                <span key={kw} className='text-xs px-2 py-0.5 rounded-full border border-primary/30 text-foreground'>
                  {kw}
                </span>
              ))}
            </div>
          )}

          {mansion.career && (
            <div className='flex flex-col gap-1'>
              <p className='text-xs font-medium text-muted-foreground'>事業</p>
              <p className='text-sm text-muted-foreground leading-relaxed'>{mansion.career}</p>
            </div>
          )}

          {mansion.love && (
            <div className='flex flex-col gap-1'>
              <p className='text-xs font-medium text-muted-foreground'>感情</p>
              <p className='text-sm text-muted-foreground leading-relaxed'>{mansion.love}</p>
            </div>
          )}

          {mansion.health && (
            <div className='flex flex-col gap-1'>
              <p className='text-xs font-medium text-muted-foreground'>健康</p>
              <p className='text-sm text-muted-foreground leading-relaxed'>{mansion.health}</p>
            </div>
          )}

          {mansion.day_fortune && (
            <div className='flex flex-col gap-2'>
              <p className='text-xs font-medium text-muted-foreground'>日宿吉凶</p>
              {mansion.day_fortune.summary && (
                <p className='text-sm text-muted-foreground leading-relaxed'>{mansion.day_fortune.summary}</p>
              )}
              {mansion.day_fortune.auspicious?.length > 0 && (
                <div className='flex flex-col gap-0.5'>
                  <p className='text-xs text-emerald-500'>宜</p>
                  <div className='flex flex-wrap gap-1'>
                    {mansion.day_fortune.auspicious.map((a) => (
                      <span key={a} className='text-xs px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'>{a}</span>
                    ))}
                  </div>
                </div>
              )}
              {mansion.day_fortune.inauspicious?.length > 0 && (
                <div className='flex flex-col gap-0.5'>
                  <p className='text-xs text-orange-400'>忌</p>
                  <div className='flex flex-wrap gap-1'>
                    {mansion.day_fortune.inauspicious.map((a) => (
                      <span key={a} className='text-xs px-1.5 py-0.5 rounded bg-orange-500/10 text-orange-600 dark:text-orange-400'>{a}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function RelationCard({ relation }: { relation: RelationType }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <Card className='border border-border'>
      <CardContent className='pt-5 pb-5 flex flex-col gap-3'>
        <div className='flex items-center justify-between gap-2'>
          <div className='flex items-center gap-2'>
            <h3 className={cn('text-base font-semibold', relationColorByType(relation.type))}>
              {relation.name}
            </h3>
            <span className='text-sm text-muted-foreground'>{relation.name_jp}（{relation.reading}）</span>
          </div>
          <span className={cn('text-sm font-semibold tabular-nums', relationColorByType(relation.type))}>
            {relation.score}分
          </span>
        </div>
        {relation.description && (
          <p className='text-sm text-muted-foreground leading-relaxed'>{relation.description}</p>
        )}
        {expanded && (
          <>
            {relation.detailed && (
              <p className='text-sm text-muted-foreground leading-relaxed'>{relation.detailed}</p>
            )}
            {relation.advice && (
              <p className='text-sm text-muted-foreground border-l-2 border-primary/40 pl-3 leading-relaxed'>
                {relation.advice}
              </p>
            )}
            {relation.good_for?.length > 0 && (
              <div className='flex flex-wrap gap-1'>
                {relation.good_for.map((g) => (
                  <span key={g} className='text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'>
                    {g}
                  </span>
                ))}
              </div>
            )}
          </>
        )}
        <button
          onClick={() => setExpanded(v => !v)}
          className='text-xs text-primary hover:underline self-start'
        >
          {expanded ? '收起' : '詳細說明'}
        </button>
      </CardContent>
    </Card>
  )
}

function HistoryTab({
  metadata,
}: {
  metadata: NonNullable<ReturnType<typeof useKnowledge>['metadata']>
}) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set())

  function toggle(key: string) {
    setExpanded(prev => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  return (
    <div className='flex flex-col gap-4'>
      <Card className='border border-border'>
        <CardContent className='pt-5 pb-5 flex flex-col gap-3'>
          <div className='flex items-baseline gap-2'>
            <h3 className='text-lg font-bold text-foreground'>{metadata.name}</h3>
            <span className='text-sm text-muted-foreground'>（{metadata.reading}）</span>
          </div>
          <div className='grid grid-cols-2 gap-2 text-sm'>
            {metadata.origin && (
              <div className='flex flex-col gap-0.5'>
                <span className='text-xs text-muted-foreground'>起源</span>
                <span className='text-foreground'>{metadata.origin}</span>
              </div>
            )}
            {metadata.founder && (
              <div className='flex flex-col gap-0.5'>
                <span className='text-xs text-muted-foreground'>創始者</span>
                <span className='text-foreground'>{metadata.founder}</span>
              </div>
            )}
            {metadata.scripture && (
              <div className='flex flex-col gap-0.5'>
                <span className='text-xs text-muted-foreground'>典籍</span>
                <span className='text-foreground'>{metadata.scripture}</span>
              </div>
            )}
            {metadata.method && (
              <div className='flex flex-col gap-0.5'>
                <span className='text-xs text-muted-foreground'>方法</span>
                <span className='text-foreground'>{metadata.method}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {metadata.history?.map((entry) => (
        <Card key={entry.title} className='border border-border'>
          <CardContent className='pt-5 pb-5 flex flex-col gap-2'>
            <h4 className='text-sm font-semibold text-foreground'>{entry.title}</h4>
            <p className={cn(
              'text-sm text-muted-foreground leading-relaxed',
              !expanded.has(`h-${entry.title}`) && 'line-clamp-3'
            )}>
              {entry.content}
            </p>
            <button
              onClick={() => toggle(`h-${entry.title}`)}
              className='text-xs text-primary hover:underline self-start'
            >
              {expanded.has(`h-${entry.title}`) ? '收起' : '詳細說明'}
            </button>
          </CardContent>
        </Card>
      ))}

      {metadata.key_concepts?.map((concept) => (
        <Card key={concept.title} className='border border-border'>
          <CardContent className='pt-5 pb-5 flex flex-col gap-2'>
            <h4 className='text-sm font-semibold text-foreground'>{concept.title}</h4>
            <p className={cn(
              'text-sm text-muted-foreground leading-relaxed',
              !expanded.has(`c-${concept.title}`) && 'line-clamp-3'
            )}>
              {concept.content}
            </p>
            <button
              onClick={() => toggle(`c-${concept.title}`)}
              className='text-xs text-primary hover:underline self-start'
            >
              {expanded.has(`c-${concept.title}`) ? '收起' : '詳細說明'}
            </button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// ---- Page ----

export default function KnowledgePage() {
  const { birthDate } = useProfileStore()
  const { mansions, relations, metadata, loading, error, loadAll } = useKnowledge()
  const [tab, setTab] = useState<KnowledgeTab>('mansions')
  const [selectedMansion, setSelectedMansion] = useState<Mansion | null>(null)

  const load = useCallback(() => {
    loadAll()
  }, [loadAll])

  useEffect(() => {
    load()
  }, [load])

  // find user's mansion from birthDate via API response
  const [yourMansionIndex, setYourMansionIndex] = useState<number | null>(null)
  useEffect(() => {
    // We don't have the user's mansion index from the store; show it from the first API call
    // The mansion index would come from a separate API call — for now just mark none
    setYourMansionIndex(null)
  }, [birthDate])

  return (
    <div className='mx-auto w-full max-w-2xl px-4 pb-12 flex flex-col gap-4'>
      <div className='py-4 flex flex-col gap-1'>
        <h2 className='text-base font-semibold text-foreground'>宿曜知識庫</h2>
        <p className='text-xs text-muted-foreground'>
          宿曜道的二十七宿、六種相性關係與歷史典故
        </p>
      </div>

      <TabNav active={tab} onChange={(t) => setTab(t)} />

      {error && !loading && (
        <div className='flex flex-col items-center gap-3 py-12 text-center'>
          <p className='text-sm text-muted-foreground'>資料載入失敗，請稍後重試</p>
          <Button variant='outline' size='sm' onClick={load}>重試</Button>
        </div>
      )}

      {loading && (
        <div className='grid grid-cols-2 gap-3 sm:grid-cols-3'>
          {Array.from({ length: 9 }).map((_, i) => (
            <Skeleton key={i} className='h-28 rounded-lg' />
          ))}
        </div>
      )}

      {!loading && tab === 'mansions' && mansions.length > 0 && (
        <div className='grid grid-cols-2 gap-2.5 sm:grid-cols-3'>
          {mansions.map((m) => (
            <MansionCard
              key={m.index}
              mansion={m}
              isYours={m.index === yourMansionIndex}
              onClick={() => setSelectedMansion(m)}
            />
          ))}
        </div>
      )}

      {!loading && tab === 'relations' && relations.length > 0 && (
        <div className='flex flex-col gap-3'>
          {relations.map((rel) => (
            <RelationCard key={rel.type} relation={rel} />
          ))}
        </div>
      )}

      {!loading && tab === 'history' && metadata && (
        <HistoryTab metadata={metadata} />
      )}

      {!loading && tab === 'history' && !metadata && (
        <p className='text-sm text-muted-foreground text-center py-12'>暫無資料</p>
      )}

      {selectedMansion && (
        <MansionDetailPanel
          mansion={selectedMansion}
          onClose={() => setSelectedMansion(null)}
        />
      )}
    </div>
  )
}
