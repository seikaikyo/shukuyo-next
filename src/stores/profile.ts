import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useState, useEffect } from 'react'
import type { PartnerRelationType, EmotionDirection } from '@/types/compatibility'

export interface Partner {
  id: string
  nickname: string
  birthDate: string
  relation?: PartnerRelationType
  subTags?: PartnerRelationType[]
  emotionDirection?: EmotionDirection
}

interface ProfileState {
  birthDate: string | null
  gender: string | null
  name: string | null
  locale: string
  partners: Partner[]
  setBirthDate: (date: string) => void
  setGender: (gender: string) => void
  setName: (name: string) => void
  setLocale: (locale: string) => void
  setProfile: (data: { birthDate?: string; gender?: string; name?: string }) => void
  clearProfile: () => void
  addPartner: (data: Omit<Partner, 'id'>) => void
  updatePartner: (id: string, data: Partial<Omit<Partner, 'id'>>) => void
  deletePartner: (id: string) => void
  _hasHydrated: boolean
  _setHasHydrated: (v: boolean) => void
}

export const RELATION_TYPES: { value: PartnerRelationType; label: string; desc: string }[] = [
  { value: 'lover', label: '戀人', desc: '戀愛關係' },
  { value: 'spouse', label: '配偶', desc: '婚姻關係' },
  { value: 'friend', label: '朋友', desc: '友誼關係' },
  { value: 'colleague', label: '同事', desc: '職場關係' },
  { value: 'family', label: '家人', desc: '家庭關係' },
  { value: 'parent', label: '父母', desc: '親子關係' },
  { value: 'boss', label: '主管', desc: '上司關係' },
  { value: 'rival', label: '競爭', desc: '競爭關係' },
  { value: 'ex', label: '前任', desc: '前戀人關係' },
]

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      birthDate: null,
      gender: null,
      name: null,
      locale: 'zh-TW',
      partners: [],
      _hasHydrated: false,
      _setHasHydrated: (v) => set({ _hasHydrated: v }),

      setBirthDate: (date) => set({ birthDate: date }),
      setGender: (gender) => set({ gender }),
      setName: (name) => set({ name }),
      setLocale: (locale) => set({ locale }),

      setProfile: ({ birthDate, gender, name }) =>
        set((state) => ({
          birthDate: birthDate ?? state.birthDate,
          gender: gender ?? state.gender,
          name: name ?? state.name,
        })),

      clearProfile: () => set({ birthDate: null, gender: null, name: null }),

      addPartner: (data) =>
        set((state) => ({
          partners: [
            ...state.partners,
            { ...data, id: `partner_${Date.now()}_${Math.random().toString(36).slice(2, 7)}` },
          ],
        })),

      updatePartner: (id, data) =>
        set((state) => ({
          partners: state.partners.map((p) => (p.id === id ? { ...p, ...data } : p)),
        })),

      deletePartner: (id) =>
        set((state) => ({
          partners: state.partners.filter((p) => p.id !== id),
        })),
    }),
    {
      name: 'shukuyo-profile',
      partialize: (state) => ({
        birthDate: state.birthDate,
        gender: state.gender,
        name: state.name,
        locale: state.locale,
        partners: state.partners,
      }),
      onRehydrateStorage: () => () => {
        useProfileStore.setState({ _hasHydrated: true })
      },
    }
  )
)

// SSR 安全的 hydration hook -- 避免 server/client 不一致
export function useProfileHydrated() {
  const [hydrated, setHydrated] = useState(false)
  useEffect(() => {
    const unsub = useProfileStore.persist.onFinishHydration(() => setHydrated(true))
    if (useProfileStore.getState()._hasHydrated) setHydrated(true)
    return unsub
  }, [])
  return hydrated
}
