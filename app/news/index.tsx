// 뉴스 목록 화면 — 실 API 페이지네이션 조회, 항목 클릭 시 원문(originalLink)을 인앱 웹뷰로 표시.
import { ActivityIndicator, StyleSheet, Text, View, Pressable } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FlashList } from '@shopify/flash-list'
import { router } from 'expo-router'
import * as WebBrowser from 'expo-web-browser'
import { Ionicons } from '@expo/vector-icons'
import { FontFamily, FontSize, Spacing } from '@/constants/tokens'
import { Badge } from '@/components/ui/badge'
import { useNews } from '@/lib/queries/news'
import type { NewsResponse } from '@/lib/api/news'
import { formatFullDate } from '@/lib/format'
import { useTheme } from '@/hooks/useTheme'

/** 원문 URL에서 호스트명만 추출 (출처 표기용) */
function hostFromUrl(url: string): string {
  return url.match(/^https?:\/\/(?:www\.)?([^/]+)/)?.[1] ?? ''
}

function NewsListItem({ query, title, pubDate, originalLink }: NewsResponse) {
  const theme = useTheme()
  const handlePress = () => WebBrowser.openBrowserAsync(originalLink)

  return (
    <Pressable style={[styles.item, { backgroundColor: theme.bg.surface }]} onPress={handlePress}>
      <View style={styles.itemHeader}>
        <Badge label={query} />
        <Text style={[styles.itemDate, { color: theme.text.tertiary }]}>{formatFullDate(pubDate)}</Text>
      </View>
      <Text style={[styles.itemTitle, { color: theme.text.primary }]} numberOfLines={2}>
        {title}
      </Text>
      <View style={styles.itemFooter}>
        <Text style={[styles.itemSource, { color: theme.text.secondary }]}>{hostFromUrl(originalLink)}</Text>
        <Ionicons name="open-outline" size={14} color={theme.text.tertiary} />
      </View>
    </Pressable>
  )
}

function renderItem({ item }: { item: NewsResponse }) {
  return (
    <NewsListItem
      id={item.id}
      query={item.query}
      title={item.title}
      originalLink={item.originalLink}
      link={item.link}
      description={item.description}
      pubDate={item.pubDate}
    />
  )
}

function ItemSeparator() {
  const theme = useTheme()
  return <View style={[styles.separator, { backgroundColor: theme.border.default }]} />
}

export default function NewsListScreen() {
  const theme = useTheme()
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useNews()
  const articles = data?.pages.flatMap((page) => page.items) ?? []

  const handleEndReached = () => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage()
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg.base }]} edges={['top']}>
      <View style={[styles.navBar, { backgroundColor: theme.bg.surface, borderBottomColor: theme.border.default }]}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="arrow-back" size={24} color={theme.text.primary} />
        </Pressable>
        <Text style={[styles.navTitle, { color: theme.text.primary }]}>뉴스</Text>
        <View style={styles.navSpacer} />
      </View>

      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator color={theme.brand.primary} />
        </View>
      ) : (
        <FlashList
          data={articles}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={ItemSeparator}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={
            <View style={styles.centered}>
              <Text style={[styles.emptyText, { color: theme.text.secondary }]}>뉴스가 없습니다.</Text>
            </View>
          }
          ListFooterComponent={
            isFetchingNextPage ? (
              <View style={styles.footer}>
                <ActivityIndicator color={theme.brand.primary} />
              </View>
            ) : null
          }
        />
      )}
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
  centered: {
    paddingVertical: Spacing.section,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.regular,
  },
  footer: {
    paddingVertical: Spacing.xxl,
  },
})
