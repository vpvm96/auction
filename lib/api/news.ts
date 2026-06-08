// 뉴스 API — 네이버 뉴스 수집 데이터 조회 (목록/최신/상세/검색). 다른 엔드포인트와 동일한 인증 게이트웨이 사용.
import { apiClient, buildQueryString } from './client'
import type { PagedResponse } from './auctions'

// ─── Response Types ───────────────────────────────────────────────────────────

export interface NewsResponse {
  /** 기사 고유 식별자 (uuid) */
  id: string
  /** 수집 키워드 (예: 경매, 부동산) */
  query: string
  /** 기사 제목 (HTML 제거됨) */
  title: string
  /** 원문 기사 URL */
  originalLink: string
  /** 네이버 캐시 URL */
  link: string
  /** 기사 요약 (HTML 제거됨, 잘려 들어올 수 있음) */
  description: string
  /** 기사 발행일시 (ISO date-time) */
  pubDate: string
}

// ─── Request Params ───────────────────────────────────────────────────────────

export interface NewsListParams {
  page?: number
  size?: number
}

export interface NewsSearchParams {
  keyword?: string
  page?: number
  size?: number
}

// ─── API Functions ────────────────────────────────────────────────────────────

const NEWS_BASE = '/hammers/hammer-auctions'

/** GET /news — 뉴스 목록 페이지네이션 조회 (최신순) */
export function fetchNews(
  params: NewsListParams = {},
): Promise<PagedResponse<NewsResponse>> {
  const qs = buildQueryString({ size: 20, ...params })
  return apiClient<PagedResponse<NewsResponse>>(`${NEWS_BASE}/news${qs}`)
}

/** GET /news/recent — 최신 뉴스 목록 (기본 5건) */
export function fetchRecentNews(count = 5): Promise<NewsResponse[]> {
  const qs = buildQueryString({ count })
  return apiClient<NewsResponse[]>(`${NEWS_BASE}/news/recent${qs}`)
}

/** GET /news/{id} — 뉴스 상세 */
export function fetchNewsDetail(id: string): Promise<NewsResponse> {
  return apiClient<NewsResponse>(`${NEWS_BASE}/news/${id}`)
}

/** GET /news/search — 제목 키워드 검색 (최신순) */
export function searchNews(
  params: NewsSearchParams = {},
): Promise<PagedResponse<NewsResponse>> {
  const qs = buildQueryString({ size: 20, ...params })
  return apiClient<PagedResponse<NewsResponse>>(`${NEWS_BASE}/news/search${qs}`)
}
