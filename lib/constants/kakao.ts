import Constants from 'expo-constants'

/**
 * 카카오 Maps JavaScript SDK 키.
 *
 * `EXPO_PUBLIC_*` 변수는 EAS 빌드 시점에 인라인된다. production EAS env가
 * 비어 있으면 TestFlight/스토어 빌드에서 키가 누락되므로 app.json extra를
 * 폴백으로 사용한다.
 */
export function getKakaoJsKey(): string {
  const fromEnv = process.env.EXPO_PUBLIC_KAKAO_JS_KEY
  if (fromEnv != null && fromEnv.length > 0) return fromEnv

  const fromExtra = Constants.expoConfig?.extra?.kakaoJsKey
  if (typeof fromExtra === 'string' && fromExtra.length > 0) return fromExtra

  return ''
}
