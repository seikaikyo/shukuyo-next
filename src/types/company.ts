import type { Person } from './mansion'
import type { Relation, DirectionAnalysis, DirectionalScores, PracticalGuidance, InitiativeGuidance } from './compatibility'

export interface CompanyNarrativeMeta {
  source?: string
  ref?: string
  classic?: string
  editorial_note?: string
}

export interface CompanyTier {
  rank: number
  label: string
  css_class: string
  reason: string
  meta?: CompanyNarrativeMeta
}

export interface CompanyRecommendation {
  priority: number
  summary: string
  action_items: string[]
  meta?: CompanyNarrativeMeta
}

export interface CompanyFortuneInfo {
  kuyou_star: {
    name: string
    reading: string
    level: string
    meta?: CompanyNarrativeMeta
    fortune_name: string
    element: string | null
    buddha: string
    description: string
    kazoe_age: number
  }
  overall: number
  career: number
}

export interface DrainInfo {
  index: number
  label: string
  css: string
}

export interface CrossRiskCurrent {
  level: 'danger' | 'warning' | 'safe'
  year: number
}

export interface DeepFortuneYear {
  year: number
  company_star: string
  company_level: string
  company_overall: number
  cross_risk: 'danger' | 'warning' | 'safe'
}

export interface CompanyAnalysisItem {
  id: string
  name: string
  compatibility: {
    score: number
    relation: Relation
    person2: Person
    direction_analysis?: DirectionAnalysis
    directional_scores?: DirectionalScores
    practical_guidance?: PracticalGuidance
    initiative?: InitiativeGuidance
  }
  company_fortune: CompanyFortuneInfo
  tier: CompanyTier
  recommendation: CompanyRecommendation
  drain?: DrainInfo
  drain_analysis?: {
    relationship: string
    daily_feel: string
    energy_flow_desc: string
    long_term_risk: string
    growth: string
    stability: string
    bad_year_impact: string
    fit_for: string
  }
  composite_score?: number
  cross_risk_current?: CrossRiskCurrent
  deep_fortune?: DeepFortuneYear[]
  memo: string
  job_url: string
}

export interface StrategicCategory {
  name: string
  reason: string
}

export interface StrategicSummary {
  top_pick: StrategicCategory | null
  categories: {
    best_match: StrategicCategory[]
    growth_potential: StrategicCategory[]
    safe_bet: StrategicCategory[]
    watch_out: StrategicCategory[]
  }
  direction_insight: string
}

export interface CompanyBatchResult {
  user: {
    mansion: {
      name_jp: string
      reading: string
      element: string
      index: number
    }
    yearly_fortune: CompanyFortuneInfo
    deep_fortune?: { year: number; star: string; level: string; overall: number }[]
  }
  companies: CompanyAnalysisItem[]
  tier_summary: {
    tier_1: number
    tier_2: number
    tier_3: number
    tier_4: number
  }
  drain_summary?: {
    low: number
    mid: number
    high: number
  }
  strategic_summary?: StrategicSummary
}

export interface CompanyJob {
  title: string
  location: string
  url: string
  sutra_match: boolean
  match_reason: string | null
}

export interface CompanyJobsResult {
  company_url: string | null
  jobs: CompanyJob[]
}

// 公司比較分析
export interface ComparisonDrain {
  index: number
  label: string
  css: string
}

export interface CrossRiskDetail {
  year: number
  level: 'danger' | 'warning' | 'safe'
  user_star: string
  drain_index: number
}

export interface ComparisonCompanyItem {
  id: string
  name: string
  founding_date: string
  compatibility: {
    score: number
    relation_type: string
    relation_name: string
    direction: string
    distance_type: string
    score_to_company: number
    score_from_company: number
  }
  company_mansion: {
    name: string
    element: string
  }
  drain: ComparisonDrain
  cross_risk: {
    danger_years: number
    warning_years: number
    details: CrossRiskDetail[]
  }
  decade_alignment: {
    score: number
    both_good_years: number
    both_bad_years: number
    complement_years: number
  }
  composite_score: number
  decade_fortune: {
    year: number
    company: { star: string; level: string; overall: number }
    user: { star: string; level: string; overall: number }
    cross_risk: string
  }[]
  priority: {
    rank: number
    label: string
  }
  initiative: Record<string, string>
}

export interface ComparisonVerdict {
  summary: string
  warnings: string[]
  top_pick: string
  top_composite: number
}

export interface ComparisonResult {
  user: {
    mansion: {
      name_jp: string
      reading: string
      element: string
      index: number
    }
    decade_fortune: {
      year: number
      star: string
      level: string
      overall: number
      career: number
    }[]
  }
  companies: ComparisonCompanyItem[]
  verdict: ComparisonVerdict
}

