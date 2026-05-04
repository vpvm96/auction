import {
  FontFamily,
  FontSize,
  Radius,
  Spacing,
} from "@/constants/tokens";
import { useTheme } from "@/hooks/useTheme";
import type { ColorTheme } from "@/constants/theme";
import { formatShortDate } from "@/lib/format";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface InstitutionAuctionCardProps {
  id: number;
  /** 공고명 */
  plnmNm: string;
  /** 공고기관명 */
  orgNm: string;
  /** 카테고리 전체 명 */
  ctgrFullNm: string;
  /** 입찰 시작 */
  pbctBegnDtm: string;
  /** 입찰 마감 */
  pbctClsDtm: string;
  /** 입찰 방법 */
  bidMtdNm: string;
}

type IoniconName = React.ComponentProps<typeof Ionicons>["name"];

function pickCategoryIcon(ctgrFullNm: string): IoniconName {
  if (ctgrFullNm.includes("아파트") || ctgrFullNm.includes("오피스텔"))
    return "business";
  if (
    ctgrFullNm.includes("주택") ||
    ctgrFullNm.includes("다가구") ||
    ctgrFullNm.includes("단독")
  )
    return "home";
  if (
    ctgrFullNm.includes("상가") ||
    ctgrFullNm.includes("점포") ||
    ctgrFullNm.includes("근린")
  )
    return "storefront";
  if (ctgrFullNm.includes("토지") || ctgrFullNm.includes("임야")) return "leaf";
  if (ctgrFullNm.includes("자동차") || ctgrFullNm.includes("차량"))
    return "car-sport";
  if (
    ctgrFullNm.includes("중기") ||
    ctgrFullNm.includes("건설기계") ||
    ctgrFullNm.includes("기계")
  )
    return "construct";
  return "cube";
}

interface BidStatus {
  label: string;
  /** 헤드라인 색상 (큰 D-day 텍스트) */
  color: string;
  /** 진행 바 채움 색상 */
  barColor: string;
  /** 진행 바 트랙 색상 */
  trackColor: string;
  /** 0–100, 입찰 기간 진행률 */
  progress: number;
  /** D-day 뱃지 배경 (썸네일 오버레이) */
  badgeBg: string;
}

function getBidStatus(
  beginIso: string,
  closeIso: string,
  theme: ColorTheme,
): BidStatus {
  const now = Date.now();
  const begin = new Date(beginIso).getTime();
  const close = new Date(closeIso).getTime();
  const dayMs = 1000 * 60 * 60 * 24;

  if (Number.isNaN(begin) || Number.isNaN(close)) {
    return {
      label: "일정 미정",
      color: theme.text.tertiary,
      barColor: theme.text.tertiary,
      trackColor: theme.border.subtle,
      progress: 0,
      badgeBg: theme.auction.closed,
    };
  }

  if (now < begin) {
    const daysToBegin = Math.max(0, Math.ceil((begin - now) / dayMs));
    return {
      label: daysToBegin === 0 ? "오늘 시작" : `시작 D-${daysToBegin}`,
      color: theme.auction.upcoming,
      barColor: theme.auction.upcoming,
      trackColor: theme.auction.upcomingBg,
      progress: 0,
      badgeBg: theme.auction.upcoming,
    };
  }

  if (now >= close) {
    return {
      label: "마감",
      color: theme.text.tertiary,
      barColor: theme.auction.closed,
      trackColor: theme.auction.closedBg,
      progress: 100,
      badgeBg: theme.auction.closed,
    };
  }

  const total = close - begin;
  const elapsed = now - begin;
  const progress = total > 0 ? Math.min(100, (elapsed / total) * 100) : 0;
  const daysLeft = Math.max(0, Math.ceil((close - now) / dayMs));

  const color =
    daysLeft <= 1
      ? theme.auction.hot
      : daysLeft <= 3
        ? theme.status.warning
        : theme.brand.primary;
  const trackColor =
    daysLeft <= 1
      ? theme.auction.hotBg
      : daysLeft <= 3
        ? theme.status.warningBg
        : theme.brand.primaryLight;

  return {
    label: daysLeft === 0 ? "오늘 마감" : `D-${daysLeft}`,
    color,
    barColor: color,
    trackColor,
    progress,
    badgeBg: color,
  };
}

export function InstitutionAuctionCard({
  id,
  plnmNm,
  orgNm,
  ctgrFullNm,
  pbctBegnDtm,
  pbctClsDtm,
  bidMtdNm,
}: InstitutionAuctionCardProps) {
  const theme = useTheme();
  const status = getBidStatus(pbctBegnDtm, pbctClsDtm, theme);
  const iconName = pickCategoryIcon(ctgrFullNm);
  const barWidth = `${Math.min(status.progress, 100)}%` as const;

  const handlePress = () => {
    router.push(`/institution/${id}`);
  };

  return (
    <Pressable
      accessible={true}
      accessibilityLabel={`${plnmNm}, 공고기관 ${orgNm}`}
      accessibilityHint={`${status.label}, 입찰 마감 ${formatShortDate(pbctClsDtm)}`}
      accessibilityRole="button"
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
      {/* 좌측 카테고리 아이콘 썸네일 */}
      <View style={styles.thumbnailWrap}>
        <View
          style={[
            styles.thumbnail,
            { backgroundColor: theme.brand.primaryLight },
          ]}
        >
          <Ionicons name={iconName} size={36} color={theme.brand.primary} />
        </View>
        <View
          style={[styles.dDayBadgeOverlay, { backgroundColor: status.badgeBg }]}
        >
          <Text style={styles.dDayBadgeText}>{status.label}</Text>
        </View>
      </View>

      {/* 정보 영역 */}
      <View style={styles.info}>
        {/* 상단: 제목 + 기관 태그 */}
        <View style={styles.topRow}>
          <Text
            style={[styles.title, { color: theme.text.primary }]}
            numberOfLines={1}
          >
            {plnmNm}
          </Text>
          <View
            style={[
              styles.orgBadge,
              { backgroundColor: theme.brand.primaryLight },
            ]}
          >
            <Text style={[styles.orgBadgeText, { color: theme.brand.primary }]}>
              기관
            </Text>
          </View>
        </View>

        {/* 공고 기관 */}
        <View style={styles.orgRow}>
          <Ionicons
            name="business-outline"
            size={12}
            color={theme.text.secondary}
          />
          <Text
            style={[styles.orgText, { color: theme.text.secondary }]}
            numberOfLines={1}
          >
            {orgNm}
          </Text>
        </View>

        {/* 헤드라인 D-day */}
        <Text style={[styles.headline, { color: status.color }]}>
          {status.label}
        </Text>

        {/* 입찰 기간 진행 바 */}
        <View style={styles.ratioRow}>
          <View
            style={[styles.barTrack, { backgroundColor: status.trackColor }]}
          >
            <View
              style={[
                styles.barFill,
                { width: barWidth, backgroundColor: status.barColor },
              ]}
            />
          </View>
          <Text style={[styles.ratioLabel, { color: status.color }]}>
            {Math.round(status.progress)}%
          </Text>
        </View>

        {/* 입찰 기간 텍스트 */}
        <Text style={[styles.subText, { color: theme.text.tertiary }]}>
          {formatShortDate(pbctBegnDtm)} ~ {formatShortDate(pbctClsDtm)}
        </Text>

        {/* 메타 정보: 카테고리 + 입찰방법 (1줄 고정) */}
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Ionicons
              name="pricetag-outline"
              size={11}
              color={theme.text.tertiary}
            />
            <Text
              style={[styles.metaText, { color: theme.text.tertiary }]}
              numberOfLines={1}
            >
              {ctgrFullNm}
            </Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons
              name="hammer-outline"
              size={11}
              color={theme.text.tertiary}
            />
            <Text
              style={[styles.metaText, { color: theme.text.tertiary }]}
              numberOfLines={1}
            >
              {bidMtdNm}
            </Text>
          </View>
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
    alignItems: "center",
    justifyContent: "center",
  },
  dDayBadgeOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderBottomLeftRadius: Radius.lg,
    borderBottomRightRadius: Radius.lg,
    paddingVertical: 4,
    alignItems: "center",
  },
  dDayBadgeText: {
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
  orgBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: Radius.sm,
  },
  orgBadgeText: {
    fontSize: FontSize.xxs,
    fontFamily: FontFamily.bold,
  },
  orgRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xxs,
  },
  orgText: {
    flex: 1,
    fontSize: FontSize.sm,
    fontFamily: FontFamily.medium,
  },
  headline: {
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
  subText: {
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
    flex: 1,
    minWidth: 0,
  },
  metaText: {
    fontSize: FontSize.xs,
    flex: 1,
  },
});
