import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function FortuneDailyLoading() {
  return (
    <div className='mx-auto w-full max-w-2xl px-4 pb-12 flex flex-col gap-4'>
      {/* date nav skeleton */}
      <div className='flex items-center justify-center gap-2 py-4'>
        <Skeleton className='h-8 w-8 rounded-full' />
        <Skeleton className='h-4 w-48' />
        <Skeleton className='h-8 w-8 rounded-full' />
      </div>

      {/* score card skeleton */}
      <Card className='border border-border'>
        <CardContent className='flex flex-col items-center gap-3 pt-8 pb-8'>
          <Skeleton className='h-32 w-32 rounded-full' />
          <Skeleton className='h-6 w-16 mt-1' />
          <Skeleton className='h-4 w-52' />
          <Skeleton className='h-4 w-44' />
        </CardContent>
      </Card>

      {/* category card skeleton */}
      <Card className='border border-border'>
        <CardContent className='pt-5 pb-5 flex flex-col gap-4'>
          <Skeleton className='h-3 w-20' />
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className='flex flex-col gap-1.5'>
              <div className='flex items-center gap-3'>
                <Skeleton className='h-3 w-10 shrink-0' />
                <Skeleton className='h-1.5 flex-1' />
                <Skeleton className='h-3 w-7' />
              </div>
              <Skeleton className='h-3 w-3/4 ml-[52px]' />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* lucky card skeleton */}
      <Card className='border border-border'>
        <CardContent className='pt-5 pb-5 flex flex-col gap-3'>
          <Skeleton className='h-3 w-16' />
          <div className='grid grid-cols-3 gap-3'>
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className='h-20 rounded-md' />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
