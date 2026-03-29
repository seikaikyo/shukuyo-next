import type { Metadata } from 'next'
import { Inter, Noto_Sans_JP, Noto_Serif_JP } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { BottomTabs } from '@/components/layout/bottom-tabs'
import { Toaster } from 'sonner'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
})

const notoSansJP = Noto_Sans_JP({
  variable: '--font-sans',
  subsets: ['latin'],
  weight: ['400', '500', '700'],
})

const notoSerifJP = Noto_Serif_JP({
  variable: '--font-serif',
  subsets: ['latin'],
  weight: ['400', '600', '700'],
})

export const metadata: Metadata = {
  title: '宿曜道 | Shukuyodo',
  description:
    '宿曜道是以古印度天文學為基礎的占星系統，透過二十七宿推算命運、相性與吉凶。探索你的本命宿，了解個性特質與人際關係。',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang='zh-TW'
      className={`${inter.variable} ${notoSansJP.variable} ${notoSerifJP.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className='min-h-full flex flex-col'>
        <ThemeProvider
          attribute='class'
          defaultTheme='dark'
          enableSystem
        >
          <Navbar />
          <main className='flex-1 pt-16 pb-16 md:pb-0'>
            {children}
          </main>
          <Footer />
          <BottomTabs />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
