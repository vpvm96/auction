import { StyleSheet, Text, View, Pressable, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FlashList } from '@shopify/flash-list'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { FontFamily, FontSize, Spacing } from '@/constants/tokens'
import { createAuctionRenderItem } from '@/components/auction/render-auction-item'
import { useRecentlyViewedStore } from '@/lib/store/useRecentlyViewedStore'
import { useFavoritesStore } from '@/lib/store/useFavoritesStore'
import { useAuctionsByIds } from '@/lib/queries/auctions'
import { toAuctionItem } from '@/lib/api/auctions'
import { useTheme } from '@/hooks/useTheme'

export default function RecentlyViewedScreen() {
  const theme = useTheme()
  const ids = useRecentlyViewedStore((s) => s.ids)
  const clear = useRecentlyViewedStore((s) => s.clear)
  const favoriteIds = useFavoritesStore((s) => s.favoriteIds)
  const toggleFavorite = useFavoritesStore((s) => s.toggle)
  const renderItem = createAuctionRenderItem({ favoriteIds, toggleFavorite })

  const results = useAuctionsByIds(ids)
  const isLoading = results.some((r) => r.isLoading)
  const items = ids
    .map((id) => results.find((r) => r.data != null && String(r.data.id) === id)?.data)
    .filter((d) => d != null)
    .map(toAuctionItem)

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg.base }]} edges={['top']}>
      <View style={[styles.navBar, { backgroundColor: theme.bg.surface, borderBottomColor: theme.border.default }]}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="arrow-back" size={24} color={theme.text.primary} />
        </Pressable>
        <Text style={[styles.navTitle, { color: theme.text.primary }]}>최근 본 물건</Text>
        {items.length > 0 ? (
          <Pressable onPress={clear} hitSlop={8}>
            <Text style={[styles.clearText, { color: theme.text.secondary }]}>전체 삭제</Text>
          </Pressable>
        ) : (
          <View style={styles.navSpacer} />
        )}
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.brand.primary} />
        </View>
      ) : items.length > 0 ? (
        <FlashList
          data={items}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          extraData={favoriteIds}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          estimatedItemSize={122}
        />
      ) : (
        <View style={styles.empty}>
          <Ionicons name="eye-off-outline" size={48} color={theme.text.tertiary} />
          <Text style={[styles.emptyTitle, { color: theme.text.primary }]}>최근 본 물건이 없습니다</Text>
          <Text style={[styles.emptyDesc, { color: theme.text.secondary }]}>경매 목록에서 물건을 확인해보세요.</Text>
          <Pressable style={[styles.goListButton, { backgroundColor: theme.brand.primary }]} onPress={() => router.push('/(tabs)/list')}>
            <Text style={[styles.goListText, { color: theme.brand.onPrimary }]}>경매 목록 보기</Text>
          </Pressable>
        </View>
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
    width: 40,
  },
  clearText: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.semibold,
    width: 40,
    textAlign: 'right',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.section,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.xl,
    paddingHorizontal: Spacing.section,
  },
  emptyTitle: {
    fontSize: FontSize.lg,
    fontFamily: FontFamily.bold,
  },
  emptyDesc: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.regular,
    textAlign: 'center',
  },
  goListButton: {
    marginTop: Spacing.md,
    paddingHorizontal: Spacing.xxxl,
    paddingVertical: Spacing.xl,
    borderRadius: 999,
  },
  goListText: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.bold,
  },
})
