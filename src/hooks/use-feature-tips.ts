'use client'
import { useState, useCallback } from 'react'

const STORAGE_KEY = 'sukuyodo_feature_tips'

type FeatureKey = 'fortune' | 'compatibility' | 'knowledge' | 'hr' | 'headhunter' | 'luckyDays' | 'scoreRecalibration' | 'welcome'

function getDismissed(): Set<FeatureKey> {
  if (typeof window === 'undefined') return new Set()
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? new Set(JSON.parse(raw)) : new Set()
  } catch {
    return new Set()
  }
}

function saveDismissed(set: Set<FeatureKey>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]))
}

export function useFeatureTips() {
  const [dismissed, setDismissed] = useState<Set<FeatureKey>>(getDismissed)

  const isVisible = useCallback((key: FeatureKey) => !dismissed.has(key), [dismissed])

  const dismiss = useCallback((key: FeatureKey) => {
    setDismissed(prev => {
      const next = new Set(prev)
      next.add(key)
      saveDismissed(next)
      return next
    })
  }, [])

  const resetAll = useCallback(() => {
    setDismissed(new Set())
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  return { isVisible, dismiss, resetAll }
}
