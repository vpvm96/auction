import { StyleSheet, Text, View, Pressable } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FlashList } from '@shopify/flash-list'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { FontFamily, FontSize, Spacing } from '@/constants/tokens'
import { Badge } from '@/components/ui/badge'
import { MOCK_NEWS_ARTICLES, type NewsArticle } from '@/lib/mock-data'
import { formatFullDate } from '@/lib/format'
import { useTheme } from '@/hooks/useTheme'

function NewsListItem({ id, category, title, date, source }: NewsArticle) {
  const theme = useTheme()
  const handlePress = () => router.push(`/news/${id}`)

  return (
    <Pressable style={[styles.item, { backgroundColor: theme.bg.surface }]} onPress={handlePress}>
      <View style={styles.itemHeader}>
        <Badge label={category} />
        <Text style={[styles.itemDate, { color: theme.text.tertiary }]}>{formatFullDate(date)}</Text>
      </View>
      <Text style={[styles.itemTitle, { color: theme.text.primary }]} numberOfLines={2}>
        {title}
      </Text>
      <View style={styles.itemFooter}>
        <Text style={[styles.itemSource, { color: theme.text.secondary }]}>{source}</Text>
        <Ionicons name="chevron-forward" size={14} color={theme.text.tertiary} />
      </View>
    </Pressable>
  )
}

function renderItem({ item }: { item: NewsArticle }) {
  return (
    <NewsListItem
      id={item.id}
      category={item.category}
      title={item.title}
      date={item.date}
      source={item.source}
      body={item.body}
    />
  )
}

function ItemSeparator() {
  const theme = useTheme()
  return <View style={[styles.separator, { backgroundColor: theme.border.default }]} />
}

export default function NewsListScreen() {
  const theme = useTheme()

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg.base }]} edges={['top']}>
      <View style={[styles.navBar, { backgroundColor: theme.bg.surface, borderBottomColor: theme.border.default }]}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="arrow-back" size={24} color={theme.text.primary} />
        </Pressable>
        <Text style={[styles.navTitle, { color: theme.text.primary }]}>뉴스</Text>
        <View style={styles.navSpacer} />
      </View>

      <FlashList
        data={MOCK_NEWS_ARTICLES}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={ItemSeparator}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: {
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
  listContent: {
    paddingTop: Spacing.md,
    paddingBottom: Spacing.section,
  },
  item: {
    paddingHorizontal: Spacing.page,
    paddingVertical: Spacing.xxl,
    gap: Spacing.md,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemDate: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.regular,
  },
  itemTitle: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.semibold,
    lineHeight: 22,
  },
  itemFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemSource: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.regular,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    marginHorizontal: Spacing.page,
  },
})
