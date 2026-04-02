'use client'
import { useState, useCallback } from 'react'
import { apiPost, apiGet, ENGINE } from '@/config/api'
import { useProfileStore } from '@/stores/profile'
import type {
  CompatibilityResult,
  CompatibilityFinderResult,
  PartnerCompatibility,
} from '@/types/compatibility'

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
      const data = await apiPost<CompatibilityResult>(`${ENGINE}/compatibility`, { date1, date2 })
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

export function usePartnerCompatibilities() {
  const { birthDate, partners } = useProfileStore()
  const [partnerCompatibilities, setPartnerCompatibilities] = useState<PartnerCompatibility[]>([])
  const [loading, setLoading] = useState(false)

  const fetchAll = useCallback(async () => {
    const validPartners = partners.filter((p) => p.birthDate)
    if (!birthDate || !validPartners.length) {
      setPartnerCompatibilities([])
      return
    }
    setLoading(true)
    try {
      const batchResult = await apiPost<{ id: string; data?: CompatibilityResult; error?: string }[]>(
        `${ENGINE}/compatibility-batch`,
        {
          date1: birthDate,
          partners: validPartners.map((p) => ({ id: p.id, date: p.birthDate })),
        }
      )
      const partnerMap = new Map(validPartners.map((p) => [p.id, p]))
      const results: PartnerCompatibility[] = []
      for (const item of batchResult) {
        if (!item.data) continue
        const partner = partnerMap.get(item.id)
        if (!partner) continue
        const compat = item.data
        results.push({
          partnerId: partner.id,
          nickname: partner.nickname,
          birthDate: partner.birthDate,
          mansion: {
            name_jp: compat.person2.mansion,
            reading: compat.person2.reading,
            yosei: compat.person2.yosei,
          },
          relation: compat.relation,
          level: compat.level,
          level_name: compat.level_name,
          directional_scores: compat.directional_scores,
          verdict: compat.direction_analysis?.verdict ?? undefined,
          direction_analysis: compat.direction_analysis ?? undefined,
          summary: compat.summary,
          calculation: { distance: compat.calculation.distance },
        })
      }
      const LEVEL_ORDER: Record<string, number> = { daikichi: 0, kichi: 1, shokyo: 2, kyo: 3 }
      setPartnerCompatibilities(results.sort((a, b) => (LEVEL_ORDER[a.level] ?? 9) - (LEVEL_ORDER[b.level] ?? 9)))
    } catch {
      // 靜默失敗，保留上次結果
    } finally {
      setLoading(false)
    }
  }, [birthDate, partners])

  return { partnerCompatibilities, loading, fetchAll }
}

export function useCompatibilityFinder() {
  const { birthDate } = useProfileStore()
  const [finder, setFinder] = useState<CompatibilityFinderResult | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchFinder = useCallback(async () => {
    if (!birthDate) return
    setLoading(true)
    try {
      const data = await apiGet<CompatibilityFinderResult>(`${ENGINE}/compatibility-finder/${birthDate}`)
      setFinder(data)
    } catch {
      // 靜默失敗
    } finally {
      setLoading(false)
    }
  }, [birthDate])

  return { finder, loading, fetchFinder }
}
