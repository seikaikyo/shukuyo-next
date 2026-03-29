'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useProfileStore } from '@/stores/profile'
import { useCompatibility } from '@/hooks/use-compatibility'
import { PairResult } from '@/components/compatibility/pair-result'
import { PartnerList } from '@/components/compatibility/partner-list'
import { CompatFinder } from '@/components/compatibility/compat-finder'

// ---- Tab 定義 ----

const TABS = [
  { key: 'diagnose', label: '相性診斷' },
  { key: 'partners', label: '夥伴管理' },
  { key: 'explore', label: '相性探索' },
] as const

type TabKey = typeof TABS[number]['key']

// ---- 相性診斷 Tab ----

function DiagnoseTab() {
  const { birthDate } = useProfileStore()
  const { compatibility, loading, error, calculateCompatibility } = useCompatibility()
  const [date2, setDate2] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (birthDate && date2) calculateCompatibility(birthDate, date2)
  }

  return (
    <div className='flex flex-col gap-4'>
      <p className='text-xs text-muted-foreground'>輸入對方的出生日期，依宿曜道推算雙向相性</p>

      <Card>
        <CardContent className='pt-5 pb-5'>
          <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
            <div className='flex flex-col gap-1'>
              <label className='text-xs text-muted-foreground'>你的出生日期</label>
              <p className='text-sm text-foreground tabular-nums'>{birthDate || '（未設定，請先到個人檔案設定）'}</p>
            </div>
            <div className='flex flex-col gap-1'>
              <label className='text-xs text-muted-foreground' htmlFor='compat-date2'>對方的出生日期</label>
              <input
                id='compat-date2'
                type='date'
                value={date2}
                onChange={(e) => setDate2(e.target.value)}
                max={new Date().toISOString().slice(0, 10)}
                className='h-9 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary'
              />
            </div>
            <Button
              type='submit'
              disabled={!birthDate || !date2 || loading}
              className='w-full'
            >
              {loading ? '計算中…' : '診斷相性'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {error && !loading && (
        <div className='flex flex-col items-center gap-3 py-6 text-center'>
          <p className='text-sm text-muted-foreground'>計算失敗：{error}</p>
          <Button variant='outline' size='sm' onClick={() => birthDate && date2 && calculateCompatibility(birthDate, date2)}>
            重試
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
        <PairResult result={compatibility} />
      )}

      {!loading && !compatibility && !error && (
        <Card>
          <CardContent className='pt-5 pb-5 text-center flex flex-col gap-3'>
            <p className='text-sm text-muted-foreground'>宿曜道將 27 個星宿分為六種關係</p>
            <div className='flex flex-wrap justify-center gap-2'>
              {[
                { label: '安危', desc: '知己' },
                { label: '安壌', desc: '志向不同' },
                { label: '義衰', desc: '義氣' },
                { label: '友衰', desc: '友情' },
                { label: '栄親', desc: '親密' },
                { label: '栄害', desc: '競爭' },
              ].map(({ label, desc }) => (
                <span key={label} className='text-xs px-2 py-1 rounded-full border border-border text-muted-foreground'>
                  {label}（{desc}）
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
  const { birthDate } = useProfileStore()
  const { compatibility, loading: compatLoading, calculateCompatibility } = useCompatibility()
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
    await calculateCompatibility(birthDate, partner.birthDate)
    setPartnerLoading(false)
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
            <ArrowLeft className='h-4 w-4' />
            返回列表
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
          <PairResult result={compatibility} />
        )}
      </div>
    )
  }

  return (
    <div className='flex flex-col gap-4'>
      <p className='text-xs text-muted-foreground'>儲存常用對象，隨時查詢相性並追蹤關係狀態</p>
      <PartnerList onSelectPartner={handleSelectPartner} />
    </div>
  )
}

// ---- Page ----

export default function CompatibilityPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('diagnose')

  // session 恢復
  useEffect(() => {
    const saved = sessionStorage.getItem('shukuyo_compat_tab') as TabKey | null
    if (saved && TABS.some((t) => t.key === saved)) setActiveTab(saved)
  }, [])

  function switchTab(tab: TabKey) {
    setActiveTab(tab)
    sessionStorage.setItem('shukuyo_compat_tab', tab)
  }

  return (
    <div className='mx-auto w-full max-w-2xl px-4 pb-12 flex flex-col gap-4'>
      {/* header */}
      <div className='py-4 flex flex-col gap-1'>
        <h2 className='text-base font-semibold text-foreground'>相性診斷</h2>
        <p className='text-xs text-muted-foreground'>依宿曜道推算人際相性</p>
      </div>

      {/* tab bar */}
      <div
        className='flex border-b border-border overflow-x-auto scrollbar-hide -mx-4 px-4'
        role='tablist'
        aria-label='相性功能'
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

      {/* tab content */}
      <div role='tabpanel'>
        {activeTab === 'diagnose' && <DiagnoseTab />}
        {activeTab === 'partners' && <PartnersTab />}
        {activeTab === 'explore' && <CompatFinder />}
      </div>
    </div>
  )
}
