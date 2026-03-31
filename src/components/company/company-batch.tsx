'use client'

import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { levelColor } from '@/utils/fortune-helpers'
import { isSafeUrl } from '@/config/api'
import { useTranslation } from '@/lib/i18n'
import type { CompanyBatchResult, CompanyAnalysisItem } from '@/types/company'

function tierBadge(rank: number) {
  const map: Record<number, string> = {
    1: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
    2: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/30',
    3: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
    4: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30',
  }
  return map[rank] || 'bg-muted/50 text-muted-foreground border-border'
}

function CompanyCard({ item }: { item: CompanyAnalysisItem }) {
  const { t } = useTranslation()
  const { compatibility, tier, recommendation, drain } = item

  return (
    <Card className='border border-border'>
      <CardContent className='pt-4 pb-4 flex flex-col gap-3'>
        <div className='flex items-start justify-between gap-2'>
          <div className='flex-1 min-w-0'>
            <p className='text-sm font-semibold text-foreground truncate'>{item.name}</p>
            <div className='flex items-center gap-2 mt-0.5'>
              <span className='text-xs text-muted-foreground'>{compatibility.relation.name}</span>
              {compatibility.relation.distance_type_name && (
                <span className='text-xs text-muted-foreground'>· {compatibility.relation.distance_type_name}</span>
              )}
            </div>
          </div>
          <div className='flex flex-col items-end gap-1'>
            <span className={cn('text-[10px] px-1.5 py-0.5 rounded border', tierBadge(tier.rank))}>
              {tier.label}
            </span>
          </div>
        </div>

        <p className='text-xs text-muted-foreground leading-relaxed'>{tier.reason}</p>

        {drain && (
          <div className='flex items-center gap-2'>
            <span className='text-[10px] text-muted-foreground'>{t('company.comparison.drainIndex')}:</span>
            <span className={cn(
              'text-[10px] px-1.5 py-0.5 rounded',
              drain.index <= 1 ? 'bg-emerald-500/10 text-emerald-600' :
              drain.index <= 2 ? 'bg-amber-500/10 text-amber-600' :
              'bg-red-500/10 text-red-600'
            )}>
              {drain.label}
            </span>
          </div>
        )}

        {recommendation && (
          <div className='flex flex-col gap-1 pt-1 border-t border-border'>
            <p className='text-xs text-muted-foreground leading-relaxed'>{recommendation.summary}</p>
            {recommendation.action_items.length > 0 && (
              <ul className='flex flex-col gap-0.5'>
                {recommendation.action_items.map((a, i) => (
                  <li key={`${i}-${a.slice(0, 20)}`} className='text-xs text-muted-foreground flex items-start gap-1'>
                    <span className='shrink-0 mt-0.5 text-primary'>·</span>{a}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {item.job_url && isSafeUrl(item.job_url) && (
          <a
            href={item.job_url}
            target='_blank'
            rel='noopener noreferrer'
            className='text-xs text-primary hover:underline self-start'
          >
            {t('company.jobLink')}
          </a>
        )}
      </CardContent>
    </Card>
  )
}

interface CompanyBatchProps {
  result: CompanyBatchResult
}

export function CompanyBatch({ result }: CompanyBatchProps) {
  const { t } = useTranslation()
  const sorted = [...result.companies].sort((a, b) => {
    return a.tier.rank - b.tier.rank
  })

  return (
    <div className='flex flex-col gap-4'>
      {/* user info */}
      <Card className='border border-border dark:border-primary/20'>
        <CardContent className='pt-4 pb-4'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-xs text-muted-foreground'>{t('v3.company.yourMansion')}</p>
              <p className='text-sm font-semibold text-foreground'>
                {result.user.mansion?.name_jp}
                <span className='text-xs text-muted-foreground ml-1'>({result.user.mansion?.reading})</span>
              </p>
            </div>
            <div className='text-right'>
              <p className='text-xs text-muted-foreground'>{t('v3.company.yearlyFortune')}</p>
              <p className={cn('text-sm font-bold', levelColor(result.user.yearly_fortune?.kuyou_star?.level))}>
                {result.user.yearly_fortune?.kuyou_star?.fortune_name}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* tier summary */}
      <div className='flex gap-2'>
        {[
          { label: t('v3.company.topPick'), count: result.tier_summary.tier_1, color: 'text-emerald-600 dark:text-emerald-400' },
          { label: t('v3.company.steadyChoice'), count: result.tier_summary.tier_2, color: 'text-sky-600 dark:text-sky-400' },
          { label: t('v3.company.needCaution'), count: result.tier_summary.tier_3, color: 'text-amber-600 dark:text-amber-400' },
          { label: t('company.tierOverride.warning'), count: result.tier_summary.tier_4, color: 'text-red-600 dark:text-red-400' },
        ].map((tier) => (
          <div key={tier.label} className='flex-1 text-center py-2 rounded-md bg-muted/30'>
            <p className={cn('text-lg font-bold tabular-nums', tier.color)}>{tier.count}</p>
            <p className='text-[10px] text-muted-foreground'>{tier.label}</p>
          </div>
        ))}
      </div>

      {/* strategic summary */}
      {result.strategic_summary?.direction_insight && (
        <Card>
          <CardContent className='pt-4 pb-4'>
            <p className='text-xs text-muted-foreground leading-relaxed'>
              {result.strategic_summary.direction_insight}
            </p>
          </CardContent>
        </Card>
      )}

      {/* company cards */}
      {sorted.map((item) => (
        <CompanyCard key={item.id} item={item} />
      ))}
    </div>
  )
}

export function CompanyBatchSkeleton() {
  return (
    <div className='flex flex-col gap-4'>
      <Skeleton className='h-20 rounded-lg' />
      <div className='flex gap-2'>
        {[1, 2, 3, 4].map((i) => <Skeleton key={i} className='flex-1 h-14 rounded-md' />)}
      </div>
      {[1, 2, 3].map((i) => <Skeleton key={i} className='h-40 rounded-lg' />)}
    </div>
  )
}
