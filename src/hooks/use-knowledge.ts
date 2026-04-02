'use client'
import { useState, useCallback } from 'react'
import { apiGet, ENGINE } from '@/config/api'
import type { Metadata } from '@/types/knowledge'
import type { Mansion } from '@/types/mansion'
import type { RelationType } from '@/types/compatibility'

export function useKnowledge() {
  const [metadata, setMetadata] = useState<Metadata | null>(null)
  const [mansions, setMansions] = useState<Mansion[]>([])
  const [relations, setRelations] = useState<RelationType[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchMansions = useCallback(async () => {
    if (mansions.length > 0) return mansions
    setLoading(true)
    setError(null)
    try {
      const res = await apiGet<{ mansions: Mansion[] }>(`${ENGINE}/mansions`)
      setMansions(res.mansions)
      return res.mansions
    } catch {
      setError('error.fetchFailed')
      return []
    } finally {
      setLoading(false)
    }
  }, [mansions])

  const fetchMetadata = useCallback(async () => {
    if (metadata) return metadata
    try {
      const data = await apiGet<Metadata>(`${ENGINE}/metadata`)
      setMetadata(data)
      return data
    } catch {
      return null
    }
  }, [metadata])

  const fetchRelations = useCallback(async () => {
    if (relations.length > 0) return relations
    try {
      const res = await apiGet<{ relations: RelationType[] }>(`${ENGINE}/relations`)
      setRelations(res.relations)
      return res.relations
    } catch {
      return []
    }
  }, [relations])

  const loadAll = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      await Promise.all([fetchMetadata(), fetchMansions(), fetchRelations()])
    } catch {
      setError('error.fetchFailed')
    } finally {
      setLoading(false)
    }
  }, [fetchMetadata, fetchMansions, fetchRelations])

  return {
    metadata,
    mansions,
    relations,
    loading,
    error,
    fetchMansions,
    fetchMetadata,
    fetchRelations,
    loadAll,
  }
}
