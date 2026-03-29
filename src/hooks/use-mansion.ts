'use client'
import { useState, useCallback } from 'react'
import { apiGet } from '@/config/api'
import type { PersonMansion } from '@/types/mansion'

export function useMansion() {
  const [mansion, setMansion] = useState<PersonMansion | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchByBirthDate = useCallback(async (
    birthDate: string,
    lang = 'zh-TW'
  ) => {
    setLoading(true)
    setError(null)
    try {
      const data = await apiGet<PersonMansion>(
        `/mansion/by-birth-date?birth_date=${birthDate}&lang=${encodeURIComponent(lang)}`
      )
      setMansion(data)
      return data
    } catch {
      setError('error.fetchFailed')
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  return { mansion, loading, error, fetchByBirthDate }
}
