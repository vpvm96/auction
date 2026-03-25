import { ScrollView, StyleSheet, Text, View, Pressable } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useLocalSearchParams, router } from 'expo-router'
import { Colors } from '@/constants/colors'
import { FontFamily, FontSize, LineHeight, Spacing } from '@/constants/tokens'
import { Badge } from '@/components/ui/badge'
import { Divider } from '@/components/ui/divider'
import { MOCK_NEWS_ARTICLES } from '@/lib/mock-data'
import { formatFullDate } from '@/lib/format'

export default function NewsDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const article = MOCK_NEWS_ARTICLES.find((a) => a.id === id)

  if (article == null) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.navBar}>
          <Pressable onPress={() => router.back()} hitSlop={8}>
            <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
          </Pressable>
        </View>
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>기사를 찾을 수 없습니다.</Text>
        </View>
      </SafeAreaView>
    )
  }

  const paragraphs = article.body.split('\n\n')

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.navBar}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </Pressable>
        <Text style={styles.navTitle} numberOfLines={1}>
          {article.category}
        </Text>
        <View style={styles.navSpacer} />
      </View>

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.headerSection}>
          <Badge label={article.category} />
          <Text style={styles.title}>{article.title}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.metaText}>{formatFullDate(article.date)}</Text>
            <Text style={styles.metaDot}>·</Text>
            <Text style={styles.metaText}>{article.source}</Text>
          </View>
        </View>

        <Divider variant="section" />

        <View style={styles.bodySection}>
          {paragraphs.map((paragraph, index) => (
            <Text key={index} style={styles.bodyText}>
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
    backgroundColor: Colors.background,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.page,
    paddingVertical: Spacing.xl,
    backgroundColor: Colors.card,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  navTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: FontSize.xl,
    fontFamily: FontFamily.bold,
    color: Colors.textPrimary,
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
    backgroundColor: Colors.card,
    paddingHorizontal: Spacing.page,
    paddingTop: Spacing.xxl,
    paddingBottom: Spacing.xxl,
    gap: Spacing.xl,
  },
  title: {
    fontSize: FontSize.xxl,
    fontFamily: FontFamily.bold,
    color: Colors.textPrimary,
    lineHeight: LineHeight.relaxed,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  metaText: {
    fontSize: FontSize.sm,
    color: Colors.textTertiary,
    fontFamily: FontFamily.regular,
  },
  metaDot: {
    fontSize: FontSize.sm,
    color: Colors.textTertiary,
  },
  bodySection: {
    backgroundColor: Colors.card,
    paddingHorizontal: Spacing.page,
    paddingVertical: Spacing.xxl,
    gap: Spacing.xxl,
  },
  bodyText: {
    fontSize: FontSize.base,
    color: Colors.textPrimary,
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
    color: Colors.textSecondary,
    fontFamily: FontFamily.regular,
  },
})
