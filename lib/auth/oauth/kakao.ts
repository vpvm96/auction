import { OAuthProvider } from '@/lib/api/auth'
import { OAuthSignInError, type OAuthSignInResult } from './types'

// `@react-native-seoul/kakao-login` 가 설치되어 있어야 동작한다. 자세한 설정은 docs/sns-login-setup.md 참고.
export async function signInWithKakao(): Promise<OAuthSignInResult> {
  interface KakaoModule {
    login: () => Promise<{ accessToken: string }>
    getProfile: () => Promise<Record<string, unknown>>
  }

  let kakao: KakaoModule | null = null
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    kakao = require('@react-native-seoul/kakao-login') as KakaoModule
  } catch {
    throw new OAuthSignInError(
      'MISSING_PACKAGE',
      '@react-native-seoul/kakao-login 패키지가 설치되어 있지 않습니다. docs/sns-login-setup.md 의 카카오 섹션을 확인하세요.',
    )
  }

  try {
    const tokenRes = await kakao.login()
    if (tokenRes.accessToken == null || tokenRes.accessToken.length === 0) {
      throw new OAuthSignInError('PROVIDER_ERROR', '카카오 액세스 토큰을 받지 못했습니다.')
    }

    let nickname: string | null = null
    try {
      const profile = await kakao.getProfile()
      const candidate =
        ('nickname' in profile && typeof profile.nickname === 'string'
          ? profile.nickname
          : null) ??
        ('name' in profile && typeof profile.name === 'string' ? profile.name : null)
      nickname = candidate
    } catch {
      nickname = null
    }

    return {
      provider: OAuthProvider.Kakao,
      token: tokenRes.accessToken,
      nickname,
    }
  } catch (err) {
    if (err instanceof OAuthSignInError) throw err
    const message = err instanceof Error ? err.message : String(err)
    if (/cancel/i.test(message)) {
      throw new OAuthSignInError('CANCELLED', '카카오 로그인이 취소되었습니다.')
    }
    throw new OAuthSignInError('PROVIDER_ERROR', `카카오 로그인 실패: ${message}`)
  }
}
