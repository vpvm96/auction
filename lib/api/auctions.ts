import type { AuctionItem, AuctionType } from "@/lib/mock-data";
import { apiClient, buildQueryString } from "./client";

// ─── Response Types ──────────────────────────────────────────────────────────

export interface RecentTrade {
  id: number;
  lawdCd: string;
  propertyType: number;
  buildingName: string | null;
  jibun: string;
  umdNm: string;
  dealAmount: number;
  dealYear: number;
  dealMonth: number;
  dealDay: number;
  area: number;
  floor: number;
  buildYear: number;
  createdAt: string;
  updatedAt: string;
}

export interface MarketGap {
  weightedMarketPrice: number;
  minBidPrice: number;
  gapRate: number;
  grade: string;
  tradeCount: number;
  usedTradeCount: number;
  confidence: string;
}

export interface InvestmentScore {
  totalScore: number;
  marketGapScore: number;
  priceTrendScore: number;
  discountDepthScore: number;
  appraisalDiscountScore: number;
  competitionScore: number;
  liquidityScore: number;
  rating: string;
}

export interface BidPriceGuide {
  conservativeBid: number;
  moderateBid: number;
  aggressiveBid: number;
  acquisitionTaxRate: number;
  evictionCostRate: number;
  miscCostRate: number;
  appraisalDiscountRate: number;
  guidance: string;
}

export interface InvestmentAnalysis {
  marketGap: MarketGap | null;
  investmentScore: InvestmentScore | null;
  bidPriceGuide: BidPriceGuide | null;
}

export interface KamcoAuctionItem {
  id: number;
  plnmNo: number;
  pbctNo: number;
  cltrNo: number;
  cltrNm: string;
  ctgrFullNm: string;
  ldnmAdrs: string;
  nmrdAdrs: string | null;
  minBidPrc: number;
  apslAsesAvgAmt: number;
  bidMtdNm: string;
  pbctCltrStatNm: string;
  pbctBegnDtm: string;
  pbctClsDtm: string;
  uscbdCnt: number;
  iqryCnt: number;
  cltrImgFiles: string[] | null;
  discountRate: number;
  /** 최근 실거래가 (만원 단위) */
  latestTradeAmount: string | null;
  latestTradeDate: string | null;
  recentTrades?: RecentTrade[] | null;
  investmentAnalysis?: InvestmentAnalysis | null;
  createdAt: string;
  updatedAt: string;
}

export interface PagedResponse<T> {
  items: T[];
  page: number;
  size: number;
  totalCount: number;
  totalPages: number;
}

// ─── Request Params ───────────────────────────────────────────────────────────

export interface AuctionListParams {
  page?: number;
  size?: number;
  status?: string;
  category?: string;
  keyword?: string;
}

// ─── Adapter ─────────────────────────────────────────────────────────────────

function parseCategoryType(ctgrFullNm: string): AuctionType {
  if (ctgrFullNm.includes("아파트")) return "apartment";
  if (
    ctgrFullNm.includes("주택") ||
    ctgrFullNm.includes("다가구") ||
    ctgrFullNm.includes("단독")
  )
    return "house";
  if (ctgrFullNm.includes("오피스텔")) return "officetel";
  if (
    ctgrFullNm.includes("상가") ||
    ctgrFullNm.includes("점포") ||
    ctgrFullNm.includes("근린")
  )
    return "commercial";
  if (ctgrFullNm.includes("토지")) return "land";
  if (ctgrFullNm.includes("자동차") || ctgrFullNm.includes("차량"))
    return "car";
  if (
    ctgrFullNm.includes("중기") ||
    ctgrFullNm.includes("건설기계") ||
    ctgrFullNm.includes("기계")
  )
    return "equipment";
  return "other";
}

export function toAuctionItem(item: KamcoAuctionItem): AuctionItem {
  const bidRatio =
    item.apslAsesAvgAmt > 0
      ? Math.round((item.minBidPrc / item.apslAsesAvgAmt) * 100)
      : 0;

  const images = item.cltrImgFiles ?? [];

  const marketGapRate =
    item.investmentAnalysis?.marketGap?.gapRate ?? undefined;

  const latestTradeRaw = item.latestTradeAmount;
  const latestTradeAmount =
    latestTradeRaw != null
      ? parseFloat(String(latestTradeRaw)) * 10000
      : undefined;

  return {
    id: String(item.id),
    type: parseCategoryType(item.ctgrFullNm),
    title: item.cltrNm,
    address: item.ldnmAdrs,
    court: "",
    caseNumber: String(item.plnmNo),
    auctionDate: item.pbctClsDtm,
    appraisalPrice: item.apslAsesAvgAmt,
    minimumBid: item.minBidPrc,
    bidRatio,
    failedBids: item.uscbdCnt,
    area: 0,
    thumbnailUrl: images[0] ?? "",
    imageUrls: images,
    investmentRating:
      item.investmentAnalysis?.investmentScore?.rating || undefined,
    investmentScore:
      item.investmentAnalysis?.investmentScore?.totalScore ?? undefined,
    marketGapRate:
      marketGapRate != null && !isNaN(marketGapRate)
        ? marketGapRate
        : undefined,
    marketGapGrade: item.investmentAnalysis?.marketGap?.grade || undefined,
    latestTradeAmount: !isNaN(latestTradeAmount ?? NaN)
      ? latestTradeAmount
      : undefined,
    latestTradeDate: item.latestTradeDate ?? undefined,
  };
}

// ─── API Functions ────────────────────────────────────────────────────────────

export function fetchAuctions(
  params: AuctionListParams = {},
): Promise<PagedResponse<KamcoAuctionItem>> {
  const qs = buildQueryString({ size: 20, ...params });
  return apiClient<PagedResponse<KamcoAuctionItem>>(
    `/hammers/hammer-auctions/hammer-auctions/items${qs}`,
  );
}

export function fetchAuctionDetail(id: number): Promise<KamcoAuctionItem> {
  return apiClient<KamcoAuctionItem>(
    `/hammers/hammer-auctions/hammer-auctions/items/${id}`,
  );
}
