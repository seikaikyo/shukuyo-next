'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/lib/i18n'

interface DateNavProps {
  label: string
  onPrev: () => void
  onNext: () => void
  onToday?: () => void
  todayLabel?: string
}

export function DateNav({ label, onPrev, onNext, onToday, todayLabel }: DateNavProps) {
  const { t } = useTranslation()

  return (
    <div className='mb-4 flex items-center justify-center gap-3'>
      <Button variant='ghost' size='icon' className='h-8 w-8' onClick={onPrev}>
        <ChevronLeft className='h-4 w-4' />
      </Button>
      <span className='min-w-[140px] text-center font-serif text-[15px] font-semibold'>
        {label}
      </span>
      <Button variant='ghost' size='icon' className='h-8 w-8' onClick={onNext}>
        <ChevronRight className='h-4 w-4' />
      </Button>
      {onToday && (
        <Button variant='outline' size='sm' className='text-xs' onClick={onToday}>
          {todayLabel || t('common.today')}
        </Button>
      )}
    </div>
  )
}
