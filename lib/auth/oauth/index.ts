import { OAuthProvider } from '@/lib/api/auth'
import type { OAuthSignInResult } from './types'

export { OAuthSignInError } from './types'
export type { OAuthSignInResult } from './types'

export type SocialProviderKey = 'kakao' | 'naver' | 'google' | 'apple'

export const SOCIAL_PROVIDER_TO_ENUM: Record<SocialProviderKey, OAuthProvider> = {
  kakao: OAuthProvider.Kakao,
  naver: OAuthProvider.Naver,
  google: OAuthProvider.Google,
  apple: OAuthProvider.Apple,
}

export async function signInWithProvider(
  provider: SocialProviderKey,
): Promise<OAuthSignInResult> {
  switch (provider) {
    case 'kakao': {
      const { signInWithKakao } = await import('./kakao')
      return signInWithKakao()
    }
    case 'naver': {
      const { signInWithNaver } = await import('./naver')
      return signInWithNaver()
    }
    case 'google': {
      const { signInWithGoogle } = await import('./google')
      return signInWithGoogle()
    }
    case 'apple': {
      const { signInWithApple } = await import('./apple')
      return signInWithApple()
    }
  }
}
