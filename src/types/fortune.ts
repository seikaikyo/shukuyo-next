import type { MansionRelation } from './compatibility'

export interface FortuneDescriptionMeta {
  source?: string
  ref?: string
  classic?: string
  editorial_note?: string
}

export interface FortuneScores {
  level?: string
  level_name?: string
  level_name_ja?: string
  level_reading?: string
  base_level?: string
  career_desc?: string
  love_desc?: string
  health_desc?: string
  wealth_desc?: string
  career_desc_ja?: string
  love_desc_ja?: string
  health_desc_ja?: string
  wealth_desc_ja?: string
  career_desc_meta?: FortuneDescriptionMeta
  love_desc_meta?: FortuneDescriptionMeta
  health_desc_meta?: FortuneDescriptionMeta
  wealth_desc_meta?: FortuneDescriptionMeta
  ryouhan_active?: boolean
  ryouhan_warning?: string | null
  ryouhan_warning_ja?: string | null
  effective_interpretation?: string
}

export interface DailyFortune {
  date: string
  weekday: {
    name: string
    reading: string
    yosei: string
    planet: string
  }
  your_mansion: {
    name_jp: string
    reading: string
    yosei: string
    index: number
  }
  day_mansion: {
    name_jp: string
    reading: string
    yosei: string
    index: number
    day_fortune?: {
      auspicious: string[]
      inauspicious: string[]
      summary: string
      summary_ja?: string
      summary_en?: string
      summary_note?: string
      summary_classic?: string
      source?: string
      is_most_auspicious: boolean
    }
  }
  mansion_relation: MansionRelation
  fortune: FortuneScores
  advice: string
  advice_sutra_key?: string
  lucky: {
    direction: string
    direction_reading: string
    color: string
    color_reading: string
    color_hex: string
    numbers: number[]
  }
  special_day?: {
    type: string
    name: string
    reading: string
    level: string
    description: string
    ryouhan_reversed?: boolean
    original_level?: string
  } | null
  ryouhan?: {
    active: boolean
    lunar_month: number
    start_day: number
    end_day: number
    weekday_name?: string
    period_label?: string
    reading?: string
    description: string
    description_ja?: string
    description_classic?: string
    source?: string
    formula?: Record<string, string>
  } | null
  sanki?: {
    period: string
    period_reading: string
    period_index: number
    day_in_period: number
    is_dark_week: boolean
    day_type: string
    day_type_reading: string
    day_description: string
    period_description: string
  } | null
  compound_analysis?: {
    pattern: string
    severity: number
    name: string
    description: string
    description_ja?: string
    description_classic?: string
  }[]
}

export interface WeeklyFortune {
  center_date: string
  week_start: string
  week_end: string
  today_yosei: {
    name: string
    reading: string
    yosei: string
    planet: string
  }
  your_mansion: {
    name_jp: string
    reading: string
    yosei: string
    index: number
  }
  fortune: FortuneScores
  daily_overview: {
    date: string
    weekday: string
    level: string
    is_today: boolean
    is_yesterday: boolean
    special_day?: string | null
    ryouhan_active?: boolean
    is_dark_week?: boolean
  }[]
  week_warnings?: string[]
  advice: string
  focus?: string
  focus_meta?: FortuneDescriptionMeta
  category_tips?: {
    career: string
    love: string
    health: string
  }
  category_tips_meta?: {
    career?: FortuneDescriptionMeta
    love?: FortuneDescriptionMeta
    health?: FortuneDescriptionMeta
  }
  lucky: {
    direction: string
    direction_reading: string
    color: string
    color_reading: string
    color_hex: string
  }
}

export interface MonthlyStrategyDay {
  date: string
  weekday: string
  level: string
  reason?: string
  reasons?: string[]
}

export interface MonthlyActionWindow {
  start_date: string
  end_date: string
  days: number
  description: string
}

export interface MonthlyStrategy {
  best_days: MonthlyStrategyDay[]
  avoid_days: MonthlyStrategyDay[]
  action_windows: MonthlyActionWindow[]
}

export interface MonthlyFortune {
  year: number
  month: number
  lunar_month?: number
  month_mansion: {
    name_jp: string
    reading: string
    index: number
    yosei: string
  }
  your_mansion: {
    name_jp: string
    reading: string
    yosei: string
    index: number
  }
  relation: {
    type: string
    name: string
    name_jp?: string
    reading: string
    description: string
    description_meta?: FortuneDescriptionMeta
  }
  theme?: {
    description?: string
    meta?: FortuneDescriptionMeta
  }
  fortune: FortuneScores
  weekly: {
    week: number
    period_index: number
    period_name: string
    period_reading: string
    week_start: string
    week_end: string
    days_count: number
    level: string
    focus: string
    has_dark_week: boolean
    warnings?: string[]
    daily_overview: {
      date: string
      weekday: string
      level: string
      sanki_period_index?: number
      sanki_day_in_period?: number
      sanki_day_type?: string
      special_day?: string | null
      ryouhan_active?: boolean
      is_dark_week?: boolean
    }[]
  }[]
  month_warnings?: string[]
  ryouhan_info?: { affected_days: number; total_days: number; ratio: number } | null
  special_days?: { date: string; type: string; name: string }[]
  strategy?: MonthlyStrategy
  advice: string
  advice_meta?: FortuneDescriptionMeta
}

export interface YearlySafeHaven {
  start_month: number
  end_month: number
  cluster_type: string | null
  description: string
}

export interface YearlyBestMonth {
  month: number
  level: string
  relation_type: string
  description: string
}

export interface YearlyCautionMonth {
  month: number
  level: string
  reasons: string[]
  description: string
}

export interface YearlyStrategy {
  safe_havens: YearlySafeHaven[]
  best_months: YearlyBestMonth[]
  caution_months: YearlyCautionMonth[]
  ryouhan_outlook: {
    affected_months: number[]
    total_ratio: number
    consecutive_groups: number[][]
    description: string
  }
  yearly_rhythm: {
    type: string
    description: string
  }
  dynamic_tips: Record<number, string>
}

export interface YearlyFortune {
  year: number
  kuyou_star: {
    name: string
    reading: string
    level: string
    meta?: FortuneDescriptionMeta
    fortune_name: string
    yosei: string | null
    buddha: string
    description: string
    kazoe_age: number
  }
  your_mansion: {
    name_jp: string
    reading: string
    yosei: string
    index: number
  }
  fortune: FortuneScores
  theme?: {
    title: string
    description: string
    meta?: FortuneDescriptionMeta
  }
  category_descriptions?: {
    career: string
    love: string
    health: string
    wealth: string
  }
  category_descriptions_meta?: {
    career?: FortuneDescriptionMeta
    love?: FortuneDescriptionMeta
    health?: FortuneDescriptionMeta
    wealth?: FortuneDescriptionMeta
  }
  monthly_trend: {
    month: number
    level: string
    relation_type?: string
    ryouhan_ratio?: number
    tip?: string
    special_day_counts?: { kanro: number; kongou: number; rasetsu: number }
  }[]
  opportunities: string[]
  warnings: string[]
  advice: string
  advice_meta?: FortuneDescriptionMeta
  strategy?: YearlyStrategy
  shingon?: {
    practice_name: string
    practice_level: string
    description: string
    core_teaching: string
    practice_focus: string
    recommended_practices: string[]
    mantra: {
      buddha: string
      name: string
      text: string
      reading: string
      siddham_unicode?: string
      siddham_roman?: string
      siddham_bija?: string
    }
    homa_type: string
    homa_description: string
    theme: { title: string; description: string }
    category_practice: { career: string; love: string; health: string; wealth: string }
    category_labels: { career: string; love: string; health: string; wealth: string }
    advice: string
    monthly_tips: Record<string, string>
    warnings: string[]
    opportunities: string[]
  }
}
