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

export interface SpecialDaysResult {
  year: number
  month: number
  days: SpecialDay[]
  summary: {
    kanro_count: number
    kongou_count: number
    rasetsu_count: number
  }
}

export interface JapaneseLuckyDay {
  date: string
  weekday: string
  types: string[]
  labels: string[]
  descriptions?: string[]
  is_super_lucky: boolean
  stem_branch: string
  rokuyo: string
}

export interface JapaneseUnluckyDay {
  date: string
  weekday: string
  type: string
  label: string
  stem_branch: string
  rokuyo: string
}

export interface JapaneseCalendarSummary {
  tensya_count: number
  ichiryumanbai_count: number
  tora_count: number
  mi_count: number
  super_lucky_count: number
  fujoubyou_count: number
}

export interface DayTypeDescription {
  name: string
  reading: string
  short: string
  description: string
}

export interface JapaneseCalendarResult {
  year: number
  month: number
  days: JapaneseLuckyDay[]
  unlucky_days: JapaneseUnluckyDay[]
  summary: JapaneseCalendarSummary
  day_type_descriptions?: Record<string, DayTypeDescription>
}
