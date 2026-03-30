import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '公司分析 | 宿曜道',
  description: '依宿曜道推算你與公司的相性，批次分析求職目標，找到最適合的職場',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
