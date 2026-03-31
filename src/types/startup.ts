/** 創業吉日 — 設立日評價 */
export interface StartupDateEval {
  date: string
  day_mansion: {
    name_zh: string
    name_jp: string
    reading: string
    index: number
  }
  relation: {
    type: string
    name: string
    direction: string
    level: string
  }
  is_opening_auspicious: boolean
  level: string
  verdict: 'excellent' | 'good' | 'fair' | 'caution' | 'warning'
  delta_days?: number
}

export interface StartupFoundingEvalResult {
  target: StartupDateEval
  alternatives: StartupDateEval[]
}

/** 創業吉日 — 業種推薦 */
export interface IndustryRecommendation {
  mansion: {
    name_zh: string
    name_jp: string
    reading: string
    index: number
  }
  career_tags: string[]
  career_description: string
  favorable_mansions: {
    index: number
    name_zh: string
    name_jp: string
    reading: string
    summary: string
  }[]
}
