import { StyleSheet, Text, View, Pressable, ScrollView, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FlashList } from '@shopify/flash-list'
import { useLocalSearchParams, router } from 'expo-router'
import { useState, useEffect, useRef } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { Colors } from '@/constants/colors'
import { FontFamily, FontSize, Radius, Spacing } from '@/constants/tokens'
import { createAuctionRenderItem } from '@/components/auction/render-auction-item'
import { MOCK_COURTS, type AuctionType } from '@/lib/mock-data'
import { useListFilterStore } from '@/lib/store/useListFilterStore'
import { useFavoritesStore } from '@/lib/store/useFavoritesStore'
import { useAuctions } from '@/lib/queries/auctions'
import { toAuctionItem } from '@/lib/api/auctions'

interface FilterTab {
  type: AuctionType | 'all'
  label: string
  category: string | undefined
}

const FILTER_TABS: FilterTab[] = [
  { type: 'all', label: '전체', category: undefined },
  { type: 'apartment', label: '아파트', category: '아파트' },
  { type: 'house', label: '주택', category: '주택' },
  { type: 'officetel', label: '오피스텔', category: '오피스텔' },
  { type: 'commercial', label: '상가', category: '상가' },
  { type: 'land', label: '토지', category: '토지' },
  { type: 'car', label: '자동차', category: '자동차' },
  { type: 'equipment', label: '중기', category: '중기' },
  { type: 'other', label: '기타', category: '기타' },
]

type SortType = 'latest' | 'deadline' | 'price_asc' | 'price_desc'

interface SortOption {
  type: SortType
  label: string
}

const SORT_OPTIONS: SortOption[] = [
  { type: 'latest', label: '최신순' },
  { type: 'deadline', label: '마감순' },
  { type: 'price_asc', label: '낮은가격' },
  { type: 'price_desc', label: '높은가격' },
]

export default function ListScreen() {
  const params = useLocalSearchParams<{ type?: AuctionType }>()
  const [selectedType, setSelectedType] = useState<AuctionType | 'all'>(
    params.type ?? 'all'
  )

  const filterScrollRef = useRef<ScrollView>(null)
  const tabLayoutsRef = useRef<Record<string, { x: number; width: number }>>({})

  useEffect(() => {
    if (params.type != null) {
      setSelectedType(params.type)
    }
  }, [params.type])

  useEffect(() => {
    const layout = tabLayoutsRef.current[selectedType]
    if (layout == null || filterScrollRef.current == null) return

    const scrollX = Math.max(0, layout.x - Spacing.page)
    filterScrollRef.current.scrollTo({ x: scrollX, animated: true })
  }, [selectedType])

  const [selectedSort, setSelectedSort] = useState<SortType>('latest')
  const selectedCourtId = useListFilterStore((s) => s.selectedCourtId)
  const favoriteIds = useFavoritesStore((s) => s.favoriteIds)
  const toggleFavorite = useFavoritesStore((s) => s.toggle)
  const renderItem = createAuctionRenderItem({ favoriteIds, toggleFavorite })

  const selectedCourtName = selectedCourtId != null
    ? (MOCK_COURTS.find((c) => c.id === selectedCourtId)?.name ?? '법원 선택')
    : null

  const activeTab = FILTER_TABS.find((t) => t.type === selectedType)

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useAuctions({ category: activeTab?.category })

  const allItems = (data?.pages ?? []).flatMap((p) => p.items.map(toAuctionItem))

  let sorted = allItems
  if (selectedSort === 'deadline') {
    sorted = [...allItems].sort((a, b) => a.auctionDate.localeCompare(b.auctionDate))
  } else if (selectedSort === 'price_asc') {
    sorted = [...allItems].sort((a, b) => a.minimumBid - b.minimumBid)
  } else if (selectedSort === 'price_desc') {
    sorted = [...allItems].sort((a, b) => b.minimumBid - a.minimumBid)
  }

  const handleEndReached = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>경매 목록</Text>
      </View>

      <ScrollView
        ref={filterScrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
        contentContainerStyle={styles.filterContent}
      >
        {FILTER_TABS.map((tab) => {
          const isActive = selectedType === tab.type
          return (
            <Pressable
              key={tab.type}
              style={[styles.filterTab, isActive && styles.filterTabActive]}
              onPress={() => setSelectedType(tab.type)}
              onLayout={(e) => {
                tabLayoutsRef.current[tab.type] = {
                  x: e.nativeEvent.layout.x,
                  width: e.nativeEvent.layout.width,
                }
              }}
            >
              <Text style={[styles.filterTabText, isActive && styles.filterTabTextActive]}>
                {tab.label}
              </Text>
            </Pressable>
          )
        })}
      </ScrollView>

      <View style={styles.courtFilterRow}>
        <Pressable
          style={[styles.courtButton, selectedCourtId != null ? styles.courtButtonActive : null]}
          onPress={() => router.push('/region-select')}
        >
          <Ionicons
            name="location-outline"
            size={14}
            color={selectedCourtId != null ? Colors.primary : Colors.textSecondary}
          />
          <Text
            style={[styles.courtButtonText, selectedCourtId != null ? styles.courtButtonTextActive : null]}
            numberOfLines={1}
          >
            {selectedCourtName ?? '전체 법원'}
          </Text>
          <Ionicons
            name="chevron-down"
            size={12}
            color={selectedCourtId != null ? Colors.primary : Colors.textTertiary}
          />
        </Pressable>
      </View>

      <View style={styles.sortRow}>
        <Text style={styles.resultCount}>
          {isLoading ? '-' : `${sorted.length}건`}
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.sortOptions}>
            {SORT_OPTIONS.map((opt) => {
              const isActive = selectedSort === opt.type
              return (
                <Pressable
                  key={opt.type}
                  style={[styles.sortButton, isActive && styles.sortButtonActive]}
                  onPress={() => setSelectedSort(opt.type)}
                >
                  <Text style={[styles.sortButtonText, isActive && styles.sortButtonTextActive]}>
                    {opt.label}
                  </Text>
                </Pressable>
              )
            })}
          </View>
        </ScrollView>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <FlashList
          data={sorted}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          extraData={favoriteIds}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.3}
          ListFooterComponent={
            isFetchingNextPage ? (
              <ActivityIndicator
                style={styles.footerLoader}
                color={Colors.primary}
              />
            ) : null
          }
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
    paddingHorizontal: Spacing.page,
    paddingVertical: 14,
    backgroundColor: Colors.white,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: FontSize.xxl,
    fontFamily: FontFamily.bold,
    color: Colors.textPrimary,
  },
  courtFilterRow: {
    paddingHorizontal: Spacing.page,
    paddingVertical: Spacing.lg,
    backgroundColor: Colors.white,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  courtButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.xxl,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
    maxWidth: '70%',
  },
  courtButtonActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryBg,
  },
  courtButtonText: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.medium,
    color: Colors.textSecondary,
  },
  courtButtonTextActive: {
    color: Colors.primary,
    fontFamily: FontFamily.bold,
  },
  filterScroll: {
    backgroundColor: Colors.white,
    maxHeight: 48,
  },
  filterContent: {
    paddingHorizontal: Spacing.page,
    gap: Spacing.md,
    alignItems: 'center',
  },
  filterTab: {
    paddingHorizontal: 14,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.xxl,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
  },
  filterTabActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterTabText: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.medium,
    color: Colors.textSecondary,
  },
  filterTabTextActive: {
    color: Colors.white,
    fontFamily: FontFamily.bold,
  },
  sortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.page,
    paddingVertical: Spacing.lg,
    gap: Spacing.xl,
    backgroundColor: Colors.background,
  },
  resultCount: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.bold,
    color: Colors.textPrimary,
  },
  sortOptions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  sortButton: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: 5,
    borderRadius: Radius.xl,
    backgroundColor: Colors.border,
  },
  sortButtonActive: {
    backgroundColor: Colors.primaryBg,
  },
  sortButtonText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontFamily: FontFamily.medium,
  },
  sortButtonTextActive: {
    color: Colors.primary,
    fontFamily: FontFamily.bold,
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
  footerLoader: {
    paddingVertical: Spacing.xl,
  },
})
