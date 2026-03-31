'use client'

import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { levelColor, levelBg } from '@/utils/fortune-helpers'
import { useTranslation } from '@/lib/i18n'

interface Member {
  id: string
  name: string
}

interface TeamMatrixProps {
  members: Member[]
  matrix: Map<string, { level: string; level_name: string; relation: string }>
  loading?: boolean
  progress?: { done: number; total: number }
}

export function TeamMatrix({ members, matrix, loading, progress }: TeamMatrixProps) {
  const { t } = useTranslation()

  if (loading) {
    return (
      <div className='flex flex-col gap-2'>
        {progress && progress.total > 0 && (
          <p className='text-xs text-muted-foreground text-center'>
            {t('common.analyzing')}... {progress.done}/{progress.total}
          </p>
        )}
        <Skeleton className='h-64 rounded-lg' />
      </div>
    )
  }

  if (members.length < 2) {
    return (
      <Card>
        <CardContent className='pt-5 pb-5 text-center'>
          <p className='text-sm text-muted-foreground'>{t('hr.team.needTwo')}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className='pt-4 pb-4 overflow-x-auto'>
        <table className='w-full text-xs'>
          <thead>
            <tr>
              <th className='p-1.5 text-left text-muted-foreground font-medium' />
              {members.map((m) => (
                <th key={m.id} className='p-1.5 text-center text-muted-foreground font-medium whitespace-nowrap'>
                  {m.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {members.map((row) => (
              <tr key={row.id}>
                <td className='p-1.5 font-medium text-foreground whitespace-nowrap'>{row.name}</td>
                {members.map((col) => {
                  if (row.id === col.id) {
                    return <td key={col.id} className='p-1.5 text-center text-muted-foreground'>-</td>
                  }
                  const pair = matrix.get(`${row.id}:${col.id}`)
                  if (!pair) {
                    return <td key={col.id} className='p-1.5 text-center text-muted-foreground'>?</td>
                  }
                  return (
                    <td key={col.id} className='p-1'>
                      <div className={cn('rounded px-1.5 py-1 text-center', levelBg(pair.level), levelColor(pair.level))}>
                        <span className='font-bold text-xs'>{pair.level_name}</span>
                        <br />
                        <span className='text-[9px] opacity-80'>{pair.relation}</span>
                      </div>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  )
}
