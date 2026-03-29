import gapDataZh from '../data/gap_guidance.json'
import gapDataJa from '../data/gap_guidance_ja.json'
import gapDataEn from '../data/gap_guidance_en.json'

const GAP_MAP: Record<string, typeof gapDataZh> = {
  'zh-TW': gapDataZh,
  'ja': gapDataJa,
  'en': gapDataEn,
}

function getGapData(locale?: string): typeof gapDataZh {
  if (!locale) return gapDataZh
  return GAP_MAP[locale] || gapDataZh
}

export type GapType = 'drain' | 'their_side' | 'my_side'

// 付出型方向：我是給的人，分數高 = 我付出效果好 = 對方獲益
const GIVER_DIRS = new Set(['友', '親', '安'])
// 接受型方向：我是收的人，分數高 = 我被照顧得好 = 我獲益
const RECEIVER_DIRS = new Set(['衰', '壊', '栄'])
// 壓力型/對稱型（危/成/命/業/胎）：維持分數高低直覺判斷

/**
 * 根據方向、gap 類型、關係類型查表取得對治文案
 * @param direction 方向（漢字，如「衰」「栄」）
 * @param gapType drain / their_side / my_side
 * @param relation 關係類型（spouse/lover/friend/colleague/family/parent）
 * @returns 對治文案，找不到回 null
 */
export function getGapGuidance(
  direction: string,
  gapType: GapType,
  relation: string,
  locale?: string,
): string | null {
  const gapData = getGapData(locale)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const typeData = (gapData as any)[gapType] as Record<string, Record<string, string>> | undefined
  if (!typeData) return null
  const dirData = typeData[direction]
  if (!dirData) return null
  return dirData[relation] || dirData['friend'] || null // fallback to friend
}

/**
 * 判斷 gap 類型（依方向角色分流）
 *
 * 付出型（友/親/安）：我分數高 = 我付出效果好 = 對方獲益多 → their_side
 * 接受型（衰/壊/栄）：我分數高 = 我被照顧得好 = 我獲益多 → my_side
 * 其他（危/成/命/業/胎）：分數高 = 我這方影響力強 → my_side
 *
 * drain 只在付出型方向且我分數低時觸發（我在被消耗）
 */
export function getGapType(
  myDirection: string,
  myScore: number,
  theirScore: number,
): GapType {
  if (GIVER_DIRS.has(myDirection)) {
    // 付出型：我分數高 = 對方獲益，我分數低 = 我被消耗
    return myScore > theirScore ? 'their_side' : 'drain'
  }
  if (RECEIVER_DIRS.has(myDirection)) {
    // 接受型：我分數高 = 我獲益，我分數低 = 對方獲益
    return myScore > theirScore ? 'my_side' : 'their_side'
  }
  // 壓力型/對稱型
  return myScore > theirScore ? 'my_side' : 'their_side'
}

/** gap 差距是否值得顯示（<= 5 分不顯示） */
export const GAP_THRESHOLD = 5
