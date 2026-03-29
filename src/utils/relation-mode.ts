import type { RelationType } from '../types/relation'

/**
 * RelationType 對應的 red_flags 查表 mode
 *
 * PartnerList 是人際關係場景，所有關係都用 personal（人對人），
 * 只有 ex 用專屬 ex mode。
 * seeker mode（公司對求職者）僅在 CompanySearch 等求職場景使用，
 * 不在此函式處理。
 */
export function getRedFlagMode(relation: RelationType): string {
  if (relation === 'ex') return 'ex'
  return 'personal'
}

/**
 * RelationType 對應的 gap_guidance 查表 key
 * gap_guidance.json 支援: spouse, lover, friend, colleague, family, parent, ex
 * 不在表中的 fallback 到 friend
 */
export function getGapRelationKey(relation: RelationType): string {
  switch (relation) {
    case 'spouse':
    case 'lover':
    case 'ex':
    case 'colleague':
    case 'family':
    case 'parent':
    case 'friend':
      return relation
    case 'crush':
      return 'lover'
    case 'superior':
    case 'client':
      return 'colleague'
    case 'master':
    case 'disciple':
      return 'friend'
    default:
      return 'friend'
  }
}

/**
 * 取得 partner 所有面向（主標籤 + 附加標籤）
 * 用於多面向原典對照
 */
export function getAllPerspectives(
  mainRelation: RelationType,
  subTags?: RelationType[],
): { relation: RelationType; mode: string; gapKey: string }[] {
  const tags = [mainRelation, ...(subTags || [])]
  const seen = new Set<string>()
  return tags
    .filter(t => {
      if (seen.has(t)) return false
      seen.add(t)
      return true
    })
    .map(t => ({
      relation: t,
      mode: getRedFlagMode(t),
      gapKey: getGapRelationKey(t),
    }))
}
