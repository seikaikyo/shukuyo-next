import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '日運 | 宿曜道',
  description: '每日運勢詳細分析，包含事業、感情、健康、財運分數與建議',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
