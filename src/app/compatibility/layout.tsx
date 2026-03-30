import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '相性診斷 | 宿曜道',
  description: '依二十七宿推算雙向人際相性，包含六種關係類型、紅旗分析與配對吉日',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
