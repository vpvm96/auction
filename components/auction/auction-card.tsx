import {
    FontFamily,
    FontSize,
    HIT_SLOP,
    Radius,
    Spacing,
} from "@/constants/tokens";
import { useTheme } from "@/hooks/useTheme";
import { formatPrice, formatShortDate } from "@/lib/format";
import type { AuctionItem } from "@/lib/mock-data";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Image, type ImageSource } from "expo-image";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

const EMPTY_IMAGE = require("@/assets/images/empty/auction_empty_image.webp");

interface AuctionCardProps {
  id: string;
  type: AuctionItem["type"];
  title: string;
  address: string;
  auctionDate: string;
  appraisalPrice: number;
  minimumBid: number;
  bidRatio: number;
  failedBids: number;
  area: number;
  thumbnailUrl: string;
  isFavorited: boolean;
  onToggleFavorite: (id: string) => void;
  /** 투자등급 (A+, A, B, C 등) */
  investmentRating?: string;
  /** 시세 괴리율 — 음수 = 시세보다 저렴 */
  marketGapRate?: number;
  /** 최근 실거래가 (원) */
  latestTradeAmount?: number;
}

export function AuctionCard({
  id,
  title,
  address,
  auctionDate,
  appraisalPrice,
  minimumBid,
  bidRatio,
  failedBids,
  area,
  thumbnailUrl,
  isFavorited,
  onToggleFavorite,
  investmentRating,
  marketGapRate,
  latestTradeAmount,
}: AuctionCardProps) {
  const theme = useTheme();

  const handlePress = () => {
    router.push(`/${id}`);
  };

  const handleFavorite = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onToggleFavorite(id);
  };

  // 입찰률 색상: 100% 이상 hot, 80% 이상 warning, 그 외 primary
  const ratioColor =
    bidRatio >= 100
      ? theme.auction.hot
      : bidRatio >= 80
        ? theme.status.warning
        : theme.brand.primary;
  const ratioTrackColor =
    bidRatio >= 100
      ? theme.auction.hotBg
      : bidRatio >= 80
        ? theme.status.warningBg
        : theme.brand.primaryLight;
  // 바 너비는 최대 100%로 클램프
  const barWidth = `${Math.min(bidRatio, 100)}%` as const;

  // 투자등급 뱃지 색상
  const ratingColor =
    investmentRating === "A+" || investmentRating === "S"
      ? theme.status.success
      : investmentRating === "A"
        ? theme.brand.primary
        : investmentRating === "B"
          ? theme.status.warning
          : theme.text.tertiary;
  const ratingBg =
    investmentRating === "A+" || investmentRating === "S"
      ? theme.status.successBg
      : investmentRating === "A"
        ? theme.brand.primaryLight
        : investmentRating === "B"
          ? theme.status.warningBg
          : theme.border.subtle;

  // 시세 괴리율 표시
  const gapLabel =
    marketGapRate != null
      ? `시세 ${marketGapRate > 0 ? "+" : ""}${marketGapRate.toFixed(1)}%`
      : null;
  const gapColor =
    marketGapRate != null && marketGapRate < 0
      ? theme.status.success
      : theme.text.tertiary;

  return (
    <Pressable
      accessible={true}
      accessibilityLabel={`${title}, ${address}, 최저입찰가 ${formatPrice(minimumBid)}`}
      accessibilityHint={`입찰률 ${bidRatio}%, ${failedBids > 0 ? `${failedBids}회 유찰` : "첫 경매"}`}
      style={[
        styles.container,
        {
          backgroundColor: theme.bg.surface,
          borderColor: theme.border.default,
        },
        theme.shadow.sm,
      ]}
      onPress={handlePress}
    >
      {/* 썸네일 */}
      <View style={styles.thumbnailWrap}>
        <Image
          source={
            thumbnailUrl ? ({ uri: thumbnailUrl } as ImageSource) : EMPTY_IMAGE
          }
          style={styles.thumbnail}
          contentFit="cover"
          transition={200}
        />
        {failedBids > 0 ? (
          <View
            style={[
              styles.failedBadgeOverlay,
              { backgroundColor: theme.auction.hot },
            ]}
          >
            <Text style={styles.failedBadgeText}>{failedBids}회 유찰</Text>
          </View>
        ) : null}
      </View>

      {/* 정보 영역 */}
      <View style={styles.info}>
        {/* 상단: 제목 + 투자등급 + 찜 버튼 */}
        <View style={styles.topRow}>
          <Text
            style={[styles.title, { color: theme.text.primary }]}
            numberOfLines={1}
          >
            {title}
          </Text>
          {investmentRating != null ? (
            <View
              style={[
                styles.ratingBadge,
                { backgroundColor: ratingBg },
              ]}
            >
              <Text style={[styles.ratingBadgeText, { color: ratingColor }]}>
                {investmentRating}
              </Text>
            </View>
          ) : null}
          <Pressable
            onPress={handleFavorite}
            hitSlop={HIT_SLOP}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={isFavorited ? "찜 해제" : "찜하기"}
            accessibilityHint={`${title} ${isFavorited ? "찜 해제하기" : "찜하기"}`}
          >
            <Ionicons
              name={isFavorited ? "heart" : "heart-outline"}
              size={20}
              color={isFavorited ? theme.auction.hot : theme.text.tertiary}
            />
          </Pressable>
        </View>

        {/* 주소 */}
        <Text
          style={[styles.address, { color: theme.text.secondary }]}
          numberOfLines={1}
        >
          {address}
        </Text>

        {/* 최저 입찰가 */}
        <Text style={[styles.minimumBid, { color: theme.text.primary }]}>
          {formatPrice(minimumBid)}
        </Text>

        {/* 입찰률 프로그레스 바 */}
        <View style={styles.ratioRow}>
          <View style={[styles.barTrack, { backgroundColor: ratioTrackColor }]}>
            <View
              style={[
                styles.barFill,
                { width: barWidth, backgroundColor: ratioColor },
              ]}
            />
          </View>
          <Text style={[styles.ratioLabel, { color: ratioColor }]}>
            {bidRatio}%
          </Text>
        </View>

        {/* 시세 괴리율 */}
        {gapLabel != null ? (
          <Text style={[styles.gapRate, { color: gapColor }]}>
            {gapLabel}
          </Text>
        ) : null}

        {/* 감정가 · 최근 실거래가 */}
        <View style={styles.priceInfoRow}>
          <Text style={[styles.appraisalPrice, { color: theme.text.tertiary }]}>
            감정가 {formatPrice(appraisalPrice)}
          </Text>
          {latestTradeAmount != null && latestTradeAmount > 0 ? (
            <Text style={[styles.appraisalPrice, { color: theme.text.tertiary }]}>
              {" · "}
              실거래 {formatPrice(latestTradeAmount)}
            </Text>
          ) : null}
        </View>

        {/* 메타 정보: 일자 + 면적 */}
        <View style={styles.metaRow}>
          <View
            style={styles.metaItem}
            accessible={true}
            accessibilityLabel={`경매 일자 ${formatShortDate(auctionDate)}`}
          >
            <Ionicons
              name="calendar-outline"
              size={11}
              color={theme.text.tertiary}
            />
            <Text style={[styles.metaText, { color: theme.text.tertiary }]}>
              {formatShortDate(auctionDate)}
            </Text>
          </View>
          {area > 0 ? (
            <View
              style={styles.metaItem}
              accessible={true}
              accessibilityLabel={`면적 ${area}㎡`}
            >
              <Ionicons
                name="expand-outline"
                size={11}
                color={theme.text.tertiary}
              />
              <Text style={[styles.metaText, { color: theme.text.tertiary }]}>
                {area}㎡
              </Text>
            </View>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderRadius: Radius.xl,
    borderWidth: StyleSheet.hairlineWidth,
    marginHorizontal: Spacing.page,
    marginBottom: Spacing.xl,
    overflow: "hidden",
    padding: Spacing.xl,
    gap: Spacing.xl,
  },
  thumbnailWrap: {
    position: "relative",
  },
  thumbnail: {
    width: 96,
    height: 96,
    borderRadius: Radius.lg,
  },
  failedBadgeOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderBottomLeftRadius: Radius.lg,
    borderBottomRightRadius: Radius.lg,
    paddingVertical: 4,
    alignItems: "center",
  },
  failedBadgeText: {
    fontSize: FontSize.xxs,
    fontFamily: FontFamily.bold,
    color: "#FFFFFF",
  },
  info: {
    flex: 1,
    gap: Spacing.xs,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: Spacing.xs,
  },
  title: {
    flex: 1,
    fontSize: FontSize.base,
    fontFamily: FontFamily.bold,
  },
  address: {
    fontSize: FontSize.sm,
  },
  minimumBid: {
    fontSize: FontSize.xl,
    fontFamily: FontFamily.extrabold,
    marginTop: Spacing.xxs,
  },
  ratioRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  barTrack: {
    flex: 1,
    height: 5,
    borderRadius: Radius.full,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: Radius.full,
  },
  ratioLabel: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.bold,
    minWidth: 32,
    textAlign: "right",
  },
  ratingBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: Radius.sm,
  },
  ratingBadgeText: {
    fontSize: FontSize.xxs,
    fontFamily: FontFamily.bold,
  },
  gapRate: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.semibold,
  },
  priceInfoRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
  },
  appraisalPrice: {
    fontSize: FontSize.xs,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    marginTop: Spacing.xxs,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xxs,
  },
  metaText: {
    fontSize: FontSize.xs,
  },
});
