'use client'

import { useTranslation } from '@/lib/i18n'
import { Card, CardContent } from '@/components/ui/card'
import { Breadcrumb } from '@/components/shared/breadcrumb'
import { FortuneBadge } from '@/components/shared/fortune-badge'

const API_ENDPOINTS = [
  'GET  /shukuyo/fortune/daily/{date}',
  'GET  /shukuyo/fortune/weekly/{date}',
  'GET  /shukuyo/fortune/monthly/{year}/{month}',
  'GET  /shukuyo/fortune/yearly/{year}',
  'GET  /shukuyo/fortune/yearly-range',
  'GET  /shukuyo/fortune/calendar/{year}/{month}',
  'GET  /shukuyo/fortune/lucky-days/summary/{birth}',
  'GET  /shukuyo/fortune/lucky-days/pair/{d1}/{d2}',
  'POST /shukuyo/engine/compatibility',
  'POST /shukuyo/career/batch',
  'POST /shukuyo/career/comparison',
  'GET  /shukuyo/engine/mansions',
]

export default function TechPage() {
  const { t } = useTranslation()

  return (
    <div className='space-y-3'>
      <Breadcrumb items={[
        { label: t('nav.home'), href: '/' },
        { label: t('about.title'), href: '/about' },
        { label: t('about.techStack') },
      ]} />

      <h1 className='font-serif text-[22px] font-bold'>{t('about.techStack')}</h1>

      <Card>
        <CardContent className='py-4'>
          <h3 className='text-sm font-semibold'>{t('tech.frontend')}</h3>
          <div className='mt-2 flex flex-wrap gap-2'>
            {['Next.js 16', 'React 19', 'TypeScript', 'Tailwind CSS 4', 'shadcn/ui', 'Zustand'].map((t2) => (
              <FortuneBadge key={t2} label={t2} />
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className='py-4'>
          <h3 className='text-sm font-semibold'>{t('tech.backend')}</h3>
          <div className='mt-2 flex flex-wrap gap-2'>
            {['Go', 'Chi Router', 'Render'].map((t2) => (
              <FortuneBadge key={t2} label={t2} level='great_fortune' />
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className='py-4'>
          <h3 className='text-sm font-semibold'>{t('tech.infra')}</h3>
          <div className='mt-2 flex flex-wrap gap-2'>
            {['Vercel', 'Sentry', 'Logto', 'Vercel Analytics'].map((t2) => (
              <span key={t2} className='inline-flex items-center rounded-full bg-sky-500/10 px-2 py-0.5 text-[11px] font-semibold text-sky-600 dark:text-sky-400'>
                {t2}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className='py-4'>
          <h3 className='text-sm font-semibold'>{t('tech.apiEndpoints')} ({API_ENDPOINTS.length})</h3>
          <div className='mt-2 flex flex-col gap-1 font-mono text-xs text-muted-foreground'>
            {API_ENDPOINTS.map((ep) => (
              <div key={ep}>{ep}</div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className='py-3'>
          <p className='text-xs text-muted-foreground'>{t('tech.aiAssisted')}</p>
        </CardContent>
      </Card>
    </div>
  )
}
