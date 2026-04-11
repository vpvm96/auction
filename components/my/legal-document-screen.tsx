import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import Markdown from "react-native-markdown-display";
import { SafeAreaView } from "react-native-safe-area-context";

import {
    FontFamily,
    FontSize,
    LineHeight,
    Radius,
    Spacing,
} from "@/constants/tokens";
import { useTheme } from "@/hooks/useTheme";
import type { LegalDocumentResponse } from "@/lib/api/legal";

interface LegalDocumentScreenProps {
  title: string;
  queryKey: string;
  queryFn: () => Promise<LegalDocumentResponse>;
}

export function LegalDocumentScreen({
  title,
  queryKey,
  queryFn,
}: LegalDocumentScreenProps) {
  const theme = useTheme();
  const markdownStyles = StyleSheet.create(createMarkdownStyles(theme));

  const documentQuery = useQuery({
    queryKey: ["legal-document", queryKey],
    queryFn,
  });

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: theme.bg.base }]}
      edges={["top"]}
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
        <Pressable
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="뒤로 가기"
          onPress={() => router.back()}
          hitSlop={8}
        >
          <Ionicons name="arrow-back" size={24} color={theme.text.primary} />
        </Pressable>
        <Text style={[styles.navTitle, { color: theme.text.primary }]}>
          {title}
        </Text>
        <View style={styles.navSpacer} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {documentQuery.isLoading ? (
          <View style={styles.stateCard}>
            <ActivityIndicator color={theme.brand.primary} />
            <Text style={[styles.stateText, { color: theme.text.secondary }]}>
              문서를 불러오는 중입니다.
            </Text>
          </View>
        ) : documentQuery.isError ? (
          <View
            style={[styles.stateCard, { borderColor: theme.border.default }]}
          >
            <Text style={[styles.errorText, { color: theme.status.danger }]}>
              문서를 불러오지 못했습니다.
            </Text>
            <Pressable
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="문서 다시 시도"
              style={[
                styles.retryButton,
                { borderColor: theme.border.default },
              ]}
              onPress={() => documentQuery.refetch()}
            >
              <Text
                style={[
                  styles.retryButtonText,
                  { color: theme.text.secondary },
                ]}
              >
                다시 시도
              </Text>
            </Pressable>
          </View>
        ) : documentQuery.data != null ? (
          <View
            style={[
              styles.documentShell,
              { backgroundColor: theme.bg.surface },
            ]}
          >
            <View
              style={[
                styles.metaCard,
                {
                  borderColor: theme.border.default,
                  backgroundColor: theme.bg.base,
                },
              ]}
            >
              <View style={styles.metaRow}>
                <Text
                  style={[styles.metaLabel, { color: theme.text.secondary }]}
                >
                  버전
                </Text>
                <Text style={[styles.metaValue, { color: theme.text.primary }]}>
                  {documentQuery.data.version}
                </Text>
              </View>
              <View
                style={[
                  styles.metaDivider,
                  { backgroundColor: theme.border.default },
                ]}
              />
              <View style={styles.metaRow}>
                <Text
                  style={[styles.metaLabel, { color: theme.text.secondary }]}
                >
                  시행일
                </Text>
                <Text style={[styles.metaValue, { color: theme.text.primary }]}>
                  {documentQuery.data.effectiveDate}
                </Text>
              </View>
            </View>

            <View style={styles.bodyCard}>
              <Text style={[styles.bodyLabel, { color: theme.text.secondary }]}>
                문서 내용
              </Text>
              <View
                style={[
                  styles.markdownCard,
                  {
                    borderColor: theme.border.default,
                    backgroundColor: theme.bg.base,
                  },
                ]}
              >
                <Markdown style={markdownStyles}>
                  {documentQuery.data.content}
                </Markdown>
              </View>
            </View>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

function createMarkdownStyles(theme: ReturnType<typeof useTheme>) {
  return {
    body: {
      color: theme.text.primary,
      fontSize: FontSize.sm,
      lineHeight: LineHeight.relaxed,
    },
    heading1: {
      color: theme.text.primary,
      fontSize: FontSize.display,
      fontFamily: FontFamily.bold,
      marginBottom: Spacing.md,
      marginTop: 0,
    },
    heading2: {
      color: theme.text.primary,
      fontSize: FontSize.xxl,
      fontFamily: FontFamily.bold,
      marginBottom: Spacing.sm,
      marginTop: Spacing.lg,
    },
    heading3: {
      color: theme.text.primary,
      fontSize: FontSize.xl,
      fontFamily: FontFamily.bold,
      marginBottom: Spacing.xs,
      marginTop: Spacing.md,
    },
    paragraph: {
      color: theme.text.primary,
      fontSize: FontSize.sm,
      lineHeight: LineHeight.relaxed,
      marginTop: 0,
      marginBottom: Spacing.md,
    },
    strong: {
      color: theme.text.primary,
      fontFamily: FontFamily.bold,
    },
    em: {
      color: theme.text.primary,
      fontStyle: "italic" as const,
    },
    bullet_list: {
      marginBottom: Spacing.md,
    },
    ordered_list: {
      marginBottom: Spacing.md,
    },
    list_item: {
      flexDirection: "row" as const,
      alignItems: "flex-start" as const,
      marginBottom: Spacing.xs,
    },
    bullet_list_icon: {
      marginLeft: 0,
      marginRight: Spacing.sm,
      color: theme.text.secondary,
    },
    bullet_list_content: {
      flex: 1,
      color: theme.text.primary,
    },
    ordered_list_icon: {
      marginLeft: 0,
      marginRight: Spacing.sm,
      color: theme.text.secondary,
    },
    ordered_list_content: {
      flex: 1,
      color: theme.text.primary,
    },
    blockquote: {
      backgroundColor: theme.bg.sunken,
      borderLeftWidth: 3,
      borderLeftColor: theme.border.default,
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.sm,
      marginBottom: Spacing.md,
    },
    code_inline: {
      backgroundColor: theme.bg.sunken,
      color: theme.text.primary,
      fontFamily: FontFamily.medium,
      paddingHorizontal: 4,
      paddingVertical: 2,
      borderRadius: Radius.sm,
    },
    code_block: {
      backgroundColor: theme.bg.sunken,
      color: theme.text.primary,
      fontFamily: FontFamily.medium,
      padding: Spacing.md,
      borderRadius: Radius.md,
      overflow: "hidden" as const,
    },
    fence: {
      backgroundColor: theme.bg.sunken,
      color: theme.text.primary,
      fontFamily: FontFamily.medium,
      padding: Spacing.md,
      borderRadius: Radius.md,
      overflow: "hidden" as const,
    },
    table: {
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.border.default,
      borderRadius: Radius.md,
      marginBottom: Spacing.md,
      overflow: "hidden" as const,
    },
    thead: {
      backgroundColor: theme.bg.sunken,
    },
    tbody: {},
    th: {
      paddingHorizontal: Spacing.sm,
      paddingVertical: Spacing.sm,
      borderRightWidth: StyleSheet.hairlineWidth,
      borderRightColor: theme.border.default,
      flex: 1,
    },
    tr: {
      flexDirection: "row" as const,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.border.default,
    },
    td: {
      paddingHorizontal: Spacing.sm,
      paddingVertical: Spacing.sm,
      borderRightWidth: StyleSheet.hairlineWidth,
      borderRightColor: theme.border.default,
      flex: 1,
    },
    link: {
      color: theme.brand.primary,
      textDecorationLine: "underline" as const,
    },
  };
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  navBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.page,
    paddingVertical: Spacing.xl,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  navTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: FontSize.xl,
    fontFamily: FontFamily.bold,
    marginHorizontal: Spacing.xl,
  },
  navSpacer: {
    width: 24,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing.section,
  },
  stateCard: {
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.md,
    paddingVertical: Spacing.section,
    paddingHorizontal: Spacing.page,
  },
  stateText: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.regular,
    textAlign: "center",
  },
  errorText: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.medium,
    textAlign: "center",
  },
  retryButton: {
    marginTop: Spacing.md,
    paddingHorizontal: Spacing.xl,
    paddingVertical: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: Radius.md,
  },
  retryButtonText: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.medium,
  },
  documentShell: {
    paddingHorizontal: Spacing.page,
    paddingTop: Spacing.xxl,
    paddingBottom: Spacing.section,
    gap: Spacing.xl,
  },
  metaCard: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: Radius.lg,
    overflow: "hidden",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.xl,
    paddingVertical: 14,
  },
  metaLabel: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.regular,
  },
  metaValue: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.medium,
  },
  metaDivider: {
    height: StyleSheet.hairlineWidth,
  },
  bodyCard: {
    gap: Spacing.md,
  },
  bodyLabel: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.medium,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  markdownCard: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: Radius.lg,
    padding: Spacing.xl,
  },
});
