import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '知識庫 | 宿曜道',
  description: '二十七宿完整解說、六種關係類型、宿曜經歷史與核心概念',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
