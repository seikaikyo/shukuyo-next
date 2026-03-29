import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ProfileState {
  birthDate: string | null
  gender: string | null
  name: string | null
  locale: string
  isProfileSet: boolean
  setBirthDate: (date: string) => void
  setGender: (gender: string) => void
  setName: (name: string) => void
  setLocale: (locale: string) => void
  setProfile: (data: { birthDate?: string; gender?: string; name?: string }) => void
  clearProfile: () => void
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set, get) => ({
      birthDate: null,
      gender: null,
      name: null,
      locale: 'zh-TW',

      // isProfileSet 作為計算屬性，birthDate 有值時為 true
      get isProfileSet() {
        return get().birthDate !== null
      },

      setBirthDate: (date) =>
        set({ birthDate: date }),

      setGender: (gender) =>
        set({ gender }),

      setName: (name) =>
        set({ name }),

      setLocale: (locale) =>
        set({ locale }),

      setProfile: ({ birthDate, gender, name }) =>
        set((state) => ({
          birthDate: birthDate ?? state.birthDate,
          gender: gender ?? state.gender,
          name: name ?? state.name,
        })),

      clearProfile: () =>
        set({ birthDate: null, gender: null, name: null }),
    }),
    {
      name: 'shukuyo-profile',
      // isProfileSet 是 getter，不需要持久化
      partialize: (state) => ({
        birthDate: state.birthDate,
        gender: state.gender,
        name: state.name,
        locale: state.locale,
      }),
    }
  )
)
