'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/lib/i18n'
import { Button } from '@/components/ui/button'
import type { RedFlag } from '@/utils/red-flags'

interface RedFlagFlowProps {
  redFlag: RedFlag
  className?: string
}

export function RedFlagFlow({ redFlag, className }: RedFlagFlowProps) {
  const { t } = useTranslation()
  const [step, setStep] = useState(0)

  return (
    <div className={cn('flex flex-col gap-3 mt-3', className)}>
      {step === 0 && (
        <div>
          <p className='text-sm leading-relaxed mb-3'>{redFlag.test}</p>
          <div className='flex gap-2 flex-wrap'>
            <Button variant='outline' size='sm' className='text-[var(--fortune-great)] border-[var(--fortune-great)]/30 hover:bg-[var(--fortune-great)]/8' onClick={() => setStep(1)}>
              {t('initiative.flowHealthy')}
            </Button>
            <Button variant='outline' size='sm' className='text-[var(--fortune-bad)] border-[var(--fortune-bad)]/30 hover:bg-[var(--fortune-bad)]/8' onClick={() => setStep(2)}>
              {t('initiative.flowRedFlag')}
            </Button>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className='flex flex-col gap-2'>
          <div className='rounded-md border border-[var(--fortune-great)]/20 bg-[var(--fortune-great)]/8 px-3 py-2 text-sm text-[var(--fortune-great)]'>
            {redFlag.healthy}
          </div>
          <Button variant='ghost' size='sm' className='self-start text-muted-foreground' onClick={() => setStep(0)}>
            {t('initiative.flowReset')}
          </Button>
        </div>
      )}

      {step === 2 && (
        <div className='flex flex-col gap-2'>
          <div className='rounded-md border border-red-200 bg-red-50 dark:bg-red-950/20 px-3 py-2 text-sm text-red-800 dark:text-red-300'>
            {redFlag.red_flag}
          </div>
          <Button variant='outline' size='sm' className='w-full' onClick={() => setStep(3)}>
            {t('initiative.flowShowAction')}
          </Button>
        </div>
      )}

      {step === 3 && (
        <div className='flex flex-col gap-2'>
          <div className='rounded-md border border-blue-200 bg-blue-50 dark:bg-blue-950/20 px-3 py-2 text-sm text-blue-800 dark:text-blue-300'>
            {redFlag.action}
          </div>
          <Button variant='ghost' size='sm' className='self-start text-muted-foreground' onClick={() => setStep(0)}>
            {t('initiative.flowReset')}
          </Button>
        </div>
      )}
    </div>
  )
}
