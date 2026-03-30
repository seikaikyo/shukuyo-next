// eslint-disable-next-line @typescript-eslint/no-explicit-any
type GapData = Record<string, any>

const cache = new Map<string, GapData>()

async function loadGapData(locale: string): Promise<GapData> {
  const key = locale || 'zh-TW'
  if (cache.has(key)) return cache.get(key)!
  let data: GapData
  switch (key) {
    case 'ja':
      data = (await import('../data/gap_guidance_ja.json')).default as GapData
      break
    case 'en':
      data = (await import('../data/gap_guidance_en.json')).default as GapData
      break
    default:
      data = (await import('../data/gap_guidance.json')).default as GapData
  }
  cache.set(key, data)
  return data
}

export type GapType = 'drain' | 'their_side' | 'my_side'

const GIVER_DIRS = new Set(['友', '親', '安'])
const RECEIVER_DIRS = new Set(['衰', '壊', '栄'])

/**
 * 根據方向、gap 類型、關係類型查表取得對治文案（同步版，用 cache）
 */
export function getGapGuidance(
  direction: string,
  gapType: GapType,
  relation: string,
  locale?: string,
): string | null {
  const cached = cache.get(locale || 'zh-TW')
  if (!cached) return null
  const typeData = cached[gapType]
  if (!typeData) return null
  const dirData = typeData[direction]
  if (!dirData) return null
  return dirData[relation] || dirData['friend'] || null
}

/**
 * 判斷 gap 類型
 */
export function getGapType(
  myDirection: string,
  myScore: number,
  theirScore: number,
): GapType {
  if (GIVER_DIRS.has(myDirection)) {
    return myScore > theirScore ? 'their_side' : 'drain'
  }
  if (RECEIVER_DIRS.has(myDirection)) {
    return myScore > theirScore ? 'my_side' : 'their_side'
  }
  return myScore > theirScore ? 'my_side' : 'their_side'
}

export const GAP_THRESHOLD = 5

/** 預載指定 locale 到 cache */
export function preloadGapGuidance(locale: string): Promise<void> {
  return loadGapData(locale).then(() => {})
}
