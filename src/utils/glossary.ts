/**
 * 術語對照表 — 提供一行白話解釋 + 知識頁面 anchor
 * 搭配 InfoHint 使用，讓新手不需查資料就能理解
 */

export interface GlossaryEntry {
  i18nKey: string
  anchor?: string // /knowledge#anchor
}

// 六種宿曜關係
export const RELATION_GLOSSARY: Record<string, GlossaryEntry> = {
  eishin: { i18nKey: 'glossary.relations.eishin', anchor: 'relations' },
  gyotai: { i18nKey: 'glossary.relations.gyotai', anchor: 'relations' },
  mei: { i18nKey: 'glossary.relations.mei', anchor: 'relations' },
  yusui: { i18nKey: 'glossary.relations.yusui', anchor: 'relations' },
  kisei: { i18nKey: 'glossary.relations.kisei', anchor: 'relations' },
  ankai: { i18nKey: 'glossary.relations.ankai', anchor: 'relations' },
}

// 特殊日
export const SPECIAL_DAY_GLOSSARY: Record<string, GlossaryEntry> = {
  kanro: { i18nKey: 'glossary.specialDays.kanro', anchor: 'special-days' },
  kongou: { i18nKey: 'glossary.specialDays.kongou', anchor: 'special-days' },
  rasetsu: { i18nKey: 'glossary.specialDays.rasetsu', anchor: 'special-days' },
}

// 運勢等級（凶相關 — 安心提示用）
export const LEVEL_GLOSSARY: Record<string, GlossaryEntry> = {
  shokyo: { i18nKey: 'glossary.levels.shokyo', anchor: 'kuyou' },
  kyo: { i18nKey: 'glossary.levels.kyo', anchor: 'kuyou' },
  daikyo: { i18nKey: 'glossary.levels.daikyo', anchor: 'kuyou' },
  '小凶': { i18nKey: 'glossary.levels.shokyo', anchor: 'kuyou' },
  '凶': { i18nKey: 'glossary.levels.kyo', anchor: 'kuyou' },
  '大凶': { i18nKey: 'glossary.levels.daikyo', anchor: 'kuyou' },
}

// 期間 / 狀態
export const PERIOD_GLOSSARY: Record<string, GlossaryEntry> = {
  ryouhan: { i18nKey: 'glossary.periods.ryouhan', anchor: 'ryouhan' },
  sanki: { i18nKey: 'glossary.periods.sanki', anchor: 'sanki' },
}

export function getKnowledgeLink(anchor?: string): string {
  return anchor ? `/knowledge#${anchor}` : '/knowledge'
}
