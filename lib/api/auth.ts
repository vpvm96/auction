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
