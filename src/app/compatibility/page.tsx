'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/lib/i18n'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useProfileStore } from '@/stores/profile'
import { useCompatibility } from '@/hooks/use-compatibility'
import { usePairLuckyDays } from '@/hooks/use-pair-lucky-days'
import { PairResult } from '@/components/compatibility/pair-result'
import { PairLuckyDays, PairLuckyDaysSkeleton } from '@/components/compatibility/pair-lucky-days'
import { PartnerList } from '@/components/compatibility/partner-list'
import { CompatFinder } from '@/components/compatibility/compat-finder'
import { preloadRedFlags } from '@/utils/red-flags'
import { preloadGapGuidance } from '@/utils/gap-guidance'

// ---- Tab 定義 ----

const TAB_KEYS = ['diagnose', 'partners', 'explore'] as const
type TabKey = typeof TAB_KEYS[number]

const TAB_LABEL_KEYS: Record<TabKey, string> = {
  diagnose: 'v3.match.directMode',
  partners: 'v3.match.savedMode',
  explore: 'v3.match.finderMode',
}

// ---- 相性診斷 Tab ----

function DiagnoseTab() {
  const { t } = useTranslation()
  const { birthDate, locale } = useProfileStore()
  const { compatibility, loading, error, calculateCompatibility } = useCompatibility()
  const { pairLuckyDays, loading: luckyLoading, fetchPairLuckyDays } = usePairLuckyDays()
  const [date2, setDate2] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!birthDate || !date2) return
    const result = await calculateCompatibility(birthDate, date2)
    if (result) {
      fetchPairLuckyDays(birthDate, date2, undefined, locale)
    }
  }

  return (
    <div className='flex flex-col gap-4'>
      <p className='text-xs text-muted-foreground'>{t('v3.match.subtitle')}</p>

      <Card>
        <CardContent className='pt-5 pb-5'>
          <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
            <div className='flex flex-col gap-1'>
              <label className='text-xs text-muted-foreground'>{t('setup.birthDate')}</label>
              <p className='text-sm text-foreground tabular-nums'>{birthDate || t('profile.birthdayNotSet')}</p>
            </div>
            <div className='flex flex-col gap-1'>
              <label className='text-xs text-muted-foreground' htmlFor='compat-date2'>{t('profile.birthDate')}</label>
              <input
                id='compat-date2'
                type='date'
                value={date2}
                onChange={(e) => setDate2(e.target.value)}
                min='1900-01-01'
                max={new Date().toISOString().slice(0, 10)}
                className='h-9 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary'
              />
            </div>
            <Button
              type='submit'
              disabled={!birthDate || !date2 || loading}
              className='w-full'
            >
              {loading ? t('common.analyzing') : t('v3.match.analyze')}
            </Button>
          </form>
        </CardContent>
      </Card>

      {error && !loading && (
        <div role='alert' className='flex flex-col items-center gap-3 py-6 text-center'>
          <p className='text-sm text-muted-foreground'>{t('error.fetchFailed')}</p>
          <Button variant='outline' size='sm' onClick={() => birthDate && date2 && calculateCompatibility(birthDate, date2)}>
            {t('common.retry')}
          </Button>
        </div>
      )}

      {loading && (
        <div className='flex flex-col gap-3'>
          <Skeleton className='h-32 rounded-xl' />
          <Skeleton className='h-24 rounded-lg' />
          <Skeleton className='h-40 rounded-lg' />
        </div>
      )}

      {!loading && compatibility && (
        <>
          <PairResult result={compatibility} />
          {luckyLoading && <PairLuckyDaysSkeleton />}
          {!luckyLoading && pairLuckyDays && (
            <PairLuckyDays result={pairLuckyDays} locale={locale} />
          )}
        </>
      )}

      {!loading && !compatibility && !error && (
        <Card>
          <CardContent className='pt-5 pb-5 text-center flex flex-col gap-3'>
            <p className='text-sm text-muted-foreground'>{t('v3.match.relationDetail')}</p>
            <div className='flex flex-wrap justify-center gap-2'>
              {[
                { label: '安危', descKey: 'compat.anki' },
                { label: '安壌', descKey: 'compat.anjo' },
                { label: '義衰', descKey: 'compat.gisui' },
                { label: '友衰', descKey: 'compat.yusui' },
                { label: '栄親', descKey: 'compat.eishin' },
                { label: '栄害', descKey: 'compat.eigai' },
              ].map(({ label, descKey }) => (
                <span key={label} className='text-xs px-2 py-1 rounded-full border border-border text-muted-foreground'>
                  {label}({t(descKey)})
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// ---- 夥伴管理 Tab ----

function PartnersTab() {
  const { t } = useTranslation()
  const { birthDate, locale } = useProfileStore()
  const { compatibility, loading: compatLoading, calculateCompatibility } = useCompatibility()
  const { pairLuckyDays, loading: luckyLoading, fetchPairLuckyDays } = usePairLuckyDays()
  const [selectedPartnerId, setSelectedPartnerId] = useState<string | null>(null)
  const [partnerName, setPartnerName] = useState<string | null>(null)
  const [partnerLoading, setPartnerLoading] = useState(false)

  const { partners } = useProfileStore()

  async function handleSelectPartner(id: string) {
    const partner = partners.find((p) => p.id === id)
    if (!partner?.birthDate || !birthDate) return

    setPartnerLoading(true)
    setSelectedPartnerId(id)
    setPartnerName(partner.nickname)
    const result = await calculateCompatibility(birthDate, partner.birthDate)
    setPartnerLoading(false)
    if (result) {
      fetchPairLuckyDays(birthDate, partner.birthDate, partner.relation, locale)
    }
  }

  function handleBack() {
    setSelectedPartnerId(null)
    setPartnerName(null)
  }

  if (selectedPartnerId) {
    return (
      <div className='flex flex-col gap-4'>
        <div className='flex items-center gap-2'>
          <Button variant='ghost' size='sm' onClick={handleBack} className='flex items-center gap-1 -ml-2'>
            <ArrowLeft className='h-4 w-4' aria-hidden='true' />
            {t('common.backToList')}
          </Button>
        </div>
        {partnerName && (
          <div className='px-4 py-3 rounded-lg border-l-4 border-l-primary bg-primary/5 flex items-baseline gap-2'>
            <span className='text-base font-semibold text-foreground'>{partnerName}</span>
            <span className='text-xs text-muted-foreground'>
              {partners.find((p) => p.id === selectedPartnerId)?.birthDate}
            </span>
          </div>
        )}
        {(partnerLoading || compatLoading) && (
          <div className='flex flex-col gap-3'>
            <Skeleton className='h-32 rounded-xl' />
            <Skeleton className='h-24 rounded-lg' />
          </div>
        )}
        {!partnerLoading && !compatLoading && compatibility && (
          <>
            <PairResult result={compatibility} />
            {luckyLoading && <PairLuckyDaysSkeleton />}
            {!luckyLoading && pairLuckyDays && (
              <PairLuckyDays result={pairLuckyDays} locale={locale} />
            )}
          </>
        )}
      </div>
    )
  }

  return (
    <div className='flex flex-col gap-4'>
      <p className='text-xs text-muted-foreground'>{t('v3.match.pairLuckyDesc')}</p>
      <PartnerList onSelectPartner={handleSelectPartner} />
    </div>
  )
}

// ---- Page ----

export default function CompatibilityPage() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState<TabKey>('diagnose')
  const locale = useProfileStore((s) => s.locale)

  // 預載紅旗 + 差距指引 JSON（按需載入 locale）
  useEffect(() => {
    preloadRedFlags(locale)
    preloadGapGuidance(locale)
  }, [locale])

  // session 恢復
  useEffect(() => {
    const saved = sessionStorage.getItem('shukuyo_compat_tab') as TabKey | null
    if (saved && TAB_KEYS.includes(saved)) setActiveTab(saved)
  }, [])

  function switchTab(tab: TabKey) {
    setActiveTab(tab)
    sessionStorage.setItem('shukuyo_compat_tab', tab)
  }

  return (
    <div className='mx-auto w-full max-w-2xl px-4 pb-12 flex flex-col gap-4'>
      {/* header */}
      <div className='py-4 flex flex-col gap-1'>
        <h2 className='text-base font-semibold text-foreground'>{t('v3.match.title')}</h2>
        <p className='text-xs text-muted-foreground'>{t('v3.match.subtitle')}</p>
      </div>

      {/* tab bar */}
      <div
        className='flex border-b border-border overflow-x-auto scrollbar-hide -mx-4 px-4'
        role='tablist'
        aria-label={t('v3.match.title')}
      >
        {TAB_KEYS.map((key) => (
          <button
            key={key}
            role='tab'
            aria-selected={activeTab === key}
            onClick={() => switchTab(key)}
            className={cn(
              'flex-shrink-0 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors whitespace-nowrap',
              activeTab === key
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            {t(TAB_LABEL_KEYS[key])}
          </button>
        ))}
      </div>

      {/* tab content */}
      <div role='tabpanel'>
        {activeTab === 'diagnose' && <DiagnoseTab />}
        {activeTab === 'partners' && <PartnersTab />}
        {activeTab === 'explore' && <CompatFinder />}
      </div>
    </div>
  )
}
