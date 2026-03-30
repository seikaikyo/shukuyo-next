const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://dashai-api.onrender.com/shukuyo/api/sukuyodo'

const REQUEST_TIMEOUT_MS = 15000
const CACHE_TTL_MS = 60_000

/** GET 請求記憶體 cache（TTL 60s，避免重複呼叫） */
const getCache = new Map<string, { data: unknown; ts: number }>()

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE}${path}`
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)
  try {
    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    })
    if (!res.ok) {
      throw new Error(`API Error: ${res.status} ${res.statusText}`)
    }
    const json = await res.json()
    if (json.success === false) {
      throw new Error(json.error?.message || json.error || 'API Error')
    }
    return json.data !== undefined ? json.data : json
  } finally {
    clearTimeout(timer)
  }
}

export function apiGet<T>(path: string): Promise<T> {
  const now = Date.now()
  const cached = getCache.get(path)
  if (cached && now - cached.ts < CACHE_TTL_MS) {
    return Promise.resolve(cached.data as T)
  }
  return apiFetch<T>(path).then((data) => {
    getCache.set(path, { data, ts: Date.now() })
    return data
  })
}

export function apiPost<T>(path: string, body: unknown): Promise<T> {
  return apiFetch<T>(path, {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

/** 驗證 URL 只允許 http/https protocol（防 javascript: XSS） */
export function isSafeUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}
