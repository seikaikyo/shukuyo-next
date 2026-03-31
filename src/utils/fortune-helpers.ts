/** 等級 key -> i18n key 映射 */
const LEVEL_I18N_MAP: Record<string, string> = {
  daikichi: 'fortune.levels.daikichi',
  kichi: 'fortune.levels.kichi',
  shokyo: 'fortune.levels.shokyo',
  kyo: 'fortune.levels.kyo',
}

const LEVEL_CLASS_MAP: Record<string, string> = {
  daikichi: 'excellent',
  kichi: 'good',
  shokyo: 'caution',
  kyo: 'warning',
}

const LEVEL_HEIGHT: Record<string, number> = {
  daikichi: 100,
  kichi: 66,
  shokyo: 40,
  kyo: 20,
}

const LEVEL_COLOR: Record<string, string> = {
  excellent: 'text-emerald-600 dark:text-emerald-400',
  good: 'text-blue-600 dark:text-blue-400',
  caution: 'text-amber-600 dark:text-amber-400',
  warning: 'text-red-600 dark:text-red-400',
  fair: 'text-muted-foreground',
}

const LEVEL_BG: Record<string, string> = {
  excellent: 'bg-emerald-50 dark:bg-emerald-950/30',
  good: 'bg-blue-50 dark:bg-blue-950/30',
  caution: 'bg-amber-50 dark:bg-amber-950/30',
  warning: 'bg-red-50 dark:bg-red-950/30',
  fair: 'bg-muted/50',
}

const LEVEL_BORDER: Record<string, string> = {
  excellent: 'border-emerald-300 dark:border-emerald-700',
  good: 'border-blue-300 dark:border-blue-700',
  caution: 'border-amber-300 dark:border-amber-700',
  warning: 'border-red-300 dark:border-red-700',
  fair: 'border-border',
}

export function getLevelClass(level?: string): string {
  return LEVEL_CLASS_MAP[level || ''] || 'fair'
}

export function getLevelHeight(level?: string): number {
  return LEVEL_HEIGHT[level || ''] || 30
}

export function levelColor(level?: string): string {
  const cls = getLevelClass(level)
  return LEVEL_COLOR[cls] || LEVEL_COLOR.fair
}

export function levelBg(level?: string): string {
  const cls = getLevelClass(level)
  return LEVEL_BG[cls] || LEVEL_BG.fair
}

export function levelBorder(level?: string): string {
  const cls = getLevelClass(level)
  return LEVEL_BORDER[cls] || LEVEL_BORDER.fair
}

export function levelBorderLeft(level?: string): string {
  const cls = getLevelClass(level)
  const map: Record<string, string> = {
    excellent: 'border-l-emerald-400',
    good: 'border-l-blue-400',
    caution: 'border-l-amber-400',
    warning: 'border-l-red-400',
    fair: 'border-l-border',
  }
  return map[cls] || map.fair
}

export function getFortuneLevel(level?: string) {
  const cls = getLevelClass(level)
  const textKeyMap: Record<string, string> = {
    daikichi: 'fortune.scoreLevels.excellent',
    kichi: 'fortune.scoreLevels.good',
    shokyo: 'fortune.scoreLevels.caution',
    kyo: 'fortune.scoreLevels.warning',
  }
  return { textKey: textKeyMap[level || ''] || '', class: cls }
}

export function getMansionRelationClass(relationType: string): string {
  const classMap: Record<string, string> = {
    eishin: 'excellent',
    gyotai: 'good',
    mei: 'fair',
    yusui: 'neutral',
    kisei: 'caution',
    ankai: 'warning',
  }
  return classMap[relationType] || 'neutral'
}

export function getLevelKey(level: string): string {
  return LEVEL_I18N_MAP[level] || level
}

/** 中文七曜 -> i18n key 反查 */
const YOSEI_KEY_MAP: Record<string, string> = {
  '\u6728': 'wood', '\u91d1': 'metal', '\u571f': 'earth',
  '\u65e5': 'sun', '\u6708': 'moon', '\u706b': 'fire', '\u6c34': 'water',
}

export function getYoseiKey(yosei: string): string {
  return YOSEI_KEY_MAP[yosei] || yosei.toLowerCase()
}
