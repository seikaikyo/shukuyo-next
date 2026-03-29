// iCalendar (.ics) 產生工具
// RFC 5545: https://datatracker.ietf.org/doc/html/rfc5545

import { getIcsTranslations } from './ics-i18n'

interface DayMansion {
  name_jp: string
  index: number
  element: string
}

interface IcsSpecialDay {
  type: string
  name: string
  level: string
  ryouhan_reversed: boolean
}

interface PersonalDay {
  relation_type: string
  relation_name: string
  fortune_score: number
  level?: string
  level_name?: string
  sanki_period: string
  sanki_period_index: number
  sanki_day_type?: string
  is_dark_week: boolean
}

interface CalendarDay {
  date: string
  day: number
  weekday: string
  day_mansion: DayMansion
  special_day: IcsSpecialDay | null
  ryouhan: { active: boolean; lunar_month: number } | null
  japanese_calendar: { types: string[]; labels: string[]; is_super_lucky: boolean } | null
  personal?: PersonalDay
}

export interface CalendarData {
  year: number
  month: number
  days: CalendarDay[]
  statistics: {
    ryouhan_days: number
    kanro_count: number
    kongou_count: number
    rasetsu_count: number
  }
  personal?: {
    your_mansion: {
      name_jp: string
      reading: string
      element: string
      index: number
    }
  }
}

export interface IcsParams {
  calendars: CalendarData[]
  mansionName: string
  mansionElement: string
  birthDate: string
  year: number
  lang?: string
}

function escapeIcsText(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n')
}

function foldLine(line: string): string {
  const encoder = new TextEncoder()
  const bytes = encoder.encode(line)
  if (bytes.length <= 75) return line

  const parts: string[] = []
  let start = 0

  while (start < line.length) {
    const maxBytes = start === 0 ? 75 : 74
    let end = start
    let currentBytes = 0

    while (end < line.length) {
      const charBytes = encoder.encode(line[end]).length
      if (currentBytes + charBytes > maxBytes) break
      currentBytes += charBytes
      end++
    }

    if (end === start) end = start + 1

    parts.push(line.substring(start, end))
    start = end
  }

  return parts.join('\r\n ')
}

function formatIcsDate(dateStr: string): string {
  return dateStr.replace(/-/g, '')
}

function getFortuneLevel(score: number, levelName?: string, lang = 'zh-TW'): string {
  if (levelName) return levelName
  const t = getIcsTranslations(lang)
  if (score >= 90) return t.levelNames.daikichi
  if (score >= 60) return t.levelNames.kichi
  if (score >= 45) return t.levelNames.shokyo
  return t.levelNames.kyo
}

function generateUid(date: string, index: number): string {
  return `${date}-${index}@sukuyodo`
}

function isSankiDayType(dayType: string, keys: string[]): boolean {
  return keys.includes(dayType)
}

function getDayTip(
  level: string | null,
  personal: PersonalDay | undefined,
  day: CalendarDay,
  lang: string
): string {
  const t = getIcsTranslations(lang)
  const hasRyouhan = !!day.ryouhan?.active
  const isDark = !!personal?.is_dark_week
  const specialType = day.special_day?.type ?? null
  const reversed = !!day.special_day?.ryouhan_reversed

  if (specialType === 'kanro' && !reversed) {
    return t.tips.kanro
  }
  if (specialType === 'kanro' && reversed) {
    return t.tips.kanroReversed
  }
  if (specialType === 'kongou' && !reversed) {
    return t.tips.kongou
  }
  if (specialType === 'kongou' && reversed) {
    return t.tips.kongouReversed
  }
  if (specialType === 'rasetsu' && !reversed) {
    return t.tips.rasetsu
  }
  if (specialType === 'rasetsu' && reversed) {
    return t.tips.rasetsuReversed
  }

  if (isDark) {
    const dayType = personal?.sanki_day_type ?? ''
    if (isSankiDayType(dayType, ['栄の日', 'Ei Day'])) return t.tips.darkWeekEi
    if (isSankiDayType(dayType, ['安の日', 'An Day'])) return t.tips.darkWeekAn
    if (isSankiDayType(dayType, ['成の日', 'Sei Day'])) return t.tips.darkWeekSei
    if (isSankiDayType(dayType, ['壊の日', 'Kai Day'])) return t.tips.darkWeekKai
    if (isSankiDayType(dayType, ['業の日', 'Gyo Day'])) return t.tips.darkWeekGyou
    if (isSankiDayType(dayType, ['衰の日', 'Sui Day'])) return t.tips.darkWeekSui
    if (isSankiDayType(dayType, ['危の日', 'Ki Day'])) return t.tips.darkWeekKi
    if (isSankiDayType(dayType, ['命の日', 'Mei Day'])) return t.tips.darkWeekMei
    if (isSankiDayType(dayType, ['胎の日', 'Tai Day'])) return t.tips.darkWeekTai
    return t.tips.darkWeekDefault
  }

  if (hasRyouhan) {
    return t.tips.ryouhan
  }

  const ln = getIcsTranslations(lang).levelNames
  if (level === ln.daikichi) return t.tips.daikichi
  if (level === ln.kichi) return t.tips.kichi
  if (level === ln.shokyo) return t.tips.shokyo
  if (level === ln.kyo) return t.tips.kyo

  return t.tips.normal
}

function buildDayEvent(day: CalendarDay, index: number, lang: string): string[] {
  const t = getIcsTranslations(lang)
  const personal = day.personal
  const level = personal
    ? getFortuneLevel(personal.fortune_score, personal.level_name, lang)
    : null

  const titleSegments: string[] = []
  if (level) titleSegments.push(level)
  if (personal) {
    titleSegments.push(personal.sanki_period)
  }
  const markers: string[] = []
  if (day.special_day) {
    const rev = day.special_day.ryouhan_reversed ? `(${t.ryouhanReverse})` : ''
    markers.push(`${day.special_day.name}${rev}`)
  }
  if (day.ryouhan?.active && !day.special_day) {
    markers.push(t.ryouhanLabel)
  }
  if (personal?.is_dark_week) {
    markers.push(t.darkWeekLabel)
  }
  // 六害宿標記已移除（非原典）
  if (markers.length > 0) {
    titleSegments.push(markers.join(' '))
  }
  const summary = titleSegments.join(' | ')

  const tip = getDayTip(level, personal, day, lang)

  const descParts: string[] = []
  descParts.push(tip)
  descParts.push('---')
  if (personal) {
    descParts.push(`${t.fortuneLabel}: ${personal.fortune_score} (${level})`)
    descParts.push(`${t.relationLabel}: ${personal.relation_name}`)
    descParts.push(`${t.mansionLabel}: ${day.day_mansion.name_jp}(${day.day_mansion.element}) - ${day.weekday}`)
    descParts.push(`${t.sankiLabel}: ${personal.sanki_period}`)
  }
  if (day.special_day) {
    const sdLabel = day.special_day.ryouhan_reversed
      ? `${day.special_day.name} (${t.ryouhanReverse}: ${day.special_day.level})`
      : `${day.special_day.name} (${day.special_day.level})`
    descParts.push(`${t.specialDayLabel}: ${sdLabel}`)
  }
  if (day.ryouhan?.active) {
    descParts.push(`-- ${t.ryouhanWarn} --`)
  }
  if (personal?.is_dark_week) {
    const dayType = personal?.sanki_day_type ?? ''
    descParts.push(`-- ${t.darkWeekLabel} (${dayType || t.darkWeekFallback}) --`)
  }
  // 六害宿描述已移除（非原典）

  const description = descParts.join('\\n')

  const dtStart = formatIcsDate(day.date)
  const nextDate = new Date(day.date + 'T00:00:00')
  nextDate.setDate(nextDate.getDate() + 1)
  const y = nextDate.getFullYear()
  const m = String(nextDate.getMonth() + 1).padStart(2, '0')
  const d = String(nextDate.getDate()).padStart(2, '0')
  const dtEnd = formatIcsDate(`${y}-${m}-${d}`)

  const lines: string[] = [
    'BEGIN:VEVENT',
    foldLine(`UID:${generateUid(day.date, index)}`),
    `DTSTART;VALUE=DATE:${dtStart}`,
    `DTEND;VALUE=DATE:${dtEnd}`,
    foldLine(`SUMMARY:${escapeIcsText(summary)}`),
  ]

  if (description) {
    lines.push(foldLine(`DESCRIPTION:${description}`))
  }

  lines.push('TRANSP:TRANSPARENT')
  lines.push('END:VEVENT')

  return lines
}

export function generateIcsCalendar(params: IcsParams): string | null {
  const { calendars, mansionName, mansionElement, year, lang = 'zh-TW' } = params
  const t = getIcsTranslations(lang)

  const allDays: CalendarDay[] = []
  for (const cal of calendars) {
    allDays.push(...cal.days)
  }

  if (allDays.length === 0) return null

  const now = new Date()
  const dtstamp = now.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')

  const calName = t.calendarName
    .replace('{mansion}', mansionName)
    .replace('{element}', mansionElement)
    .replace('{year}', String(year))

  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    foldLine(`PRODID:-//Sukuyodo//Fortune Calendar//${year}//`),
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    foldLine(`X-WR-CALNAME:${escapeIcsText(calName)}`),
    'X-WR-TIMEZONE:Asia/Taipei',
  ]

  for (let i = 0; i < allDays.length; i++) {
    const day = allDays[i]!
    const eventLines = buildDayEvent(day, i, lang)
    const insertIdx = eventLines.indexOf('BEGIN:VEVENT') + 1
    eventLines.splice(insertIdx, 0, `DTSTAMP:${dtstamp}`)
    lines.push(...eventLines)
  }

  lines.push('END:VCALENDAR')

  return lines.join('\r\n')
}

export function downloadIcs(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
