'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // 避免 SSR hydration 不一致
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const isDark = theme === 'dark'

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={isDark ? '切換為亮色模式' : '切換為暗色模式'}
      className='
        inline-flex items-center justify-center
        w-9 h-9 rounded-md
        text-base leading-none
        text-[oklch(0.75_0.12_60)]
        hover:bg-[oklch(1_0_0/8%)]
        transition-colors duration-200
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[oklch(0.75_0.12_60)]
      '
    >
      {isDark ? '☀' : '☽'}
    </button>
  )
}
