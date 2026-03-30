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
  element: string
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

/** API /compatibility 回傳的精簡人物資料 */
export interface Person {
  date: string
  mansion: string
  reading: string
  element: string
  element_reading: string
  element_traits: string
  keywords: string[]
  index: number
}


