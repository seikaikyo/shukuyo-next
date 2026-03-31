export interface LifeStages {
  twenties: string
  thirties: string
  forties: string
  fifties_plus: string
}

export interface DayFortune {
  auspicious: string[]
  inauspicious: string[]
  summary: string
  summary_ja?: string
  summary_classic?: string
  is_most_auspicious?: boolean
}

export interface Mansion {
  index: number
  name_jp: string
  name_zh: string
  reading: string
  yosei: string
  personality: string
  personality_classic?: string
  personality_ja?: string
  classic_source?: string
  keywords: string[]
  day_fortune?: DayFortune
  love?: string
  love_classic?: string
  love_ja?: string
  career?: string
  career_classic?: string
  career_ja?: string
  health?: string
  life_stages?: LifeStages
  life_stages_classic?: Partial<LifeStages>
  life_stages_ja?: Partial<LifeStages>
  lunar_date?: {
    year: number
    month: number
    day: number
    display: string
  }
}

export interface WheelMansion {
  index: number
  name_jp: string
  name_zh: string
  reading: string
  yosei: string
  personality?: string
  keywords?: string[]
}

/** API /compatibility 回傳的精簡人物資料 */
export interface Person {
  date: string
  mansion: string
  reading: string
  yosei: string
  yosei_reading: string
  yosei_traits: string
  keywords: string[]
  index: number
}

/** API /mansion/{date} 回傳：完整 Mansion 資料 + 日期欄位 */
export interface PersonMansion extends Mansion {
  solar_date?: string
}
