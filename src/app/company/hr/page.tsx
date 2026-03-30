'use client'

import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useProfileStore } from '@/stores/profile'
import { useTeamMatrix } from '@/hooks/use-company'
import { TeamMatrix } from '@/components/company/team-matrix'
import { Breadcrumb } from '@/components/shared/breadcrumb'
import { useTranslation } from '@/lib/i18n'

export default function HrPage() {
  const { t } = useTranslation()
  const { hrCandidates, addHrCandidate, deleteHrCandidate, hrCompany, setHrCompany } = useProfileStore()
  const { matrix, loading, progress, fetchMatrix } = useTeamMatrix()
  const [name, setName] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [companyName, setCompanyName] = useState(hrCompany?.name || '')
  const [companyDate, setCompanyDate] = useState(hrCompany?.foundingDate || '')

  function handleAddCandidate(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !birthDate) return
    addHrCandidate({ name: name.trim(), birthDate })
    setName('')
    setBirthDate('')
  }

  function handleSaveCompany() {
    if (companyName.trim() && companyDate) {
      setHrCompany({ name: companyName.trim(), foundingDate: companyDate })
    }
  }

  function handleAnalyze() {
    const members = hrCandidates.filter(c => c.birthDate).map(c => ({
      id: c.id,
      name: c.name,
      birthDate: c.birthDate,
    }))
    if (members.length >= 2) fetchMatrix(members)
  }

  return (
    <div className='mx-auto w-full max-w-2xl px-4 pb-12 flex flex-col gap-4'>
      <Breadcrumb
        items={[
          { label: t('nav.home'), href: '/' },
          { label: t('v3.company.title'), href: '/company' },
          { label: t('modeEntry.hr') },
        ]}
        className='pt-2'
      />

      <div className='py-2 flex flex-col gap-1'>
        <h2 className='text-base font-semibold text-foreground'>{t('hr.teamCompatibility')}</h2>
        <p className='text-xs text-muted-foreground'>{t('hr.team.desc')}</p>
      </div>

      {/* company info */}
      <Card>
        <CardContent className='pt-4 pb-4 flex flex-col gap-2'>
          <p className='text-xs font-medium text-muted-foreground'>{t('hr.companySetup')}</p>
          <div className='flex flex-col sm:flex-row gap-2'>
            <input
              type='text'
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder={t('company.companyName')}
              maxLength={100}
              aria-label={t('company.companyName')}
              className='h-8 flex-1 rounded-md border border-border bg-background px-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary'
            />
            <input
              type='date'
              value={companyDate}
              onChange={(e) => setCompanyDate(e.target.value)}
              min='1900-01-01'
              aria-label={t('company.foundingDate')}
              className='h-8 rounded-md border border-border bg-background px-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary'
            />
            <Button size='sm' variant='outline' onClick={handleSaveCompany} className='h-8 text-xs'>
              {t('common.save')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* add candidate form */}
      <Card>
        <CardContent className='pt-4 pb-4'>
          <p className='text-xs font-medium text-muted-foreground mb-2'>{t('hr.addCandidate')}</p>
          <form onSubmit={handleAddCandidate} className='flex flex-col sm:flex-row gap-2'>
            <input
              type='text'
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('company.name')}
              maxLength={50}
              aria-label={t('company.name')}
              required
              className='h-8 flex-1 rounded-md border border-border bg-background px-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary'
            />
            <input
              type='date'
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              min='1900-01-01'
              aria-label={t('profile.birthDate')}
              required
              className='h-8 rounded-md border border-border bg-background px-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary'
            />
            <Button type='submit' size='sm' className='h-8 gap-1 text-xs'>
              <Plus className='size-3' aria-hidden='true' />{t('common.add')}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* candidate list */}
      {hrCandidates.length > 0 && (
        <Card>
          <CardContent className='pt-4 pb-4'>
            <p className='text-xs font-medium text-muted-foreground mb-2'>
              {t('hr.candidate')} ({hrCandidates.length})
            </p>
            <div className='flex flex-col gap-1'>
              {hrCandidates.map((c) => (
                <div key={c.id} className='flex items-center justify-between py-1'>
                  <div>
                    <span className='text-sm text-foreground'>{c.name}</span>
                    <span className='text-xs text-muted-foreground ml-2 tabular-nums'>{c.birthDate}</span>
                  </div>
                  <button
                    onClick={() => deleteHrCandidate(c.id)}
                    className='h-9 w-9 inline-flex items-center justify-center rounded text-muted-foreground hover:text-red-500 transition-colors'
                    aria-label={t('common.delete')}
                  >
                    <Trash2 className='size-3' />
                  </button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* analyze button */}
      <Button
        onClick={handleAnalyze}
        disabled={hrCandidates.length < 2 || loading}
        className='self-start'
      >
        {loading ? `${t('common.analyzing')} (${progress.done}/${progress.total})...` : t('hr.team.analyze')}
      </Button>

      {/* matrix */}
      {(loading || matrix.size > 0) && (
        <TeamMatrix
          members={hrCandidates.map(c => ({ id: c.id, name: c.name }))}
          matrix={matrix}
          loading={loading}
          progress={progress}
        />
      )}
    </div>
  )
}
