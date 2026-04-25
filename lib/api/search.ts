import { apiClient, buildQueryString } from './client'
import type { PagedResponse } from './auctions'
import type { AuctionItem, AuctionType } from '@/lib/mock-data'

// ─── Response Types ───────────────────────────────────────────────────────────

export interface UnifiedAuctionItem {
  id: number
  /** Kamco / Institution */
  source: string
  name: string
  category: string
  minBidPrice: number | null
  pbctBegnDtm: string
  pbctClsDtm: string
  address: string | null
  status: string | null
}

export interface PopularSearchTerm {
  keyword: string
  count: number
}

function parseCategoryFromSearchLabel(ctgrFullNm: string): AuctionType {
  if (ctgrFullNm.includes('아파트')) return 'apartment'
  if (
    ctgrFullNm.includes('주택') ||
    ctgrFullNm.includes('다가구') ||
    ctgrFullNm.includes('단독')
  ) {
    return 'house'
  }
  if (ctgrFullNm.includes('오피스텔')) return 'officetel'
  if (
    ctgrFullNm.includes('상가') ||
    ctgrFullNm.includes('점포') ||
    ctgrFullNm.includes('근린')
  ) {
    return 'commercial'
  }
  if (ctgrFullNm.includes('토지')) return 'land'
  if (ctgrFullNm.includes('자동차') || ctgrFullNm.includes('차량')) return 'car'
  if (
    ctgrFullNm.includes('중기') ||
    ctgrFullNm.includes('건설기계') ||
    ctgrFullNm.includes('기계')
  ) {
    return 'equipment'
  }
  return 'other'
}

/** 통합 검색 응답을 목록 카드용 `AuctionItem`으로 변환 */
export function unifiedAuctionToAuctionItem(item: UnifiedAuctionItem): AuctionItem {
  const minBid = item.minBidPrice ?? 0
  const appraisal = minBid > 0 ? minBid : 0
  const bidRatio = appraisal > 0 ? Math.round((minBid / appraisal) * 100) : 0
  return {
    id: String(item.id),
    type: parseCategoryFromSearchLabel(item.category),
    title: item.name,
    address: item.address ?? '',
    court: '',
    caseNumber: item.source,
    auctionDate: item.pbctClsDtm,
    appraisalPrice: appraisal,
    minimumBid: minBid,
    bidRatio,
    failedBids: 0,
    area: 0,
    thumbnailUrl: '',
    imageUrls: [],
  }
}

// ─── Request Params ───────────────────────────────────────────────────────────

export interface SearchAuctionsParams {
  keyword?: string
  page?: number
  size?: number
  /**
   * Gateway가 쿼리로 전달하는 사용자 식별자 (OpenAPI UserId).
   * 일반 앱에서는 Bearer 토큰만 쓰는 경우 생략 가능.
   */
  userId?: string
}

export interface PopularSearchParams {
  /** 집계 기간(일), 기본 7 */
  days?: number
  /** 반환 개수, 기본 10 */
  limit?: number
}

export interface RecentSearchParams {
  limit?: number
  userId?: string
}

export interface ClearRecentSearchParams {
  userId?: string
}

// ─── API Functions ────────────────────────────────────────────────────────────

/** GET /search/auctions — KAMCO + 기관 공매 통합 검색 (검색 기록 저장) */
export function searchAuctions(
  params: SearchAuctionsParams = {},
): Promise<PagedResponse<UnifiedAuctionItem>> {
  const qs = buildQueryString(params)
  return apiClient<PagedResponse<UnifiedAuctionItem>>(`/search/auctions${qs}`)
}

/** GET /search/popular — 글로벌 인기 검색어 */
export function fetchPopularSearchTerms(
  params: PopularSearchParams = {},
): Promise<PopularSearchTerm[]> {
  const qs = buildQueryString(params)
  return apiClient<PopularSearchTerm[]>(`/search/popular${qs}`)
}

/** GET /search/recent — 내 최근 검색어 */
export function fetchRecentSearchTerms(
  params: RecentSearchParams = {},
): Promise<string[]> {
  const qs = buildQueryString(params)
  return apiClient<string[]>(`/search/recent${qs}`)
}

/** DELETE /search/recent — 내 검색 기록 전체 삭제 (204) */
export function clearRecentSearchTerms(
  params: ClearRecentSearchParams = {},
): Promise<void> {
  const qs = buildQueryString(params)
  return apiClient<void>(`/search/recent${qs}`, { method: 'DELETE' })
}
