import { apiClient, buildQueryString } from './client'
import type { PagedResponse } from './auctions'

// ─── Response Types ──────────────────────────────────────────────────────────

export interface InstitutionAuctionItem {
  id: number
  plnmNo: number
  pbctNo: number
  plnmKindCd: string
  plnmKindNm: string
  bidDvsnCd: string
  bidDvsnNm: string
  plnmNm: string
  orgNm: string
  plnmDt: string
  orgPlnmNo: string
  plnmMnmtNo: string
  bidMtdCd: string
  bidMtdNm: string
  totAmtUnpcDvsnCd: string
  totAmtUnpcDvsnNm: string
  dpslMtdCd: string
  dpslMtdNm: string
  prptDvsnCd: string
  prptDvsnNm: string
  pbctBegnDtm: string
  pbctClsDtm: string
  pbctExctDtm: string
  ctgrId: string
  ctgrFullNm: string
  createdAt: string
  updatedAt: string
}

// ─── Request Params ───────────────────────────────────────────────────────────

export interface InstitutionAuctionListParams {
  page?: number
  size?: number
  /** 공고기관명 필터 (완전 일치) */
  org?: string
  /** 용도 필터 (부분 일치) */
  category?: string
  /** 공고명 키워드 검색 (부분 일치) */
  keyword?: string
}

// ─── API Functions ────────────────────────────────────────────────────────────

export function fetchInstitutionAuctions(
  params: InstitutionAuctionListParams = {},
): Promise<PagedResponse<InstitutionAuctionItem>> {
  const qs = buildQueryString(params)
  return apiClient<PagedResponse<InstitutionAuctionItem>>(`/institution-auctions/items${qs}`)
}

export function fetchInstitutionAuctionDetail(id: number): Promise<InstitutionAuctionItem> {
  return apiClient<InstitutionAuctionItem>(`/institution-auctions/items/${id}`)
}
