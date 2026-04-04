'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useProfileStore, useProfileHydrated } from '@/stores/profile'
import { useTranslation } from '@/lib/i18n'
import { useCompanyAnalysis } from '@/hooks/use-company'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { Breadcrumb } from '@/components/shared/breadcrumb'
import { FortuneBadge } from '@/components/shared/fortune-badge'
import { MansionTag } from '@/components/shared/mansion-tag'
import { cn } from '@/lib/utils'

const TIER_COLORS: Record<number, string> = {
  1: 'border-l-[var(--fortune-great)]',
  2: 'border-l-[var(--fortune-good)]',
  3: 'border-l-[var(--fortune-caution)]',
  4: 'border-l-[var(--fortune-bad)]',
}

function CompanyContent() {
  const { t, locale } = useTranslation()
  const birthDate = useProfileStore((s) => s.birthDate)!
  const companies = useProfileStore((s) => s.companies)
  const addCompany = useProfileStore((s) => s.addCompany)
  const deleteCompany = useProfileStore((s) => s.deleteCompany)
  const { batchResult, loading, fetchBatchAnalysis } = useCompanyAnalysis()

  const [tab, setTab] = useState<'manage' | 'analyze' | 'compare'>('manage')
  const [name, setName] = useState('')
  const [foundingDate, setFoundingDate] = useState('')
  const [country, setCountry] = useState('')

  function handleAdd() {
    if (!name || !foundingDate) return
    addCompany({ name, foundingDate, country })
    setName(''); setFoundingDate(''); setCountry('')
  }

  function handleAnalyze() {
    fetchBatchAnalysis(new Date().getFullYear(), locale)
    setTab('analyze')
  }

  return (
    <div className='space-y-3'>
      <Breadcrumb items={[
        { label: t('nav.home'), href: '/' },
        { label: t('nav.company') },
      ]} />

      {/* Tabs */}
      <div className='flex gap-0.5 rounded-lg border border-border bg-muted p-[3px]'>
        {(['manage', 'analyze', 'compare'] as const).map((t2) => (
          <button
            key={t2}
            className={cn(
              'flex-1 rounded-md px-3 py-[7px] text-xs transition-all',
              tab === t2 ? 'bg-card font-semibold text-foreground shadow-sm' : 'text-muted-foreground'
            )}
            onClick={() => {
              setTab(t2)
              if (t2 === 'analyze' && companies.length > 0 && !batchResult) handleAnalyze()
            }}
          >
            {t(`company.tab${t2.charAt(0).toUpperCase() + t2.slice(1)}`)}
          </button>
        ))}
      </div>

      {tab === 'manage' && (
        <>
          {/* Add form */}
          <Card>
            <CardContent className='py-4'>
              <h3 className='text-sm font-semibold'>{t('company.addCompany')}</h3>
              <div className='mt-2 flex flex-col gap-2'>
                <Input placeholder={t('company.companyNameLabel')} value={name} onChange={(e) => setName(e.target.value)} />
                <Input type='date' min='1800-01-01' max='2025-12-31' value={foundingDate} onChange={(e) => setFoundingDate(e.target.value)} />
                <div className='grid grid-cols-2 gap-2'>
                  <Input placeholder={t('company.country')} value={country} onChange={(e) => setCountry(e.target.value)} />
                  <Input placeholder={t('company.memo')} />
                </div>
                <Button className='self-end' onClick={handleAdd} disabled={!name || !foundingDate}>
                  {t('company.add')}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Company list */}
          <Card>
            <CardContent className='py-4'>
              <h3 className='text-sm font-semibold'>{t('company.savedCompaniesLabel')}</h3>
              <div className='mt-2 flex flex-col gap-2'>
                {companies.map((c) => (
                  <div key={c.id} className='flex items-center justify-between rounded-lg bg-muted p-3'>
                    <div>
                      <div className='text-sm font-semibold'>{c.name}</div>
                      <div className='text-xs text-muted-foreground'>
                        {c.foundingDate}{c.country ? ` · ${c.country}` : ''}
                      </div>
                    </div>
                    <button
                      onClick={() => deleteCompany(c.id)}
                      className='text-xs text-destructive hover:underline'
                    >
                      {t('common.delete')}
                    </button>
                  </div>
                ))}
                {companies.length === 0 && (
                  <p className='py-4 text-center text-xs text-muted-foreground'>
                    {t('company.noCompanies')}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {tab === 'analyze' && (
        <>
          {loading ? (
            <Skeleton className='h-40 w-full rounded-xl' />
          ) : batchResult?.companies ? (
            <Card>
              <CardContent className='py-4'>
                <h3 className='text-sm font-semibold'>{t('company.batchResult')}</h3>
                <div className='mt-2 flex flex-col gap-2'>
                  {[1, 2, 3, 4].map((tierRank) => {
                    const items = batchResult.companies.filter((c) => c.tier.rank === tierRank)
                    if (items.length === 0) return null
                    return (
                      <div key={tierRank}>
                        <div className='mb-2 text-xs font-semibold' style={{
                          color: `var(--fortune-${tierRank === 1 ? 'great' : tierRank === 2 ? 'good' : tierRank === 3 ? 'caution' : 'bad'})`
                        }}>
                          Tier {tierRank}
                        </div>
                        {items.map((item) => (
                          <div
                            key={item.id}
                            className={cn(
                              'mb-2 rounded-lg border-l-[3px] bg-muted p-3',
                              TIER_COLORS[tierRank] || ''
                            )}
                          >
                            <div className='flex items-center justify-between'>
                              <span className='text-sm font-semibold'>{item.name}</span>
                              <FortuneBadge label={item.tier.label} level={tierRank === 1 ? 'great_fortune' : tierRank === 2 ? 'good_fortune' : 'small_misfortune'} />
                            </div>
                            <div className='mt-1 text-xs text-muted-foreground'>
                              {item.compatibility.relation.name}
                            </div>
                          </div>
                        ))}
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className='py-6 text-center'>
                <p className='text-sm text-muted-foreground'>{t('company.addFirst')}</p>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {tab === 'compare' && (
        <Card>
          <CardContent className='py-6 text-center'>
            <p className='text-sm text-muted-foreground'>
              {companies.length < 2 ? t('company.needTwoCompanies') : t('company.compareDesc')}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Mode entry */}
      <Separator />
      <div className='grid grid-cols-2 gap-2'>
        <Link href='/company/hr'>
          <Card className='cursor-pointer transition-colors hover:bg-card/80'>
            <CardContent className='py-3'>
              <div className='text-sm font-semibold'>{t('company.hrMode')}</div>
              <div className='text-xs text-muted-foreground'>{t('company.hrModeDesc')}</div>
            </CardContent>
          </Card>
        </Link>
        <Link href='/company/headhunter'>
          <Card className='cursor-pointer transition-colors hover:bg-card/80'>
            <CardContent className='py-3'>
              <div className='text-sm font-semibold'>{t('company.headhunterMode')}</div>
              <div className='text-xs text-muted-foreground'>{t('company.headhunterModeDesc')}</div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}

export default function CompanyPage() {
  const hydrated = useProfileHydrated()
  const birthDate = useProfileStore((s) => s.birthDate)
  if (!hydrated) return <Skeleton className='h-60 w-full rounded-xl' />
  if (!birthDate) return <p className='py-12 text-center text-sm text-muted-foreground'>Please set your birth date first.</p>
  return <CompanyContent />
}
