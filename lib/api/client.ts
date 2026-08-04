import AsyncStorage from '@react-native-async-storage/async-storage'
import { Platform } from 'react-native'

const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? ''

const ACCESS_TOKEN_KEY = 'access-token'

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

// ─── 토큰 유틸 ──────────────────────────────────────────────────────────────

export async function getAccessToken(): Promise<string | null> {
  return AsyncStorage.getItem(ACCESS_TOKEN_KEY)
}

export async function setAccessToken(token: string): Promise<void> {
  await AsyncStorage.setItem(ACCESS_TOKEN_KEY, token)
}

export async function removeAccessToken(): Promise<void> {
  await AsyncStorage.removeItem(ACCESS_TOKEN_KEY)
}

// ─── 로그아웃 콜백 (순환 참조 방지용) ────────────────────────────────────────

type LogoutCallback = () => void
let _onForceLogout: LogoutCallback | null = null
let _isLoggingOut = false

export function setForceLogoutCallback(cb: LogoutCallback) {
  _onForceLogout = cb
}

export function resetForceLogoutFlag() {
  _isLoggingOut = false
}

// ─── Refresh 중복 호출 방지 ──────────────────────────────────────────────────

let _refreshPromise: Promise<string> | null = null

// refresh 요청에 실어 보낼 Cookie 헤더를 네이티브 쿠키 저장소에서 직접 구성한다.
// RN fetch의 credentials:'include' 자동 송출은 불안정해, refresh token(HttpOnly 쿠키)이
// 누락된 채 요청이 도달하는 경우가 있다. CookieManager로 읽어 명시적으로 Cookie 헤더를 붙인다.
// 웹은 브라우저가 HttpOnly 쿠키를 자동 전송하고 라이브러리가 web을 지원하지 않으므로 제외한다.
async function buildRefreshCookieHeader(): Promise<string> {
  if (Platform.OS === 'web') return ''
  try {
    const CookieManager = (
      require('@react-native-cookies/cookies') as typeof import('@react-native-cookies/cookies')
    ).default
    const cookies = await CookieManager.get(BASE_URL)
    return Object.values(cookies)
      .map((c) => `${c.name}=${c.value}`)
      .join('; ')
  } catch {
    return ''
  }
}

// 로그인/refresh 응답의 Set-Cookie(refresh token)를 디스크에 즉시 기록한다.
// Android WebView CookieManager는 쿠키를 비동기로 디스크에 쓰기 때문에,
// flush 전에 앱 프로세스가 종료되면 회전된 refresh 쿠키가 유실되어
// 다음 실행에서 refresh가 401로 실패하고 로그인이 풀린다.
export async function persistCookies(): Promise<void> {
  if (Platform.OS !== 'android') return
  try {
    const CookieManager = (
      require('@react-native-cookies/cookies') as typeof import('@react-native-cookies/cookies')
    ).default
    await CookieManager.flush()
  } catch {
    // flush 실패는 치명적이지 않으므로 무시
  }
}

async function tryRefreshToken(): Promise<string> {
  // 이미 강제 로그아웃이 진행 중이면 더 이상 refresh 시도하지 않음.
  // — 백엔드 장애로 retry가 계속 401을 받는 폭주 시나리오를 차단한다.
  if (_isLoggingOut) {
    throw new ApiError(401, 'Already logging out')
  }
  if (_refreshPromise) return _refreshPromise

  _refreshPromise = (async () => {
    try {
      const cookieHeader = await buildRefreshCookieHeader()
      // 쿠키 값은 노출하지 않고 이름만 로깅 — refresh token 누락 여부를 진단하기 위함.
      console.log('[API] ↺ refresh', {
        cookies: cookieHeader
          ? cookieHeader.split('; ').map((c) => c.split('=')[0])
          : [],
      })

      const res = await fetch(`${BASE_URL}/hammers/hammer-users/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(cookieHeader ? { Cookie: cookieHeader } : {}),
        },
        credentials: 'include',
      })

      if (!res.ok) {
        throw new ApiError(res.status, 'Token refresh failed')
      }

      const data = (await res.json()) as { accessToken: string }
      await setAccessToken(data.accessToken)
      // 서버가 refresh token을 회전(재발급)했을 수 있으므로 즉시 디스크에 기록한다.
      await persistCookies()
      return data.accessToken
    } catch (error) {
      // refresh token 자체가 무효(401/403)일 때만 로그아웃한다.
      // 네트워크 오류·5xx 같은 일시 장애에 토큰을 지우면 멀쩡한 세션이
      // 풀려버리므로, 토큰을 유지하고 다음 요청에서 다시 refresh를 시도한다.
      const status = error instanceof ApiError ? error.status : null
      if (status === 401 || status === 403) {
        await removeAccessToken()
        if (!_isLoggingOut) {
          _isLoggingOut = true
          _onForceLogout?.()
        }
      } else {
        console.log('[API] ⚠ refresh 일시 실패 (토큰 유지, 다음 요청에서 재시도)', {
          error: error instanceof Error ? error.message : String(error),
        })
      }
      throw error
    } finally {
      _refreshPromise = null
    }
  })()

  return _refreshPromise
}

// ─── 로깅 유틸 ──────────────────────────────────────────────────────────────

// password / token 류는 콘솔에 그대로 노출되지 않도록 마스킹.
const SENSITIVE_KEYS = new Set([
  'password',
  'token',
  'accessToken',
  'refreshToken',
  'pushToken',
])

function maskBody(raw: BodyInit | null | undefined): unknown {
  if (raw == null) return undefined
  if (typeof raw !== 'string') return '[non-string body]'
  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>
    const masked: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(parsed)) {
      if (SENSITIVE_KEYS.has(k) && typeof v === 'string' && v.length > 0) {
        masked[k] = `[${v.length} chars]`
      } else {
        masked[k] = v
      }
    }
    return masked
  } catch {
    return raw.length > 200 ? `${raw.slice(0, 200)}…` : raw
  }
}

// ─── API Client ──────────────────────────────────────────────────────────────

export async function apiClient<T>(
  path: string,
  options?: RequestInit & { skipAuth?: boolean },
): Promise<T> {
  const { skipAuth, ...fetchOptions } = options ?? {}

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(fetchOptions.headers as Record<string, string>),
  }

  let hasToken = false
  if (!skipAuth) {
    const token = await getAccessToken()
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
      hasToken = true
    }
  }

  const method = fetchOptions.method ?? 'GET'
  const startedAt = Date.now()
  console.log('[API] →', method, path, {
    body: maskBody(fetchOptions.body),
    auth: headers['Authorization'] != null,
  })

  const response = await fetch(`${BASE_URL}${path}`, {
    ...fetchOptions,
    headers,
  })

  // 애초에 access token이 없던 요청(비로그인)의 401은 "인증 필요"일 뿐이다.
  // 여기서 refresh를 시도하면 실패 → 강제 로그아웃 콜백이 돌아 로그인 화면으로 튕긴다.
  if (response.status === 401 && !skipAuth && hasToken) {
    console.log('[API] ↺', method, path, '401 → refresh 시도')
    try {
      const newToken = await tryRefreshToken()
      headers['Authorization'] = `Bearer ${newToken}`

      const retryResponse = await fetch(`${BASE_URL}${path}`, {
        ...fetchOptions,
        headers,
      })

      // retry가 또 401이면 강제 로그아웃 — 무한 refresh 루프를 막는다.
      // (백엔드가 새 access token을 발급했는데도 같은 요청을 거부하는 경우)
      if (retryResponse.status === 401) {
        console.log('[API] ✗', method, path, 'refresh 후에도 401 → 강제 로그아웃')
        if (!_isLoggingOut) {
          _isLoggingOut = true
          await removeAccessToken()
          _onForceLogout?.()
        }
        throw new ApiError(401, 'Authentication failed after refresh')
      }

      if (!retryResponse.ok) {
        const body = await retryResponse.text().catch(() => retryResponse.statusText)
        console.log('[API] ✗', method, path, retryResponse.status, `${Date.now() - startedAt}ms`, {
          body: body.slice(0, 500),
        })
        throw new ApiError(retryResponse.status, body)
      }

      console.log('[API] ✓', method, path, retryResponse.status, `${Date.now() - startedAt}ms (after refresh)`)
      if (retryResponse.status === 204) return undefined as T
      return parseJsonOrThrow<T>(retryResponse, method, path)
    } catch (err) {
      if (err instanceof ApiError) throw err
      throw new ApiError(401, 'Authentication failed')
    }
  }

  if (!response.ok) {
    const body = await response.text().catch(() => response.statusText)
    console.log('[API] ✗', method, path, response.status, `${Date.now() - startedAt}ms`, {
      body: body.slice(0, 500),
    })
    throw new ApiError(response.status, body)
  }

  console.log('[API] ✓', method, path, response.status, `${Date.now() - startedAt}ms`)
  if (response.status === 204) return undefined as T
  return parseJsonOrThrow<T>(response, method, path)
}

// gateway가 잘못된 path를 SPA index.html로 fallback할 때 JSON parse가 실패하기 전에 명확한 에러를 던진다.
async function parseJsonOrThrow<T>(
  response: Response,
  method: string,
  path: string,
): Promise<T> {
  const contentType = response.headers.get('content-type') ?? ''
  if (!contentType.includes('application/json')) {
    console.log('[API] ⚠ JSON 아님', method, path, { contentType, finalUrl: response.url })
    throw new ApiError(response.status, `Expected JSON, got ${contentType || 'no content-type'}`)
  }
  return response.json() as Promise<T>
}

export function buildQueryString<T extends object>(params: T): string {
  const entries = Object.entries(params).filter(
    ([, v]) => v !== undefined && v !== null && v !== '',
  )
  if (entries.length === 0) return ''
  return '?' + new URLSearchParams(entries.map(([k, v]) => [k, String(v)])).toString()
}
