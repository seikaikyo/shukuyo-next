/**
 * 將分析文字中的「對方」替換為實際暱稱
 * 三語言對應：對方 (zh-TW) / 相手 (ja) / the other person (en)
 */
export function replaceOtherPerson(
  text: string,
  name: string,
  locale: string = 'zh-TW'
): string {
  if (!name || !text) return text
  if (locale === 'ja') return text.replace(/相手/g, name)
  if (locale === 'en') return text.replace(/the other person/gi, name)
  return text.replace(/對方/g, name)
}
