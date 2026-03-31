import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { zustandStorage } from './storage'

export type ThemePreference = 'system' | 'light' | 'dark'

interface ThemeStore {
  preference: ThemePreference
  setPreference: (pref: ThemePreference) => void
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      preference: 'system',
      setPreference: (preference) => set({ preference }),
    }),
    {
      name: 'theme-preference',
      storage: zustandStorage,
    }
  )
)
