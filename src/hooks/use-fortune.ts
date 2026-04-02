'use client'
import { useState, useCallback, useRef } from 'react'
import { apiGet, FORTUNE } from '@/config/api'
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

  // 追蹤最後一次 fetchDaily 的參數，供 retryDaily 使用
  const lastDailyArgs = useRef<[string, string | undefined, string] | null>(null)

  const fetchDaily = useCallback(async (
    birthDate: string,
    targetDate?: string,
    lang = 'zh-TW'
  ) => {
    lastDailyArgs.current = [birthDate, targetDate, lang]
    setDailyLoading(true)
    setError(null)
    try {
      const date = targetDate || new Date().toISOString().split('T')[0]
      const data = await apiGet<DailyFortune>(
        `${FORTUNE}/daily/${date}?birth_date=${birthDate}&lang=${encodeURIComponent(lang)}`
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
        `${FORTUNE}/weekly/${date}?birth_date=${birthDate}&lang=${encodeURIComponent(lang)}`
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
        `${FORTUNE}/monthly/${year}/${month}?birth_date=${birthDate}&lang=${encodeURIComponent(lang)}`
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
        `${FORTUNE}/yearly/${year}?birth_date=${birthDate}&lang=${encodeURIComponent(lang)}`
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
        `${FORTUNE}/yearly-range?birth_date=${birthDate}&start_year=${startYear}&end_year=${endYear}&lang=${encodeURIComponent(lang)}`
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

  /** 一次拉今日的日/週/月/年運勢 */
  const fetchAllForToday = useCallback(async (birthDate: string, lang = 'zh-TW') => {
    const now = new Date()
    const today = now.toISOString().split('T')[0]
    const year = now.getFullYear()
    const month = now.getMonth() + 1
    await Promise.all([
      fetchDaily(birthDate, today, lang),
      fetchWeekly(birthDate, today, lang),
      fetchMonthly(birthDate, year, month, lang),
      fetchYearly(birthDate, year, lang),
    ])
  }, [fetchDaily, fetchWeekly, fetchMonthly, fetchYearly])

  /** 重試上一次 fetchDaily */
  const retryDaily = useCallback(async () => {
    if (!lastDailyArgs.current) return null
    const [bd, td, lang] = lastDailyArgs.current
    return fetchDaily(bd, td, lang)
  }, [fetchDaily])

  /** 單次查詢日運（不寫入 state） */
  const fetchDailyOnce = useCallback(async (
    birthDate: string,
    targetDate: string,
    lang = 'zh-TW'
  ): Promise<DailyFortune | null> => {
    try {
      return await apiGet<DailyFortune>(
        `${FORTUNE}/daily/${targetDate}?birth_date=${birthDate}&lang=${encodeURIComponent(lang)}`
      )
    } catch {
      return null
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
    fetchAllForToday,
    retryDaily,
    fetchDailyOnce,
  }
}
