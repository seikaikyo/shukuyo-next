'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import type { CompatibilityResult } from '@/types/compatibility'

// ---- スコアカラー helpers ----

function scoreColor(score: number) {
  if (score >= 80) return 'text-[var(--fortune-great)]'
  if (score >= 60) return 'text-[var(--fortune-good)]'
  if (score >= 40) return 'text-[var(--fortune-neutral)]'
  if (score >= 20) return 'text-[var(--fortune-caution)]'
  return 'text-[var(--fortune-bad)]'
}

function scoreBorderLeft(score: number) {
  if (score >= 80) return 'border-l-[var(--fortune-great)]'
  if (score >= 60) return 'border-l-[var(--fortune-good)]'
  if (score >= 40) return 'border-l-[var(--fortune-neutral)]'
  if (score >= 20) return 'border-l-[var(--fortune-caution)]'
  return 'border-l-[var(--fortune-bad)]'
}

function verdictBg(severity: string) {
  if (severity === 'good') return 'bg-emerald-50 dark:bg-emerald-950/30 border-l-emerald-500'
  if (severity === 'caution') return 'bg-amber-50 dark:bg-amber-950/30 border-l-amber-500'
  if (severity === 'warning') return 'bg-red-50 dark:bg-red-950/30 border-l-red-500'
  return 'bg-muted/30 border-l-border'
}

function verdictTitleColor(severity: string) {
  if (severity === 'good') return 'text-emerald-700 dark:text-emerald-400'
  if (severity === 'caution') return 'text-amber-700 dark:text-amber-400'
  if (severity === 'warning') return 'text-red-700 dark:text-red-400'
  return 'text-foreground'
}

// ---- コンポーネント ----

interface PairResultProps {
  result: CompatibilityResult
  partnerRelation?: string
}

export function PairResult({ result }: PairResultProps) {
  const { score, relation, person1, person2, calculation } = result
  const ds = result.directional_scores
  const da = result.direction_analysis
  const pg = result.practical_guidance
  const verdict = da?.verdict
  const initiative = relation.initiative
  const hasDirectional = ds && ds.person1_to_person2.score !== ds.person2_to_person1.score

  const [showDetail, setShowDetail] = useState(false)
  const [showClassical, setShowClassical] = useState(false)
  const [showRoles, setShowRoles] = useState(false)

  return (
    <div className='flex flex-col gap-4'>

      {/* 雙人宿 */}
      <Card>
        <CardContent className='pt-5 pb-5'>
          <div className='flex items-center justify-between gap-4'>
            <div className='flex flex-col items-center gap-1 flex-1'>
              <span className='text-lg font-bold text-foreground'>{person1.mansion}</span>
              <span className='text-xs text-muted-foreground'>({person1.reading})</span>
              <span className='text-xs px-2 py-0.5 rounded bg-primary/10 text-primary'>{person1.element}</span>
            </div>
            <div className='flex flex-col items-center gap-1'>
              {hasDirectional ? (
                <span className='text-base font-semibold text-primary'>{relation.name}</span>
              ) : (
                <>
                  <span className={cn('text-4xl font-bold tabular-nums', scoreColor(score))}>{score}</span>
                  <span className='text-xs text-muted-foreground'>{relation.name}</span>
                </>
              )}
            </div>
            <div className='flex flex-col items-center gap-1 flex-1'>
              <span className='text-lg font-bold text-foreground'>{person2.mansion}</span>
              <span className='text-xs text-muted-foreground'>({person2.reading})</span>
              <span className='text-xs px-2 py-0.5 rounded bg-primary/10 text-primary'>{person2.element}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 雙向スコア */}
      {ds && (
        <Card>
          <CardContent className='pt-4 pb-4 flex flex-col gap-2'>
            <p className='text-xs font-medium text-muted-foreground uppercase tracking-widest mb-1'>雙向影響力</p>
            {[
              { label: `${person1.mansion} → ${person2.mansion}`, dir: ds.person1_to_person2 },
              { label: `${person2.mansion} → ${person1.mansion}`, dir: ds.person2_to_person1 },
            ].map(({ label, dir }) => (
              <div key={label} className='flex items-center gap-2 text-sm'>
                <span className='flex-1 text-foreground font-medium'>{label}</span>
                <span className='text-xs text-muted-foreground'>({dir.direction}宿)</span>
                <span className={cn('text-base font-bold tabular-nums', scoreColor(dir.score))}>
                  {dir.score}
                </span>
                {dir.ryouhan_active && dir.ryouhan_adjusted_score !== null && (
                  <span className='text-xs text-muted-foreground line-through'>→ {dir.ryouhan_adjusted_score}</span>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* 関係タイプ */}
      <Card className={cn('border-l-4', scoreBorderLeft(score))}>
        <CardContent className='pt-5 pb-5 flex flex-col gap-2'>
          <div className='flex items-baseline gap-2 flex-wrap'>
            <h3 className='text-base font-semibold text-foreground'>{relation.name}</h3>
            <span className='text-xs text-muted-foreground'>{relation.name_jp}（{relation.reading}）</span>
            {relation.distance_type_name && (
              <span className='text-xs text-muted-foreground'>· {relation.distance_type_name}</span>
            )}
          </div>
          <p className='text-sm text-muted-foreground leading-relaxed'>{relation.description}</p>
          {relation.detailed && (
            <>
              <button
                type='button'
                onClick={() => setShowDetail(!showDetail)}
                className='text-xs text-primary text-left hover:underline flex items-center gap-0.5'
              >
                {showDetail ? '收起' : '詳細說明'}
                {showDetail ? <ChevronUp className='h-3 w-3' /> : <ChevronDown className='h-3 w-3' />}
              </button>
              {showDetail && (
                <p className='text-sm text-muted-foreground leading-relaxed'>{relation.detailed}</p>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* verdict */}
      {verdict && (
        <div className={cn('rounded-lg border-l-4 px-4 py-3 flex flex-col gap-1.5', verdictBg(verdict.severity))}>
          <p className={cn('text-sm font-semibold', verdictTitleColor(verdict.severity))}>
            {verdict.verdict}
          </p>
          {verdict.explanation && (
            <p className='text-xs text-muted-foreground leading-relaxed'>{verdict.explanation}</p>
          )}
          {verdict.bottom_line && (
            <p className='text-xs font-medium text-foreground leading-relaxed'>{verdict.bottom_line}</p>
          )}
        </div>
      )}

      {/* initiative */}
      {initiative && (
        <Card className='border border-primary/20 bg-primary/5'>
          <CardContent className='pt-5 pb-5 flex flex-col gap-3'>
            <div className='flex items-center gap-2 flex-wrap'>
              <p className='text-xs font-medium text-muted-foreground uppercase tracking-widest'>主導建議</p>
              {relation.direction && (
                <span className='text-xs px-2 py-0.5 rounded bg-primary/10 text-primary'>
                  {relation.direction}宿
                </span>
              )}
            </div>
            <p className='text-sm font-semibold text-foreground'>{initiative.initiative}</p>
            <p className='text-sm text-muted-foreground leading-relaxed'>{initiative.headline}</p>
            {initiative.why && (
              <p className='text-xs text-muted-foreground leading-relaxed'>{initiative.why}</p>
            )}
            {initiative.reassurance && (
              <p className='text-xs text-muted-foreground leading-relaxed italic'>{initiative.reassurance}</p>
            )}
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1'>
              {initiative.do.length > 0 && (
                <div className='flex flex-col gap-1'>
                  <p className='text-xs font-medium text-emerald-600 dark:text-emerald-400'>建議做</p>
                  <ul className='flex flex-col gap-0.5'>
                    {initiative.do.map((item, i) => (
                      <li key={i} className='text-xs text-muted-foreground flex items-start gap-1'>
                        <span className='text-emerald-500 shrink-0 mt-0.5'>·</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {initiative.avoid.length > 0 && (
                <div className='flex flex-col gap-1'>
                  <p className='text-xs font-medium text-red-600 dark:text-red-400'>避免</p>
                  <ul className='flex flex-col gap-0.5'>
                    {initiative.avoid.map((item, i) => (
                      <li key={i} className='text-xs text-muted-foreground flex items-start gap-1'>
                        <span className='text-red-500 shrink-0 mt-0.5'>·</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 建議 / tips / good_for */}
      <Card>
        <CardContent className='pt-5 pb-5 flex flex-col gap-3'>
          <p className='text-xs font-medium text-muted-foreground uppercase tracking-widest'>關係建議</p>
          {relation.advice && (
            <p className='text-sm text-muted-foreground leading-relaxed border-l-2 border-primary/40 pl-3'>
              {relation.advice}
            </p>
          )}
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
            {relation.tips && relation.tips.length > 0 && (
              <div className='flex flex-col gap-1'>
                <p className='text-xs font-medium text-emerald-600 dark:text-emerald-400'>訣竅</p>
                <ul className='flex flex-col gap-0.5'>
                  {relation.tips.map((tip, i) => (
                    <li key={i} className='text-xs text-muted-foreground flex items-start gap-1.5'>
                      <span className='text-emerald-500 shrink-0 mt-0.5'>·</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {relation.avoid && relation.avoid.length > 0 && (
              <div className='flex flex-col gap-1'>
                <p className='text-xs font-medium text-red-600 dark:text-red-400'>禁忌</p>
                <ul className='flex flex-col gap-0.5'>
                  {relation.avoid.map((item, i) => (
                    <li key={i} className='text-xs text-muted-foreground flex items-start gap-1.5'>
                      <span className='text-red-500 shrink-0 mt-0.5'>·</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          {relation.good_for && relation.good_for.length > 0 && (
            <div className='flex flex-col gap-1'>
              <p className='text-xs font-medium text-muted-foreground'>適合活動</p>
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

      {/* 方向分析 narratives */}
      {da && (
        <Card>
          <CardContent className='pt-5 pb-5 flex flex-col gap-4'>
            <p className='text-xs font-medium text-muted-foreground uppercase tracking-widest'>方向分析</p>
            {[
              {
                label: `${person1.mansion} 的視角`,
                direction: da.direction,
                roleName: da.role_name,
                narrative: da.narrative || da.person1_perspective,
                score: ds?.person1_to_person2?.score,
                doList: pg?.person1_to_person2?.do,
                avoidList: pg?.person1_to_person2?.avoid,
                careerAdvice: pg?.person1_to_person2?.career_advice,
              },
              {
                label: `${person2.mansion} 的視角`,
                direction: da.inverse_direction,
                roleName: da.inverse_role_name,
                narrative: da.inverse_narrative || da.person2_perspective,
                score: ds?.person2_to_person1?.score,
                doList: pg?.person2_to_person1?.do,
                avoidList: pg?.person2_to_person1?.avoid,
                careerAdvice: pg?.person2_to_person1?.career_advice,
              },
            ].map(({ label, direction, roleName, narrative, score: dirScore, doList, avoidList, careerAdvice }) => (
              <div key={label} className='flex flex-col gap-2 pb-4 border-b border-border last:border-0 last:pb-0'>
                <div className='flex items-center gap-2 flex-wrap'>
                  <p className='text-sm font-medium text-foreground'>{label}</p>
                  {direction && (
                    <span className='text-xs text-muted-foreground'>（{direction}{roleName ? ` / ${roleName}` : ''}宿）</span>
                  )}
                  {dirScore !== undefined && (
                    <span className={cn('text-sm font-bold tabular-nums ml-auto', scoreColor(dirScore))}>{dirScore}</span>
                  )}
                </div>
                {narrative && (
                  <p className='text-xs text-muted-foreground leading-relaxed'>{narrative}</p>
                )}
                {!initiative && (doList?.length || avoidList?.length || careerAdvice) && (
                  <div className='flex flex-col gap-1'>
                    {doList?.length && (
                      <div>
                        <p className='text-xs font-medium text-emerald-600 dark:text-emerald-400 mb-0.5'>建議</p>
                        <ul className='flex flex-col gap-0.5'>
                          {doList.map((item, i) => (
                            <li key={i} className='text-xs text-muted-foreground flex items-start gap-1'>
                              <span className='shrink-0 mt-0.5 text-emerald-500'>·</span>{item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {avoidList?.length && (
                      <div>
                        <p className='text-xs font-medium text-red-600 dark:text-red-400 mb-0.5'>避免</p>
                        <ul className='flex flex-col gap-0.5'>
                          {avoidList.map((item, i) => (
                            <li key={i} className='text-xs text-muted-foreground flex items-start gap-1'>
                              <span className='shrink-0 mt-0.5 text-red-500'>·</span>{item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {careerAdvice && (
                      <p className='text-xs text-muted-foreground leading-relaxed italic'>{careerAdvice}</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* 角色別指南 */}
      {relation.roles && Object.keys(relation.roles).filter(k => !k.startsWith('_')).length > 0 && (
        <Card>
          <CardContent className='pt-5 pb-5 flex flex-col gap-3'>
            <button
              type='button'
              onClick={() => setShowRoles(!showRoles)}
              className='flex items-center justify-between w-full text-left'
            >
              <p className='text-xs font-medium text-muted-foreground uppercase tracking-widest'>
                角色指南（{Object.keys(relation.roles).filter(k => !k.startsWith('_')).length} 種）
              </p>
              {showRoles ? <ChevronUp className='h-4 w-4 text-muted-foreground' /> : <ChevronDown className='h-4 w-4 text-muted-foreground' />}
            </button>
            {showRoles && (
              <PairRolesContent roles={relation.roles} />
            )}
          </CardContent>
        </Card>
      )}

      {/* 經典分析 */}
      {result.classical_analysis && (
        <Card>
          <CardContent className='pt-5 pb-5 flex flex-col gap-3'>
            <button
              type='button'
              onClick={() => setShowClassical(!showClassical)}
              className='flex items-center justify-between w-full text-left'
            >
              <p className='text-xs font-medium text-muted-foreground uppercase tracking-widest'>
                經典文獻解析
              </p>
              {showClassical ? <ChevronUp className='h-4 w-4 text-muted-foreground' /> : <ChevronDown className='h-4 w-4 text-muted-foreground' />}
            </button>
            {showClassical && (
              <PairClassicalContent
                analysis={result.classical_analysis}
                person1Mansion={person1.mansion}
                person2Mansion={person2.mansion}
              />
            )}
          </CardContent>
        </Card>
      )}

      {/* 距離 */}
      <p className='text-xs text-muted-foreground text-right'>宿距：{calculation.distance}</p>
    </div>
  )
}

// ---- 角色指南內容 ----

const ROLE_LABELS: Record<string, string> = {
  lover: '戀人',
  spouse: '配偶',
  friend: '朋友',
  colleague: '同事',
  family: '家人',
  parent: '父母',
}

function PairRolesContent({ roles }: { roles: Record<string, unknown> }) {
  const ROLE_ORDER = ['lover', 'spouse', 'friend', 'colleague', 'family', 'parent']
  const entries = ROLE_ORDER
    .filter((k) => roles[k])
    .map((k) => {
      const val = roles[k]
      const paragraphs = (val && typeof val === 'object' && 'paragraphs' in (val as object))
        ? (val as { paragraphs: { sutra: string; ref: string; cbeta_url?: string; interpretation: string }[] }).paragraphs
        : []
      return { key: k, label: ROLE_LABELS[k] || k, paragraphs }
    })

  if (!entries.length) return null

  return (
    <div className='flex flex-col gap-4'>
      <p className='text-xs text-muted-foreground'>依宿曜道原典，各關係角色的處世指引</p>
      {entries.map((entry) => (
        <div key={entry.key} className='flex flex-col gap-2 pb-3 border-b border-border last:border-0 last:pb-0'>
          <p className='text-xs font-semibold text-primary'>{entry.label}</p>
          {entry.paragraphs.map((p, i) => (
            <div key={i} className='flex flex-col gap-0.5'>
              <p className='text-xs text-muted-foreground italic'>
                {p.cbeta_url ? (
                  <a href={p.cbeta_url} target='_blank' rel='noopener noreferrer' className='underline text-primary/70 hover:text-primary'>
                    「{p.sutra}」
                  </a>
                ) : (
                  `「${p.sutra}」`
                )}
                <span className='text-[10px] ml-1'>({p.ref})</span>
              </p>
              <p className='text-xs text-muted-foreground leading-relaxed'>{p.interpretation}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

// ---- 經典文獻內容 ----

import type { ClassicalAnalysis } from '@/types/compatibility'

function PairClassicalContent({
  analysis,
  person1Mansion,
  person2Mansion,
}: {
  analysis: ClassicalAnalysis
  person1Mansion: string
  person2Mansion: string
}) {
  return (
    <div className='flex flex-col gap-3'>
      <p className='text-xs text-muted-foreground'>依《宿曜經》原典解析雙向關係</p>
      {[
        {
          label: `${person1Mansion} → ${person2Mansion}`,
          view: analysis.person1_to_person2,
        },
        {
          label: `${person2Mansion} → ${person1Mansion}`,
          view: analysis.person2_to_person1,
        },
      ].map(({ label, view }) => (
        <div key={label} className='flex flex-col gap-1.5 pb-3 border-b border-border last:border-0 last:pb-0'>
          <p className='text-xs font-medium text-foreground'>{label}</p>
          <p className='text-xs text-muted-foreground italic leading-relaxed'>
            {view.sutra.text}
            <span className='text-[10px] ml-1 not-italic'>({view.sutra.ref})</span>
          </p>
          <p className='text-xs text-muted-foreground leading-relaxed'>{view.interpretation}</p>
        </div>
      ))}
    </div>
  )
}
