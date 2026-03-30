'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useProfileStore, type Company } from '@/stores/profile'
import { useTranslation } from '@/lib/i18n'

interface CompanyFormProps {
  editingCompany?: Company | null
  onDone?: () => void
}

export function CompanyForm({ editingCompany, onDone }: CompanyFormProps) {
  const { t } = useTranslation()
  const { addCompany, updateCompany } = useProfileStore()
  const [name, setName] = useState(editingCompany?.name || '')
  const [foundingDate, setFoundingDate] = useState(editingCompany?.foundingDate || '')
  const [memo, setMemo] = useState(editingCompany?.memo || '')
  const [jobUrl, setJobUrl] = useState(editingCompany?.jobUrl || '')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !foundingDate) return

    if (editingCompany) {
      updateCompany(editingCompany.id, { name: name.trim(), foundingDate, memo, jobUrl })
    } else {
      addCompany({ name: name.trim(), foundingDate, memo, jobUrl })
    }
    onDone?.()
  }

  return (
    <Card>
      <CardContent className='pt-5 pb-5'>
        <form onSubmit={handleSubmit} className='flex flex-col gap-3'>
          <div className='flex flex-col gap-1'>
            <label className='text-xs text-muted-foreground' htmlFor='company-name'>{t('company.companyName')}</label>
            <input
              id='company-name'
              type='text'
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('company.placeholderCompanyName')}
              maxLength={100}
              required
              className='h-9 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary'
            />
          </div>
          <div className='flex flex-col gap-1'>
            <label className='text-xs text-muted-foreground' htmlFor='company-founding'>{t('company.foundingDate')}</label>
            <input
              id='company-founding'
              type='date'
              value={foundingDate}
              onChange={(e) => setFoundingDate(e.target.value)}
              min='1900-01-01'
              required
              className='h-9 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary'
            />
          </div>
          <div className='flex flex-col gap-1'>
            <label className='text-xs text-muted-foreground' htmlFor='company-memo'>{t('company.memoLabel')}</label>
            <input
              id='company-memo'
              type='text'
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder={t('company.memoPlaceholder')}
              maxLength={200}
              className='h-9 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary'
            />
          </div>
          <div className='flex flex-col gap-1'>
            <label className='text-xs text-muted-foreground' htmlFor='company-joburl'>{t('company.jobUrlLabel')}</label>
            <input
              id='company-joburl'
              type='url'
              value={jobUrl}
              onChange={(e) => setJobUrl(e.target.value)}
              placeholder={t('company.jobUrlPlaceholder')}
              className='h-9 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary'
            />
          </div>
          <div className='flex gap-2 mt-1'>
            <Button type='submit' className='flex-1' disabled={!name.trim() || !foundingDate}>
              {editingCompany ? t('common.update') : t('common.add')}
            </Button>
            {onDone && (
              <Button type='button' variant='outline' onClick={onDone}>
                {t('common.cancel')}
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
