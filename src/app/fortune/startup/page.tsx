'use client'

import { useState, useEffect } from 'react'
import { useProfileStore, useProfileHydrated } from '@/stores/profile'
import { useTranslation } from '@/lib/i18n'
import { useStartup } from '@/hooks/use-startup'
import { getYoseiFullName } from '@/utils/yosei'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Breadcrumb } from '@/components/shared/breadcrumb'
import { FortuneBadge } from '@/components/shared/fortune-badge'
import { MansionTag } from '@/components/shared/mansion-tag'

function StartupContent() {
  const { t, locale } = useTranslation()
  const birthDate = useProfileStore((s) => s.birthDate)!
  const { industryRecs, industryLoading, fetchIndustryRecommendations } = useStartup()
  const [tab, setTab] = useState<'industry' | 'calendar'>('industry')

  useEffect(() => {
    fetchIndustryRecommendations(birthDate, locale)
  }, [birthDate, locale, fetchIndustryRecommendations])

  if (industryLoading || !industryRecs) return <Skeleton className='h-60 w-full rounded-xl' />

  return (
    <div className='space-y-3'>
      <Breadcrumb items={[
        { label: t('nav.home'), href: '/' },
        { label: t('nav.fortune'), href: '/fortune/daily' },
        { label: t('fortune.startup') },
      ]} />

      <h1 className='font-serif text-[22px] font-bold'>{t('fortune.startupTitle')}</h1>
      <p className='text-sm text-muted-foreground'>{t('fortune.startupDesc')}</p>

      {/* Tab toggle */}
      <div className='flex max-w-[240px] gap-0.5 rounded-lg border border-border bg-muted p-[3px]'>
        <button
          className={`flex-1 rounded-md px-3 py-[7px] text-xs transition-all ${tab === 'industry' ? 'bg-card font-semibold text-foreground shadow-sm' : 'text-muted-foreground'}`}
          onClick={() => setTab('industry')}
        >
          {t('fortune.industryRec')}
        </button>
        <button
          className={`flex-1 rounded-md px-3 py-[7px] text-xs transition-all ${tab === 'calendar' ? 'bg-card font-semibold text-foreground shadow-sm' : 'text-muted-foreground'}`}
          onClick={() => setTab('calendar')}
        >
          {t('fortune.startupCalendarLabel')}
        </button>
      </div>

      {tab === 'industry' && (
        <>
          {/* Industry tags */}
          <Card>
            <CardContent className='py-4'>
              <div className='mb-3 flex items-center gap-2'>
                <MansionTag
                  yosei={industryRecs.mansion.name_jp ? 'moon' : ''}
                  yoseiLabel=''
                  name={industryRecs.mansion.name_jp}
                />
                <span className='text-sm text-muted-foreground'>
                  {t('fortune.suitableIndustries')}
                </span>
              </div>
              <div className='mb-3 flex flex-wrap gap-2'>
                {industryRecs.career_tags.map((tag) => (
                  <FortuneBadge key={tag} label={tag} />
                ))}
              </div>
              <p className='text-sm text-muted-foreground'>
                {industryRecs.career_description}
              </p>
            </CardContent>
          </Card>

          {/* Favorable mansions */}
          {industryRecs.favorable_mansions.length > 0 && (
            <Card>
              <CardContent className='py-4'>
                <h3 className='text-sm font-semibold'>{t('fortune.favorableMansionsLabel')}</h3>
                <p className='mb-3 text-xs text-muted-foreground'>
                  {t('fortune.favorableMansionsDesc')}
                </p>
                <div className='flex flex-col gap-2.5'>
                  {industryRecs.favorable_mansions.map((fm) => (
                    <div
                      key={fm.index}
                      className='flex items-center gap-3 rounded-lg bg-muted p-3'
                    >
                      <MansionTag yosei='' yoseiLabel='' name={fm.name_jp} />
                      <div className='flex-1'>
                        <div className='text-xs text-muted-foreground'>{fm.summary}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {tab === 'calendar' && (
        <Card>
          <CardContent className='py-6 text-center'>
            <p className='text-sm text-muted-foreground'>
              {t('fortune.startupCalendarDesc')}
            </p>
            <a href='/fortune/calendar'>
              <Button variant='outline' className='mt-3'>
                {t('fortune.goToCalendar')}
              </Button>
            </a>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default function StartupPage() {
  const hydrated = useProfileHydrated()
  const birthDate = useProfileStore((s) => s.birthDate)
  if (!hydrated) return <Skeleton className='h-60 w-full rounded-xl' />
  if (!birthDate) return <p className='py-12 text-center text-sm text-muted-foreground'>Please set your birth date first.</p>
  return <StartupContent />
}
