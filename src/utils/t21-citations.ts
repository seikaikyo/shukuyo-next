import { safeLinkifyT21 } from './linkify'

/** T21n1299 原典引文映射（來源: backend/services/t21_citations.py） */
export const T21_CITATIONS: Record<string, { text: string; source: string }> = {
  eishin: { text: '宜入官拜職、對見大人、上書表進獻君王、興營買賣。宜結交、定婚姻、歡宴聚會並吉', source: 'T21 p.397c' },
  yusui: { text: '宜結交朋友大吉。唯宜解除諸惡、療病', source: 'T21 p.397c-398a' },
  kisei: { text: '宜修道學問、作諸成就法並吉', source: 'T21 p.397c-398a' },
  ankai: { text: '移徙吉、造作園宅並吉。宜作鎮壓、降伏怨讎，餘並不堪', source: 'T21 p.397c-398a' },
  gyotai: { text: '所作善惡亦不成就，甚衰。不宜舉動百事', source: 'T21 p.397c' },
  mei: { text: '不宜舉動百事。宜修功德', source: 'T21 p.397c' },
  kanro: { text: '甘露日，是大吉祥，宜冊立、受灌頂法、造作寺宇及受戒、習學經法、出家修道，一切並吉', source: 'T21 p.398b' },
  kongou: { text: '宜作一切降伏法，誦日天子呪及作護摩，並諸猛利等事', source: 'T21 p.398b-c' },
  rasetsu: { text: '不宜舉百事，必有殃禍', source: 'T21 p.398c' },
}

/** 從 reason 文字提取日型 key 的正則映射 */
const DAY_TYPE_PATTERNS: [RegExp, string][] = [
  [/栄親/, 'eishin'],
  [/友衰/, 'yusui'],
  [/危成/, 'kisei'],
  [/安壊/, 'ankai'],
  [/業胎/, 'gyotai'],
  [/命日/, 'mei'],
  [/甘露/, 'kanro'],
  [/金剛/, 'kongou'],
  [/羅刹/, 'rasetsu'],
]

/** 根據 reason 文字取得對應的 T21 原典引文 */
export function getCitation(reason: string): { text: string; source: string; html: string } | null {
  for (const [pattern, key] of DAY_TYPE_PATTERNS) {
    if (pattern.test(reason)) {
      const c = T21_CITATIONS[key]
      if (c) {
        return {
          text: c.text,
          source: c.source,
          html: safeLinkifyT21(`「${c.text}」（${c.source}）`),
        }
      }
    }
  }
  return null
}
