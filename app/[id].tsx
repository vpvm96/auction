import { AuctionImageCarousel } from "@/components/auction/auction-image-carousel";
import { KakaoMap } from "@/components/map/kakao-map";
import { Badge } from "@/components/ui/badge";
import { Divider } from "@/components/ui/divider";
import {
    FontFamily,
    FontSize,
    HIT_SLOP,
    Radius,
    Spacing,
} from "@/constants/tokens";
import type { ColorTheme } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";
import type {
  RecentTrade,
  MarketGap,
  InvestmentScore,
  BidPriceGuide,
} from "@/lib/api/auctions";
import { toAuctionItem } from "@/lib/api/auctions";
import { formatFullDate, formatPrice } from "@/lib/format";
import { useAuctionDetail } from "@/lib/queries/auctions";
import { useFavoritesStore } from "@/lib/store/useFavoritesStore";
import { useRecentlyViewedStore } from "@/lib/store/useRecentlyViewedStore";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

const EMPTY_IMAGE = require("@/assets/images/empty/auction_empty_image.webp");

interface InfoRowProps {
  label: string;
  value: string;
}

interface AddressInfoRowProps {
  label: string;
  value: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function gradeColors(grade: string, theme: ColorTheme) {
  switch (grade?.toUpperCase()) {
    case "S":
      return { text: theme.status.success, bg: theme.status.successBg };
    case "A":
      return { text: theme.status.info, bg: theme.status.infoBg };
    case "B":
      return { text: theme.status.warning, bg: theme.status.warningBg };
    default:
      return { text: theme.status.danger, bg: theme.status.dangerBg };
  }
}

function ratingColor(rating: string, theme: ColorTheme): string {
  if (rating === "상") return theme.status.success;
  if (rating === "중") return theme.status.warning;
  return theme.status.danger;
}

function splitAddressLines(value: string): string[] {
  return value
    .split(",")
    .map((part) => part.trim())
    .filter((part) => part.length > 0);
}

function toAddressRows(lines: string[], groupSize = 2): string[] {
  const rows: string[] = [];

  for (let i = 0; i < lines.length; i += groupSize) {
    rows.push(lines.slice(i, i + groupSize).join(", "));
  }

  return rows;
}

function AddressInfoRow({ label, value }: AddressInfoRowProps) {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);

  const lines = splitAddressLines(value);
  const rows = toAddressRows(lines);
  const hasMore = rows.length > 2;
  const visibleRows = expanded ? rows : rows.slice(0, 2);

  return (
    <View style={styles.infoRow}>
      <Text style={[styles.infoLabel, { color: theme.text.secondary }]}>
        {label}
      </Text>
      <View style={styles.infoValueWrap}>
        {visibleRows.length > 0 ? (
          <View style={styles.addressRows}>
            {visibleRows.map((row, index) => (
              <Text
                key={`${row}-${index}`}
                style={[styles.addressRowText, { color: theme.text.primary }]}
              >
                {row}
              </Text>
            ))}
          </View>
        ) : (
          <Text style={[styles.infoValue, { color: theme.text.primary }]}>
            -
          </Text>
        )}

        {hasMore ? (
          <Pressable
            accessible={true}
            accessibilityLabel={expanded ? "소재지 접기" : "소재지 더보기"}
            accessibilityRole="button"
            accessibilityHint={
              expanded
                ? "전체 소재지를 접습니다"
                : "전체 소재지를 펼쳐서 봅니다"
            }
            onPress={() => setExpanded((prev) => !prev)}
            style={styles.addressToggle}
          >
            <Text
              style={[styles.addressToggleText, { color: theme.text.brand }]}
            >
              {expanded ? "접기" : `더보기 +${rows.length - 2}`}
            </Text>
            <Ionicons
              name={expanded ? "chevron-up" : "chevron-down"}
              size={14}
              color={theme.text.brand}
            />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

function InfoRow({ label, value }: InfoRowProps) {
  const theme = useTheme();

  return (
    <View style={styles.infoRow}>
      <Text style={[styles.infoLabel, { color: theme.text.secondary }]}>
        {label}
      </Text>
      <Text style={[styles.infoValue, { color: theme.text.primary }]}>
        {value}
      </Text>
    </View>
  );
}

interface TradeRowProps {
  trade: RecentTrade;
}

function TradeRow({ trade }: TradeRowProps) {
  const theme = useTheme();
  const tradeDate = `${trade.dealYear}.${trade.dealMonth}.${trade.dealDay}`;
  const tradeAmount = trade.dealAmount * 10000;

  return (
    <View style={styles.tradeRow}>
      <View style={styles.tradeInfo}>
        <Text style={[styles.tradeDate, { color: theme.text.tertiary }]}>
          {tradeDate}
        </Text>
        <Text
          style={[styles.tradeAddress, { color: theme.text.secondary }]}
          numberOfLines={1}
        >
          {trade.umdNm} {trade.jibun}
        </Text>
      </View>
      <View style={styles.tradeRight}>
        <Text style={[styles.tradePrice, { color: theme.text.primary }]}>
          {formatPrice(tradeAmount)}
        </Text>
        <Text style={[styles.tradeArea, { color: theme.text.tertiary }]}>
          {trade.area}㎡
        </Text>
      </View>
    </View>
  );
}

const SCORE_LABELS: {
  key: keyof InvestmentScore;
  label: string;
  max: number;
}[] = [
  { key: "marketGapScore", label: "시장 갭", max: 30 },
  { key: "priceTrendScore", label: "가격 추세", max: 20 },
  { key: "discountDepthScore", label: "할인 깊이", max: 15 },
  { key: "appraisalDiscountScore", label: "감정 할인", max: 15 },
  { key: "competitionScore", label: "경쟁도", max: 10 },
  { key: "liquidityScore", label: "유동성", max: 10 },
];

interface MarketGapSectionProps {
  marketGap: MarketGap;
}

function MarketGapSection({ marketGap }: MarketGapSectionProps) {
  const theme = useTheme();
  const gradeClr = gradeColors(marketGap.grade, theme);

  return (
    <View style={[styles.section, { backgroundColor: theme.bg.surface }]}>
      <View style={styles.sectionHeaderRow}>
        <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>
          시장 갭 분석
        </Text>
        <View style={[styles.gradeBadge, { backgroundColor: gradeClr.bg }]}>
          <Text style={[styles.gradeBadgeText, { color: gradeClr.text }]}>
            {marketGap.grade}등급
          </Text>
        </View>
      </View>

      <View style={[styles.highlightCard, { backgroundColor: theme.bg.sunken }]}>
        <View style={styles.highlightRow}>
          <View style={styles.highlightItem}>
            <Text style={[styles.highlightLabel, { color: theme.text.tertiary }]}>
              갭 비율
            </Text>
            <Text style={[styles.highlightValue, { color: gradeClr.text }]}>
              {marketGap.gapRate.toFixed(1)}%
            </Text>
          </View>
          <View
            style={[
              styles.highlightDivider,
              { backgroundColor: theme.border.default },
            ]}
          />
          <View style={styles.highlightItem}>
            <Text style={[styles.highlightLabel, { color: theme.text.tertiary }]}>
              시장 가중 평균가
            </Text>
            <Text style={[styles.highlightValue, { color: theme.text.primary }]}>
              {formatPrice(marketGap.weightedMarketPrice)}
            </Text>
          </View>
        </View>
      </View>

      <InfoRow
        label="참고 거래"
        value={`${marketGap.usedTradeCount}건 / 전체 ${marketGap.tradeCount}건`}
      />
      <InfoRow label="신뢰도" value={marketGap.confidence} />
    </View>
  );
}

interface InvestmentScoreSectionProps {
  score: InvestmentScore;
}

function InvestmentScoreSection({ score }: InvestmentScoreSectionProps) {
  const theme = useTheme();
  const ratingClr = ratingColor(score.rating, theme);

  return (
    <View style={[styles.section, { backgroundColor: theme.bg.surface }]}>
      <View style={styles.sectionHeaderRow}>
        <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>
          투자 점수
        </Text>
        <View style={styles.scoreChip}>
          <Text style={[styles.scoreTotalText, { color: theme.text.primary }]}>
            {score.totalScore}점
          </Text>
          <Text style={[styles.scoreRatingText, { color: ratingClr }]}>
            {score.rating}
          </Text>
        </View>
      </View>

      <View style={styles.scoreBarContainer}>
        {SCORE_LABELS.map(({ key, label, max }) => {
          const val = score[key] as number;
          const ratio = Math.min(val / max, 1);
          return (
            <View key={key} style={styles.scoreBarRow}>
              <Text
                style={[styles.scoreBarLabel, { color: theme.text.secondary }]}
              >
                {label}
              </Text>
              <View
                style={[
                  styles.scoreBarTrack,
                  { backgroundColor: theme.bg.sunken },
                ]}
              >
                <View
                  style={[
                    styles.scoreBarFill,
                    {
                      width: `${ratio * 100}%` as `${number}%`,
                      backgroundColor: theme.brand.primary,
                    },
                  ]}
                />
              </View>
              <Text
                style={[styles.scoreBarValue, { color: theme.text.primary }]}
              >
                {val}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

interface BidPriceGuideSectionProps {
  guide: BidPriceGuide;
}

function BidPriceGuideSection({ guide }: BidPriceGuideSectionProps) {
  const theme = useTheme();

  return (
    <View style={[styles.section, { backgroundColor: theme.bg.surface }]}>
      <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>
        입찰가 가이드
      </Text>

      <View style={[styles.bidGuideCard, { backgroundColor: theme.bg.sunken }]}>
        <View style={styles.bidGuideRow}>
          <View style={styles.bidGuideItem}>
            <Text style={[styles.bidGuideLabel, { color: theme.text.tertiary }]}>
              보수적
            </Text>
            <Text style={[styles.bidGuideValue, { color: theme.status.info }]}>
              {formatPrice(guide.conservativeBid)}
            </Text>
          </View>
          <View
            style={[
              styles.bidGuideDivider,
              { backgroundColor: theme.border.default },
            ]}
          />
          <View style={styles.bidGuideItem}>
            <Text style={[styles.bidGuideLabel, { color: theme.text.tertiary }]}>
              중간
            </Text>
            <Text
              style={[styles.bidGuideValue, { color: theme.status.success }]}
            >
              {formatPrice(guide.moderateBid)}
            </Text>
          </View>
          <View
            style={[
              styles.bidGuideDivider,
              { backgroundColor: theme.border.default },
            ]}
          />
          <View style={styles.bidGuideItem}>
            <Text style={[styles.bidGuideLabel, { color: theme.text.tertiary }]}>
              적극적
            </Text>
            <Text style={[styles.bidGuideValue, { color: theme.auction.hot }]}>
              {formatPrice(guide.aggressiveBid)}
            </Text>
          </View>
        </View>
      </View>

      <View
        style={[
          styles.guidanceBox,
          {
            backgroundColor: theme.brand.primarySubtle,
            borderColor: theme.border.brand,
          },
        ]}
      >
        <Ionicons
          name="information-circle-outline"
          size={16}
          color={theme.text.brand}
        />
        <Text style={[styles.guidanceText, { color: theme.text.brand }]}>
          {guide.guidance}
        </Text>
      </View>

      <InfoRow label="취득세율" value={`${guide.acquisitionTaxRate}%`} />
      <InfoRow label="명도비용율" value={`${guide.evictionCostRate}%`} />
      <InfoRow label="기타비용율" value={`${guide.miscCostRate}%`} />
    </View>
  );
}

export default function DetailScreen() {
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const numericId = Number(id);
  const { data: rawItem, isLoading, isError, refetch, isRefetching } = useAuctionDetail(numericId);
  const auction = rawItem != null ? toAuctionItem(rawItem) : null;

  const isFavorited = useFavoritesStore((s) => s.favoriteIds.has(id ?? ""));
  const toggle = useFavoritesStore((s) => s.toggle);
  const addRecentlyViewed = useRecentlyViewedStore((s) => s.addId);

  useEffect(() => {
    if (id != null) {
      addRecentlyViewed(id);
    }
  }, [id, addRecentlyViewed]);

  useEffect(() => {
    if (rawItem == null) return;
    console.log("[Detail] images", {
      id: rawItem.id,
      count: rawItem.cltrImgFiles?.length ?? 0,
      cltrImgFiles: rawItem.cltrImgFiles,
    });
  }, [rawItem]);

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg.base }]}>
        <View
          style={[
            styles.navBar,
            {
              backgroundColor: theme.bg.surface,
              borderBottomColor: theme.border.default,
            },
          ]}
        >
          <Pressable onPress={() => router.back()} hitSlop={HIT_SLOP}>
            <Ionicons name="arrow-back" size={24} color={theme.text.primary} />
          </Pressable>
          <Text
            style={[styles.navTitle, { color: theme.text.primary }]}
            numberOfLines={1}
          >
            <Text>상세 정보</Text>
          </Text>
          <View style={styles.navPlaceholder} />
        </View>
        <View style={styles.loadingContainer}>
          <LoadingSpinner size="medium" />
        </View>
      </SafeAreaView>
    );
  }

  if (isError || auction == null) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg.base }]}>
        <View
          style={[
            styles.navBar,
            {
              backgroundColor: theme.bg.surface,
              borderBottomColor: theme.border.default,
            },
          ]}
        >
          <Pressable onPress={() => router.back()} hitSlop={HIT_SLOP}>
            <Ionicons name="arrow-back" size={24} color={theme.text.primary} />
          </Pressable>
          <Text
            style={[styles.navTitle, { color: theme.text.primary }]}
            numberOfLines={1}
          >
            <Text>상세 정보</Text>
          </Text>
          <View style={styles.navPlaceholder} />
        </View>
        <View style={styles.errorContainer}>
          <Ionicons
            name="alert-circle-outline"
            size={48}
            color={theme.status.danger}
          />
          <Text style={[styles.notFoundText, { color: theme.text.primary }]}>
            물건을 불러오지 못했습니다
          </Text>
          <Text style={[styles.errorMessage, { color: theme.text.secondary }]}>
            네트워크 상태를 확인 후 다시 시도해주세요.
          </Text>
          <Pressable
            accessible={true}
            accessibilityLabel="다시 시도"
            accessibilityRole="button"
            style={[
              styles.retryButton,
              { backgroundColor: theme.brand.primary },
              isRefetching ? styles.retryButtonDisabled : null,
            ]}
            onPress={() => refetch()}
            disabled={isRefetching}
          >
            <Text style={[styles.retryButtonText, { color: theme.brand.onPrimary }]}>
              {isRefetching ? "다시 시도 중..." : "다시 시도"}
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const handleFavorite = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggle(auction.id);
  };

  const recentTrades = rawItem?.recentTrades ?? [];
  const investmentAnalysis = rawItem?.investmentAnalysis;

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: theme.bg.base }]}
      edges={["top", "bottom"]}
    >
      <View
        style={[
          styles.navBar,
          {
            backgroundColor: theme.bg.surface,
            borderBottomColor: theme.border.default,
          },
        ]}
      >
        <Pressable onPress={() => router.back()} hitSlop={HIT_SLOP}>
          <Ionicons name="arrow-back" size={24} color={theme.text.primary} />
        </Pressable>
        <Text
          style={[styles.navTitle, { color: theme.text.primary }]}
          numberOfLines={1}
        >
          {auction.title}
        </Text>
        <Pressable onPress={handleFavorite} hitSlop={HIT_SLOP}>
          <Ionicons
            name={isFavorited ? "heart" : "heart-outline"}
            size={24}
            color={isFavorited ? theme.auction.hot : theme.text.primary}
          />
        </Pressable>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <AuctionImageCarousel
          imageUrls={auction.imageUrls}
          fallback={EMPTY_IMAGE}
        />

        <View style={[styles.section, { backgroundColor: theme.bg.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>
            기본 정보
          </Text>
          <AddressInfoRow label="소재지" value={auction.address} />
          {auction.area > 0 ? (
            <InfoRow label="면적" value={`${auction.area}㎡`} />
          ) : null}
          <InfoRow label="분류" value={rawItem?.ctgrFullNm ?? "-"} />
          <InfoRow label="상태" value={rawItem?.pbctCltrStatNm ?? "-"} />
          <InfoRow label="조회수" value={`${rawItem?.iqryCnt ?? 0}회`} />
        </View>

        <Divider variant="section" />

        <View style={[styles.section, { backgroundColor: theme.bg.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>
            지도
          </Text>
          <KakaoMap
            query={auction.title}
            fallbackQuery={auction.address}
            height={240}
          />
        </View>

        <Divider variant="section" />

        <View style={[styles.section, { backgroundColor: theme.bg.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>
            경매 정보
          </Text>
          <InfoRow label="사건번호" value={auction.caseNumber} />
          <InfoRow label="입찰방법" value={rawItem?.bidMtdNm ?? "-"} />
          <InfoRow
            label="입찰시작"
            value={
              rawItem?.pbctBegnDtm != null
                ? formatFullDate(rawItem.pbctBegnDtm)
                : "-"
            }
          />
          <InfoRow
            label="입찰마감"
            value={formatFullDate(auction.auctionDate)}
          />
          <InfoRow label="감정가" value={formatPrice(auction.appraisalPrice)} />
          <InfoRow label="최저입찰가" value={formatPrice(auction.minimumBid)} />
          <InfoRow label="할인율" value={`${rawItem?.discountRate ?? 0}%`} />
          <InfoRow label="유찰횟수" value={`${auction.failedBids}회`} />
        </View>

        {investmentAnalysis?.investmentScore != null ? (
          <>
            <Divider variant="section" />
            <InvestmentScoreSection score={investmentAnalysis.investmentScore} />
          </>
        ) : null}
        {investmentAnalysis?.marketGap != null ? (
          <>
            <Divider variant="section" />
            <MarketGapSection marketGap={investmentAnalysis.marketGap} />
          </>
        ) : null}
        {investmentAnalysis?.bidPriceGuide != null ? (
          <>
            <Divider variant="section" />
            <BidPriceGuideSection guide={investmentAnalysis.bidPriceGuide} />
          </>
        ) : null}

        {recentTrades.length > 0 ? (
          <>
            <Divider variant="section" />
            <View
              style={[styles.section, { backgroundColor: theme.bg.surface }]}
            >
              <Text
                style={[styles.sectionTitle, { color: theme.text.primary }]}
              >
                주변 실거래가
              </Text>
              {recentTrades.map((trade, index) => (
                <TradeRow key={`${trade.dealYear}-${trade.dealMonth}-${index}`} trade={trade} />
              ))}
            </View>
          </>
        ) : null}

        <Divider variant="section" />

        <View
          style={[
            styles.section,
            styles.lastSection,
            { backgroundColor: theme.bg.surface },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>
            유찰 이력
          </Text>
          {auction.failedBids === 0 ? (
            <Text style={[styles.emptyText, { color: theme.text.tertiary }]}>
              유찰 이력이 없습니다.
            </Text>
          ) : (
            Array.from({ length: auction.failedBids }, (_, i) => (
              <View key={i} style={styles.historyRow}>
                <Text
                  style={[styles.historyLabel, { color: theme.text.secondary }]}
                >
                  {auction.failedBids - i}차
                </Text>
                <Badge label="유찰" variant="danger" />
              </View>
            ))
          )}
        </View>
      </ScrollView>

      <View
        style={[
          styles.bottomBar,
          {
            backgroundColor: theme.bg.surface,
            borderTopColor: theme.border.default,
          },
        ]}
      >
        <View style={styles.priceArea}>
          <Text style={[styles.bidLabel, { color: theme.text.secondary }]}>
            최저입찰가
          </Text>
          <Text style={[styles.bidPrice, { color: theme.text.primary }]}>
            {formatPrice(auction.minimumBid)}
          </Text>
        </View>
        <Pressable
          style={[styles.ctaButton, { backgroundColor: theme.brand.primary }]}
          onPress={handleFavorite}
        >
          <Ionicons
            name={isFavorited ? "heart" : "heart-outline"}
            size={18}
            color={theme.brand.onPrimary}
          />
          <Text style={[styles.ctaText, { color: theme.brand.onPrimary }]}>
            {isFavorited ? "관심 해제" : "관심 등록"}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing.section,
    gap: Spacing.md,
  },
  navPlaceholder: {
    width: 24,
  },
  notFoundText: {
    fontSize: FontSize.lg,
    fontFamily: FontFamily.bold,
    marginTop: Spacing.sm,
  },
  errorMessage: {
    fontSize: FontSize.sm,
    textAlign: "center",
  },
  retryButton: {
    marginTop: Spacing.lg,
    paddingHorizontal: Spacing.section,
    paddingVertical: Spacing.xl,
    borderRadius: Radius.lg,
  },
  retryButtonDisabled: {
    opacity: 0.6,
  },
  retryButtonText: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.bold,
  },
  navBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.page,
    paddingVertical: Spacing.xl,
    gap: Spacing.xl,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  navTitle: {
    flex: 1,
    fontSize: FontSize.xl,
    fontFamily: FontFamily.bold,
  },
  scroll: {
    flex: 1,
  },
  section: {
    padding: Spacing.xxl,
    gap: Spacing.xl,
  },
  lastSection: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontFamily: FontFamily.bold,
    marginBottom: Spacing.xs,
  },
  infoRow: {
    flexDirection: "row",
    gap: Spacing.xl,
  },
  infoLabel: {
    fontSize: FontSize.md,
    width: 80,
    flexShrink: 0,
  },
  infoValue: {
    flex: 1,
    fontSize: FontSize.md,
    fontFamily: FontFamily.medium,
  },
  infoValueWrap: {
    flex: 1,
    gap: Spacing.sm,
  },
  addressRows: {
    gap: Spacing.xxs,
  },
  addressRowText: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.medium,
    lineHeight: 20,
  },
  addressToggle: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    alignSelf: "flex-start",
  },
  addressToggleText: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.semibold,
  },
  historyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.lg,
  },
  historyLabel: {
    fontSize: FontSize.md,
    width: 30,
  },
  emptyText: {
    fontSize: FontSize.md,
  },
  tradeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Spacing.sm,
  },
  tradeInfo: {
    flex: 1,
    gap: 2,
    marginRight: Spacing.lg,
  },
  tradeDate: {
    fontSize: FontSize.xs,
  },
  tradeAddress: {
    fontSize: FontSize.sm,
  },
  tradeRight: {
    alignItems: "flex-end",
    gap: 2,
  },
  tradePrice: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.bold,
  },
  tradeArea: {
    fontSize: FontSize.xs,
  },
  bottomBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.page,
    paddingVertical: Spacing.xl,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: Spacing.xl,
  },
  priceArea: {
    flex: 1,
  },
  bidLabel: {
    fontSize: FontSize.xs,
  },
  bidPrice: {
    fontSize: FontSize.xxl,
    fontFamily: FontFamily.extrabold,
  },
  ctaButton: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: Radius.xl,
    paddingHorizontal: Spacing.xxxl,
    paddingVertical: Spacing.xl,
    gap: Spacing.sm,
  },
  ctaText: {
    fontSize: FontSize.lg,
    fontFamily: FontFamily.bold,
  },
  // Section header with badge
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.xs,
  },
  gradeBadge: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.sm,
  },
  gradeBadgeText: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.bold,
  },
  // Highlight card (market gap)
  highlightCard: {
    borderRadius: Radius.xl,
    padding: Spacing.xxl,
  },
  highlightRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  highlightItem: {
    flex: 1,
    alignItems: "center",
    gap: Spacing.xs,
  },
  highlightDivider: {
    width: StyleSheet.hairlineWidth,
    height: 40,
    marginHorizontal: Spacing.xxl,
  },
  highlightLabel: {
    fontSize: FontSize.xs,
  },
  highlightValue: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.bold,
  },
  // Score chip
  scoreChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  scoreTotalText: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.bold,
  },
  scoreRatingText: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.semibold,
  },
  // Score bars
  scoreBarContainer: {
    gap: Spacing.lg,
  },
  scoreBarRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.lg,
  },
  scoreBarLabel: {
    fontSize: FontSize.sm,
    width: 60,
    flexShrink: 0,
  },
  scoreBarTrack: {
    flex: 1,
    height: 6,
    borderRadius: Radius.full,
    overflow: "hidden",
  },
  scoreBarFill: {
    height: "100%",
    borderRadius: Radius.full,
  },
  scoreBarValue: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.semibold,
    width: 24,
    textAlign: "right",
  },
  // Bid price guide
  bidGuideCard: {
    borderRadius: Radius.xl,
    padding: Spacing.xxl,
  },
  bidGuideRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  bidGuideItem: {
    flex: 1,
    alignItems: "center",
    gap: Spacing.xs,
  },
  bidGuideDivider: {
    width: StyleSheet.hairlineWidth,
    height: 40,
    marginHorizontal: Spacing.sm,
  },
  bidGuideLabel: {
    fontSize: FontSize.xs,
  },
  bidGuideValue: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.bold,
    textAlign: "center",
  },
  guidanceBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.sm,
    padding: Spacing.xl,
    borderRadius: Radius.lg,
    borderWidth: 1,
  },
  guidanceText: {
    flex: 1,
    fontSize: FontSize.sm,
    lineHeight: 18,
  },
});
