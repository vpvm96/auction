import {
    FontFamily,
    FontSize,
    LineHeight,
    Radius,
    Spacing,
} from "@/constants/tokens";
import { useTheme } from "@/hooks/useTheme";
import { Pressable, StyleSheet, Text, View } from "react-native";

export function QuizBanner() {
  const theme = useTheme();

  return (
    <View
      style={[styles.container, { backgroundColor: theme.brand.primarySubtle }]}
    >
      <View style={styles.content}>
        <View style={styles.textArea}>
          <Text style={[styles.subtitle, { color: theme.brand.primary }]}>
            오늘의 경매퀴즈
          </Text>
          <Text style={[styles.title, { color: theme.text.primary }]}>
            {"퀴즈 풀고\n경매 지식 쌓고!"}
          </Text>
          <Pressable
            accessible={true}
            accessibilityLabel="퀴즈 풀러가기"
            accessibilityRole="button"
            style={[styles.button, { backgroundColor: theme.brand.primary }]}
          >
            <Text style={[styles.buttonText, { color: theme.brand.onPrimary }]}>
              퀴즈 풀러가기
            </Text>
          </Pressable>
        </View>
        <View style={styles.decorArea}>
          <View
            style={[
              styles.quizCard,
              { backgroundColor: theme.bg.elevated },
              theme.shadow.md,
            ]}
          >
            <Text
              style={[styles.quizCardLabel, { color: theme.text.secondary }]}
            >
              Q.문제
            </Text>
            <Text style={[styles.quizCardText, { color: theme.text.primary }]}>
              {"법률상 의무를 강제할 수 있는\n관계를 뜻하는 말은?"}
            </Text>
            <View
              style={[
                styles.quizOption,
                { backgroundColor: theme.border.default },
              ]}
            >
              <Text
                style={[styles.quizOptionText, { color: theme.text.secondary }]}
              >
                채무관계
              </Text>
            </View>
            <View
              style={[
                styles.quizOption,
                { backgroundColor: theme.status.success },
              ]}
            >
              <Text
                style={[
                  styles.quizOptionText,
                  { color: "#FFFFFF", fontFamily: FontFamily.bold },
                ]}
              >
                권리관계
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: Radius.xl,
    marginHorizontal: Spacing.page,
    marginBottom: Spacing.xl,
    overflow: "hidden",
  },
  content: {
    flexDirection: "row",
    padding: Spacing.xxxl,
    alignItems: "center",
  },
  textArea: {
    flex: 1,
    gap: Spacing.md,
  },
  subtitle: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.semibold,
  },
  title: {
    fontSize: FontSize.display,
    fontFamily: FontFamily.extrabold,
    lineHeight: LineHeight.relaxed,
  },
  button: {
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.lg,
    alignSelf: "flex-start",
    marginTop: Spacing.xs,
  },
  buttonText: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.bold,
  },
  decorArea: {
    width: 140,
    alignItems: "flex-end",
  },
  quizCard: {
    borderRadius: Radius.lg,
    padding: Spacing.xl,
    width: 130,
    gap: Spacing.sm,
  },
  quizCardLabel: {
    fontSize: FontSize.xxs,
    fontFamily: FontFamily.semibold,
  },
  quizCardText: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.semibold,
    lineHeight: LineHeight.tight,
  },
  quizOption: {
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  quizOptionText: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.medium,
    textAlign: "center",
  },
});
