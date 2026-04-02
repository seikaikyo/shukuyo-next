'use client'
import { useState, useCallback } from 'react'
import { apiGet, FORTUNE } from '@/config/api'
import type { IndustryRecommendation } from '@/types/startup'
import type { LuckyCalendarData } from '@/types/lucky-days'

export function useStartup() {
  const [industryRecs, setIndustryRecs] = useState<IndustryRecommendation | null>(null)
  const [startupCalendar, setStartupCalendar] = useState<LuckyCalendarData | null>(null)
  const [industryLoading, setIndustryLoading] = useState(false)
  const [calendarLoading, setCalendarLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchIndustryRecommendations = useCallback(async (
    birthDate: string,
    lang = 'zh-TW'
  ) => {
    setIndustryLoading(true)
    setError(null)
    try {
      const data = await apiGet<IndustryRecommendation>(
        `${FORTUNE}/startup/industry/${birthDate}?lang=${encodeURIComponent(lang)}`
      )
      setIndustryRecs(data)
      return data
    } catch {
      setError('error.fetchFailed')
      return null
    } finally {
      setIndustryLoading(false)
    }
  }, [])

  const fetchStartupCalendar = useCallback(async (
    birthDate: string,
    year: number,
    month: number,
    lang = 'zh-TW'
  ) => {
    setCalendarLoading(true)
    setError(null)
    try {
      const data = await apiGet<LuckyCalendarData>(
        `${FORTUNE}/lucky-days/calendar/${birthDate}/${year}/${month}?categories=career&actions=founding&lang=${encodeURIComponent(lang)}`
      )
      setStartupCalendar(data)
      return data
    } catch {
      setError('error.fetchFailed')
      return null
    } finally {
      setCalendarLoading(false)
    }
  }, [])

  return {
    industryRecs,
    startupCalendar,
    industryLoading,
    calendarLoading,
    error,
    fetchIndustryRecommendations,
    fetchStartupCalendar,
  }
}
