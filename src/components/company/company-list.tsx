'use client'

import { useState } from 'react'
import { Plus, Pencil, Trash2, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useProfileStore } from '@/stores/profile'
import { isSafeUrl } from '@/config/api'
import { useTranslation } from '@/lib/i18n'
import { CompanyForm } from './company-form'

export function CompanyList() {
  const { t } = useTranslation()
  const { companies, deleteCompany } = useProfileStore()
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const editingCompany = editingId ? companies.find((c) => c.id === editingId) : null

  if (showForm || editingId) {
    return (
      <CompanyForm
        editingCompany={editingCompany}
        onDone={() => { setShowForm(false); setEditingId(null) }}
      />
    )
  }

  return (
    <div className='flex flex-col gap-3'>
      <Button
        variant='outline'
        size='sm'
        onClick={() => setShowForm(true)}
        className='self-start gap-1.5'
      >
        <Plus className='size-3.5' aria-hidden='true' />
        {t('common.add')}
      </Button>

      {companies.length === 0 && (
        <Card>
          <CardContent className='pt-5 pb-5 text-center'>
            <p className='text-sm text-muted-foreground'>{t('v3.company.noCompanies')}</p>
            <p className='text-xs text-muted-foreground mt-1'>{t('company.batchHint')}</p>
          </CardContent>
        </Card>
      )}

      {companies.map((company) => (
        <Card key={company.id} className='border border-border'>
          <CardContent className='pt-4 pb-4'>
            <div className='flex items-start justify-between gap-2'>
              <div className='flex-1 min-w-0'>
                <p className='text-sm font-medium text-foreground truncate'>{company.name}</p>
                <p className='text-xs text-muted-foreground tabular-nums'>{company.foundingDate}</p>
                {company.memo && (
                  <p className='text-xs text-muted-foreground mt-0.5'>{company.memo}</p>
                )}
              </div>
              <div className='flex items-center gap-1 shrink-0'>
                {company.jobUrl && isSafeUrl(company.jobUrl) && (
                  <a
                    href={company.jobUrl}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='h-9 w-9 inline-flex items-center justify-center rounded-md text-muted-foreground hover:text-primary hover:bg-muted transition-colors'
                    aria-label={t('company.jobLink')}
                  >
                    <ExternalLink className='size-3.5' aria-hidden='true' />
                  </a>
                )}
                <button
                  onClick={() => setEditingId(company.id)}
                  className='h-7 w-7 inline-flex items-center justify-center rounded-md text-muted-foreground hover:text-primary hover:bg-muted transition-colors'
                  aria-label={t('common.edit')}
                >
                  <Pencil className='size-3.5' aria-hidden='true' />
                </button>
                <button
                  onClick={() => deleteCompany(company.id)}
                  className='h-7 w-7 inline-flex items-center justify-center rounded-md text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors'
                  aria-label={t('common.delete')}
                >
                  <Trash2 className='size-3.5' aria-hidden='true' />
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
