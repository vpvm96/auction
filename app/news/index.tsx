import { StyleSheet, Text, View, Pressable } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FlashList } from '@shopify/flash-list'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { Colors } from '@/constants/colors'
import { FontFamily, FontSize, Radius, Spacing } from '@/constants/tokens'
import { Badge } from '@/components/ui/badge'
import { MOCK_NEWS_ARTICLES, type NewsArticle } from '@/lib/mock-data'
import { formatFullDate } from '@/lib/format'

function NewsListItem({ id, category, title, date, source }: NewsArticle) {
  const handlePress = () => router.push(`/news/${id}`)

  return (
    <Pressable style={styles.item} onPress={handlePress}>
      <View style={styles.itemHeader}>
        <Badge label={category} />
        <Text style={styles.itemDate}>{formatFullDate(date)}</Text>
      </View>
      <Text style={styles.itemTitle} numberOfLines={2}>
        {title}
      </Text>
      <View style={styles.itemFooter}>
        <Text style={styles.itemSource}>{source}</Text>
        <Ionicons name="chevron-forward" size={14} color={Colors.textTertiary} />
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
  return <View style={styles.separator} />
}

export default function NewsListScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.navBar}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </Pressable>
        <Text style={styles.navTitle}>뉴스</Text>
        <View style={styles.navSpacer} />
      </View>

      <FlashList
        data={MOCK_NEWS_ARTICLES}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        estimatedItemSize={120}
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
  listContent: {
    paddingTop: Spacing.md,
    paddingBottom: Spacing.section,
  },
  item: {
    backgroundColor: Colors.card,
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
    color: Colors.textTertiary,
    fontFamily: FontFamily.regular,
  },
  itemTitle: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.semibold,
    color: Colors.textPrimary,
    lineHeight: 22,
  },
  itemFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemSource: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontFamily: FontFamily.regular,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.border,
    marginHorizontal: Spacing.page,
  },
})
