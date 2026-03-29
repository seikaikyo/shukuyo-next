import type { Person } from './mansion'

export type PartnerRelationType = 'lover' | 'spouse' | 'friend' | 'colleague' | 'family' | 'ex' | 'parent' | 'boss' | 'rival'
export type EmotionDirection = 'me_to_them' | 'them_to_me' | 'mutual'

export interface RoleParagraph {
  theme: string
  sutra: string
  ref: string
  cbeta_url?: string
  interpretation: string
}

export interface RoleGuidance {
  paragraphs: RoleParagraph[]
}

export interface RoleGuidanceMap {
  _role_label?: string
  _inverse_role_label?: string
  [role: string]: RoleGuidance | string | undefined
}

export interface Relation {
  type: string
  name: string
  name_jp: string
  reading: string
  description: string
  detailed: string
  detailed_meta?: NarrativeMeta
  advice: string
  advice_meta?: NarrativeMeta
  tips?: string[]
  avoid?: string[]
  good_for: string[]
  distance_type?: 'near' | 'mid' | 'far' | null
  distance_type_name?: string
  distance_type_reading?: string
  direction?: string | null
  love?: string
  love_meta?: NarrativeMeta
  career?: string
  career_meta?: NarrativeMeta
  roles?: RoleGuidanceMap
  initiative?: InitiativeGuidance
}

export interface Calculation {
  distance: number
  formula: string
}

export interface ClassicalDirectionView {
  source_mansion: string
  target_mansion: string
  distance: number
  group: { number: number; name: string; reading: string; head: string }
  position: { name: string; index_in_group: number; full_name: string }
  sutra: { text: string; ref: string }
  interpretation: string
}

export interface ClassicalAnalysis {
  source: string
  person1_to_person2: ClassicalDirectionView
  person2_to_person1: ClassicalDirectionView
}

export interface SutraCareerItem {
  sutra: string
  interpretation: string
  cbeta_url: string
}

export interface GuidanceItem {
  sutra: string
  cbeta_url: string
  interpretation: string
}

export interface DirectionGuidance {
  suitable: GuidanceItem[]
  timing_poor: GuidanceItem[]
  remedy: {
    principle: string
    detail: string
  }
}

export interface RelationshipVerdict {
  severity: 'good' | 'neutral' | 'caution' | 'warning'
  verdict: string
  explanation: string
  bottom_line: string
}

export interface NarrativeMeta {
  source?: string
  ref?: string
  classic?: string
  editorial_note?: string
}

export interface DirectionAnalysis {
  verdict?: RelationshipVerdict | null
  direction: string
  role_name?: string
  narrative?: string
  narrative_meta?: NarrativeMeta
  energy_flow: string
  person1_perspective: string
  person2_perspective: string
  career_tip: string
  sutra_career_items?: SutraCareerItem[]
  guidance?: DirectionGuidance
  inverse_direction: string
  inverse_role_name?: string
  inverse_narrative?: string
  inverse_narrative_meta?: NarrativeMeta
  inverse_meaning: string
  inverse_sutra_career_items?: SutraCareerItem[]
  inverse_guidance?: DirectionGuidance
}

export interface PracticalGuidanceDirection {
  position: string
  do: string[]
  avoid: string[]
  career_advice: string
}

export interface PracticalGuidance {
  person1_to_person2: PracticalGuidanceDirection
  person2_to_person1: PracticalGuidanceDirection
}

export interface DirectionalScore {
  direction: string
  score: number
  modifier: number
  ryouhan_active: boolean
  ryouhan_adjusted_score: number | null
}

export interface DirectionalScores {
  person1_to_person2: DirectionalScore
  person2_to_person1: DirectionalScore
}

export interface InitiativeGuidance {
  energy_label: string
  initiative: string
  headline: string
  why: string
  reassurance: string
  do: string[]
  avoid: string[]
  // 五段式（角色/原因/流向/消耗/風險）
  role?: string
  reason?: string
  flow?: string
  drain?: string
  risk?: string
  // headhunter 模式專用
  recommend?: boolean | string
  pitch_to_candidate?: string
  pitch_to_company?: string
}

export interface CompatibilityResult {
  person1: Person
  person2: Person
  relation: Relation
  calculation: Calculation
  score: number
  directional_scores?: DirectionalScores
  summary: string
  classical_analysis?: ClassicalAnalysis
  direction_analysis?: DirectionAnalysis
  practical_guidance?: PracticalGuidance
}

export interface MansionRelation {
  type: string
  name: string
  name_jp?: string
  reading: string
  description: string
  description_classic?: string
  description_ja?: string
  description_meta?: {
    source?: string
    ref?: string
    classic?: string
    editorial_note?: string
  }
}

export interface RelationType {
  type: string
  name: string
  name_jp: string
  reading: string
  score: number
  description: string
  description_classic?: string
  source?: string
  description_ja?: string
  detailed: string
  detailed_meta?: NarrativeMeta
  advice: string
  advice_meta?: NarrativeMeta
  tips: string[]
  avoid: string[]
  good_for: string[]
}

export interface PartnerCompatibility {
  partnerId: string
  nickname: string
  birthDate: string
  mansion: {
    name_jp: string
    reading: string
    element: string
  }
  relation: Relation
  score: number
  directional_scores?: DirectionalScores
  verdict?: RelationshipVerdict
  direction_analysis?: DirectionAnalysis
  summary: string
  calculation: {
    distance: number
  }
}

export interface LunarDate {
  lunar_month: number
  lunar_month_name: string
  lunar_day: number
  display: string
  solar_dates?: { lunar_year: number; solar_date: string; display: string }[]
}

export interface CompatibleMansion {
  name_jp: string
  name_zh: string
  reading: string
  index: number
  element: string
  element_reading: string
  keywords: string[]
  personality: string
  lunar_dates: LunarDate[]
}

export interface CompatibilityCategory {
  relation: string
  reading: string
  score: number
  description: string
  description_classic?: string
  description_meta?: NarrativeMeta
  detailed?: string
  mansions: CompatibleMansion[]
}

export interface CompatibilityFinderResult {
  your_mansion: {
    name_jp: string
    name_zh: string
    reading: string
    index: number
    element: string
    lunar_date: {
      year: number
      month: number
      day: number
      display: string
    }
  }
  mei: CompatibilityCategory
  gyotai: CompatibilityCategory
  eishin: CompatibilityCategory
  yusui: CompatibilityCategory
  ankai: CompatibilityCategory
  kisei: CompatibilityCategory
}
