import type { Metadata } from 'next'
import { Inter, Noto_Sans_JP, Noto_Serif_JP } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { ThemeProvider } from '@/components/theme-provider'
import { I18nProvider } from '@/lib/i18n'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { BottomTabs } from '@/components/layout/bottom-tabs'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  variable: '--font-noto-sans-jp',
  display: 'swap',
  weight: ['400', '500', '700'],
})

const notoSerifJP = Noto_Serif_JP({
  subsets: ['latin'],
  variable: '--font-noto-serif-jp',
  display: 'swap',
  weight: ['400', '600', '700'],
})

export const metadata: Metadata = {
  title: {
    default: '\u5BBF\u66DC\u9053 | Shukuyodo',
    template: '%s | \u5BBF\u66DC\u9053',
  },
  description:
    '\u5370\u5EA6\u5360\u661F\u8853\u300C\u5BBF\u66DC\u7D4C\u300D\u306B\u57FA\u3065\u304F\u904B\u52E2\u30FB\u76F8\u6027\u8A3A\u65AD\u30A2\u30D7\u30EA',
  openGraph: {
    title: '\u5BBF\u66DC\u9053 | Shukuyodo',
    description: '\u5370\u5EA6\u5360\u661F\u8853\u300C\u5BBF\u66DC\u7D4C\u300D\u306B\u57FA\u3065\u304F\u904B\u52E2\u30FB\u76F8\u6027\u8A3A\u65AD',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang='zh-TW'
      suppressHydrationWarning
      className={`${inter.variable} ${notoSansJP.variable} ${notoSerifJP.variable}`}
    >
      <body className='min-h-screen bg-background text-foreground antialiased'>
        <ThemeProvider>
          <I18nProvider>
            <Navbar />
            <main className='mx-auto max-w-2xl px-4 pt-16 pb-24 md:pb-8'>
              {children}
            </main>
            <Footer />
            <BottomTabs />
            <Toaster />
          </I18nProvider>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
