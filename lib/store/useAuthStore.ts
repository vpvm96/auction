import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { zustandStorage } from '@/lib/store/storage'
import { EMAIL_REGEX } from '@/lib/validation'
import * as authApi from '@/lib/api/auth'
import {
  setAccessToken,
  removeAccessToken,
  setForceLogoutCallback,
  ApiError,
} from '@/lib/api/client'

interface AuthUser {
  id?: string
  name: string
  email: string
}

interface AuthStore {
  user: AuthUser | null
  isLoggedIn: boolean
  isLoading: boolean
  error: string | null
  hasHydrated: boolean
  setHasHydrated: (value: boolean) => void
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  clearError: () => void
  updateProfile: (name: string) => void
  deleteAccount: () => void
}

// onRehydrateStorage 콜백에서 store 초기화 전에 useAuthStore를 참조하면
// ReferenceError가 발생하므로, set 함수를 캡처해서 사용
let _storeSet: ((partial: Partial<AuthStore>) => void) | null = null

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => {
      _storeSet = set as (partial: Partial<AuthStore>) => void

      return {
        user: null,
        isLoggedIn: false,
        isLoading: false,
        error: null,
        hasHydrated: false,

        setHasHydrated: (value: boolean) => {
          set({ hasHydrated: value })
        },

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

          try {
            const res = await authApi.login({ email, password })
            await setAccessToken(res.accessToken)

            set({
              isLoading: false,
              isLoggedIn: true,
              user: { name: email.split('@')[0], email },
            })
          } catch (err) {
            const message =
              err instanceof ApiError
                ? err.status === 401
                  ? '이메일 또는 비밀번호가 올바르지 않습니다.'
                  : `로그인에 실패했습니다. (${err.status})`
                : '네트워크 오류가 발생했습니다.'

            set({ isLoading: false, error: message })
          }
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

          try {
            const registerRes = await authApi.register({
              email,
              nickname: name.trim(),
              password,
            })

            const loginRes = await authApi.login({ email, password })
            await setAccessToken(loginRes.accessToken)

            set({
              isLoading: false,
              isLoggedIn: true,
              user: {
                id: registerRes.userId,
                name: registerRes.nickname,
                email: registerRes.email,
              },
            })
          } catch (err) {
            const message =
              err instanceof ApiError
                ? err.status === 409
                  ? '이미 가입된 이메일입니다.'
                  : `회원가입에 실패했습니다. (${err.status})`
                : '네트워크 오류가 발생했습니다.'

            set({ isLoading: false, error: message })
          }
        },

        logout: () => {
          removeAccessToken()
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
          removeAccessToken()
          set({ user: null, isLoggedIn: false, error: null })
        },
      }
    },
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => zustandStorage),
      partialize: (state) => ({
        user: state.user,
        isLoggedIn: state.isLoggedIn,
      }),
      onRehydrateStorage: () => (_state, error) => {
        if (error) {
          console.log('Auth store rehydration failed:', error)
        }
        _storeSet?.({ hasHydrated: true })
      },
    },
  ),
)

// 401 강제 로그아웃 콜백 등록
setForceLogoutCallback(() => {
  useAuthStore.getState().logout()
})
