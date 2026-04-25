import { apiClient } from './client'

// ─── Request Types ────────────────────────────────────────────────────────────

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  nickname: string
  password: string
}

export interface RegisterDeviceRequest {
  platform: DevicePlatform
  deviceIdentifier: string
  pushToken: string
}

export interface OAuthLoginRequest {
  provider: OAuthProvider
  token: string
  nickname: string | null
  agreeToTerms: boolean | null
}

// ─── Enums ───────────────────────────────────────────────────────────────────

export enum DevicePlatform {
  iOS = 1,
  Android = 2,
}

// 백엔드와 정수 매핑이 일치해야 한다. 변경 시 hobom-system.com 백엔드 팀과 확인.
export enum OAuthProvider {
  Kakao = 1,
  Naver = 2,
  Google = 3,
  Apple = 4,
}

// ─── Response Types ──────────────────────────────────────────────────────────

export interface LoginResponse {
  accessToken: string
}

export interface RegisterResponse {
  userId: string
  email: string
  nickname: string
}

// ─── API Functions ────────────────────────────────────────────────────────────

export function login(body: LoginRequest): Promise<LoginResponse> {
  return apiClient<LoginResponse>('/hammers/hammer-users/auth/login', {
    method: 'POST',
    body: JSON.stringify(body),
    skipAuth: true,
  })
}

export function oauthLogin(body: OAuthLoginRequest): Promise<LoginResponse> {
  return apiClient<LoginResponse>('/hammers/hammer-users/auth/oauth', {
    method: 'POST',
    body: JSON.stringify(body),
    skipAuth: true,
    credentials: 'include',
  })
}

export function refreshToken(): Promise<LoginResponse> {
  return apiClient<LoginResponse>('/hammers/hammer-users/auth/refresh', {
    method: 'POST',
    credentials: 'include',
    skipAuth: true,
  })
}

export function register(body: RegisterRequest): Promise<RegisterResponse> {
  return apiClient<RegisterResponse>('/hammers/hammer-users/auth/register', {
    method: 'POST',
    body: JSON.stringify(body),
    skipAuth: true,
  })
}

export function registerDevice(body: RegisterDeviceRequest): Promise<void> {
  return apiClient<void>('/hammers/hammer-users/auth/device', {
    method: 'PUT',
    body: JSON.stringify(body),
  })
}

export async function logout(): Promise<void> {
  await apiClient<void>('/hammers/hammer-users/auth/logout', {
    method: 'POST',
  })
}
