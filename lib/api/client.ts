import AsyncStorage from '@react-native-async-storage/async-storage'

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

async function tryRefreshToken(): Promise<string> {
  // 이미 강제 로그아웃이 진행 중이면 더 이상 refresh 시도하지 않음.
  // — 백엔드 장애로 retry가 계속 401을 받는 폭주 시나리오를 차단한다.
  if (_isLoggingOut) {
    throw new ApiError(401, 'Already logging out')
  }
  if (_refreshPromise) return _refreshPromise

  _refreshPromise = (async () => {
    try {
      const res = await fetch(`${BASE_URL}/hammers/hammer-users/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      })

      if (!res.ok) {
        throw new ApiError(res.status, 'Token refresh failed')
      }

      const data = (await res.json()) as { accessToken: string }
      await setAccessToken(data.accessToken)
      return data.accessToken
    } catch (error) {
      await removeAccessToken()
      if (!_isLoggingOut) {
        _isLoggingOut = true
        _onForceLogout?.()
      }
      throw error
    } finally {
      _refreshPromise = null
    }
  })()

  return _refreshPromise
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

  if (!skipAuth) {
    const token = await getAccessToken()
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    ...fetchOptions,
    headers,
  })

  if (response.status === 401 && !skipAuth) {
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
        if (!_isLoggingOut) {
          _isLoggingOut = true
          await removeAccessToken()
          _onForceLogout?.()
        }
        throw new ApiError(401, 'Authentication failed after refresh')
      }

      if (!retryResponse.ok) {
        const body = await retryResponse.text().catch(() => retryResponse.statusText)
        throw new ApiError(retryResponse.status, body)
      }

      if (retryResponse.status === 204) return undefined as T
      return retryResponse.json() as Promise<T>
    } catch (err) {
      if (err instanceof ApiError) throw err
      throw new ApiError(401, 'Authentication failed')
    }
  }

  if (!response.ok) {
    const body = await response.text().catch(() => response.statusText)
    throw new ApiError(response.status, body)
  }

  if (response.status === 204) return undefined as T
  return response.json() as Promise<T>
}

export function buildQueryString<T extends object>(params: T): string {
  const entries = Object.entries(params).filter(
    ([, v]) => v !== undefined && v !== null && v !== '',
  )
  if (entries.length === 0) return ''
  return '?' + new URLSearchParams(entries.map(([k, v]) => [k, String(v)])).toString()
}
