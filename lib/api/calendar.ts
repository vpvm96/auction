import { apiClient, buildQueryString } from './client'

// ─── Response Types (OpenAPI: CalendarScheduleItem, CalendarScheduleResponse) ─

export interface CalendarScheduleItem {
  id: number
  /** 데이터 출처 (Kamco / Institution) */
  source: string
  /** 물건명 또는 공고명 */
  name: string
  /** 용도 */
  category: string
  /** 최저입찰가 (KAMCO만 해당, Institution은 null) */
  minBidPrice: number | null
  pbctBegnDtm: string
  pbctClsDtm: string
}

export interface CalendarScheduleResponse {
  year: number
  month: number
  /** 날짜별 일정 (키: yyyy-MM-dd, KST 기준) */
  schedules: Record<string, CalendarScheduleItem[]>
}

// ─── Request Params ───────────────────────────────────────────────────────────

export interface CalendarScheduleParams {
  /** 조회 연도 */
  year?: number
  /** 조회 월 (1–12) */
  month?: number
}

// ─── API Functions ────────────────────────────────────────────────────────────

/** GET /calendar/schedules — 월별 경매 일정 (KST 기준 날짜별 그룹) */
export function fetchCalendarSchedules(
  params: CalendarScheduleParams = {},
): Promise<CalendarScheduleResponse> {
  const qs = buildQueryString(params)
  return apiClient<CalendarScheduleResponse>(`/calendar/schedules${qs}`)
}
