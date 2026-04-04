'use client'

import { FortuneSubTabs } from '@/components/shared/fortune-sub-tabs'

export default function FortuneLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <FortuneSubTabs />
      {children}
    </div>
  )
}
