import type { OAuthProvider } from '@/lib/api/auth'

export interface OAuthSignInResult {
  provider: OAuthProvider
  // 백엔드 /hammer-users/auth/oauth 로 전달할 토큰.
  // - Kakao: access token
  // - Naver: access token
  // - Google: id token
  // - Apple: identity token (JWT)
  token: string
  // 신규 가입 시 기본 닉네임으로 사용. 미상이면 null.
  nickname: string | null
}

export class OAuthSignInError extends Error {
  constructor(
    public code: 'CANCELLED' | 'MISSING_PACKAGE' | 'MISSING_CONFIG' | 'PROVIDER_ERROR',
    message: string,
  ) {
    super(message)
    this.name = 'OAuthSignInError'
  }
}

export const OAUTH_INSTALL_GUIDE_URL = 'docs/sns-login-setup.md'
