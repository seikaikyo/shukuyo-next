import type { FortuneDescriptionMeta } from './fortune'

export interface LuckyDay {
  date: string
  weekday: string
  level: string
  rating?: string
  reason: string
  reason_meta?: FortuneDescriptionMeta
  tip?: string
  boosts?: string[]
  conflicts?: string[]
}

export interface LuckyDaySummaryItem {
  name: string
  lucky_days: LuckyDay[]
}

export interface LuckyDayCategoryMeta {
  key: string
  name: string
  icon: string
  actions: { key: string; name: string }[]
}

export interface LuckyDayActionResult {
  key: string
  name: string
  lucky_days: LuckyDay[]
}

export interface LuckyDayCategoryResult {
  key: string
  name: string
  icon: string
  actions: LuckyDayActionResult[]
}

export interface LuckyDaySummary {
  your_mansion: {
    name_jp: string
    reading: string
    yosei: string
    index: number
  }
  categories: LuckyDayCategoryResult[]
}

export interface PairLuckyAction {
  action: string
  name: string
  lucky_days: LuckyDay[]
}

export interface LuckyCalendarDay {
  category: string
  category_name: string
  action: string
  action_name: string
  level: string
  rating: string
  reason: string
  reason_meta?: FortuneDescriptionMeta
  tip?: string
  conflicts?: string[]
  boosts?: string[]
  advice?: {
    summary: string
    do: string[]
    avoid: string[]
  }
  advice_meta?: FortuneDescriptionMeta
}

export interface LuckyCalendarData {
  year: number
  month: number
  your_mansion: {
    name_jp: string
    reading: string
    yosei: string
    index: number
  }
  days: Record<string, LuckyCalendarDay[]>
}

export interface PairLuckyCalendarData {
  year: number
  month: number
  person1: {
    mansion: string
    reading: string
    yosei: string
  }
  person2: {
    mansion: string
    reading: string
    yosei: string
  }
  compatibility: {
    relation: string
    level: string
    description: string
  }
  days: Record<string, LuckyCalendarDay[]>
}

export interface PairLuckyDaysResult {
  relation_type: string
  relation_name: string
  person1: {
    mansion: string
    reading: string
    yosei: string
  }
  person2: {
    mansion: string
    reading: string
    yosei: string
  }
  compatibility: {
    relation: string
    level: string
    description: string
  }
  actions: PairLuckyAction[]
}

export interface CareerLuckyDate {
  date: string
  weekday: string
  level: string
  level_label: string
  day_mansion: string
  relation: string
  flags: string[]
  reason: string
  reason_meta?: FortuneDescriptionMeta
}

export interface LuckyDatesResult {
  good_dates: CareerLuckyDate[]
  bad_dates: CareerLuckyDate[]
  dark_weeks: { start: string; end: string }[]
}
