'use client'

import { useState } from 'react'
import { useProfileStore, useProfileHydrated } from '@/stores/profile'
import { useTranslation } from '@/lib/i18n'
import { useCompatibility } from '@/hooks/use-compatibility'
import { usePairLuckyDays } from '@/hooks/use-pair-lucky-days'
import { getYoseiFullName } from '@/utils/yosei'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { LevelRing } from '@/components/shared/level-ring'
import { FortuneBadge, levelToKey } from '@/components/shared/fortune-badge'
import { MansionTag } from '@/components/shared/mansion-tag'
import { Breadcrumb } from '@/components/shared/breadcrumb'
import { cn } from '@/lib/utils'

const RELATION_COLORS: Record<string, string> = {
  great: 'bg-[var(--fortune-great)]/12 text-[var(--fortune-great)]',
  good: 'bg-[var(--fortune-good)]/10 text-[var(--fortune-good)]',
  caution: 'bg-[var(--fortune-caution)]/10 text-[var(--fortune-caution)]',
  bad: 'bg-[var(--fortune-bad)]/10 text-[var(--fortune-bad)]',
}

function CompatContent() {
  const { t, locale } = useTranslation()
  const birthDate = useProfileStore((s) => s.birthDate)!
  const { compatibility: result, loading, calculateCompatibility } = useCompatibility()
  const [partnerDate, setPartnerDate] = useState('')

  async function handleAnalyze() {
    if (!partnerDate) return
    await calculateCompatibility(birthDate, partnerDate)
  }

  return (
    <div className='space-y-3'>
      <Breadcrumb items={[
        { label: t('nav.home'), href: '/' },
        { label: t('nav.compatibility') },
      ]} />

      {/* My info */}
      <Card>
        <CardContent className='py-3'>
          <h3 className='text-sm font-semibold'>{t('compatibility.yourBirthday')}</h3>
          <div className='mt-2 flex items-center gap-2'>
            <span className='text-sm text-muted-foreground'>{birthDate}</span>
          </div>
        </CardContent>
      </Card>

      {/* Partner input */}
      <Card>
        <CardContent className='py-4'>
          <h3 className='text-sm font-semibold'>{t('compatibility.partnerBirthday')}</h3>
          <Input
            type='date'
            min='1920-01-01'
            max='2020-12-31'
            className='mt-2'
            value={partnerDate}
            onChange={(e) => setPartnerDate(e.target.value)}
          />
          <Button
            className='mt-3 w-full'
            disabled={!partnerDate || loading}
            onClick={handleAnalyze}
          >
            {loading ? t('common.loading') : t('compatibility.analyze')}
          </Button>
        </CardContent>
      </Card>

      {/* Result */}
      {result && (
        <>
          <Card>
            <CardContent className='py-6 text-center'>
              <div className='flex items-center justify-center gap-4'>
                <div className='text-center'>
                  <MansionTag
                    yosei={result.person1.yosei}
                    yoseiLabel={getYoseiFullName(result.person1.yosei, locale)}
                    name={result.person1.mansion}
                  />
                  <div className='mt-1 text-xs text-muted-foreground'>{t('compatibility.you')}</div>
                </div>
                <span className='text-2xl text-primary'>x</span>
                <div className='text-center'>
                  <MansionTag
                    yosei={result.person2.yosei}
                    yoseiLabel={getYoseiFullName(result.person2.yosei, locale)}
                    name={result.person2.mansion}
                  />
                  <div className='mt-1 text-xs text-muted-foreground'>{t('compatibility.partnerLabel')}</div>
                </div>
              </div>

              <div className='mt-4'>
                <LevelRing level={result.level} label={result.relation.name} />
              </div>
              <div className='mt-2 font-serif text-sm font-semibold'>
                {result.relation.name}（{result.relation.reading}）
              </div>
              <FortuneBadge label={result.level_name || ''} level={result.level} className='mt-2' />
              <p className='mt-3 max-w-[400px] mx-auto text-sm text-muted-foreground'>
                {result.relation.description}
              </p>

              {/* Directional */}
              {result.directional_scores && (
                <div className='mt-4 grid grid-cols-2 gap-3'>
                  <div className='rounded-lg bg-muted p-3 text-center'>
                    <div className='text-xs text-muted-foreground'>
                      {t('compatibility.youToPartner')}
                    </div>
                    <div className='text-sm font-semibold' style={{ color: 'var(--fortune-great)' }}>
                      {result.directional_scores.person1_to_person2?.direction} · {result.directional_scores.person1_to_person2?.position}
                    </div>
                  </div>
                  <div className='rounded-lg bg-muted p-3 text-center'>
                    <div className='text-xs text-muted-foreground'>
                      {t('compatibility.partnerToYou')}
                    </div>
                    <div className='text-sm font-semibold' style={{ color: 'var(--fortune-good)' }}>
                      {result.directional_scores.person2_to_person1?.direction} · {result.directional_scores.person2_to_person1?.position}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Six relations legend */}
          <Card>
            <CardContent className='py-4'>
              <h3 className='text-sm font-semibold'>{t('compatibility.sixRelations')}</h3>
              <div className='mt-2 grid grid-cols-3 gap-1.5'>
                {[
                  { name: '\u547D', level: 'great', desc: '\u6700\u5F37' },
                  { name: '\u696D\u80CE', level: 'great', desc: '\u524D\u4E16\u7E01' },
                  { name: '\u69AE\u89AA', level: 'good', desc: '\u4E92\u5229' },
                  { name: '\u53CB\u8870', level: 'good', desc: '\u7A69\u5B9A' },
                  { name: '\u5B89\u58DE', level: 'caution', desc: '\u8907\u96DC' },
                  { name: '\u5371\u6210', level: 'bad', desc: '\u5C0D\u7ACB' },
                ].map((r) => (
                  <div
                    key={r.name}
                    className={cn('rounded-lg p-3 text-center', RELATION_COLORS[r.level])}
                  >
                    <div className='text-sm font-semibold'>{r.name}</div>
                    <div className='text-xs opacity-80'>{r.desc}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}

export default function CompatibilityPage() {
  const hydrated = useProfileHydrated()
  const birthDate = useProfileStore((s) => s.birthDate)
  if (!hydrated) return <Skeleton className='h-60 w-full rounded-xl' />
  if (!birthDate) return <p className='py-12 text-center text-sm text-muted-foreground'>Please set your birth date first.</p>
  return <CompatContent />
}
