'use client'

import { useState, useEffect } from 'react'
import { useProfileStore, useProfileHydrated } from '@/stores/profile'
import { useTranslation } from '@/lib/i18n'
import { useCompanyAnalysis } from '@/hooks/use-company'
import { getYoseiFullName } from '@/utils/yosei'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Breadcrumb } from '@/components/shared/breadcrumb'
import { FortuneBadge } from '@/components/shared/fortune-badge'
import { MansionTag } from '@/components/shared/mansion-tag'
import { cn } from '@/lib/utils'

const TIER_BORDER: Record<number, string> = {
  1: 'border-l-[var(--fortune-great)]',
  2: 'border-l-[var(--fortune-good)]',
  3: 'border-l-[var(--fortune-caution)]',
  4: 'border-l-[var(--fortune-bad)]',
}

function HeadhunterContent() {
  const { t, locale } = useTranslation()
  const companies = useProfileStore((s) => s.companies)
  const jobSeekers = useProfileStore((s) => s.jobSeekers)
  const addJobSeeker = useProfileStore((s) => s.addJobSeeker)
  const deleteJobSeeker = useProfileStore((s) => s.deleteJobSeeker)

  const [name, setName] = useState('')
  const [date, setDate] = useState('')
  const [selectedSeeker, setSelectedSeeker] = useState<string | null>(null)
  const [seekerResults, setSeekerResults] = useState<Record<string, unknown> | null>(null)

  function handleAdd() {
    if (!name || !date) return
    addJobSeeker({ name, birthDate: date })
    setName(''); setDate('')
  }

  return (
    <div className='space-y-3'>
      <Breadcrumb items={[
        { label: t('nav.home'), href: '/' },
        { label: t('nav.company'), href: '/company' },
        { label: t('company.headhunterMode') },
      ]} />

      <h1 className='font-serif text-[22px] font-bold'>{t('company.headhunterMode')}</h1>
      <p className='text-sm text-muted-foreground'>{t('company.headhunterModeDesc')}</p>

      {/* Add seeker */}
      <Card>
        <CardContent className='py-4'>
          <h3 className='text-sm font-semibold'>{t('company.addSeeker')}</h3>
          <div className='mt-2 grid grid-cols-2 gap-2'>
            <Input placeholder={t('company.seekerName')} value={name} onChange={(e) => setName(e.target.value)} />
            <Input type='date' value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <Button size='sm' className='mt-2' onClick={handleAdd} disabled={!name || !date}>
            {t('company.add')}
          </Button>
        </CardContent>
      </Card>

      {/* Seeker list */}
      <Card>
        <CardContent className='py-4'>
          <h3 className='text-sm font-semibold'>{t('company.seekerList')}</h3>
          {jobSeekers.map((s) => (
            <div key={s.id} className='mt-2 flex items-center justify-between rounded-lg bg-muted p-3'>
              <div>
                <span className='text-sm font-semibold'>{s.name}</span>
                <span className='text-xs text-muted-foreground'> · {s.birthDate}</span>
              </div>
              <div className='flex gap-2'>
                <Button variant='outline' size='sm' className='text-xs' onClick={() => setSelectedSeeker(s.id)}>
                  {t('company.analyze')}
                </Button>
                <button onClick={() => deleteJobSeeker(s.id)} className='text-xs text-destructive'>x</button>
              </div>
            </div>
          ))}
          {jobSeekers.length === 0 && (
            <p className='mt-2 py-4 text-center text-xs text-muted-foreground'>
              {t('company.noSeekers')}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Placeholder for results */}
      {selectedSeeker && companies.length === 0 && (
        <Card>
          <CardContent className='py-6 text-center'>
            <p className='text-sm text-muted-foreground'>
              {t('company.addCompaniesFirst')}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default function HeadhunterPage() {
  const hydrated = useProfileHydrated()
  if (!hydrated) return <Skeleton className='h-60 w-full rounded-xl' />
  return <HeadhunterContent />
}
