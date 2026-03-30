import type { FortuneDescriptionMeta } from './fortune'

export interface LuckyDay {
  date: string
  weekday: string
  score: number
  rating?: string
  reason: string
  reason_meta?: FortuneDescriptionMeta
  tip?: string
  boosts?: string[]
  conflicts?: string[]
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
    element: string
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
  score: number
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
    element: string
    index: number
  }
  days: Record<string, LuckyCalendarDay[]>
}

export interface PairLuckyDaysResult {
  relation_type: string
  relation_name: string
  person1: {
    mansion: string
    reading: string
    element: string
  }
  person2: {
    mansion: string
    reading: string
    element: string
  }
  compatibility: {
    relation: string
    score: number
    description: string
  }
  actions: PairLuckyAction[]
}

