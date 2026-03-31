import { useEffect } from 'react'
import { ScrollView, StyleSheet, Text, View, Pressable, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Image } from 'expo-image'
import { Ionicons } from '@expo/vector-icons'
import { useLocalSearchParams, router } from 'expo-router'
import { Colors } from '@/constants/colors'
import { FontFamily, FontSize, HIT_SLOP, Radius, Spacing } from '@/constants/tokens'
import { Badge } from '@/components/ui/badge'
import { Divider } from '@/components/ui/divider'
import { useFavoritesStore } from '@/lib/store/useFavoritesStore'
import { useRecentlyViewedStore } from '@/lib/store/useRecentlyViewedStore'
import { useAuctionDetail } from '@/lib/queries/auctions'
import { toAuctionItem } from '@/lib/api/auctions'
import type { RealEstateTrade } from '@/lib/api/auctions'
import { formatPrice, formatFullDate } from '@/lib/format'

interface InfoRowProps {
  label: string
  value: string
}

function InfoRow({ label, value }: InfoRowProps) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  )
}

interface TradeRowProps {
  trade: RealEstateTrade
}

function TradeRow({ trade }: TradeRowProps) {
  return (
    <View style={styles.tradeRow}>
      <View style={styles.tradeInfo}>
        <Text style={styles.tradeDate}>{trade.tradeDate}</Text>
        <Text style={styles.tradeAddress} numberOfLines={1}>{trade.address}</Text>
      </View>
      <View style={styles.tradeRight}>
        <Text style={styles.tradePrice}>{formatPrice(trade.tradeAmount)}</Text>
        <Text style={styles.tradeArea}>{trade.area}㎡</Text>
      </View>
    </View>
  )
}

export default function DetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const numericId = Number(id)
  const { data: rawItem, isLoading, isError } = useAuctionDetail(numericId)
  const auction = rawItem != null ? toAuctionItem(rawItem) : null

  const isFavorited = useFavoritesStore((s) => s.favoriteIds.has(id ?? ''))
  const toggle = useFavoritesStore((s) => s.toggle)
  const addRecentlyViewed = useRecentlyViewedStore((s) => s.addId)

  useEffect(() => {
    if (id != null) {
      addRecentlyViewed(id)
    }
  }, [id, addRecentlyViewed])

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.navBar}>
          <Pressable onPress={() => router.back()} hitSlop={HIT_SLOP}>
            <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
          </Pressable>
          <Text style={styles.navTitle} numberOfLines={1}>
            <Text>상세 정보</Text>
          </Text>
          <View style={styles.navPlaceholder} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </SafeAreaView>
    )
  }

  if (isError || auction == null) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.navBar}>
          <Pressable onPress={() => router.back()} hitSlop={HIT_SLOP}>
            <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
          </Pressable>
          <Text style={styles.navTitle} numberOfLines={1}>
            <Text>상세 정보</Text>
          </Text>
          <View style={styles.navPlaceholder} />
        </View>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={Colors.textTertiary} />
          <Text style={styles.notFoundText}>
            물건을 찾을 수 없습니다.
          </Text>
        </View>
      </SafeAreaView>
    )
  }

  const handleFavorite = () => {
    toggle(auction.id)
  }

  const recentTrades = rawItem?.recentTrades ?? []
  const investmentAnalysis = rawItem?.investmentAnalysis

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.navBar}>
        <Pressable onPress={() => router.back()} hitSlop={HIT_SLOP}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </Pressable>
        <Text style={styles.navTitle} numberOfLines={1}>
          {auction.title}
        </Text>
        <Pressable onPress={handleFavorite} hitSlop={HIT_SLOP}>
          <Ionicons
            name={isFavorited ? 'heart' : 'heart-outline'}
            size={24}
            color={isFavorited ? Colors.increase : Colors.textPrimary}
          />
        </Pressable>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <Image
          source={{ uri: auction.thumbnailUrl }}
          style={styles.heroImage}
          contentFit="cover"
        />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>기본 정보</Text>
          <InfoRow label="소재지" value={auction.address} />
          {auction.area > 0 ? (
            <InfoRow label="면적" value={`${auction.area}㎡`} />
          ) : null}
          <InfoRow label="분류" value={rawItem?.ctgrFullNm ?? '-'} />
          <InfoRow label="상태" value={rawItem?.pbctCltrStatNm ?? '-'} />
          <InfoRow label="조회수" value={`${rawItem?.iqryCnt ?? 0}회`} />
        </View>

        <Divider variant="section" />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>경매 정보</Text>
          <InfoRow label="사건번호" value={auction.caseNumber} />
          <InfoRow label="입찰방법" value={rawItem?.bidMtdNm ?? '-'} />
          <InfoRow label="입찰시작" value={rawItem?.pbctBegnDtm != null ? formatFullDate(rawItem.pbctBegnDtm) : '-'} />
          <InfoRow label="입찰마감" value={formatFullDate(auction.auctionDate)} />
          <InfoRow label="감정가" value={formatPrice(auction.appraisalPrice)} />
          <InfoRow label="최저입찰가" value={formatPrice(auction.minimumBid)} />
          <InfoRow label="할인율" value={`${rawItem?.discountRate ?? 0}%`} />
          <InfoRow label="유찰횟수" value={`${auction.failedBids}회`} />
        </View>

        {investmentAnalysis != null ? (
          <>
            <Divider variant="section" />
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>투자 분석</Text>
              <InfoRow label="할인율" value={`${investmentAnalysis.discountRate}%`} />
              <InfoRow label="평당가" value={formatPrice(investmentAnalysis.pricePerArea)} />
              <InfoRow label="예상수익률" value={`${investmentAnalysis.estimatedYield}%`} />
            </View>
          </>
        ) : null}

        {recentTrades.length > 0 ? (
          <>
            <Divider variant="section" />
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>주변 실거래가</Text>
              {recentTrades.map((trade, index) => (
                <TradeRow key={`${trade.tradeDate}-${index}`} trade={trade} />
              ))}
            </View>
          </>
        ) : null}

        <Divider variant="section" />

        <View style={[styles.section, styles.lastSection]}>
          <Text style={styles.sectionTitle}>유찰 이력</Text>
          {auction.failedBids === 0 ? (
            <Text style={styles.emptyText}>유찰 이력이 없습니다.</Text>
          ) : (
            Array.from({ length: auction.failedBids }, (_, i) => (
              <View key={i} style={styles.historyRow}>
                <Text style={styles.historyLabel}>{auction.failedBids - i}차</Text>
                <Badge label="유찰" variant="danger" />
              </View>
            ))
          )}
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <View style={styles.priceArea}>
          <Text style={styles.bidLabel}>최저입찰가</Text>
          <Text style={styles.bidPrice}>{formatPrice(auction.minimumBid)}</Text>
        </View>
        <Pressable style={styles.ctaButton} onPress={handleFavorite}>
          <Ionicons
            name={isFavorited ? 'heart' : 'heart-outline'}
            size={18}
            color={Colors.white}
          />
          <Text style={styles.ctaText}>
            {isFavorited ? '관심 해제' : '관심 등록'}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.xl,
  },
  navPlaceholder: {
    width: 24,
  },
  notFoundText: {
    fontSize: FontSize.md,
    color: Colors.textTertiary,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.page,
    paddingVertical: Spacing.xl,
    backgroundColor: Colors.white,
    gap: Spacing.xl,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  navTitle: {
    flex: 1,
    fontSize: FontSize.xl,
    fontFamily: FontFamily.bold,
    color: Colors.textPrimary,
  },
  scroll: {
    flex: 1,
  },
  heroImage: {
    width: '100%',
    height: 240,
    backgroundColor: Colors.border,
  },
  section: {
    backgroundColor: Colors.card,
    padding: Spacing.xxl,
    gap: Spacing.xl,
  },
  lastSection: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontFamily: FontFamily.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  infoRow: {
    flexDirection: 'row',
    gap: Spacing.xl,
  },
  infoLabel: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    width: 80,
    flexShrink: 0,
  },
  infoValue: {
    flex: 1,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    fontFamily: FontFamily.medium,
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
  },
  historyLabel: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    width: 30,
  },
  emptyText: {
    fontSize: FontSize.md,
    color: Colors.textTertiary,
  },
  tradeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  tradeInfo: {
    flex: 1,
    gap: 2,
    marginRight: Spacing.lg,
  },
  tradeDate: {
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
  },
  tradeAddress: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  tradeRight: {
    alignItems: 'flex-end',
    gap: 2,
  },
  tradePrice: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.bold,
    color: Colors.textPrimary,
  },
  tradeArea: {
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.page,
    paddingVertical: Spacing.xl,
    backgroundColor: Colors.white,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.border,
    gap: Spacing.xl,
  },
  priceArea: {
    flex: 1,
  },
  bidLabel: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
  bidPrice: {
    fontSize: FontSize.xxl,
    fontFamily: FontFamily.extrabold,
    color: Colors.textPrimary,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    borderRadius: Radius.xl,
    paddingHorizontal: Spacing.xxxl,
    paddingVertical: Spacing.xl,
    gap: Spacing.sm,
  },
  ctaText: {
    fontSize: FontSize.lg,
    fontFamily: FontFamily.bold,
    color: Colors.white,
  },
})
