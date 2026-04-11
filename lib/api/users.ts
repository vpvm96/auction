import { apiClient } from "./client";

// ─── Response Types ──────────────────────────────────────────────────────────

export type UserStatus = number;

export interface DeviceInfo {
  platform: number;
  deviceIdentifier: string;
  pushToken: string;
}

export interface UserSummary {
  id: string;
  email: string | null;
  nickname: string;
  status: UserStatus;
  hasPassword: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserDetail {
  id: string;
  email: string | null;
  nickname: string;
  status: UserStatus;
  deviceInfo: DeviceInfo | null;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateCurrentUserRequest {
  nickname: string;
  currentPassword: string | null;
  newPassword: string | null;
}

export interface UpdateCurrentUserResponse {
  id: string;
  email: string | null;
  nickname: string;
  status: UserStatus;
  hasPassword: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── API Functions ────────────────────────────────────────────────────────────

export function fetchUser(id: string): Promise<UserSummary> {
  return apiClient<UserSummary>(`/hammers/hammer-users/users/${id}`);
}

export function fetchCurrentUser(): Promise<UserDetail> {
  return apiClient<UserDetail>("/hammers/hammer-users/auth/me");
}

export function updateCurrentUser(
  body: UpdateCurrentUserRequest,
): Promise<UpdateCurrentUserResponse> {
  return apiClient<UpdateCurrentUserResponse>("/hammers/hammer-users/auth/me", {
    method: "PATCH",
    body: JSON.stringify(body),
  });
}
