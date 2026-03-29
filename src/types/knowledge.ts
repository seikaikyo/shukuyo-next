export interface HistoryEntry {
  title: string
  content: string
  source?: string
  editorial_note?: string
}

export interface KeyConcept {
  title: string
  content: string
  content_classic?: string
  content_ja?: string
  source?: string
  editorial_note?: string
}

export interface PracticalGuide {
  title: string
  content: string
  source?: string
  editorial_note?: string
}

export interface KnowledgeSection {
  title: string
  content: string
  content_classic?: string
  content_ja?: string
  source?: string
  editorial_note?: string
}

export interface KnowledgeTable {
  description: string
  headers: string[]
  rows: string[][]
  source?: string
  content_classic?: string
  editorial_note?: string
}

export interface SpecialDaysKnowledge {
  title: string
  sections: KnowledgeSection[]
  day_map_table: KnowledgeTable
  source?: string
  editorial_note?: string
}

export interface KuyouKnowledge {
  title: string
  sections: KnowledgeSection[]
  stars_table: KnowledgeTable
  source?: string
  editorial_note?: string
}

export interface MonthMansionEntry {
  month: number
  name: string
  start_mansion: string
  start_index: number
  reading: string
}

export interface MonthMansionTable {
  calendar_description: string
  months: MonthMansionEntry[]
  source_classic?: string
  source_ref?: string
  source_ja?: string
  correction_note?: string
}

export interface Metadata {
  name: string
  reading: string
  origin: string
  origin_reading: string
  founder: string
  founder_reading: string
  scripture: string
  scripture_reading: string
  method: string
  method_reading: string
  history?: HistoryEntry[]
  key_concepts?: KeyConcept[]
  practical_guide?: PracticalGuide[]
  special_days_knowledge?: SpecialDaysKnowledge
  kuyou_knowledge?: KuyouKnowledge
  ryouhan_knowledge?: {
    title: string
    sections: KnowledgeSection[]
    source?: string
    editorial_note?: string
    ryouhan_table?: {
      description: string
      headers: string[]
      rows: string[][]
    }
  }
  sanki_knowledge?: {
    title: string
    sections: KnowledgeSection[]
    source?: string
    editorial_note?: string
  }
  month_mansion_table?: MonthMansionTable
  requested_language?: string
  content_language?: string
  is_fallback_content?: boolean
}
