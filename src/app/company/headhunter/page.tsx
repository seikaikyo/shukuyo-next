'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useProfileStore } from '@/stores/profile'
import { apiPost } from '@/config/api'
import { Breadcrumb } from '@/components/shared/breadcrumb'
import { scoreColor } from '@/utils/score-colors'
import { useTranslation } from '@/lib/i18n'
import type { CompanyBatchResult } from '@/types/company'

export default function HeadhunterPage() {
  const { t } = useTranslation()
  const {
    jobSeekers, addJobSeeker, deleteJobSeeker,
    companies, locale,
  } = useProfileStore()
  const [name, setName] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [selectedSeeker, setSelectedSeeker] = useState<string | null>(null)
  const [analysisResult, setAnalysisResult] = useState<CompanyBatchResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleAddSeeker(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !birthDate) return
    addJobSeeker({ name: name.trim(), birthDate })
    setName('')
    setBirthDate('')
  }

  async function handleAnalyze(seekerId: string) {
    const seeker = jobSeekers.find(s => s.id === seekerId)
    const validCompanies = companies.filter(c => c.foundingDate)
    if (!seeker || !validCompanies.length) return

    setSelectedSeeker(seekerId)
    setLoading(true)
    setError(null)
    setAnalysisResult(null)
    try {
      const data = await apiPost<CompanyBatchResult>('/company-batch-analysis', {
        birth_date: seeker.birthDate,
        companies: validCompanies.map(c => ({
          id: c.id,
          founding_date: c.foundingDate,
          name: c.name,
          memo: c.memo || '',
          job_url: c.jobUrl || '',
        })),
        year: new Date().getFullYear(),
        mode: 'seeker',
        lang: locale,
      })
      setAnalysisResult(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : t('error.fetchFailed'))
    } finally {
      setLoading(false)
    }
  }

  const seeker = jobSeekers.find(s => s.id === selectedSeeker)

  return (
    <div className='mx-auto w-full max-w-2xl px-4 pb-12 flex flex-col gap-4'>
      <Breadcrumb
        items={[
          { label: t('nav.home'), href: '/' },
          { label: t('v3.company.title'), href: '/company' },
          { label: t('modeEntry.headhunter') },
        ]}
        className='pt-2'
      />

      <div className='py-2 flex flex-col gap-1'>
        <h2 className='text-base font-semibold text-foreground'>{t('modeEntry.headhunter')}</h2>
        <p className='text-xs text-muted-foreground'>{t('modeEntry.headhunterDesc')}</p>
      </div>

      {/* add seeker form */}
      <Card>
        <CardContent className='pt-4 pb-4'>
          <p className='text-xs font-medium text-muted-foreground mb-2'>{t('company.addSeeker')}</p>
          <form onSubmit={handleAddSeeker} className='flex flex-col sm:flex-row gap-2'>
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

      {/* seeker list */}
      {jobSeekers.length > 0 && (
        <Card>
          <CardContent className='pt-4 pb-4'>
            <p className='text-xs font-medium text-muted-foreground mb-2'>
              {t('headhunter.seekerName')} ({jobSeekers.length})
            </p>
            <div className='flex flex-col gap-1.5'>
              {jobSeekers.map((s) => (
                <div key={s.id} className='flex items-center justify-between py-1.5 border-b border-border last:border-0'>
                  <div>
                    <span className='text-sm font-medium text-foreground'>{s.name}</span>
                    <span className='text-xs text-muted-foreground ml-2 tabular-nums'>{s.birthDate}</span>
                  </div>
                  <div className='flex items-center gap-1'>
                    <Button
                      size='sm'
                      variant='ghost'
                      onClick={() => handleAnalyze(s.id)}
                      disabled={companies.filter(c => c.foundingDate).length === 0 || loading}
                      className='h-7 text-xs'
                    >
                      {loading && selectedSeeker === s.id ? t('v3.company.analyzing') : t('v3.company.analyze')}
                    </Button>
                    <button
                      onClick={() => deleteJobSeeker(s.id)}
                      className='h-9 w-9 inline-flex items-center justify-center rounded text-muted-foreground hover:text-red-500 transition-colors'
                      aria-label={t('common.delete')}
                    >
                      <Trash2 className='size-3' />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* info when no companies */}
      {companies.length === 0 && (
        <Card>
          <CardContent className='pt-5 pb-5 text-center'>
            <p className='text-sm text-muted-foreground'>
              {t('v3.company.noCompanies')}{' '}
              <Link href='/company' className='text-primary hover:underline'>{t('v3.company.title')}</Link>
            </p>
          </CardContent>
        </Card>
      )}

      {/* loading */}
      {loading && (
        <div className='flex flex-col gap-3'>
          <Skeleton className='h-20 rounded-lg' />
          {[1, 2, 3].map(i => <Skeleton key={i} className='h-32 rounded-lg' />)}
        </div>
      )}

      {/* error */}
      {error && !loading && (
        <Card role='alert'>
          <CardContent className='pt-5 pb-5 text-center'>
            <p className='text-sm text-muted-foreground'>{error}</p>
          </CardContent>
        </Card>
      )}

      {/* analysis result */}
      {!loading && analysisResult && seeker && (
        <div className='flex flex-col gap-3'>
          <Card className='border-l-4 border-l-primary'>
            <CardContent className='pt-4 pb-4'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-semibold text-foreground'>{seeker.name}</p>
                  <p className='text-xs text-muted-foreground tabular-nums'>{seeker.birthDate}</p>
                </div>
                <div className='text-right'>
                  <p className='text-xs text-muted-foreground'>{t('v3.company.yourMansion')}</p>
                  <p className='text-sm font-semibold text-foreground'>
                    {analysisResult.user.mansion?.name_jp}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {[...analysisResult.companies]
            .sort((a, b) => a.tier.rank - b.tier.rank || b.compatibility.score - a.compatibility.score)
            .map((item) => (
              <Card key={item.id} className='border border-border'>
                <CardContent className='pt-4 pb-4 flex flex-col gap-2'>
                  <div className='flex items-center justify-between'>
                    <p className='text-sm font-medium text-foreground'>{item.name}</p>
                    <span className={cn('text-xl font-bold tabular-nums', scoreColor(item.compatibility.score))}>
                      {item.compatibility.score}
                    </span>
                  </div>
                  <div className='flex flex-wrap gap-2 text-xs text-muted-foreground'>
                    <span>{item.compatibility.relation.name}</span>
                    <span>{item.tier.label}</span>
                    {item.drain && <span>{t('company.comparison.drainIndex')}: {item.drain.label}</span>}
                  </div>
                  <p className='text-xs text-muted-foreground'>{item.tier.reason}</p>
                </CardContent>
              </Card>
            ))}
        </div>
      )}
    </div>
  )
}
