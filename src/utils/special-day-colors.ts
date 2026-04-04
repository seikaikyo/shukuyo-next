/**
 * 特殊日 badge 色彩 — CIS C1.7
 * 甘露日: 金 (--kanro)
 * 金剛峯日: 紫 (--kongou)
 * 羅刹日: 紅 (--fortune-bad)
 * 凌犯: 橘 (--ryouhan)
 */

const SPECIAL_DAY_CLASSES: Record<string, string> = {
  kanro: 'bg-[var(--kanro-bg)] text-[var(--kanro)]',
  kongou: 'bg-[var(--kongou-bg)] text-[var(--kongou)]',
  rasetsu: 'bg-[var(--fortune-bad)]/12 text-[var(--fortune-bad)]',
}

const RYOUHAN_CLASS = 'bg-[var(--ryouhan-bg)] text-[var(--ryouhan)]'

/** 回傳特殊日 badge 的 Tailwind class（CIS C1.7） */
export function specialDayBadgeClass(type: string): string {
  return SPECIAL_DAY_CLASSES[type] || 'bg-muted text-muted-foreground'
}

/** 凌犯 badge class（CIS C1.7.4） */
export function ryouhanBadgeClass(): string {
  return RYOUHAN_CLASS
}

/** 特殊日圓點色（日曆格用） */
export function specialDayDotClass(type: string): string {
  switch (type) {
    case 'kanro': return 'bg-[var(--kanro)]'
    case 'kongou': return 'bg-[var(--kongou)]'
    case 'rasetsu': return 'bg-[var(--fortune-bad)]'
    default: return 'bg-muted-foreground'
  }
}

/** 凌犯圓點色 */
export function ryouhanDotClass(): string {
  return 'bg-[var(--ryouhan)]'
}
