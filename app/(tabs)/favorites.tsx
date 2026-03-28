import { StyleSheet, Text, View, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FlashList } from '@shopify/flash-list'
import { Ionicons } from '@expo/vector-icons'
import { Colors } from '@/constants/colors'
import { FontFamily, FontSize, LineHeight, Spacing } from '@/constants/tokens'
import { createAuctionRenderItem } from '@/components/auction/render-auction-item'
import { useFavoritesStore } from '@/lib/store/useFavoritesStore'
import { useAuctionsByIds } from '@/lib/queries/auctions'
import { toAuctionItem } from '@/lib/api/auctions'

function EmptyState() {
  return (
    <View style={styles.empty}>
      <Ionicons name="heart-outline" size={56} color={Colors.textTertiary} />
      <Text style={styles.emptyTitle}>관심 물건이 없습니다</Text>
      <Text style={styles.emptyDesc}>
        {'경매 목록에서 마음에 드는 물건에\n하트를 눌러 관심 등록해보세요'}
      </Text>
    </View>
  )
}

export default function FavoritesScreen() {
  const favoriteIds = useFavoritesStore((s) => s.favoriteIds)
  const toggleFavorite = useFavoritesStore((s) => s.toggle)
  const favoriteIdArray = Array.from(favoriteIds)
  const renderItem = createAuctionRenderItem({ favoriteIds, toggleFavorite })

  const results = useAuctionsByIds(favoriteIdArray)
  const isLoading = results.some((r) => r.isLoading)
  const favoriteItems = results
    .filter((r) => r.data != null)
    .map((r) => toAuctionItem(r.data!))

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>관심목록</Text>
        <Text style={styles.headerCount}>{favoriteItems.length}건</Text>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : favoriteItems.length === 0 ? (
        <EmptyState />
      ) : (
        <FlashList
          data={favoriteItems}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          extraData={favoriteIds}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          estimatedItemSize={122}
        />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.page,
    paddingVertical: 14,
    backgroundColor: Colors.white,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
    gap: Spacing.md,
  },
  headerTitle: {
    fontSize: FontSize.xxl,
    fontFamily: FontFamily.bold,
    color: Colors.textPrimary,
  },
  headerCount: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.semibold,
    color: Colors.primary,
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
    paddingBottom: 60,
  },
  emptyTitle: {
    fontSize: FontSize.xl,
    fontFamily: FontFamily.bold,
    color: Colors.textSecondary,
  },
  emptyDesc: {
    fontSize: FontSize.md,
    color: Colors.textTertiary,
    textAlign: 'center',
    lineHeight: LineHeight.tight,
  },
})
