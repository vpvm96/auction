import Constants from 'expo-constants'

import { getKakaoJsKey } from '@/lib/constants/kakao'

jest.mock('expo-constants', () => ({
  expoConfig: {
    extra: {
      kakaoJsKey: 'extra-key',
    },
  },
}))

describe('getKakaoJsKey', () => {
  const originalEnv = process.env.EXPO_PUBLIC_KAKAO_JS_KEY

  afterEach(() => {
    if (originalEnv == null) {
      delete process.env.EXPO_PUBLIC_KAKAO_JS_KEY
    } else {
      process.env.EXPO_PUBLIC_KAKAO_JS_KEY = originalEnv
    }
  })

  it('returns EXPO_PUBLIC_KAKAO_JS_KEY when set', () => {
    process.env.EXPO_PUBLIC_KAKAO_JS_KEY = 'env-key'
    expect(getKakaoJsKey()).toBe('env-key')
  })

  it('falls back to app.json extra when env is missing', () => {
    delete process.env.EXPO_PUBLIC_KAKAO_JS_KEY
    expect(getKakaoJsKey()).toBe('extra-key')
  })

  it('returns empty string when neither env nor extra is set', () => {
    delete process.env.EXPO_PUBLIC_KAKAO_JS_KEY
    ;(Constants as { expoConfig: { extra?: { kakaoJsKey?: string } } }).expoConfig =
      { extra: {} }
    expect(getKakaoJsKey()).toBe('')
  })
})
