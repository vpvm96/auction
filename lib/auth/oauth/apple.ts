import { Platform } from 'react-native'
import { OAuthProvider } from '@/lib/api/auth'
import { OAuthSignInError, type OAuthSignInResult } from './types'

// `expo-apple-authentication` 가 설치되어 있어야 동작한다. iOS 13+ 에서만 동작.
export async function signInWithApple(): Promise<OAuthSignInResult> {
  if (Platform.OS !== 'ios') {
    throw new OAuthSignInError(
      'PROVIDER_ERROR',
      'Apple 로그인은 iOS 에서만 사용할 수 있습니다.',
    )
  }

  interface AppleAuthModule {
    isAvailableAsync: () => Promise<boolean>
    signInAsync: (opts: { requestedScopes: number[] }) => Promise<{
      identityToken: string | null
      fullName: { familyName: string | null; givenName: string | null } | null
    }>
    AppleAuthenticationScope: { FULL_NAME: number; EMAIL: number }
  }

  let appleAuth: AppleAuthModule | null = null
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    appleAuth = require('expo-apple-authentication') as AppleAuthModule
  } catch {
    throw new OAuthSignInError(
      'MISSING_PACKAGE',
      'expo-apple-authentication 패키지가 설치되어 있지 않습니다. docs/sns-login-setup.md 의 애플 섹션을 확인하세요.',
    )
  }

  try {
    const available = await appleAuth.isAvailableAsync()
    if (!available) {
      throw new OAuthSignInError('PROVIDER_ERROR', 'Apple 로그인을 사용할 수 없는 기기입니다.')
    }

    const credential = await appleAuth.signInAsync({
      requestedScopes: [
        appleAuth.AppleAuthenticationScope.FULL_NAME,
        appleAuth.AppleAuthenticationScope.EMAIL,
      ],
    })

    if (credential.identityToken == null || credential.identityToken.length === 0) {
      throw new OAuthSignInError('PROVIDER_ERROR', 'Apple identityToken 을 받지 못했습니다.')
    }

    const fullName = credential.fullName
    const nickname =
      fullName != null
        ? [fullName.familyName, fullName.givenName].filter((p) => p != null && p.length > 0).join(' ').trim() || null
        : null

    return {
      provider: OAuthProvider.Apple,
      token: credential.identityToken,
      nickname: nickname != null && nickname.length > 0 ? nickname : null,
    }
  } catch (err) {
    if (err instanceof OAuthSignInError) throw err
    const code = (err as { code?: string }).code
    if (code === 'ERR_REQUEST_CANCELED' || code === 'ERR_CANCELED') {
      throw new OAuthSignInError('CANCELLED', 'Apple 로그인이 취소되었습니다.')
    }
    const message = err instanceof Error ? err.message : String(err)
    throw new OAuthSignInError('PROVIDER_ERROR', `Apple 로그인 실패: ${message}`)
  }
}
