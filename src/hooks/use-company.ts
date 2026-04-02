'use client'
import { useState, useCallback } from 'react'
import { apiPost, CAREER, ENGINE, FORTUNE } from '@/config/api'
import { useProfileStore } from '@/stores/profile'
import type { CompanyBatchResult, ComparisonResult, CompanyJobsResult, GcisCompany, GlobalSearchResult } from '@/types/company'
import type { LuckyDatesResult } from '@/types/lucky-days'
import type { CompatibilityResult } from '@/types/compatibility'
import type { HrCandidate, JobSeeker } from '@/stores/profile'

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
      const data = await apiPost<CompanyBatchResult>(`${CAREER}/batch`, {
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
      const data = await apiPost<ComparisonResult>(`${CAREER}/comparison`, {
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
      const data = await apiPost<CompanyJobsResult>(`${CAREER}/104/company-jobs`, {
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
          `${ENGINE}/compatibility-batch`,
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

/** GCIS 公司搜尋（台灣經濟部商工登記） */
export function useGcisSearch() {
  const [results, setResults] = useState<GcisCompany[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const search = useCallback(async (keyword: string) => {
    if (keyword.trim().length < 2) {
      setResults([])
      return
    }
    setLoading(true)
    setResults([])
    setError(null)
    try {
      const searchName = keyword.trim()
        .replace(/股份有限公司/g, '')
        .replace(/有限公司/g, '')
        .replace(/^[A-Za-z0-9\s._-]+[_\-・]/g, '')
        .replace(/^[A-Za-z0-9\s._-]+\s+/g, '')
        .trim()
      const params = new URLSearchParams({
        '$format': 'json',
        '$filter': `Company_Name like ${searchName} and Company_Status eq 01`,
        '$top': '10',
      })
      const gcisApiId = '6BBA2268-1367-4B42-9CCA-BC17499EBE8C'
      const controller = new AbortController()
      const timer = setTimeout(() => controller.abort(), 15000)
      const res = await fetch(`/proxy/gcis/${gcisApiId}?${params}`, { signal: controller.signal })
      clearTimeout(timer)
      if (res.ok) {
        const raw = await res.json()
        if (Array.isArray(raw)) {
          setResults(raw
            .map((c: Record<string, string>) => {
              const d = c.Company_Setup_Date || ''
              if (d.length !== 7) return null
              const rocYear = parseInt(d.substring(0, 3), 10)
              const mm = d.substring(3, 5)
              const dd = d.substring(5, 7)
              return {
                name: c.Company_Name || '',
                business_no: c.Business_Accounting_NO || '',
                founding_date: `${rocYear + 1911}-${mm}-${dd}`,
                responsible: c.Responsible_Name || '',
                capital: c.Capital_Stock_Amount || '0',
              }
            })
            .filter((x): x is GcisCompany => x !== null)
          )
        }
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'GCIS 搜尋失敗')
    } finally {
      setLoading(false)
    }
  }, [])

  return { results, loading, error, search }
}

/** 全球公司搜尋 */
export function useGlobalCompanySearch() {
  const { birthDate } = useProfileStore()
  const [result, setResult] = useState<GlobalSearchResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const search = useCallback(async (companyName: string, country: string) => {
    if (companyName.trim().length < 2 || !birthDate) return
    setLoading(true)
    setResult(null)
    setError(null)
    try {
      const data = await apiPost<GlobalSearchResult>(`${CAREER}/company-search`, {
        company_name: companyName.trim(),
        country,
        birth_date: birthDate,
      })
      setResult(data)
      return data
    } catch (e) {
      setError(e instanceof Error ? e.message : '搜尋失敗')
      return null
    } finally {
      setLoading(false)
    }
  }, [birthDate])

  return { result, loading, error, search }
}

/** HR 批次分析（候選人 vs 單一公司，3 worker 並行） */
export function useHrBatchAnalysis() {
  const [results, setResults] = useState<Record<string, CompanyBatchResult>>({})
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState({ done: 0, total: 0 })

  const fetch_ = useCallback(async (
    hrCompany: { name: string; foundingDate: string },
    candidates: HrCandidate[],
    lang = 'zh-TW'
  ) => {
    setLoading(true)
    setResults({})
    setProgress({ done: 0, total: candidates.length })
    const newResults: Record<string, CompanyBatchResult> = {}

    const concurrency = 3
    let idx = 0

    async function processNext() {
      while (idx < candidates.length) {
        const current = idx++
        const candidate = candidates[current]
        try {
          const data = await apiPost<CompanyBatchResult>(`${CAREER}/batch`, {
            birth_date: candidate.birthDate,
            year: new Date().getFullYear(),
            mode: 'hr',
            lang,
            companies: [{ id: hrCompany.name, name: hrCompany.name, founding_date: hrCompany.foundingDate, memo: '', job_url: '' }],
          })
          if (data) newResults[candidate.id] = data
        } catch { /* skip */ }
        setProgress(p => ({ ...p, done: p.done + 1 }))
      }
    }

    await Promise.all(
      Array.from({ length: Math.min(concurrency, candidates.length) }, () => processNext())
    )
    setResults({ ...newResults })
    setLoading(false)
  }, [])

  return { results, loading, progress, fetchHrBatch: fetch_ }
}

/** 獵頭批次分析（多求職者 x 多公司） */
export function useHeadhunterAnalysis() {
  const [results, setResults] = useState<Record<string, CompanyBatchResult>>({})
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState({ done: 0, total: 0 })

  const fetch_ = useCallback(async (seekers: JobSeeker[], companies: { id: string; name: string; foundingDate: string }[], lang = 'zh-TW') => {
    const seekersWithCompanies = seekers.filter(s => (s.targetCompanyIds?.length ?? 0) > 0 || companies.length > 0)
    if (!seekersWithCompanies.length) return
    const totalPairs = seekersWithCompanies.length * companies.length
    setLoading(true)
    setResults({})
    setProgress({ done: 0, total: totalPairs })
    const newResults: Record<string, CompanyBatchResult> = {}

    const concurrency = 3
    let idx = 0

    async function processNext() {
      while (idx < seekersWithCompanies.length) {
        const current = idx++
        const seeker = seekersWithCompanies[current]
        try {
          const data = await apiPost<CompanyBatchResult>(`${CAREER}/batch`, {
            birth_date: seeker.birthDate,
            year: new Date().getFullYear(),
            mode: 'seeker',
            lang,
            companies: companies.map(c => ({ id: c.id, name: c.name, founding_date: c.foundingDate, memo: '', job_url: '' })),
          })
          if (data) {
            for (const company of data.companies) {
              newResults[`${seeker.id}:${company.id}`] = data
            }
          }
        } catch { /* skip */ }
        setProgress(p => ({ ...p, done: p.done + companies.length }))
      }
    }

    await Promise.all(
      Array.from({ length: Math.min(concurrency, seekersWithCompanies.length) }, () => processNext())
    )
    setResults({ ...newResults })
    setLoading(false)
  }, [])

  return { results, loading, progress, fetchHeadhunterBatch: fetch_ }
}

/** 職涯吉日查詢 */
export function useCareerLuckyDates() {
  const [luckyDates, setLuckyDates] = useState<LuckyDatesResult | null>(null)
  const [loading, setLoading] = useState(false)

  const fetch_ = useCallback(async (birthDate: string, days = 30, lang = 'zh-TW') => {
    setLoading(true)
    try {
      const data = await apiPost<LuckyDatesResult>(`${FORTUNE}/lucky-dates`, {
        birth_date: birthDate,
        days,
        lang,
      })
      setLuckyDates(data)
      return data
    } catch {
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  return { luckyDates, loading, fetchLuckyDates: fetch_ }
}
