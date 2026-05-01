import { apiClient } from './client'
import type { AuctionStats } from '@/lib/mock-data'

// ─── Response Types (OpenAPI: DashboardCategorySummary, DashboardSummaryResponse)

export interface DashboardCategorySummary {
  category: string
  totalCount: number
  /** 오늘 신규 − 어제 신규 */
  dailyChange: number
}

export interface DashboardSummaryResponse {
  categories: DashboardCategorySummary[]
}

/** 대시보드 카테고리를 홈 `StatsCard`용 부동산 / 동산(차량·중기 등)으로 묶습니다 */
export function dashboardSummaryToAuctionStats(
  data: DashboardSummaryResponse,
): AuctionStats {
  let realEstate = { count: 0, change: 0 }
  let personal = { count: 0, change: 0 }
  for (const c of data.categories) {
    const lower = c.category.toLowerCase()
    const isVehicleOrEquipment =
      lower.includes('자동차') ||
      lower.includes('차량') ||
      lower.includes('중기') ||
      lower.includes('기계') ||
      lower.includes('건설기계')
    if (isVehicleOrEquipment) {
      personal.count += c.totalCount
      personal.change += c.dailyChange
    } else {
      realEstate.count += c.totalCount
      realEstate.change += c.dailyChange
    }
  }
  return { realEstate, personal }
}

// ─── API Functions ────────────────────────────────────────────────────────────

/** GET /dashboard/summary — 카테고리별 전체 건수 및 일일 변동 */
export function fetchDashboardSummary(): Promise<DashboardSummaryResponse> {
  return apiClient<DashboardSummaryResponse>('/hammers/hammer-auctions/dashboard/summary')
}
