import {
  FontFamily,
  FontSize,
  LineHeight,
  Radius,
  Spacing,
} from "@/constants/tokens";
import { useTheme } from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

export function QuizBanner() {
  const theme = useTheme();

  const handlePress = () => {
    router.push("/quiz");
  };

  return (
    <Pressable
      accessible
      accessibilityRole="button"
      accessibilityLabel="오늘의 경매 퀴즈 풀러가기"
      onPress={handlePress}
      style={({ pressed }) => [
        styles.container,
        {
          backgroundColor: theme.brand.primaryLight,
          borderColor: theme.border.brand,
          opacity: pressed ? 0.92 : 1,
        },
      ]}
    >
      <View
        pointerEvents="none"
        style={[
          styles.glyphOuter,
          { borderColor: theme.brand.primary, opacity: 0.12 },
        ]}
      />
      <View
        pointerEvents="none"
        style={[
          styles.glyphInner,
          { backgroundColor: theme.brand.primary, opacity: 0.08 },
        ]}
      />
      <Text
        pointerEvents="none"
        style={[styles.glyphQ, { color: theme.brand.primary }]}
      >
        Q
      </Text>

      <View style={styles.content}>
        <View
          style={[
            styles.chip,
            { backgroundColor: theme.bg.surface },
          ]}
        >
          <Ionicons
            name="bulb"
            size={12}
            color={theme.brand.primary}
          />
          <Text style={[styles.chipText, { color: theme.text.brand }]}>
            오늘의 경매 퀴즈
          </Text>
        </View>

        <Text style={[styles.title, { color: theme.text.primary }]}>
          {"하루 3문제,\n경매 감각 키우기"}
        </Text>

        <View style={styles.footer}>
          <Text style={[styles.footerMeta, { color: theme.text.secondary }]}>
            약 1분 소요
          </Text>
          <View
            style={[styles.cta, { backgroundColor: theme.brand.primary }]}
          >
            <Text style={[styles.ctaText, { color: theme.brand.onPrimary }]}>
              지금 풀기
            </Text>
            <Ionicons
              name="arrow-forward"
              size={14}
              color={theme.brand.onPrimary}
            />
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: Radius.xl,
    marginHorizontal: Spacing.page,
    marginBottom: Spacing.xl,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
  },
  content: {
    padding: Spacing.xxxl,
    gap: Spacing.xl,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: Spacing.xs,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xxs,
    borderRadius: Radius.pill,
  },
  chipText: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.bold,
  },
  title: {
    fontSize: FontSize.display,
    fontFamily: FontFamily.extrabold,
    lineHeight: LineHeight.relaxed,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: Spacing.xs,
  },
  footerMeta: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.medium,
  },
  cta: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: Radius.pill,
  },
  ctaText: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.bold,
  },
  glyphQ: {
    position: "absolute",
    right: -16,
    top: -32,
    fontSize: 220,
    fontFamily: FontFamily.extrabold,
    opacity: 0.06,
    includeFontPadding: false,
  },
  glyphOuter: {
    position: "absolute",
    right: -40,
    bottom: -40,
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 2,
  },
  glyphInner: {
    position: "absolute",
    right: -10,
    bottom: 24,
    width: 70,
    height: 70,
    borderRadius: 35,
  },
});
