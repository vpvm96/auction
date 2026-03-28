import { apiClient, buildQueryString } from './client'
import type { AuctionItem, AuctionType } from '@/lib/mock-data'

// ─── Response Types ──────────────────────────────────────────────────────────

export interface RealEstateTrade {
  address: string
  tradeAmount: number
  tradeDate: string
  area: number
}

export interface InvestmentAnalysis {
  discountRate: number
  pricePerArea: number
  estimatedYield: number
}

export interface KamcoAuctionItem {
  id: number
  plnmNo: number
  pbctNo: number
  cltrNo: number
  cltrNm: string
  ctgrFullNm: string
  ldnmAdrs: string
  nmrdAdrs: string | null
  minBidPrc: number
  apslAsesAvgAmt: number
  bidMtdNm: string
  pbctCltrStatNm: string
  pbctBegnDtm: string
  pbctClsDtm: string
  uscbdCnt: number
  iqryCnt: number
  cltrImgFiles: string[]
  discountRate: number
  latestTradeAmount: number | null
  latestTradeDate: string | null
  createdAt: string
  updatedAt: string
  // 상세 조회 전용
  recentTrades?: RealEstateTrade[]
  investmentAnalysis?: InvestmentAnalysis
}

export interface PagedResponse<T> {
  items: T[]
  page: number
  size: number
  totalCount: number
  totalPages: number
}

// ─── Request Params ───────────────────────────────────────────────────────────

export interface AuctionListParams {
  page?: number
  size?: number
  status?: string
  category?: string
  keyword?: string
}

// ─── Adapter ─────────────────────────────────────────────────────────────────

function parseCategoryType(ctgrFullNm: string): AuctionType {
  if (ctgrFullNm.includes('아파트')) return 'apartment'
  if (
    ctgrFullNm.includes('주택') ||
    ctgrFullNm.includes('다가구') ||
    ctgrFullNm.includes('단독')
  )
    return 'house'
  if (ctgrFullNm.includes('오피스텔')) return 'officetel'
  if (
    ctgrFullNm.includes('상가') ||
    ctgrFullNm.includes('점포') ||
    ctgrFullNm.includes('근린')
  )
    return 'commercial'
  if (ctgrFullNm.includes('토지')) return 'land'
  if (ctgrFullNm.includes('자동차') || ctgrFullNm.includes('차량')) return 'car'
  if (
    ctgrFullNm.includes('중기') ||
    ctgrFullNm.includes('건설기계') ||
    ctgrFullNm.includes('기계')
  )
    return 'equipment'
  return 'other'
}

export function toAuctionItem(item: KamcoAuctionItem): AuctionItem {
  const bidRatio =
    item.apslAsesAvgAmt > 0
      ? Math.round((item.minBidPrc / item.apslAsesAvgAmt) * 100)
      : 0

  return {
    id: String(item.id),
    type: parseCategoryType(item.ctgrFullNm),
    title: item.cltrNm,
    address: item.ldnmAdrs,
    court: '',
    caseNumber: String(item.plnmNo),
    auctionDate: item.pbctClsDtm,
    appraisalPrice: item.apslAsesAvgAmt,
    minimumBid: item.minBidPrc,
    bidRatio,
    failedBids: item.uscbdCnt,
    area: 0,
    thumbnailUrl: item.cltrImgFiles[0] ?? '',
    imageUrls: item.cltrImgFiles,
  }
}

// ─── API Functions ────────────────────────────────────────────────────────────

export function fetchAuctions(
  params: AuctionListParams = {},
): Promise<PagedResponse<KamcoAuctionItem>> {
  const qs = buildQueryString({ size: 20, ...params })
  return apiClient<PagedResponse<KamcoAuctionItem>>(`/hammers/hammer-auctions/hammer-auctions/items${qs}`)
}

export function fetchAuctionDetail(id: number): Promise<KamcoAuctionItem> {
  return apiClient<KamcoAuctionItem>(`/hammers/hammer-auctions/hammer-auctions/items/${id}`)
}
