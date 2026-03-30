'use client'
import { useState, useCallback } from 'react'
import { apiGet } from '@/config/api'
import type { DailyFortune, WeeklyFortune, MonthlyFortune, YearlyFortune } from '@/types/fortune'

export function useFortune() {
  const [dailyFortune, setDailyFortune] = useState<DailyFortune | null>(null)
  const [weeklyFortune, setWeeklyFortune] = useState<WeeklyFortune | null>(null)
  const [monthlyFortune, setMonthlyFortune] = useState<MonthlyFortune | null>(null)
  const [yearlyFortune, setYearlyFortune] = useState<YearlyFortune | null>(null)
  const [yearlyRange, setYearlyRange] = useState<YearlyFortune[]>([])

  const [dailyLoading, setDailyLoading] = useState(false)
  const [weeklyLoading, setWeeklyLoading] = useState(false)
  const [monthlyLoading, setMonthlyLoading] = useState(false)
  const [yearlyLoading, setYearlyLoading] = useState(false)
  const [rangeLoading, setRangeLoading] = useState(false)

  const [error, setError] = useState<string | null>(null)

  const loading = dailyLoading || weeklyLoading || monthlyLoading || yearlyLoading || rangeLoading

  const fetchDaily = useCallback(async (
    birthDate: string,
    targetDate?: string,
    lang = 'zh-TW'
  ) => {
    setDailyLoading(true)
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
      setDailyLoading(false)
    }
  }, [])

  const fetchWeekly = useCallback(async (
    birthDate: string,
    centerDate?: string,
    lang = 'zh-TW'
  ) => {
    setWeeklyLoading(true)
    try {
      const date = centerDate || new Date().toISOString().split('T')[0]
      const data = await apiGet<WeeklyFortune>(
        `/fortune/weekly/${date}?birth_date=${birthDate}&lang=${encodeURIComponent(lang)}`
      )
      setWeeklyFortune(data)
      return data
    } catch {
      return null
    } finally {
      setWeeklyLoading(false)
    }
  }, [])

  const fetchMonthly = useCallback(async (
    birthDate: string,
    year: number,
    month: number,
    lang = 'zh-TW'
  ) => {
    setMonthlyLoading(true)
    setError(null)
    try {
      const data = await apiGet<MonthlyFortune>(
        `/fortune/monthly/${year}/${month}?birth_date=${birthDate}&lang=${encodeURIComponent(lang)}`
      )
      setMonthlyFortune(data)
      return data
    } catch {
      setError('error.fetchFailed')
      return null
    } finally {
      setMonthlyLoading(false)
    }
  }, [])

  const fetchYearly = useCallback(async (
    birthDate: string,
    year: number,
    lang = 'zh-TW'
  ) => {
    setYearlyLoading(true)
    setError(null)
    try {
      const data = await apiGet<YearlyFortune>(
        `/fortune/yearly/${year}?birth_date=${birthDate}&lang=${encodeURIComponent(lang)}`
      )
      setYearlyFortune(data)
      return data
    } catch {
      setError('error.fetchFailed')
      return null
    } finally {
      setYearlyLoading(false)
    }
  }, [])

  const fetchYearlyRange = useCallback(async (
    birthDate: string,
    startYear: number,
    endYear: number,
    lang = 'zh-TW'
  ) => {
    setRangeLoading(true)
    setError(null)
    try {
      const data = await apiGet<YearlyFortune[]>(
        `/fortune/yearly-range?birth_date=${birthDate}&start_year=${startYear}&end_year=${endYear}&lang=${encodeURIComponent(lang)}`
      )
      setYearlyRange(data)
      return data
    } catch {
      setError('error.fetchFailed')
      return null
    } finally {
      setRangeLoading(false)
    }
  }, [])

  return {
    dailyFortune,
    weeklyFortune,
    monthlyFortune,
    yearlyFortune,
    yearlyRange,
    loading,
    dailyLoading,
    weeklyLoading,
    error,
    fetchDaily,
    fetchWeekly,
    fetchMonthly,
    fetchYearly,
    fetchYearlyRange,
  }
}
