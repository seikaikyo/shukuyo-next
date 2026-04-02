'use client'
import { useState, useCallback, useRef } from 'react'
import { apiGet, ENGINE } from '@/config/api'
import { useProfileStore } from '@/stores/profile'
import type { PersonMansion } from '@/types/mansion'

export function useMansion() {
  const { birthDate } = useProfileStore()
  const [myMansion, setMyMansion] = useState<PersonMansion | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const cachedDate = useRef<string | null>(null)

  const fetchMyMansion = useCallback(async () => {
    if (!birthDate) return null
    if (myMansion && cachedDate.current === birthDate) return myMansion

    setLoading(true)
    setError(null)
    try {
      const data = await apiGet<PersonMansion>(`${ENGINE}/mansion/${birthDate}`)
      setMyMansion(data)
      cachedDate.current = birthDate
      return data
    } catch {
      setError('Failed to fetch birth mansion')
      return null
    } finally {
      setLoading(false)
    }
  }, [birthDate, myMansion])

  const fetchMansionByDate = useCallback(async (date: string): Promise<PersonMansion | null> => {
    try {
      return await apiGet<PersonMansion>(`${ENGINE}/mansion/${date}`)
    } catch {
      return null
    }
  }, [])

  const retryMansion = useCallback(async () => {
    setMyMansion(null)
    cachedDate.current = null
    if (!birthDate) return null
    setLoading(true)
    setError(null)
    try {
      const data = await apiGet<PersonMansion>(`${ENGINE}/mansion/${birthDate}`)
      setMyMansion(data)
      cachedDate.current = birthDate
      return data
    } catch {
      setError('Failed to fetch birth mansion')
      return null
    } finally {
      setLoading(false)
    }
  }, [birthDate])

  return {
    myMansion,
    loading,
    error,
    hasProfile: !!birthDate,
    fetchMyMansion,
    fetchMansionByDate,
    retryMansion,
  }
}
