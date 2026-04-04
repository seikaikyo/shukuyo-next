'use client'

import { useState, useCallback } from 'react'
import { useProfileStore, useProfileHydrated } from '@/stores/profile'
import { useTranslation } from '@/lib/i18n'
import { useCompatibility } from '@/hooks/use-compatibility'
import { apiPost, ENGINE } from '@/config/api'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Breadcrumb } from '@/components/shared/breadcrumb'
import { cn } from '@/lib/utils'
import type { CompatibilityResult } from '@/types/compatibility'

const RELATION_BG: Record<string, string> = {
  great_fortune: 'bg-[var(--fortune-great)]/12 text-[var(--fortune-great)]',
  good_fortune: 'bg-[var(--fortune-good)]/10 text-[var(--fortune-good)]',
  small_misfortune: 'bg-[var(--fortune-caution)]/10 text-[var(--fortune-caution)]',
  misfortune: 'bg-[var(--fortune-bad)]/10 text-[var(--fortune-bad)]',
}

interface MatrixCell {
  relation: string
  level: string
}

function HrContent() {
  const { t } = useTranslation()
  const hrCandidates = useProfileStore((s) => s.hrCandidates)
  const hrCompany = useProfileStore((s) => s.hrCompany)
  const addHrCandidate = useProfileStore((s) => s.addHrCandidate)
  const deleteHrCandidate = useProfileStore((s) => s.deleteHrCandidate)
  const setHrCompany = useProfileStore((s) => s.setHrCompany)

  const [companyName, setCompanyName] = useState(hrCompany?.name || '')
  const [companyDate, setCompanyDate] = useState(hrCompany?.foundingDate || '')
  const [candName, setCandName] = useState('')
  const [candDate, setCandDate] = useState('')
  const [matrix, setMatrix] = useState<Record<string, Record<string, MatrixCell>> | null>(null)
  const [matrixLoading, setMatrixLoading] = useState(false)

  function handleSaveCompany() {
    if (!companyName || !companyDate) return
    setHrCompany({ name: companyName, foundingDate: companyDate })
  }

  function handleAddCandidate() {
    if (!candName || !candDate) return
    addHrCandidate({ name: candName, birthDate: candDate })
    setCandName(''); setCandDate('')
  }

  async function handleAnalyze() {
    if (!hrCompany || hrCandidates.length === 0) return
    setMatrixLoading(true)
    try {
      const allDates = [hrCompany.foundingDate, ...hrCandidates.map(c => c.birthDate)]
      const allNames = [hrCompany.name, ...hrCandidates.map(c => c.name)]
      const result: Record<string, Record<string, MatrixCell>> = {}

      for (let i = 0; i < allDates.length; i++) {
        result[allNames[i]] = {}
        for (let j = 0; j < allDates.length; j++) {
          if (i === j) {
            result[allNames[i]][allNames[j]] = { relation: '\u2014', level: '' }
          } else {
            try {
              const compat = await apiPost<CompatibilityResult>(`${ENGINE}/compatibility`, {
                date1: allDates[i], date2: allDates[j]
              })
              result[allNames[i]][allNames[j]] = {
                relation: compat?.relation?.name || '?',
                level: compat?.level || '',
              }
            } catch {
              result[allNames[i]][allNames[j]] = { relation: '?', level: '' }
            }
          }
        }
      }
      setMatrix(result)
    } finally {
      setMatrixLoading(false)
    }
  }

  const allNames = hrCompany
    ? [hrCompany.name, ...hrCandidates.map(c => c.name)]
    : hrCandidates.map(c => c.name)

  return (
    <div className='space-y-3'>
      <Breadcrumb items={[
        { label: t('nav.home'), href: '/' },
        { label: t('nav.company'), href: '/company' },
        { label: t('company.hrMode') },
      ]} />

      <h1 className='font-serif text-[22px] font-bold'>{t('company.hrMode')}</h1>
      <p className='text-sm text-muted-foreground'>{t('company.hrModeDesc')}</p>

      {/* Company setup */}
      <Card>
        <CardContent className='py-4'>
          <h3 className='text-sm font-semibold'>{t('company.companyInfo')}</h3>
          <div className='mt-2 grid grid-cols-2 gap-2'>
            <Input placeholder={t('company.companyNameLabel')} value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
            <Input type='date' min='1800-01-01' max='2025-12-31' value={companyDate} onChange={(e) => setCompanyDate(e.target.value)} />
          </div>
          <Button variant='outline' size='sm' className='mt-2' onClick={handleSaveCompany}>
            {t('common.save')}
          </Button>
        </CardContent>
      </Card>

      {/* Add candidate */}
      <Card>
        <CardContent className='py-4'>
          <h3 className='text-sm font-semibold'>{t('company.addCandidate')}</h3>
          <div className='mt-2 grid grid-cols-2 gap-2'>
            <Input placeholder={t('company.candidateName')} value={candName} onChange={(e) => setCandName(e.target.value)} />
            <Input type='date' min='1920-01-01' max='2020-12-31' value={candDate} onChange={(e) => setCandDate(e.target.value)} />
          </div>
          <Button size='sm' className='mt-2' onClick={handleAddCandidate} disabled={!candName || !candDate}>
            {t('company.add')}
          </Button>
        </CardContent>
      </Card>

      {/* Candidate list */}
      <Card>
        <CardContent className='py-4'>
          <h3 className='text-sm font-semibold'>{t('company.candidateList')}</h3>
          <div className='mt-2 flex flex-col gap-1.5'>
            {hrCandidates.map((c) => (
              <div key={c.id} className='flex items-center justify-between rounded-lg bg-muted p-3'>
                <div>
                  <span className='text-sm font-semibold'>{c.name}</span>
                  <span className='text-xs text-muted-foreground'> · {c.birthDate}</span>
                </div>
                <button onClick={() => deleteHrCandidate(c.id)} className='text-xs text-destructive' aria-label='Delete'>x</button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Button className='w-full' onClick={handleAnalyze} disabled={!hrCompany || hrCandidates.length === 0 || matrixLoading}>
        {matrixLoading ? t('common.loading') : t('company.analyzeTeam')}
      </Button>

      {/* Matrix */}
      {matrix && (
        <Card>
          <CardContent className='py-4 overflow-x-auto'>
            <h3 className='text-sm font-semibold'>{t('company.teamMatrix')}</h3>
            <p className='text-xs text-muted-foreground mb-3'>{t('company.matrixDesc')}</p>
            <div
              className='grid gap-1 text-[11px]'
              style={{ gridTemplateColumns: `56px repeat(${allNames.length}, 1fr)` }}
            >
              <div />
              {allNames.map((n) => (
                <div key={n} className='text-center text-xs text-muted-foreground truncate'>{n}</div>
              ))}
              {allNames.map((row) => (
                <>
                  <div key={`r-${row}`} className='flex items-center text-xs text-muted-foreground truncate'>{row}</div>
                  {allNames.map((col) => {
                    const cell = matrix[row]?.[col]
                    return (
                      <div
                        key={`${row}-${col}`}
                        className={cn(
                          'flex aspect-square items-center justify-center rounded text-[10px] font-semibold',
                          cell?.level ? RELATION_BG[cell.level] || 'bg-muted' : 'bg-muted'
                        )}
                      >
                        {cell?.relation || ''}
                      </div>
                    )
                  })}
                </>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default function HrPage() {
  const hydrated = useProfileHydrated()
  if (!hydrated) return <Skeleton className='h-60 w-full rounded-xl' />
  return <HrContent />
}
