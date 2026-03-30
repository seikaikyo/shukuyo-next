'use client'
import { useState, useCallback } from 'react'
import { apiGet } from '@/config/api'
import type { PairLuckyDaysResult } from '@/types/lucky-days'

/** PartnerRelationType → API relation 參數映射 */
const RELATION_API_MAP: Record<string, string> = {
  lover: 'dating',
  spouse: 'spouse',
  friend: 'friend',
  colleague: 'friend',
  family: 'family',
  parent: 'parent',
  boss: 'master',
  rival: 'friend',
  ex: 'dating',
}

export function usePairLuckyDays() {
  const [pairLuckyDays, setPairLuckyDays] = useState<PairLuckyDaysResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPairLuckyDays = useCallback(async (
    date1: string,
    date2: string,
    relation?: string,
    lang = 'zh-TW'
  ) => {
    if (!date1 || !date2) return null
    setLoading(true)
    setError(null)
    setPairLuckyDays(null)
    try {
      const apiRelation = relation ? (RELATION_API_MAP[relation] || 'friend') : 'friend'
      const data = await apiGet<PairLuckyDaysResult>(
        `/lucky-days/pair/${date1}/${date2}?relation=${apiRelation}&lang=${lang}`
      )
      setPairLuckyDays(data)
      return data
    } catch (e) {
      setError(e instanceof Error ? e.message : '取得配對吉日失敗')
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  return { pairLuckyDays, loading, error, fetchPairLuckyDays }
}
