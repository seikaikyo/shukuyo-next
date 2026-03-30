'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react'
import { useProfileStore } from '@/stores/profile'
import zhTW from '@/locales/zh-TW'

type Messages = Record<string, unknown>
type TFn = (key: string, params?: Record<string, string | number>) => string

interface I18nContextValue {
  t: TFn
  locale: string
}

const I18nContext = createContext<I18nContextValue>({
  t: (key) => key,
  locale: 'zh-TW',
})

function resolve(obj: unknown, path: string): string | undefined {
  let cur: unknown = obj
  for (const seg of path.split('.')) {
    if (cur == null || typeof cur !== 'object') return undefined
    cur = (cur as Record<string, unknown>)[seg]
  }
  return typeof cur === 'string' ? cur : undefined
}

function interpolate(tpl: string, params: Record<string, string | number>) {
  let out = tpl
  for (const [k, v] of Object.entries(params)) {
    out = out.replaceAll(`{${k}}`, String(v))
  }
  return out
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const locale = useProfileStore((s) => s.locale)
  const [messages, setMessages] = useState<Messages>(zhTW as unknown as Messages)

  useEffect(() => {
    let cancelled = false
    if (locale === 'zh-TW') {
      setMessages(zhTW as unknown as Messages)
    } else if (locale === 'en') {
      import('@/locales/en').then((m) => {
        if (!cancelled) setMessages(m.default as unknown as Messages)
      })
    } else if (locale === 'ja') {
      import('@/locales/ja').then((m) => {
        if (!cancelled) setMessages(m.default as unknown as Messages)
      })
    }
    return () => { cancelled = true }
  }, [locale])

  const t: TFn = useCallback(
    (key, params) => {
      const val =
        resolve(messages, key) ??
        resolve(zhTW as unknown as Messages, key) ??
        key
      return params ? interpolate(val, params) : val
    },
    [messages],
  )

  const value = useMemo(() => ({ t, locale }), [t, locale])

  return <I18nContext value={value}>{children}</I18nContext>
}

export function useTranslation() {
  return useContext(I18nContext)
}
