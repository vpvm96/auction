import { Badge } from "@/components/ui/badge";
import { Divider } from "@/components/ui/divider";
import {
    FontFamily,
    FontSize,
    HIT_SLOP,
    Radius,
    Spacing,
} from "@/constants/tokens";
import { useTheme } from "@/hooks/useTheme";
import type { RealEstateTrade } from "@/lib/api/auctions";
import { toAuctionItem } from "@/lib/api/auctions";
import { formatFullDate, formatPrice } from "@/lib/format";
import { useAuctionDetail } from "@/lib/queries/auctions";
import { useFavoritesStore } from "@/lib/store/useFavoritesStore";
import { useRecentlyViewedStore } from "@/lib/store/useRecentlyViewedStore";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface InfoRowProps {
  label: string;
  value: string;
}

interface AddressInfoRowProps {
  label: string;
  value: string;
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
  trade: RealEstateTrade;
}

function TradeRow({ trade }: TradeRowProps) {
  const theme = useTheme();

  return (
    <View style={styles.tradeRow}>
      <View style={styles.tradeInfo}>
        <Text style={[styles.tradeDate, { color: theme.text.tertiary }]}>
          {trade.tradeDate}
        </Text>
        <Text
          style={[styles.tradeAddress, { color: theme.text.secondary }]}
          numberOfLines={1}
        >
          {trade.address}
        </Text>
      </View>
      <View style={styles.tradeRight}>
        <Text style={[styles.tradePrice, { color: theme.text.primary }]}>
          {formatPrice(trade.tradeAmount)}
        </Text>
        <Text style={[styles.tradeArea, { color: theme.text.tertiary }]}>
          {trade.area}㎡
        </Text>
      </View>
    </View>
  );
}

export default function DetailScreen() {
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const numericId = Number(id);
  const { data: rawItem, isLoading, isError } = useAuctionDetail(numericId);
  const auction = rawItem != null ? toAuctionItem(rawItem) : null;

  const isFavorited = useFavoritesStore((s) => s.favoriteIds.has(id ?? ""));
  const toggle = useFavoritesStore((s) => s.toggle);
  const addRecentlyViewed = useRecentlyViewedStore((s) => s.addId);

  useEffect(() => {
    if (id != null) {
      addRecentlyViewed(id);
    }
  }, [id, addRecentlyViewed]);

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
          <ActivityIndicator size="large" color={theme.brand.primary} />
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
            color={theme.text.tertiary}
          />
          <Text style={[styles.notFoundText, { color: theme.text.tertiary }]}>
            물건을 찾을 수 없습니다.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleFavorite = () => {
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
        <Image
          source={{ uri: auction.thumbnailUrl }}
          style={[styles.heroImage, { backgroundColor: theme.bg.sunken }]}
          contentFit="cover"
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

        {investmentAnalysis != null ? (
          <>
            <Divider variant="section" />
            <View
              style={[styles.section, { backgroundColor: theme.bg.surface }]}
            >
              <Text
                style={[styles.sectionTitle, { color: theme.text.primary }]}
              >
                투자 분석
              </Text>
              <InfoRow
                label="할인율"
                value={`${investmentAnalysis.discountRate}%`}
              />
              <InfoRow
                label="평당가"
                value={formatPrice(investmentAnalysis.pricePerArea)}
              />
              <InfoRow
                label="예상수익률"
                value={`${investmentAnalysis.estimatedYield}%`}
              />
            </View>
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
                <TradeRow key={`${trade.tradeDate}-${index}`} trade={trade} />
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
    gap: Spacing.xl,
  },
  navPlaceholder: {
    width: 24,
  },
  notFoundText: {
    fontSize: FontSize.md,
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
  heroImage: {
    width: "100%",
    height: 240,
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
});
