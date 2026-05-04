import { apiClient, buildQueryString } from './client'
import type { PagedResponse } from './auctions'

// ─── Response Types ──────────────────────────────────────────────────────────

export interface CodeInfo {
  id: number
  ctgrId: string
  ctgrNm: string
  ctgrHirkId: string
  ctgrHirkNm: string
  createdAt: string
  updatedAt: string
}

// ─── Request Params ───────────────────────────────────────────────────────────

export interface CodeListParams {
  page?: number
  size?: number
  parentId?: string
}

// ─── API Functions ────────────────────────────────────────────────────────────

export function fetchCodes(
  params: CodeListParams = {},
): Promise<PagedResponse<CodeInfo>> {
  const qs = buildQueryString(params)
  return apiClient<PagedResponse<CodeInfo>>(
    `/hammers/hammer-auctions/code-infos${qs}`,
  )
}

export function fetchCodeDetail(id: number): Promise<CodeInfo> {
  return apiClient<CodeInfo>(`/hammers/hammer-auctions/code-infos/${id}`)
}
