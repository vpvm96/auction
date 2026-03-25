import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { EMAIL_REGEX } from '@/lib/validation'
import { zustandStorage } from '@/lib/store/storage'

interface AuthUser {
  name: string
  email: string
}

interface AuthStore {
  user: AuthUser | null
  isLoggedIn: boolean
  isLoading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  clearError: () => void
  updateProfile: (name: string) => void
  deleteAccount: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isLoggedIn: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        if (!EMAIL_REGEX.test(email)) {
          set({ error: '올바른 이메일 형식을 입력해주세요.' })
          return
        }
        if (password.length < 6) {
          set({ error: '비밀번호는 6자 이상이어야 합니다.' })
          return
        }
        set({ isLoading: true, error: null })
        await new Promise<void>((resolve) => setTimeout(resolve, 500))
        set({
          isLoading: false,
          isLoggedIn: true,
          user: { name: '홍길동', email },
        })
      },

      signup: async (name: string, email: string, password: string) => {
        if (name.trim().length === 0) {
          set({ error: '이름을 입력해주세요.' })
          return
        }
        if (!EMAIL_REGEX.test(email)) {
          set({ error: '올바른 이메일 형식을 입력해주세요.' })
          return
        }
        if (password.length < 6) {
          set({ error: '비밀번호는 6자 이상이어야 합니다.' })
          return
        }
        set({ isLoading: true, error: null })
        await new Promise<void>((resolve) => setTimeout(resolve, 500))
        set({
          isLoading: false,
          isLoggedIn: true,
          user: { name: name.trim(), email },
        })
      },

      logout: () => {
        set({ user: null, isLoggedIn: false, error: null })
      },

      clearError: () => {
        set({ error: null })
      },

      updateProfile: (name: string) => {
        set((state) => ({
          user: state.user != null ? { ...state.user, name: name.trim() } : null,
        }))
      },

      deleteAccount: () => {
        set({ user: null, isLoggedIn: false, error: null })
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => zustandStorage),
      partialize: (state) => ({
        user: state.user,
        isLoggedIn: state.isLoggedIn,
      }),
    },
  ),
)
