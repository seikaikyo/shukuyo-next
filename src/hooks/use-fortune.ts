'use client'
import { useState, useCallback } from 'react'
import { apiGet } from '@/config/api'
import type { DailyFortune } from '@/types/fortune'

export function useFortune() {
  const [dailyFortune, setDailyFortune] = useState<DailyFortune | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchDaily = useCallback(async (
    birthDate: string,
    targetDate?: string,
    lang = 'zh-TW'
  ) => {
    setLoading(true)
    setError(null)
    try {
      const date = targetDate || new Date().toISOString().split('T')[0]
      const data = await apiGet<DailyFortune>(
        `/fortune/daily/${date}?birth_date=${birthDate}&lang=${encodeURIComponent(lang)}`
      )
      setDailyFortune(data)
      return data
    } catch {
      setError('error.fetchFailed')
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  return { dailyFortune, loading, error, fetchDaily }
}
