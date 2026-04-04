'use client'

import { Card, CardContent } from '@/components/ui/card'
import { useTranslation } from '@/lib/i18n'

interface DayFortune {
  auspicious: string[]
  inauspicious: string[]
  summary: string
  source?: string
}

export function AuspiciousCard({ dayFortune }: { dayFortune: DayFortune }) {
  const { t } = useTranslation()

  const hasAuspicious = dayFortune.auspicious.length > 0
  const hasInauspicious = dayFortune.inauspicious.length > 0

  if (!hasAuspicious && !hasInauspicious) return null

  return (
    <Card>
      <CardContent className='pt-4 pb-4 space-y-3'>
        <div className='text-sm font-semibold'>{t('fortune.dayFortuneTitle')}</div>

        <div className='grid grid-cols-2 gap-2'>
          {hasAuspicious && (
            <div className='rounded-lg bg-muted/50 p-3 space-y-1'>
              <div className='text-[11px] text-muted-foreground/60'>{t('fortune.auspicious')}</div>
              {dayFortune.auspicious.map((item, i) => (
                <div key={i} className='text-[13px] text-[var(--fortune-great)]'>{item}</div>
              ))}
            </div>
          )}
          {hasInauspicious && (
            <div className='rounded-lg bg-muted/50 p-3 space-y-1'>
              <div className='text-[11px] text-muted-foreground/60'>{t('fortune.inauspicious')}</div>
              {dayFortune.inauspicious.map((item, i) => (
                <div key={i} className='text-[13px] text-[var(--fortune-caution)]'>{item}</div>
              ))}
            </div>
          )}
        </div>

        {dayFortune.summary && (
          <p className='text-[13px] text-muted-foreground'>{dayFortune.summary}</p>
        )}

        <p className='text-[11px] text-muted-foreground/60 italic'>
          {dayFortune.source || 'T21n1299 三九秘法日型'}
        </p>
      </CardContent>
    </Card>
  )
}
