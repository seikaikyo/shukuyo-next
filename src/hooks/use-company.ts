'use client'
import { useState, useCallback } from 'react'
import { apiPost } from '@/config/api'
import { useProfileStore } from '@/stores/profile'
import type { CompanyBatchResult, ComparisonResult, CompanyJobsResult } from '@/types/company'
import type { CompatibilityResult } from '@/types/compatibility'

export function useCompanyAnalysis() {
  const { birthDate, companies } = useProfileStore()
  const [batchResult, setBatchResult] = useState<CompanyBatchResult | null>(null)
  const [comparisonResult, setComparisonResult] = useState<ComparisonResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [comparing, setComparing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchBatchAnalysis = useCallback(async (year?: number, lang = 'zh-TW') => {
    const validCompanies = companies.filter((c) => c.foundingDate)
    if (!birthDate || !validCompanies.length) {
      setBatchResult(null)
      return null
    }
    setLoading(true)
    setError(null)
    try {
      const data = await apiPost<CompanyBatchResult>('/company-batch-analysis', {
        birth_date: birthDate,
        companies: validCompanies.map((c) => ({
          id: c.id,
          founding_date: c.foundingDate,
          name: c.name,
          memo: c.memo || '',
          job_url: c.jobUrl || '',
        })),
        year: year || new Date().getFullYear(),
        lang,
      })
      setBatchResult(data)
      return data
    } catch (e) {
      setError(e instanceof Error ? e.message : '分析失敗')
      return null
    } finally {
      setLoading(false)
    }
  }, [birthDate, companies])

  const fetchComparison = useCallback(async (companyIds?: string[], lang = 'zh-TW') => {
    const targets = companyIds
      ? companies.filter((c) => companyIds.includes(c.id) && c.foundingDate)
      : companies.filter((c) => c.foundingDate)
    if (!birthDate || targets.length < 2) {
      setError('至少需要 2 間公司才能比較')
      return null
    }
    setComparing(true)
    setError(null)
    try {
      const data = await apiPost<ComparisonResult>('/company-comparison', {
        birth_date: birthDate,
        companies: targets.map((c) => ({
          id: c.id,
          founding_date: c.foundingDate,
          name: c.name,
        })),
        lang,
      })
      setComparisonResult(data)
      return data
    } catch (e) {
      setError(e instanceof Error ? e.message : '比較失敗')
      return null
    } finally {
      setComparing(false)
    }
  }, [birthDate, companies])

  return {
    batchResult,
    comparisonResult,
    loading,
    comparing,
    error,
    fetchBatchAnalysis,
    fetchComparison,
  }
}

/** 104 職缺查詢 */
export function use104Jobs() {
  const [jobs, setJobs] = useState<CompanyJobsResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchJobs = useCallback(async (
    companyName: string,
    foundingDate: string,
    birthDate: string,
    lang = 'zh-TW'
  ) => {
    setLoading(true)
    setError(null)
    setJobs(null)
    try {
      const data = await apiPost<CompanyJobsResult>('/104/company-jobs', {
        company_name: companyName,
        founding_date: foundingDate,
        birth_date: birthDate,
        lang,
      })
      setJobs(data)
      return data
    } catch (e) {
      setError(e instanceof Error ? e.message : '查詢 104 職缺失敗')
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  return { jobs, loading, error, fetchJobs }
}

/** 團隊矩陣 (HR/獵頭用) — 批次呼叫 compatibility-batch */
export function useTeamMatrix() {
  const [matrix, setMatrix] = useState<Map<string, { level: string; level_name: string; relation: string }>>(new Map())
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState({ done: 0, total: 0 })

  const fetchMatrix = useCallback(async (
    members: { id: string; birthDate: string }[]
  ) => {
    if (members.length < 2) return
    setLoading(true)
    const total = members.length - 1
    setProgress({ done: 0, total })
    const newMatrix = new Map<string, { level: string; level_name: string; relation: string }>()

    for (let i = 0; i < members.length; i++) {
      const person1 = members[i]
      const others = members.filter((_, j) => j !== i)
      try {
        const results = await apiPost<{ id: string; data?: CompatibilityResult; error?: string }[]>(
          '/compatibility-batch',
          {
            date1: person1.birthDate,
            partners: others.map((o) => ({ id: o.id, date: o.birthDate })),
          }
        )
        for (const r of results) {
          if (r.data) {
            newMatrix.set(`${person1.id}:${r.id}`, {
              level: r.data.level,
              level_name: r.data.level_name,
              relation: r.data.relation.name,
            })
          }
        }
      } catch {
        // continue with partial results
      }
      setProgress({ done: i + 1, total })
    }

    setMatrix(newMatrix)
    setLoading(false)
  }, [])

  return { matrix, loading, progress, fetchMatrix }
}
