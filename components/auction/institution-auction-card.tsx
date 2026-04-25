import {
  FontFamily,
  FontSize,
  Radius,
  Spacing,
} from "@/constants/tokens";
import { useTheme } from "@/hooks/useTheme";
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

  const handlePress = () => {
    router.push(`/institution/${id}`);
  };

  return (
    <Pressable
      accessible={true}
      accessibilityLabel={`${plnmNm}, 공고기관 ${orgNm}`}
      accessibilityHint={`입찰 마감 ${formatShortDate(pbctClsDtm)}`}
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
      <View style={styles.headerRow}>
        <View
          style={[
            styles.tag,
            {
              backgroundColor: theme.brand.primaryLight,
            },
          ]}
        >
          <Text style={[styles.tagText, { color: theme.brand.primary }]}>
            기관
          </Text>
        </View>
        <Text
          style={[styles.category, { color: theme.text.tertiary }]}
          numberOfLines={1}
        >
          {ctgrFullNm}
        </Text>
      </View>

      <Text
        style={[styles.title, { color: theme.text.primary }]}
        numberOfLines={2}
      >
        {plnmNm}
      </Text>

      <View style={styles.orgRow}>
        <Ionicons
          name="business-outline"
          size={13}
          color={theme.text.secondary}
        />
        <Text
          style={[styles.orgText, { color: theme.text.secondary }]}
          numberOfLines={1}
        >
          {orgNm}
        </Text>
      </View>

      <View
        style={[styles.divider, { backgroundColor: theme.border.subtle }]}
      />

      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <Ionicons
            name="calendar-outline"
            size={12}
            color={theme.text.tertiary}
          />
          <Text style={[styles.metaText, { color: theme.text.tertiary }]}>
            {formatShortDate(pbctBegnDtm)} ~ {formatShortDate(pbctClsDtm)}
          </Text>
        </View>
        <View style={styles.metaItem}>
          <Ionicons
            name="hammer-outline"
            size={12}
            color={theme.text.tertiary}
          />
          <Text style={[styles.metaText, { color: theme.text.tertiary }]}>
            {bidMtdNm}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: Radius.xl,
    borderWidth: StyleSheet.hairlineWidth,
    marginHorizontal: Spacing.page,
    marginBottom: Spacing.xl,
    padding: Spacing.xl,
    gap: Spacing.sm,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  tag: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 2,
    borderRadius: Radius.sm,
  },
  tagText: {
    fontSize: FontSize.xxs,
    fontFamily: FontFamily.bold,
  },
  category: {
    flex: 1,
    fontSize: FontSize.xs,
  },
  title: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.bold,
    lineHeight: 22,
  },
  orgRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  orgText: {
    flex: 1,
    fontSize: FontSize.sm,
    fontFamily: FontFamily.medium,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginVertical: Spacing.xs,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: Spacing.lg,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  metaText: {
    fontSize: FontSize.xs,
  },
});
