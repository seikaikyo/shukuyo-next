'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Info } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/lib/i18n'
import { getKnowledgeLink } from '@/utils/glossary'

interface InfoHintProps {
  text: string
  anchor?: string
  className?: string
}

export function InfoHint({ text, anchor, className }: InfoHintProps) {
  const [open, setOpen] = useState(false)
  const { t } = useTranslation()

  return (
    <span className={cn('relative inline-flex items-center', className)}>
      <button
        type='button'
        onClick={() => setOpen(!open)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        aria-label={t('common.infoHintLabel')}
        className='inline-flex items-center justify-center w-3.5 h-3.5 rounded-full text-muted-foreground hover:text-primary transition-colors'
      >
        <Info className='size-3' aria-hidden='true' />
      </button>
      {open && (
        <span className='absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2.5 py-1.5 rounded-md bg-popover border border-border shadow-md text-xs text-popover-foreground whitespace-normal max-w-52 leading-relaxed'>
          {text}
          {anchor && (
            <>
              {' '}
              <Link
                href={getKnowledgeLink(anchor)}
                className='text-primary hover:underline'
                onClick={() => setOpen(false)}
              >
                {t('common.details')}
              </Link>
            </>
          )}
        </span>
      )}
    </span>
  )
}
