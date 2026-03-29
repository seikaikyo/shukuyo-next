/** 取得本地日期字串 YYYY-MM-DD */
export function getLocalDateStr(d: Date = new Date()): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/** 將 YYYY-MM-DD 解析為本地時間（避免 UTC 偏移問題） */
function parseLocalDate(dateStr: string): Date {
  return new Date(dateStr + 'T00:00:00')
}

/** 格式化為 M/D */
export function formatDate(dateStr: string): string {
  const d = parseLocalDate(dateStr)
  return `${d.getMonth() + 1}/${d.getDate()}`
}

/** 格式化為 YYYY/M/D */
export function formatDateFull(dateStr: string): string {
  const d = parseLocalDate(dateStr)
  return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`
}

/** 取得星期幾（依語系） */
const WEEKDAY_NAMES_ZH = ['日', '一', '二', '三', '四', '五', '六']
const WEEKDAY_NAMES_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const WEEKDAY_NAMES_JA = ['日', '月', '火', '水', '木', '金', '土']

export function getWeekdayName(dateStr: string, locale = 'zh-TW'): string {
  const d = parseLocalDate(dateStr)
  const day = d.getDay()
  if (locale === 'en') return WEEKDAY_NAMES_EN[day]
  if (locale === 'ja') return WEEKDAY_NAMES_JA[day]
  return WEEKDAY_NAMES_ZH[day]
}
