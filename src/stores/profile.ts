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

export interface Company {
  id: string
  name: string
  foundingDate: string
  country?: string
  memo?: string
  jobUrl?: string
}

export interface JobSeeker {
  id: string
  name: string
  birthDate: string
  targetCompanyIds?: string[]
}

export interface HrCandidate {
  id: string
  name: string
  birthDate: string
}

interface ProfileState {
  birthDate: string | null
  gender: string | null
  name: string | null
  locale: string
  partners: Partner[]
  companies: Company[]
  jobSeekers: JobSeeker[]
  hrCandidates: HrCandidate[]
  hrCompany: { name: string; foundingDate: string } | null
  setBirthDate: (date: string) => void
  setGender: (gender: string) => void
  setName: (name: string) => void
  setLocale: (locale: string) => void
  setProfile: (data: { birthDate?: string; gender?: string; name?: string }) => void
  clearProfile: () => void
  addPartner: (data: Omit<Partner, 'id'>) => void
  updatePartner: (id: string, data: Partial<Omit<Partner, 'id'>>) => void
  deletePartner: (id: string) => void
  addCompany: (data: Omit<Company, 'id'>) => void
  updateCompany: (id: string, data: Partial<Omit<Company, 'id'>>) => void
  deleteCompany: (id: string) => void
  addJobSeeker: (data: Omit<JobSeeker, 'id'>) => void
  updateJobSeeker: (id: string, data: Partial<Omit<JobSeeker, 'id'>>) => void
  deleteJobSeeker: (id: string) => void
  addHrCandidate: (data: Omit<HrCandidate, 'id'>) => void
  deleteHrCandidate: (id: string) => void
  setHrCompany: (data: { name: string; foundingDate: string } | null) => void
  _hasHydrated: boolean
  _setHasHydrated: (v: boolean) => void
}

export const RELATION_TYPES: { value: PartnerRelationType; labelKey: string; descKey: string }[] = [
  { value: 'lover', labelKey: 'relationTypes.lover', descKey: 'relationTypeDesc.lover' },
  { value: 'spouse', labelKey: 'relationTypes.spouse', descKey: 'relationTypeDesc.spouse' },
  { value: 'friend', labelKey: 'relationTypes.friend', descKey: 'relationTypeDesc.friend' },
  { value: 'colleague', labelKey: 'relationTypes.colleague', descKey: 'relationTypeDesc.colleague' },
  { value: 'family', labelKey: 'relationTypes.family', descKey: 'relationTypeDesc.family' },
  { value: 'parent', labelKey: 'relationTypes.parent', descKey: 'relationTypeDesc.parent' },
  { value: 'boss', labelKey: 'relationTypes.superior', descKey: 'relationTypeDesc.superior' },
  { value: 'rival', labelKey: 'relationTypes.client', descKey: 'relationTypeDesc.client' },
  { value: 'ex', labelKey: 'relationTypes.ex', descKey: 'relationTypeDesc.ex' },
]

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      birthDate: null,
      gender: null,
      name: null,
      locale: 'zh-TW',
      partners: [],
      companies: [],
      jobSeekers: [],
      hrCandidates: [],
      hrCompany: null,
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

      addCompany: (data) =>
        set((state) => ({
          companies: [
            ...state.companies,
            { ...data, id: `company_${Date.now()}_${Math.random().toString(36).slice(2, 7)}` },
          ],
        })),

      updateCompany: (id, data) =>
        set((state) => ({
          companies: state.companies.map((c) => (c.id === id ? { ...c, ...data } : c)),
        })),

      deleteCompany: (id) =>
        set((state) => ({
          companies: state.companies.filter((c) => c.id !== id),
        })),

      addJobSeeker: (data) =>
        set((state) => ({
          jobSeekers: [
            ...state.jobSeekers,
            { ...data, id: `seeker_${Date.now()}_${Math.random().toString(36).slice(2, 7)}` },
          ],
        })),

      updateJobSeeker: (id, data) =>
        set((state) => ({
          jobSeekers: state.jobSeekers.map((s) => (s.id === id ? { ...s, ...data } : s)),
        })),

      deleteJobSeeker: (id) =>
        set((state) => ({
          jobSeekers: state.jobSeekers.filter((s) => s.id !== id),
        })),

      addHrCandidate: (data) =>
        set((state) => ({
          hrCandidates: [
            ...state.hrCandidates,
            { ...data, id: `hr_${Date.now()}_${Math.random().toString(36).slice(2, 7)}` },
          ],
        })),

      deleteHrCandidate: (id) =>
        set((state) => ({
          hrCandidates: state.hrCandidates.filter((c) => c.id !== id),
        })),

      setHrCompany: (data) => set({ hrCompany: data }),
    }),
    {
      name: 'shukuyo-profile',
      version: 1,
      partialize: (state) => ({
        birthDate: state.birthDate,
        gender: state.gender,
        name: state.name,
        locale: state.locale,
        partners: state.partners,
        companies: state.companies,
        jobSeekers: state.jobSeekers,
        hrCandidates: state.hrCandidates,
        hrCompany: state.hrCompany,
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
