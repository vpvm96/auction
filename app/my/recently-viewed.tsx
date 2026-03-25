import { StyleSheet, Text, View, Pressable } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FlashList } from '@shopify/flash-list'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { Colors } from '@/constants/colors'
import { FontFamily, FontSize, Spacing } from '@/constants/tokens'
import { createAuctionRenderItem } from '@/components/auction/render-auction-item'
import { MOCK_AUCTIONS, type AuctionItem } from '@/lib/mock-data'
import { useRecentlyViewedStore } from '@/lib/store/useRecentlyViewedStore'
import { useFavoritesStore } from '@/lib/store/useFavoritesStore'

export default function RecentlyViewedScreen() {
  const ids = useRecentlyViewedStore((s) => s.ids)
  const clear = useRecentlyViewedStore((s) => s.clear)
  const favoriteIds = useFavoritesStore((s) => s.favoriteIds)
  const toggleFavorite = useFavoritesStore((s) => s.toggle)
  const renderItem = createAuctionRenderItem({ favoriteIds, toggleFavorite })

  const items = ids
    .map((id) => MOCK_AUCTIONS.find((a) => a.id === id))
    .filter((a): a is AuctionItem => a != null)

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.navBar}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </Pressable>
        <Text style={styles.navTitle}>최근 본 물건</Text>
        {items.length > 0 ? (
          <Pressable onPress={clear} hitSlop={8}>
            <Text style={styles.clearText}>전체 삭제</Text>
          </Pressable>
        ) : (
          <View style={styles.navSpacer} />
        )}
      </View>

      {items.length > 0 ? (
        <FlashList
          data={items}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          estimatedItemSize={114}
          extraData={favoriteIds}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.empty}>
          <Ionicons name="eye-off-outline" size={48} color={Colors.textTertiary} />
          <Text style={styles.emptyTitle}>최근 본 물건이 없습니다</Text>
          <Text style={styles.emptyDesc}>경매 목록에서 물건을 확인해보세요.</Text>
          <Pressable style={styles.goListButton} onPress={() => router.push('/(tabs)/list')}>
            <Text style={styles.goListText}>경매 목록 보기</Text>
          </Pressable>
        </View>
      )}
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
    width: 40,
  },
  clearText: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.semibold,
    color: Colors.textSecondary,
    width: 40,
    textAlign: 'right',
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
    color: Colors.textPrimary,
  },
  emptyDesc: {
    fontSize: FontSize.base,
    color: Colors.textSecondary,
    fontFamily: FontFamily.regular,
    textAlign: 'center',
  },
  goListButton: {
    marginTop: Spacing.md,
    paddingHorizontal: Spacing.xxxl,
    paddingVertical: Spacing.xl,
    backgroundColor: Colors.primary,
    borderRadius: 999,
  },
  goListText: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.bold,
    color: Colors.white,
  },
})
