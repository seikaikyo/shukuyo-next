'use client'

import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/lib/i18n'

interface IcsDownloadButtonProps {
  onDownload: () => void
  label?: string
  disabled?: boolean
}

export function IcsDownloadButton({
  onDownload,
  label,
  disabled = false,
}: IcsDownloadButtonProps) {
  const { t } = useTranslation()
  const displayLabel = label ?? t('fortune.exportCalendar')
  return (
    <Button
      variant='outline'
      size='sm'
      onClick={onDownload}
      disabled={disabled}
      className='gap-1.5'
    >
      <Download className='size-3.5' aria-hidden='true' />
      <span className='text-xs'>{displayLabel}</span>
    </Button>
  )
}
