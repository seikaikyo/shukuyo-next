'use client'

import { useState } from 'react'
import { useProfileStore } from '@/stores/profile'
import { useCompatibility } from '@/hooks/use-compatibility'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import type { CompatibilityResult } from '@/types/compatibility'

// ---- Helpers ----

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

function DateInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  return (
    <div className='flex flex-col gap-1'>
      <label className='text-xs text-muted-foreground'>{label}</label>
      <input
        type='date'
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          'h-9 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground',
          'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
          'transition-colors duration-200'
        )}
      />
    </div>
  )
}

function ResultCard({ result }: { result: CompatibilityResult }) {
  const { score, relation, person1, person2, summary, direction_analysis } = result
  const verdict = direction_analysis?.verdict

  return (
    <div className='flex flex-col gap-4'>
      {/* score */}
      <Card className={cn('border-2', scoreBorder(score))}>
        <CardContent className='pt-6 pb-6 flex flex-col items-center gap-3'>
          <div className='flex flex-col items-center gap-1'>
            <span className={cn('text-6xl font-bold tabular-nums leading-none', scoreColor(score))}>
              {score}
            </span>
            <span className='text-xs text-muted-foreground'>分</span>
          </div>
          <div className='flex flex-col items-center gap-1'>
            <p className='text-xl font-semibold text-foreground'>{relation.name}</p>
            <p className='text-sm text-muted-foreground'>{relation.name_jp}（{relation.reading}）</p>
          </div>
          {summary && (
            <p className='text-sm text-muted-foreground text-center max-w-sm leading-relaxed'>
              {summary}
            </p>
          )}
        </CardContent>
      </Card>

      {/* persons */}
      <Card className='border border-border'>
        <CardContent className='pt-5 pb-5 flex flex-col gap-3'>
          <p className='text-xs font-medium text-muted-foreground tracking-widest uppercase'>
            雙方宿
          </p>
          <div className='grid grid-cols-2 gap-4'>
            {[
              { label: '你', person: person1 },
              { label: '對方', person: person2 },
            ].map(({ label, person }) => (
              <div key={label} className='flex flex-col gap-1 px-3 py-3 rounded-md bg-muted/40'>
                <span className='text-xs text-muted-foreground'>{label}</span>
                <span className='text-base font-semibold text-foreground'>{person.mansion}</span>
                <span className='text-xs text-muted-foreground'>{person.reading}</span>
                <span className='text-xs text-muted-foreground'>{person.element}</span>
                {person.keywords?.length > 0 && (
                  <div className='flex flex-wrap gap-1 mt-0.5'>
                    {person.keywords.slice(0, 3).map((kw) => (
                      <span key={kw} className='text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary'>
                        {kw}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* relation detail */}
      <Card className='border border-border'>
        <CardContent className='pt-5 pb-5 flex flex-col gap-3'>
          <p className='text-xs font-medium text-muted-foreground tracking-widest uppercase'>
            關係解析
          </p>
          {relation.description && (
            <p className='text-sm text-muted-foreground leading-relaxed'>{relation.description}</p>
          )}
          {relation.advice && (
            <p className='text-sm text-muted-foreground leading-relaxed border-l-2 border-primary/40 pl-3'>
              {relation.advice}
            </p>
          )}
          {relation.tips && relation.tips.length > 0 && (
            <div className='flex flex-col gap-1'>
              <p className='text-xs font-medium text-muted-foreground'>建議</p>
              <ul className='flex flex-col gap-0.5'>
                {relation.tips.map((tip, i) => (
                  <li key={i} className='text-xs text-muted-foreground flex items-start gap-1.5'>
                    <span className='text-primary shrink-0 mt-0.5'>·</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {relation.good_for && relation.good_for.length > 0 && (
            <div className='flex flex-col gap-1'>
              <p className='text-xs font-medium text-muted-foreground'>適合</p>
              <div className='flex flex-wrap gap-1'>
                {relation.good_for.map((g) => (
                  <span key={g} className='text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'>
                    {g}
                  </span>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* verdict */}
      {verdict && (
        <Card className='border border-border'>
          <CardContent className='pt-5 pb-5 flex flex-col gap-2'>
            <p className='text-xs font-medium text-muted-foreground tracking-widest uppercase'>
              總體評斷
            </p>
            <p className='text-sm font-medium text-foreground'>{verdict.verdict}</p>
            {verdict.explanation && (
              <p className='text-xs text-muted-foreground leading-relaxed'>{verdict.explanation}</p>
            )}
            {verdict.bottom_line && (
              <p className='text-xs text-muted-foreground leading-relaxed border-l-2 border-primary/40 pl-3'>
                {verdict.bottom_line}
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// ---- Page ----

export default function CompatibilityPage() {
  const { birthDate } = useProfileStore()
  const { compatibility, loading, error, calculateCompatibility } = useCompatibility()

  const [date1, setDate1] = useState(birthDate || '')
  const [date2, setDate2] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (date1 && date2) calculateCompatibility(date1, date2)
  }

  return (
    <div className='mx-auto w-full max-w-2xl px-4 pb-12 flex flex-col gap-4'>
      <div className='py-4 flex flex-col gap-1'>
        <h2 className='text-base font-semibold text-foreground'>相性診斷</h2>
        <p className='text-xs text-muted-foreground'>
          輸入兩人出生日期，依宿曜道推算相性關係
        </p>
      </div>

      {/* input form */}
      <Card className='border border-border dark:border-primary/20'>
        <CardContent className='pt-5 pb-5'>
          <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
            <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
              <DateInput
                label='你的出生日期'
                value={date1}
                onChange={setDate1}
                placeholder='YYYY-MM-DD'
              />
              <DateInput
                label='對方的出生日期'
                value={date2}
                onChange={setDate2}
                placeholder='YYYY-MM-DD'
              />
            </div>
            <Button
              type='submit'
              disabled={!date1 || !date2 || loading}
              className='w-full'
            >
              {loading ? '計算中…' : '診斷相性'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* error */}
      {error && !loading && (
        <div className='flex flex-col items-center gap-3 py-8 text-center'>
          <p className='text-sm text-muted-foreground'>計算失敗：{error}</p>
          <Button
            variant='outline'
            size='sm'
            onClick={() => date1 && date2 && calculateCompatibility(date1, date2)}
          >
            重試
          </Button>
        </div>
      )}

      {/* loading */}
      {loading && (
        <>
          <Card className='border border-border'>
            <CardContent className='pt-6 pb-6 flex flex-col items-center gap-3'>
              <Skeleton className='h-20 w-20 rounded-full' />
              <Skeleton className='h-6 w-32' />
              <Skeleton className='h-4 w-24' />
              <Skeleton className='h-4 w-64' />
            </CardContent>
          </Card>
          <Card className='border border-border'>
            <CardContent className='pt-5 pb-5 flex flex-col gap-3'>
              <Skeleton className='h-3 w-16' />
              <div className='grid grid-cols-2 gap-4'>
                <Skeleton className='h-28 rounded-md' />
                <Skeleton className='h-28 rounded-md' />
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* result */}
      {!loading && compatibility && <ResultCard result={compatibility} />}

      {/* tip */}
      {!loading && !compatibility && !error && (
        <Card className='border border-border'>
          <CardContent className='pt-5 pb-5 text-center'>
            <p className='text-sm text-muted-foreground'>
              宿曜道將 27 個星宿分為六種關係：
            </p>
            <div className='flex flex-wrap justify-center gap-2 mt-3'>
              {['安危（知己）', '安壊（志向不同）', '義衰（義氣）', '友衰（友情）', '栄親（親密）', '栄害（競爭）'].map((rel) => (
                <span key={rel} className='text-xs px-2 py-1 rounded-full border border-border text-muted-foreground'>
                  {rel}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
