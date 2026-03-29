import redFlagsZh from '../data/red_flags.json'
import redFlagsJa from '../data/red_flags_ja.json'
import redFlagsEn from '../data/red_flags_en.json'

const RED_FLAGS_MAP: Record<string, typeof redFlagsZh> = {
  'zh-TW': redFlagsZh,
  'ja': redFlagsJa,
  'en': redFlagsEn,
}

function getRedFlagsData(locale?: string): typeof redFlagsZh {
  if (!locale) return redFlagsZh
  return RED_FLAGS_MAP[locale] || redFlagsZh
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
 * 取得紅旗資料
 * @param direction 方向（漢字或 romaji）
 * @param mode 面向：personal（預設）/ seeker / company
 */
export function getRedFlag(direction: string, mode: string = 'personal', locale?: string): RedFlag | null {
  const key = DIRECTION_KEY_MAP[direction]
  if (!key) return null
  const data = getRedFlagsData(locale)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const entry = (data as any)[key]
  if (!entry) return null
  // 新格式：entry.personal / entry.seeker / entry.company
  if (entry[mode]) return entry[mode] as RedFlag
  // fallback 到 personal
  if (entry.personal) return entry.personal as RedFlag
  // 舊格式相容（直接有 healthy/red_flag）
  if (entry.healthy) return entry as unknown as RedFlag
  return null
}
