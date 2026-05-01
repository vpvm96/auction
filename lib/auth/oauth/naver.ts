import { OAuthProvider } from '@/lib/api/auth'
import { OAuthSignInError, type OAuthSignInResult } from './types'

const CLIENT_ID = process.env.EXPO_PUBLIC_NAVER_CLIENT_ID
const CLIENT_SECRET = process.env.EXPO_PUBLIC_NAVER_CLIENT_SECRET
const APP_NAME = process.env.EXPO_PUBLIC_NAVER_APP_NAME ?? 'HB Auction'
const SERVICE_URL_SCHEME_IOS = process.env.EXPO_PUBLIC_NAVER_URL_SCHEME_IOS

// `@react-native-seoul/naver-login` 가 설치되어 있어야 동작한다. 자세한 설정은 docs/sns-login-setup.md 참고.
export async function signInWithNaver(): Promise<OAuthSignInResult> {
  if (CLIENT_ID == null || CLIENT_SECRET == null) {
    throw new OAuthSignInError(
      'MISSING_CONFIG',
      'EXPO_PUBLIC_NAVER_CLIENT_ID / EXPO_PUBLIC_NAVER_CLIENT_SECRET 환경변수가 설정되어 있지 않습니다.',
    )
  }

  interface NaverModule {
    initialize: (config: {
      appName: string
      consumerKey: string
      consumerSecret: string
      serviceUrlSchemeIOS: string
      disableNaverAppAuthIOS: boolean
    }) => void
    login: () => Promise<{
      isSuccess: boolean
      successResponse?: { accessToken: string }
      failureResponse?: { message?: string }
    }>
    getProfile: (accessToken: string) => Promise<unknown>
  }

  let naver: NaverModule | null = null
  try {
    // v4.x 부터 NaverLogin 객체가 default export 라서 .default 로 풀어야 한다.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const mod = require('@react-native-seoul/naver-login') as
      | NaverModule
      | { default: NaverModule }
    naver = ('default' in mod ? mod.default : mod) as NaverModule
  } catch {
    throw new OAuthSignInError(
      'MISSING_PACKAGE',
      '@react-native-seoul/naver-login 패키지가 설치되어 있지 않습니다. docs/sns-login-setup.md 의 네이버 섹션을 확인하세요.',
    )
  }

  try {
    naver.initialize({
      appName: APP_NAME,
      consumerKey: CLIENT_ID,
      consumerSecret: CLIENT_SECRET,
      serviceUrlSchemeIOS: SERVICE_URL_SCHEME_IOS ?? '',
      disableNaverAppAuthIOS: false,
    })

    const result = await naver.login()
    if (!result.isSuccess || result.successResponse == null) {
      const reason = result.failureResponse?.message ?? '알 수 없는 오류'
      if (/cancel/i.test(reason)) {
        throw new OAuthSignInError('CANCELLED', '네이버 로그인이 취소되었습니다.')
      }
      throw new OAuthSignInError('PROVIDER_ERROR', `네이버 로그인 실패: ${reason}`)
    }

    const accessToken = result.successResponse.accessToken
    if (accessToken == null || accessToken.length === 0) {
      throw new OAuthSignInError('PROVIDER_ERROR', '네이버 액세스 토큰을 받지 못했습니다.')
    }

    let nickname: string | null = null
    try {
      const profile = await naver.getProfile(accessToken)
      const resp =
        (profile as { response?: { nickname?: string; name?: string } }).response ?? {}
      nickname = resp.nickname ?? resp.name ?? null
    } catch {
      nickname = null
    }

    return {
      provider: OAuthProvider.Naver,
      token: accessToken,
      nickname,
    }
  } catch (err) {
    if (err instanceof OAuthSignInError) throw err
    const message = err instanceof Error ? err.message : String(err)
    throw new OAuthSignInError('PROVIDER_ERROR', `네이버 로그인 실패: ${message}`)
  }
}
