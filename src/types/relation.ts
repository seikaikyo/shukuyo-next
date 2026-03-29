export type RelationType =
  | 'crush' | 'lover' | 'spouse' | 'ex'
  | 'parent' | 'family'
  | 'friend' | 'colleague' | 'superior' | 'client'
  | 'master' | 'disciple'
  | 'dating'

export type EmotionDirection = 'me_to_them' | 'them_to_me' | 'mutual'

export const RELATION_TYPES: { value: RelationType; labelKey: string; descKey: string; group: string }[] = [
  { value: 'crush', labelKey: 'relationTypes.crush', descKey: 'relationTypeDesc.crush', group: 'romance' },
  { value: 'lover', labelKey: 'relationTypes.lover', descKey: 'relationTypeDesc.lover', group: 'romance' },
  { value: 'spouse', labelKey: 'relationTypes.spouse', descKey: 'relationTypeDesc.spouse', group: 'romance' },
  { value: 'ex', labelKey: 'relationTypes.ex', descKey: 'relationTypeDesc.ex', group: 'romance' },
  { value: 'parent', labelKey: 'relationTypes.parent', descKey: 'relationTypeDesc.parent', group: 'family' },
  { value: 'family', labelKey: 'relationTypes.family', descKey: 'relationTypeDesc.family', group: 'family' },
  { value: 'friend', labelKey: 'relationTypes.friend', descKey: 'relationTypeDesc.friend', group: 'social' },
  { value: 'colleague', labelKey: 'relationTypes.colleague', descKey: 'relationTypeDesc.colleague', group: 'social' },
  { value: 'superior', labelKey: 'relationTypes.superior', descKey: 'relationTypeDesc.superior', group: 'social' },
  { value: 'client', labelKey: 'relationTypes.client', descKey: 'relationTypeDesc.client', group: 'social' },
  { value: 'master', labelKey: 'relationTypes.master', descKey: 'relationTypeDesc.master', group: 'mentor' },
  { value: 'disciple', labelKey: 'relationTypes.disciple', descKey: 'relationTypeDesc.disciple', group: 'mentor' },
]

const RELATION_MIGRATION: Record<string, RelationType> = {
  dating: 'crush',
}

export function migrateRelationType(key: string): RelationType {
  return RELATION_MIGRATION[key] ?? key as RelationType
}
