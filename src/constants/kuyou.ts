/** 九曜星定義（mod 9 查表用） */
export const KUYOU_STARS = [
  { nameKey: 'fortune.kuyou.rahula', levelKey: 'fortune.kuyouLevels.daikyo', cls: 'kuyou-bad' },
  { nameKey: 'fortune.kuyou.saturn', levelKey: 'fortune.kuyouLevels.hankichi', cls: 'kuyou-mid' },
  { nameKey: 'fortune.kuyou.mercury', levelKey: 'fortune.kuyouLevels.suekichi', cls: 'kuyou-mid' },
  { nameKey: 'fortune.kuyou.venus', levelKey: 'fortune.kuyouLevels.hankichi', cls: 'kuyou-mid' },
  { nameKey: 'fortune.kuyou.sun', levelKey: 'fortune.kuyouLevels.daikichi', cls: 'kuyou-good' },
  { nameKey: 'fortune.kuyou.mars', levelKey: 'fortune.kuyouLevels.daikyo', cls: 'kuyou-bad' },
  { nameKey: 'fortune.kuyou.ketu', levelKey: 'fortune.kuyouLevels.daikyo', cls: 'kuyou-bad' },
  { nameKey: 'fortune.kuyou.moon', levelKey: 'fortune.kuyouLevels.daikichi', cls: 'kuyou-good' },
  { nameKey: 'fortune.kuyou.jupiter', levelKey: 'fortune.kuyouLevels.daikichi', cls: 'kuyou-good' },
] as const

export type KuyouStar = (typeof KUYOU_STARS)[number]

export const THIS_YEAR = new Date().getFullYear()

/** 從出生年計算十年九曜運勢（前5+後5） */
export function getTenYearKuyouByBirthYear(birthYear: number) {
  const kazoeAge = THIS_YEAR - birthYear + 1
  return getTenYearKuyouByAge(kazoeAge)
}

/** 從數歲計算十年九曜運勢（前5+後5） */
export function getTenYearKuyouByAge(kazoeAge: number) {
  const result: { year: number; star: KuyouStar; isPast: boolean }[] = []
  for (let i = -5; i < 5; i++) {
    const age = kazoeAge + i
    const idx = ((age - 1) % 9 + 9) % 9
    result.push({ year: THIS_YEAR + i, star: KUYOU_STARS[idx], isPast: i < 0 })
  }
  return result
}
