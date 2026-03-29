'use client'
import { useState, useCallback } from 'react'
import { apiPost } from '@/config/api'
import type { CompatibilityResult } from '@/types/compatibility'

export function useCompatibility() {
  const [compatibility, setCompatibility] = useState<CompatibilityResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const calculateCompatibility = useCallback(async (
    date1: string,
    date2: string
  ) => {
    if (!date1 || !date2) return null
    setLoading(true)
    setError(null)
    setCompatibility(null)
    try {
      const data = await apiPost<CompatibilityResult>('/compatibility', { date1, date2 })
      setCompatibility(data)
      return data
    } catch (e) {
      setError(e instanceof Error ? e.message : '計算失敗')
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  return { compatibility, loading, error, calculateCompatibility }
}
