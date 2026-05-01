import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { zustandStorage } from '@/lib/store/storage'
import { EMAIL_REGEX } from '@/lib/validation'
import * as authApi from '@/lib/api/auth'
import {
  setAccessToken,
  removeAccessToken,
  setForceLogoutCallback,
  resetForceLogoutFlag,
  ApiError,
} from '@/lib/api/client'
import {
  signInWithProvider,
  OAuthSignInError,
  type SocialProviderKey,
} from '@/lib/auth/oauth'
import { SAVED_EMAIL_KEY } from '@/lib/auth/storage-keys'

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
  oauthLogin: (provider: SocialProviderKey) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
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

            resetForceLogoutFlag()
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

        oauthLogin: async (provider: SocialProviderKey) => {
          set({ isLoading: true, error: null })

          try {
            const result = await signInWithProvider(provider)

            const loginRes = await authApi.oauthLogin({
              provider: result.provider,
              token: result.token,
              nickname: result.nickname,
              agreeToTerms: true,
            })
            await setAccessToken(loginRes.accessToken)

            resetForceLogoutFlag()
            set({
              isLoading: false,
              isLoggedIn: true,
              user: {
                name: result.nickname ?? provider,
                email: '',
              },
            })
          } catch (err) {
            let message = '소셜 로그인에 실패했습니다.'
            if (err instanceof OAuthSignInError) {
              if (err.code === 'CANCELLED') {
                set({ isLoading: false, error: null })
                return
              }
              message = err.message
            } else if (err instanceof ApiError) {
              message =
                err.status === 409
                  ? '이미 다른 방식으로 가입된 계정입니다.'
                  : `소셜 로그인에 실패했습니다. (${err.status})`
            }
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

            resetForceLogoutFlag()
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

        logout: async () => {
          try {
            await authApi.logout()
          } catch {
            // 서버 로그아웃 실패해도 로컬 정리는 진행
          }
          await removeAccessToken()
          // 아이디 저장 값은 로그아웃 후에도 다음 로그인 화면에서 복원되어야 하므로 clear() 전후로 보존
          const savedEmail = await AsyncStorage.getItem(SAVED_EMAIL_KEY)
          await AsyncStorage.clear()
          if (savedEmail != null) {
            await AsyncStorage.setItem(SAVED_EMAIL_KEY, savedEmail)
          }
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
