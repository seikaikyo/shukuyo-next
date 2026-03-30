/** 統一分數配色 — 所有元件共用，禁止各自定義 */

export function scoreColor(score: number): string {
  if (score >= 80) return 'text-[var(--fortune-great)]'
  if (score >= 60) return 'text-[var(--fortune-good)]'
  if (score >= 40) return 'text-[var(--fortune-neutral)]'
  if (score >= 20) return 'text-[var(--fortune-caution)]'
  return 'text-[var(--fortune-bad)]'
}

export function scoreBorder(score: number): string {
  if (score >= 80) return 'border-[var(--fortune-great)]'
  if (score >= 60) return 'border-[var(--fortune-good)]'
  if (score >= 40) return 'border-[var(--fortune-neutral)]'
  if (score >= 20) return 'border-[var(--fortune-caution)]'
  return 'border-[var(--fortune-bad)]'
}

export function scoreBorderLeft(score: number): string {
  if (score >= 80) return 'border-l-[var(--fortune-great)]'
  if (score >= 60) return 'border-l-[var(--fortune-good)]'
  if (score >= 40) return 'border-l-[var(--fortune-neutral)]'
  if (score >= 20) return 'border-l-[var(--fortune-caution)]'
  return 'border-l-[var(--fortune-bad)]'
}

export function scoreBg(score: number): string {
  if (score >= 80) return 'bg-emerald-500/10'
  if (score >= 60) return 'bg-sky-500/10'
  if (score >= 40) return 'bg-transparent'
  if (score >= 20) return 'bg-amber-500/10'
  return 'bg-red-500/10'
}

export function scoreCellColor(score: number): string {
  if (score >= 80) return 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-400'
  if (score >= 60) return 'bg-sky-500/20 text-sky-700 dark:text-sky-400'
  if (score >= 40) return 'bg-amber-500/20 text-amber-700 dark:text-amber-400'
  return 'bg-red-500/20 text-red-700 dark:text-red-400'
}
