'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Users, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useProfileStore } from '@/stores/profile'
import { useCompanyAnalysis } from '@/hooks/use-company'
import { CompanyList } from '@/components/company/company-list'
import { CompanyBatch, CompanyBatchSkeleton } from '@/components/company/company-batch'
import { Breadcrumb } from '@/components/shared/breadcrumb'
import { useTranslation } from '@/lib/i18n'

type TabKey = 'manage' | 'analysis' | 'compare'

function ManageTab() {
  const { t } = useTranslation()
  return (
    <div className='flex flex-col gap-4'>
      <p className='text-xs text-muted-foreground'>{t('company.batchHint')}</p>
      <CompanyList />
    </div>
  )
}

function AnalysisTab() {
  const { t } = useTranslation()
  const { birthDate, companies, locale } = useProfileStore()
  const { batchResult, loading, error, fetchBatchAnalysis } = useCompanyAnalysis()

  useEffect(() => {
    if (birthDate && companies.length > 0) {
      fetchBatchAnalysis(new Date().getFullYear(), locale)
    }
  }, [birthDate, companies, locale, fetchBatchAnalysis])

  if (!birthDate) {
    return <p className='text-sm text-muted-foreground text-center py-8'>{t('profile.birthdayNotSet')}</p>
  }

  if (companies.length === 0) {
    return <p className='text-sm text-muted-foreground text-center py-8'>{t('v3.company.noCompanies')}</p>
  }

  return (
    <div className='flex flex-col gap-4'>
      {error && !loading && (
        <div role='alert' className='flex flex-col items-center gap-3 py-8 text-center'>
          <p className='text-sm text-muted-foreground'>{t('error.fetchFailed')}</p>
          <Button variant='outline' size='sm' onClick={() => fetchBatchAnalysis(new Date().getFullYear(), locale)}>
            {t('common.retry')}
          </Button>
        </div>
      )}
      {loading && <CompanyBatchSkeleton />}
      {!loading && batchResult && <CompanyBatch result={batchResult} />}
    </div>
  )
}

function CompareTab() {
  const { t } = useTranslation()
  const { birthDate, companies, locale } = useProfileStore()
  const { comparisonResult, comparing, error, fetchComparison } = useCompanyAnalysis()

  if (!birthDate) {
    return <p className='text-sm text-muted-foreground text-center py-8'>{t('profile.birthdayNotSet')}</p>
  }

  if (companies.filter(c => c.foundingDate).length < 2) {
    return <p className='text-sm text-muted-foreground text-center py-8'>{t('company.comparison.minWarning')}</p>
  }

  return (
    <div className='flex flex-col gap-4'>
      <Button
        onClick={() => fetchComparison(undefined, locale)}
        disabled={comparing}
        className='self-start'
      >
        {comparing ? t('company.comparison.analyzing') : t('company.comparison.compareBtn')}
      </Button>

      {error && !comparing && (
        <p role='alert' className='text-sm text-muted-foreground text-center'>{error}</p>
      )}

      {comparing && (
        <div className='flex flex-col gap-3'>
          {[1, 2, 3].map(i => <Skeleton key={i} className='h-32 rounded-lg' />)}
        </div>
      )}

      {!comparing && comparisonResult && (
        <div className='flex flex-col gap-4'>
          {comparisonResult.verdict && (
            <div className='rounded-lg bg-primary/5 border border-primary/20 px-4 py-3'>
              <p className='text-sm text-foreground font-medium'>{comparisonResult.verdict.summary}</p>
              {comparisonResult.verdict.top_pick && (
                <p className='text-xs text-muted-foreground mt-1'>
                  {t('company.topPick')}: {comparisonResult.verdict.top_pick}
                </p>
              )}
              {comparisonResult.verdict.warnings.length > 0 && (
                <ul className='mt-2 flex flex-col gap-0.5'>
                  {comparisonResult.verdict.warnings.map((w, i) => (
                    <li key={`${i}-${w.slice(0, 20)}`} className='text-xs text-[var(--fortune-caution)] flex items-start gap-1'>
                      <span className='shrink-0 mt-0.5'>·</span>{w}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {comparisonResult.companies.map((c) => (
            <div key={c.id} className='rounded-lg border border-border p-4 flex flex-col gap-2'>
              <div className='flex items-center justify-between'>
                <p className='text-sm font-semibold text-foreground'>{c.name}</p>
              </div>
              <div className='flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground'>
                <span>{c.compatibility.relation_name}</span>
                <span>{c.compatibility.level}</span>
                <span>{t('company.comparison.drainIndex')} {c.drain.label}</span>
              </div>
              <span className={cn(
                'text-[10px] px-1.5 py-0.5 rounded self-start',
                c.priority.rank === 1 ? 'bg-[var(--fortune-great)]/12 text-[var(--fortune-great)]' :
                c.priority.rank === 2 ? 'bg-[var(--fortune-good)]/12 text-[var(--fortune-good)]' :
                'bg-[var(--fortune-caution)]/12 text-[var(--fortune-caution)]'
              )}>
                {c.priority.label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function CompanyPage() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState<TabKey>('manage')

  const TABS: { key: TabKey; label: string }[] = [
    { key: 'manage', label: t('company.companyManageTab') },
    { key: 'analysis', label: t('company.batchAnalysis') },
    { key: 'compare', label: t('company.comparison.title') },
  ]

  useEffect(() => {
    const saved = sessionStorage.getItem('shukuyo_company_tab') as TabKey | null
    if (saved && TABS.some((tab) => tab.key === saved)) setActiveTab(saved)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function switchTab(tab: TabKey) {
    setActiveTab(tab)
    sessionStorage.setItem('shukuyo_company_tab', tab)
  }

  return (
    <div className='mx-auto w-full max-w-2xl px-4 pb-12 flex flex-col gap-4'>
      <Breadcrumb
        items={[
          { label: t('nav.home'), href: '/' },
          { label: t('v3.company.title') },
        ]}
        className='pt-2'
      />

      <div className='py-2 flex flex-col gap-1'>
        <h2 className='text-base font-semibold text-foreground'>{t('v3.company.title')}</h2>
        <p className='text-xs text-muted-foreground'>{t('v3.company.subtitle')}</p>
      </div>

      <div
        className='flex border-b border-border overflow-x-auto scrollbar-hide -mx-4 px-4'
        role='tablist'
        aria-label={t('v3.company.title')}
      >
        {TABS.map((tab) => (
          <button
            key={tab.key}
            role='tab'
            aria-selected={activeTab === tab.key}
            onClick={() => switchTab(tab.key)}
            className={cn(
              'flex-shrink-0 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors whitespace-nowrap',
              activeTab === tab.key
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div role='tabpanel'>
        {activeTab === 'manage' && <ManageTab />}
        {activeTab === 'analysis' && <AnalysisTab />}
        {activeTab === 'compare' && <CompareTab />}
      </div>

      {/* mode links */}
      <div className='grid grid-cols-2 gap-3 pt-4 border-t border-border'>
        <Link href='/company/hr'>
          <Card className='border border-border hover:border-primary/40 hover:shadow-sm transition-all cursor-pointer h-full'>
            <CardContent className='flex flex-col items-center gap-1.5 pt-5 pb-5 text-center'>
              <Users className='size-5 text-primary' aria-hidden='true' />
              <span className='text-xs font-medium text-foreground'>{t('modeEntry.hr')}</span>
              <span className='text-[10px] text-muted-foreground'>{t('hr.teamCompatibility')}</span>
            </CardContent>
          </Card>
        </Link>
        <Link href='/company/headhunter'>
          <Card className='border border-border hover:border-primary/40 hover:shadow-sm transition-all cursor-pointer h-full'>
            <CardContent className='flex flex-col items-center gap-1.5 pt-5 pb-5 text-center'>
              <Search className='size-5 text-primary' aria-hidden='true' />
              <span className='text-xs font-medium text-foreground'>{t('modeEntry.headhunter')}</span>
              <span className='text-[10px] text-muted-foreground'>{t('modeEntry.headhunterDesc')}</span>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}
