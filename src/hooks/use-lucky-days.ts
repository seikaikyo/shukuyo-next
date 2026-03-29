'use client'
import { useState, useCallback } from 'react'
import { apiGet } from '@/config/api'
import type { LuckyDaySummary, LuckyCalendarData } from '@/types/lucky-days'

export function useLuckyDays() {
  const [luckyDaySummary, setLuckyDaySummary] = useState<LuckyDaySummary | null>(null)
  const [luckyCalendar, setLuckyCalendar] = useState<LuckyCalendarData | null>(null)
  const [loading, setLoading] = useState(false)
  const [calendarLoading, setCalendarLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchLuckyDaySummary = useCallback(async (
    birthDate: string,
    lang = 'zh-TW'
  ) => {
    setLoading(true)
    setError(null)
    try {
      const data = await apiGet<LuckyDaySummary>(
        `/lucky-days/summary/${birthDate}?lang=${encodeURIComponent(lang)}`
      )
      setLuckyDaySummary(data)
      return data
    } catch {
      setError('error.fetchFailed')
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchLuckyCalendar = useCallback(async (
    birthDate: string,
    year: number,
    month: number,
    lang = 'zh-TW'
  ) => {
    setCalendarLoading(true)
    setError(null)
    try {
      const data = await apiGet<LuckyCalendarData>(
        `/lucky-days/calendar/${birthDate}/${year}/${month}?lang=${encodeURIComponent(lang)}`
      )
      setLuckyCalendar(data)
      return data
    } catch {
      setError('error.fetchFailed')
      return null
    } finally {
      setCalendarLoading(false)
    }
  }, [])

  return {
    luckyDaySummary,
    luckyCalendar,
    loading,
    calendarLoading,
    error,
    fetchLuckyDaySummary,
    fetchLuckyCalendar,
  }
}
