export interface SpecialDay {
  date: string
  weekday: string
  type: string
  name: string
  reading: string
  level: string
  mansion: string
  mansion_reading: string
  description: string
  ryouhan_reversed?: boolean
}

// ---- 月曆 API 回傳型別 ----

export interface CalendarDayMansion {
  name_jp: string
  index: number
  yosei: string
}

export interface CalendarPersonal {
  relation_type: string
  relation_name: string
  fortune_score: number
  level?: string
  level_name?: string
  sanki_period: string
  sanki_period_index: number
  sanki_day_type?: string
  is_dark_week: boolean
  rokugai?: string | null
}

export interface CalendarDay {
  date: string
  day: number
  weekday: string
  day_mansion: CalendarDayMansion
  special_day: {
    type: string
    name: string
    level: string
    reading?: string
    description?: string
  } | null
  ryouhan: { active: boolean } | null
  personal: CalendarPersonal | null
}

export interface CalendarMonthData {
  year: number
  month: number
  days: CalendarDay[]
}
