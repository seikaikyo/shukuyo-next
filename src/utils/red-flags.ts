// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RedFlagsData = Record<string, any>

const cache = new Map<string, RedFlagsData>()

async function loadRedFlags(locale: string): Promise<RedFlagsData> {
  const key = locale || 'zh-TW'
  if (cache.has(key)) return cache.get(key)!
  let data: RedFlagsData
  switch (key) {
    case 'ja':
      data = (await import('../data/red_flags_ja.json')).default as RedFlagsData
      break
    case 'en':
      data = (await import('../data/red_flags_en.json')).default as RedFlagsData
      break
    default:
      data = (await import('../data/red_flags.json')).default as RedFlagsData
  }
  cache.set(key, data)
  return data
}

const DIRECTION_KEY_MAP: Record<string, string> = {
  '栄': 'ei', '親': 'shin', '友': 'yu', '衰': 'sui',
  '安': 'an', '壊': 'kai', '危': 'ki', '成': 'sei',
  '命': 'mei', '業': 'gyo', '胎': 'tai',
  ei: 'ei', shin: 'shin', yu: 'yu', sui: 'sui',
  an: 'an', kai: 'kai', ki: 'ki', sei: 'sei',
  mei: 'mei', gyo: 'gyo', tai: 'tai',
}

export interface RedFlag {
  healthy: string
  red_flag: string
  test: string
  action: string
  drain_warning?: string
}

/**
 * 取得紅旗資料（async — 按需載入 locale JSON）
 */
export async function getRedFlagAsync(direction: string, mode: string = 'personal', locale?: string): Promise<RedFlag | null> {
  const key = DIRECTION_KEY_MAP[direction]
  if (!key) return null
  const data = await loadRedFlags(locale || 'zh-TW')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const entry = (data as any)[key]
  if (!entry) return null
  if (entry[mode]) return entry[mode] as RedFlag
  if (entry.personal) return entry.personal as RedFlag
  if (entry.healthy) return entry as unknown as RedFlag
  return null
}

/** 同步版（用預載的 cache，首次可能 miss 回 null） */
export function getRedFlag(direction: string, mode: string = 'personal', locale?: string): RedFlag | null {
  const key = DIRECTION_KEY_MAP[direction]
  if (!key) return null
  const cached = cache.get(locale || 'zh-TW')
  if (!cached) return null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const entry = (cached as any)[key]
  if (!entry) return null
  if (entry[mode]) return entry[mode] as RedFlag
  if (entry.personal) return entry.personal as RedFlag
  if (entry.healthy) return entry as unknown as RedFlag
  return null
}

/** 預載指定 locale 到 cache */
export function preloadRedFlags(locale: string): Promise<void> {
  return loadRedFlags(locale).then(() => {})
}
