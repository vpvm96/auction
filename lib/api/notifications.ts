import { apiClient, buildQueryString } from './client'
import type { PagedResponse } from './auctions'

// ─── Response Types (OpenAPI: NotificationResponse, NotificationSettingsResponse)

export interface NotificationResponse {
  id: number
  /** 백엔드 정의 알림 타입 문자열 (e.g. "Auction", "System") */
  type: string
  title: string
  body: string
  isRead: boolean
  createdAt: string
  readAt: string | null
}

export interface NotificationSettingsResponse {
  isEnabled: boolean
}

// ─── Request Types ───────────────────────────────────────────────────────────

export interface NotificationListParams {
  /** 페이지 번호 (기본값: 1) */
  page?: number
  /** 페이지 크기 (기본값: 20) */
  size?: number
}

export interface UpdateNotificationSettingsRequest {
  isEnabled: boolean
}

// ─── API Functions ────────────────────────────────────────────────────────────

/** GET /notifications — 알림 목록 (페이지네이션) */
export function fetchNotifications(
  params: NotificationListParams = {},
): Promise<PagedResponse<NotificationResponse>> {
  const qs = buildQueryString({ page: 1, size: 20, ...params })
  return apiClient<PagedResponse<NotificationResponse>>(
    `/hammers/hammer-auctions/notifications${qs}`,
  )
}

/** GET /notifications/unread-count — 읽지 않은 알림 수 */
export function fetchUnreadNotificationCount(): Promise<number> {
  return apiClient<number>('/hammers/hammer-auctions/notifications/unread-count')
}

/** PATCH /notifications/{id}/read — 알림 읽음 처리 */
export function markNotificationRead(id: number): Promise<void> {
  return apiClient<void>(`/hammers/hammer-auctions/notifications/${id}/read`, {
    method: 'PATCH',
  })
}

/** PATCH /notifications/read-all — 모든 알림 읽음 처리 */
export function markAllNotificationsRead(): Promise<void> {
  return apiClient<void>('/hammers/hammer-auctions/notifications/read-all', {
    method: 'PATCH',
  })
}

/** GET /notifications/settings — 알림 설정 조회 */
export function fetchNotificationSettings(): Promise<NotificationSettingsResponse> {
  return apiClient<NotificationSettingsResponse>(
    '/hammers/hammer-auctions/notifications/settings',
  )
}

/** PUT /notifications/settings — 알림 설정 변경 */
export function updateNotificationSettings(
  body: UpdateNotificationSettingsRequest,
): Promise<NotificationSettingsResponse> {
  return apiClient<NotificationSettingsResponse>(
    '/hammers/hammer-auctions/notifications/settings',
    {
      method: 'PUT',
      body: JSON.stringify(body),
    },
  )
}
