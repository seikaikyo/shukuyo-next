'use client'

import { Card, CardContent } from '@/components/ui/card'
import { useTranslation } from '@/lib/i18n'
import { cn } from '@/lib/utils'

interface SankiData {
  period: string
  period_reading: string
  period_index: number
  day_in_period: number
  day_type: string
  day_type_reading: string
  day_description: string
  period_description: string
}

const PERIOD_STYLE: Record<number, string> = {
  0: 'bg-[var(--fortune-great)]/12 text-[var(--fortune-great)]',
  1: 'bg-[var(--fortune-caution)]/12 text-[var(--fortune-caution)]',
  2: 'bg-muted text-muted-foreground',
}

export function SankiCard({ sanki }: { sanki: SankiData }) {
  const { t } = useTranslation()
  const periodClass = PERIOD_STYLE[sanki.period_index] ?? PERIOD_STYLE[2]

  return (
    <Card>
      <CardContent className='pt-4 pb-4 space-y-2'>
        <div className='text-sm font-semibold'>{t('fortune.sankiTitle')}</div>
        <div className='flex items-center gap-2'>
          <span className={cn('text-[11px] font-semibold px-2 py-0.5 rounded-full', periodClass)}>
            {sanki.period}
          </span>
          <span className='text-xs text-muted-foreground'>
            {t('fortune.sankiDays', { fallback: `第 ${sanki.day_in_period} 日` })} · {sanki.day_type}
          </span>
        </div>
        <p className='text-[13px] text-muted-foreground'>{sanki.day_description}</p>
        <p className='text-[11px] text-muted-foreground/60 italic'>T21n1299 三九秘法</p>
      </CardContent>
    </Card>
  )
}
