import { apiClient } from './client'

// ─── Response Types ──────────────────────────────────────────────────────────

export type UserStatus = number

export interface UserSummary {
  id: string
  email: string | null
  nickname: string
  status: UserStatus
  hasPassword: boolean
  createdAt: string
  updatedAt: string
}

// ─── API Functions ────────────────────────────────────────────────────────────

export function fetchUser(id: string): Promise<UserSummary> {
  return apiClient<UserSummary>(`/hammers/hammer-users/users/${id}`)
}
