'use client'
import { useState, useCallback } from 'react'
import { apiGet } from '@/config/api'
import type { CalendarMonthData } from '@/types/calendar'

export function useCalendar() {
  const [calendarData, setCalendarData] = useState<CalendarMonthData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCalendar = useCallback(async (
    birthDate: string,
    year: number,
    month: number,
    lang = 'zh-TW'
  ) => {
    setLoading(true)
    setError(null)
    try {
      const data = await apiGet<CalendarMonthData>(
        `/calendar/monthly/${year}/${month}?birth_date=${birthDate}&lang=${encodeURIComponent(lang)}`
      )
      setCalendarData(data)
      return data
    } catch (e) {
      setError(e instanceof Error ? e.message : '載入月曆失敗')
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  return { calendarData, loading, error, fetchCalendar }
}
