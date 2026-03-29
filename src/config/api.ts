const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://dashai-api.onrender.com/shukuyo'

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE}${path}`
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })
  if (!res.ok) {
    throw new Error(`API Error: ${res.status} ${res.statusText}`)
  }
  const json = await res.json()
  // 後端回傳 { success, data } 格式
  if (json.success === false) {
    throw new Error(json.error?.message || 'API Error')
  }
  return json.data !== undefined ? json.data : json
}

export function apiGet<T>(path: string): Promise<T> {
  return apiFetch<T>(path)
}

export function apiPost<T>(path: string, body: unknown): Promise<T> {
  return apiFetch<T>(path, {
    method: 'POST',
    body: JSON.stringify(body),
  })
}
