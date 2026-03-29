/** 等級 key -> CSS class 映射 */
const LEVEL_CLASS_MAP: Record<string, string> = {
  daikichi: 'excellent',
  kichi: 'good',
  shokyo: 'caution',
  kyo: 'warning'
}

/** 等級 key -> i18n key 映射 */
const LEVEL_I18N_MAP: Record<string, string> = {
  daikichi: 'fortune.levels.daikichi',
  kichi: 'fortune.levels.kichi',
  shokyo: 'fortune.levels.shokyo',
  kyo: 'fortune.levels.kyo'
}

export function getScoreClass(score: number): string {
  if (score >= 80) return 'excellent'
  if (score >= 65) return 'good'
  if (score >= 50) return 'fair'
  if (score >= 35) return 'caution'
  return 'warning'
}

export function getFortuneLevel(score: number, level?: string) {
  if (level && LEVEL_CLASS_MAP[level]) {
    return { textKey: LEVEL_I18N_MAP[level], class: LEVEL_CLASS_MAP[level] }
  }
  if (score >= 80) return { textKey: 'fortune.levels.daikichi', class: 'excellent' }
  if (score >= 60) return { textKey: 'fortune.levels.kichi', class: 'good' }
  if (score >= 35) return { textKey: 'fortune.levels.shokyo', class: 'caution' }
  return { textKey: 'fortune.levels.kyo', class: 'warning' }
}

export function getMansionRelationClass(relationType: string): string {
  const classMap: Record<string, string> = {
    'eishin': 'excellent',
    'gyotai': 'good',
    'mei': 'fair',
    'yusui': 'neutral',
    'kisei': 'caution',
    'ankai': 'warning'
  }
  return classMap[relationType] || 'neutral'
}

export function getScoreLevel(score: number) {
  if (score >= 80) return { textKey: 'fortune.scoreLevels.excellent', class: 'excellent' }
  if (score >= 65) return { textKey: 'fortune.scoreLevels.good', class: 'good' }
  if (score >= 50) return { textKey: 'fortune.scoreLevels.fair', class: 'fair' }
  return { textKey: 'fortune.scoreLevels.warning', class: 'warning' }
}

export function getRatingKey(score: number, level?: string): string {
  if (level && LEVEL_I18N_MAP[level]) {
    return LEVEL_I18N_MAP[level]
  }
  if (score >= 80) return 'fortune.levels.daikichi'
  if (score >= 60) return 'fortune.levels.kichi'
  if (score >= 35) return 'fortune.levels.shokyo'
  return 'fortune.levels.kyo'
}

export function getLevelKey(level: string): string {
  return LEVEL_I18N_MAP[level] || level
}

export function getLevelClass(level: string): string {
  return LEVEL_CLASS_MAP[level] || 'neutral'
}

/** 中文元素 → i18n key 反查 */
const ELEMENT_KEY_MAP: Record<string, string> = {
  '木': 'wood', '金': 'metal', '土': 'earth',
  '日': 'sun', '月': 'moon', '火': 'fire', '水': 'water',
}

export function getElementKey(element: string): string {
  return ELEMENT_KEY_MAP[element] || element.toLowerCase()
}
