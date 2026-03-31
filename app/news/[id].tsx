import { ScrollView, StyleSheet, Text, View, Pressable } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useLocalSearchParams, router } from 'expo-router'
import { FontFamily, FontSize, LineHeight, Spacing } from '@/constants/tokens'
import { Badge } from '@/components/ui/badge'
import { Divider } from '@/components/ui/divider'
import { MOCK_NEWS_ARTICLES } from '@/lib/mock-data'
import { formatFullDate } from '@/lib/format'
import { useTheme } from '@/hooks/useTheme'

export default function NewsDetailScreen() {
  const theme = useTheme()
  const { id } = useLocalSearchParams<{ id: string }>()
  const article = MOCK_NEWS_ARTICLES.find((a) => a.id === id)

  if (article == null) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.bg.surface }]} edges={['top', 'bottom']}>
        <View style={[styles.navBar, { borderBottomColor: theme.border.default }]}>
          <Pressable onPress={() => router.back()} hitSlop={8}>
            <Ionicons name="arrow-back" size={24} color={theme.text.primary} />
          </Pressable>
        </View>
        <View style={styles.emptyState}>
          <Text style={[styles.emptyText, { color: theme.text.secondary }]}>기사를 찾을 수 없습니다.</Text>
        </View>
      </SafeAreaView>
    )
  }

  const paragraphs = article.body.split('\n\n')

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg.base }]} edges={['top', 'bottom']}>
      <View style={[styles.navBar, { backgroundColor: theme.bg.surface, borderBottomColor: theme.border.default }]}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="arrow-back" size={24} color={theme.text.primary} />
        </Pressable>
        <Text style={[styles.navTitle, { color: theme.text.primary }]} numberOfLines={1}>
          {article.category}
        </Text>
        <View style={styles.navSpacer} />
      </View>

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={[styles.headerSection, { backgroundColor: theme.bg.surface }]}>
          <Badge label={article.category} />
          <Text style={[styles.title, { color: theme.text.primary }]}>{article.title}</Text>
          <View style={styles.metaRow}>
            <Text style={[styles.metaText, { color: theme.text.tertiary }]}>{formatFullDate(article.date)}</Text>
            <Text style={[styles.metaDot, { color: theme.text.tertiary }]}>·</Text>
            <Text style={[styles.metaText, { color: theme.text.tertiary }]}>{article.source}</Text>
          </View>
        </View>

        <Divider variant="section" />

        <View style={[styles.bodySection, { backgroundColor: theme.bg.surface }]}>
          {paragraphs.map((paragraph, index) => (
            <Text key={index} style={[styles.bodyText, { color: theme.text.primary }]}>
              {paragraph}
            </Text>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.page,
    paddingVertical: Spacing.xl,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  navTitle: {
    flex: 1,
    textAlign: 'center',
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
  headerSection: {
    paddingHorizontal: Spacing.page,
    paddingTop: Spacing.xxl,
    paddingBottom: Spacing.xxl,
    gap: Spacing.xl,
  },
  title: {
    fontSize: FontSize.xxl,
    fontFamily: FontFamily.bold,
    lineHeight: LineHeight.relaxed,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  metaText: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.regular,
  },
  metaDot: {
    fontSize: FontSize.sm,
  },
  bodySection: {
    paddingHorizontal: Spacing.page,
    paddingVertical: Spacing.xxl,
    gap: Spacing.xxl,
  },
  bodyText: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.regular,
    lineHeight: LineHeight.relaxed,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.regular,
  },
})
