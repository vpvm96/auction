import { OAuthProvider } from '@/lib/api/auth'
import { OAuthSignInError, type OAuthSignInResult } from './types'

const WEB_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID
const IOS_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID

// `@react-native-google-signin/google-signin` 가 설치되어 있어야 동작한다. 자세한 설정은 docs/sns-login-setup.md 참고.
export async function signInWithGoogle(): Promise<OAuthSignInResult> {
  if (WEB_CLIENT_ID == null) {
    throw new OAuthSignInError(
      'MISSING_CONFIG',
      'EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID 환경변수가 설정되어 있지 않습니다.',
    )
  }

  interface GoogleSigninModule {
    GoogleSignin: {
      configure: (opts: {
        webClientId: string
        iosClientId?: string
        offlineAccess?: boolean
      }) => void
      hasPlayServices: (opts: { showPlayServicesUpdateDialog: boolean }) => Promise<boolean>
      signIn: () => Promise<unknown>
    }
    statusCodes: {
      SIGN_IN_CANCELLED: string
      IN_PROGRESS: string
      PLAY_SERVICES_NOT_AVAILABLE: string
    }
  }

  let mod: GoogleSigninModule | null = null
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    mod = require('@react-native-google-signin/google-signin') as GoogleSigninModule
  } catch {
    throw new OAuthSignInError(
      'MISSING_PACKAGE',
      '@react-native-google-signin/google-signin 패키지가 설치되어 있지 않습니다. docs/sns-login-setup.md 의 구글 섹션을 확인하세요.',
    )
  }

  const { GoogleSignin, statusCodes } = mod

  try {
    GoogleSignin.configure({
      webClientId: WEB_CLIENT_ID,
      iosClientId: IOS_CLIENT_ID,
      offlineAccess: false,
    })

    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true })

    const userInfo = await GoogleSignin.signIn()
    const data = (userInfo as { data?: { idToken?: string | null; user?: { name?: string | null } } })
      .data
    const legacyIdToken = (userInfo as { idToken?: string | null }).idToken
    const idToken = data?.idToken ?? legacyIdToken ?? null

    if (idToken == null || idToken.length === 0) {
      throw new OAuthSignInError('PROVIDER_ERROR', '구글 ID 토큰을 받지 못했습니다.')
    }

    const legacyName = (userInfo as { user?: { name?: string | null } }).user?.name ?? null
    const nickname = data?.user?.name ?? legacyName ?? null

    return {
      provider: OAuthProvider.Google,
      token: idToken,
      nickname,
    }
  } catch (err) {
    if (err instanceof OAuthSignInError) throw err
    const code = (err as { code?: string }).code
    if (code === statusCodes.SIGN_IN_CANCELLED) {
      throw new OAuthSignInError('CANCELLED', '구글 로그인이 취소되었습니다.')
    }
    if (code === statusCodes.IN_PROGRESS) {
      throw new OAuthSignInError('PROVIDER_ERROR', '이미 진행 중인 로그인이 있습니다.')
    }
    if (code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      throw new OAuthSignInError('PROVIDER_ERROR', 'Google Play Services 가 사용 불가합니다.')
    }
    const message = err instanceof Error ? err.message : String(err)
    throw new OAuthSignInError('PROVIDER_ERROR', `구글 로그인 실패: ${message}`)
  }
}
