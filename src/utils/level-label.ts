/** Map Go API level key to localized display label */
export function levelLabel(level: string, locale: string): string {
  const labels: Record<string, Record<string, string>> = {
    great_fortune: { 'zh-TW': '\u5927\u5409', en: 'Great', ja: '\u5927\u5409' },
    good_fortune: { 'zh-TW': '\u5409', en: 'Good', ja: '\u5409' },
    small_misfortune: { 'zh-TW': '\u5C0F\u51F6', en: 'Caution', ja: '\u5C0F\u51F6' },
    misfortune: { 'zh-TW': '\u51F6', en: 'Bad', ja: '\u51F6' },
    great_misfortune: { 'zh-TW': '\u5927\u51F6', en: 'Bad', ja: '\u5927\u51F6' },
    // Go API 日文 level
    daikichi: { 'zh-TW': '\u5927\u5409', en: 'Great', ja: '\u5927\u5409' },
    kichi: { 'zh-TW': '\u5409', en: 'Good', ja: '\u5409' },
    shokyo: { 'zh-TW': '\u5C0F\u51F6', en: 'Caution', ja: '\u5C0F\u51F6' },
    kyo: { 'zh-TW': '\u51F6', en: 'Bad', ja: '\u51F6' },
    daikyo: { 'zh-TW': '\u5927\u51F6', en: 'Bad', ja: '\u5927\u51F6' },
  }
  return labels[level]?.[locale] || labels[level]?.['zh-TW'] || level
}
