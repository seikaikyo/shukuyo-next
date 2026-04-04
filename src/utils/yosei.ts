/** Seven luminaries (七曜) full name mapping */
const YOSEI_NAMES: Record<string, Record<string, string>> = {
  sun: { 'zh-TW': '\u65E5\u66DC', en: 'Sun', ja: '\u65E5\u66DC' },
  moon: { 'zh-TW': '\u6708\u66DC', en: 'Moon', ja: '\u6708\u66DC' },
  fire: { 'zh-TW': '\u706B\u66DC', en: 'Mars', ja: '\u706B\u66DC' },
  water: { 'zh-TW': '\u6C34\u66DC', en: 'Mercury', ja: '\u6C34\u66DC' },
  wood: { 'zh-TW': '\u6728\u66DC', en: 'Jupiter', ja: '\u6728\u66DC' },
  metal: { 'zh-TW': '\u91D1\u66DC', en: 'Venus', ja: '\u91D1\u66DC' },
  earth: { 'zh-TW': '\u571F\u66DC', en: 'Saturn', ja: '\u571F\u66DC' },
}

export function getYoseiFullName(yosei: string, locale = 'zh-TW'): string {
  return YOSEI_NAMES[yosei]?.[locale] || YOSEI_NAMES[yosei]?.['zh-TW'] || yosei
}
