'use client'

import Link from 'next/link'
import { useTranslation } from '@/lib/i18n'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function AboutPage() {
  const { t } = useTranslation()

  return (
    <div className='space-y-3'>
      <h1 className='font-serif text-[22px] font-bold'>{t('about.title')}</h1>

      <Card>
        <CardContent className='py-4'>
          <h3 className='text-sm font-semibold'>{t('about.philosophy')}</h3>
          <p className='mt-2 text-sm text-muted-foreground'>{t('about.philosophyContent')}</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className='py-4'>
          <h3 className='text-sm font-semibold'>{t('about.features')}</h3>
          <div className='mt-2 grid grid-cols-2 gap-2.5'>
            {[
              { titleKey: 'about.featureFortune', descKey: 'about.featureFortuneDesc' },
              { titleKey: 'about.featureCompat', descKey: 'about.featureCompatDesc' },
              { titleKey: 'about.featureLucky', descKey: 'about.featureLuckyDesc' },
              { titleKey: 'about.featureCompany', descKey: 'about.featureCompanyDesc' },
              { titleKey: 'about.featureI18n', descKey: 'about.featureI18nDesc' },
              { titleKey: 'about.featureKnowledge', descKey: 'about.featureKnowledgeDesc' },
            ].map((f) => (
              <div key={f.titleKey} className='rounded-lg bg-muted p-3'>
                <div className='text-sm font-semibold'>{t(f.titleKey)}</div>
                <div className='text-xs text-muted-foreground'>{t(f.descKey)}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className='py-4'>
          <h3 className='text-sm font-semibold'>{t('about.privacy')}</h3>
          <p className='mt-2 text-sm text-muted-foreground'>{t('about.privacyContent')}</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className='py-4'>
          <h3 className='text-sm font-semibold'>{t('about.developer')}</h3>
          <div className='mt-2 text-sm font-semibold'>DashAI</div>
          <div className='text-sm text-muted-foreground'>AI-assisted development</div>
          <div className='mt-3'>
            <Link href='/about/tech'>
              <Button variant='outline' size='sm'>{t('about.techStack')} →</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
