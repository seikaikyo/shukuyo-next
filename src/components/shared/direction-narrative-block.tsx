'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/lib/i18n'
import { InfoHint } from './info-hint'
import type { DirectionGuidance, SutraCareerItem } from '@/types/compatibility'

interface DirectionNarrativeBlockProps {
  label: string
  direction: string
  roleName: string
  narrative: string
  level?: string
  tierRank?: number
  coreSutra?: string
  doList: string[]
  avoidList: string[]
  copingText: string
  guidance?: DirectionGuidance
  sutraCareerItems?: SutraCareerItem[]
  className?: string
}

const LEVEL_TIER: Record<string, number> = { daikichi: 1, kichi: 2, shokyo: 3, kyo: 4 }

const TIER_BORDER: Record<number, string> = {
  1: 'border-l-[var(--fortune-great)]',
  2: 'border-l-[var(--fortune-good)]',
  3: 'border-l-[var(--fortune-caution)]',
  4: 'border-l-[var(--fortune-bad)]',
}

function escHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function cbetaLink(url: string, text: string): string {
  const safeText = escHtml(text)
  if (!url) return `\u300C${safeText}\u300D`
  try {
    const parsed = new URL(url)
    if (parsed.origin !== 'https://cbetaonline.dila.edu.tw') return `\u300C${safeText}\u300D`
  } catch { return `\u300C${safeText}\u300D` }
  return `<a href="${escHtml(url)}" target="_blank" rel="noopener" class="text-primary hover:underline">\u300C${safeText}\u300D</a>`
}

export function DirectionNarrativeBlock({
  label, direction, roleName, narrative, level, tierRank,
  coreSutra, doList, avoidList, copingText, guidance, sutraCareerItems, className,
}: DirectionNarrativeBlockProps) {
  const { t } = useTranslation()
  const [showSutra, setShowSutra] = useState(false)

  const tier = tierRank || (level ? LEVEL_TIER[level] || 3 : 3)
  const borderClass = TIER_BORDER[tier] || 'border-l-border'

  const hasSutra = !!guidance || (sutraCareerItems && sutraCareerItems.length > 0)

  return (
    <div className={cn('bg-card rounded-lg p-4 flex flex-col gap-2 border-l-[3px]', borderClass, className)}>
      {/* Header */}
      <div className='flex items-center gap-1 flex-wrap'>
        <span className='text-xs text-muted-foreground'>{label}</span>
        {direction && <span className='text-sm font-bold'>{direction}</span>}
        {roleName && <span className='text-xs text-muted-foreground'>({roleName})</span>}
      </div>

      {coreSutra && (
        <p className='text-xs text-muted-foreground italic leading-snug'>{coreSutra}</p>
      )}

      <p className='text-sm leading-relaxed'>{narrative}</p>

      {(doList.length > 0 || avoidList.length > 0) && (
        <div className='flex flex-col gap-0.5'>
          {doList.map((item, i) => (
            <div key={`do-${i}`} className='text-xs pl-4 relative text-muted-foreground'>
              <span className='absolute left-0 text-[var(--fortune-great)] font-semibold'>+</span>
              {item}
            </div>
          ))}
          {avoidList.map((item, i) => (
            <div key={`av-${i}`} className='text-xs pl-4 relative text-muted-foreground/70'>
              <span className='absolute left-0 text-amber-500 font-semibold'>-</span>
              {item}
            </div>
          ))}
        </div>
      )}

      {copingText && (
        <p className='text-xs text-muted-foreground leading-relaxed pt-1 border-t border-border'>
          {copingText}
        </p>
      )}

      {hasSutra && (
        <button
          type='button'
          className='text-xs text-primary hover:underline text-left'
          onClick={() => setShowSutra(!showSutra)}
        >
          {showSutra ? t('narrative.hideSutra') : t('narrative.showSutra')}
        </button>
      )}

      {showSutra && (
        <div className='flex flex-col gap-3 pt-2 border-t border-border'>
          {guidance ? (
            <>
              {guidance.suitable.length > 0 && (
                <div className='flex flex-col gap-1 p-2 rounded bg-muted/30'>
                  <span className='text-xs font-semibold text-[var(--fortune-great)] flex items-center gap-1'>
                    {t('guidance.suitable')}
                    <InfoHint text={t('guidance.suitableHint')} />
                  </span>
                  {guidance.suitable.map((g, i) => (
                    <div key={`gs-${i}`} className='text-xs leading-relaxed'>
                      <span dangerouslySetInnerHTML={{ __html: cbetaLink(g.cbeta_url || '', g.sutra) }} />
                      <span className='block ml-3 text-muted-foreground'>{g.interpretation}</span>
                    </div>
                  ))}
                </div>
              )}
              {guidance.timing_poor.length > 0 && (
                <div className='flex flex-col gap-1 p-2 rounded bg-muted/30'>
                  <span className='text-xs font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1'>
                    {t('guidance.timingPoor')}
                    <InfoHint text={t('guidance.timingPoorHint')} />
                  </span>
                  {guidance.timing_poor.map((g, i) => (
                    <div key={`gt-${i}`} className='text-xs leading-relaxed'>
                      <span dangerouslySetInnerHTML={{ __html: cbetaLink(g.cbeta_url || '', g.sutra) }} />
                      <span className='block ml-3 text-muted-foreground'>{g.interpretation}</span>
                    </div>
                  ))}
                </div>
              )}
              {guidance.remedy.principle && (
                <div className='flex flex-col gap-1 p-2 rounded bg-muted/30'>
                  <span className='text-xs font-semibold text-muted-foreground flex items-center gap-1'>
                    {t('guidance.remedy')}
                    <InfoHint text={t('guidance.remedyHint')} />
                  </span>
                  <p className='text-xs font-medium'>{guidance.remedy.principle}</p>
                  <p className='text-xs text-muted-foreground leading-relaxed'>{guidance.remedy.detail}</p>
                </div>
              )}
            </>
          ) : (
            sutraCareerItems?.map((si, i) => (
              <div key={`s-${i}`} className='text-xs leading-relaxed'>
                <span dangerouslySetInnerHTML={{ __html: cbetaLink(si.cbeta_url, si.sutra) }} />
                <span className='block ml-3 text-muted-foreground'>{si.interpretation}</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
