import { StyleSheet, Text, View, Pressable } from 'react-native'
import { Image } from 'expo-image'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { useTheme } from '@/hooks/useTheme'
import { FontFamily, FontSize, HIT_SLOP, Radius, Spacing } from '@/constants/tokens'
import type { AuctionItem } from '@/lib/mock-data'
import { formatPrice, formatShortDate } from '@/lib/format'

interface AuctionCardProps {
  id: string
  type: AuctionItem['type']
  title: string
  address: string
  auctionDate: string
  appraisalPrice: number
  minimumBid: number
  bidRatio: number
  failedBids: number
  area: number
  thumbnailUrl: string
  isFavorited: boolean
  onToggleFavorite: (id: string) => void
}

export function AuctionCard({
  id,
  title,
  address,
  auctionDate,
  appraisalPrice,
  minimumBid,
  bidRatio,
  failedBids,
  area,
  thumbnailUrl,
  isFavorited,
  onToggleFavorite,
}: AuctionCardProps) {
  const theme = useTheme()

  const handlePress = () => {
    router.push(`/${id}`)
  }

  const handleFavorite = () => {
    onToggleFavorite(id)
  }

  // 입찰률 색상: 100% 이상 hot, 80% 이상 warning, 그 외 primary
  const ratioColor =
    bidRatio >= 100 ? theme.auction.hot : bidRatio >= 80 ? theme.status.warning : theme.brand.primary
  const ratioTrackColor =
    bidRatio >= 100 ? theme.auction.hotBg : bidRatio >= 80 ? theme.status.warningBg : theme.brand.primaryLight
  // 바 너비는 최대 100%로 클램프
  const barWidth = `${Math.min(bidRatio, 100)}%` as const

  return (
    <Pressable
      style={[
        styles.container,
        {
          backgroundColor: theme.bg.surface,
          borderColor: theme.border.default,
        },
        theme.shadow.sm,
      ]}
      onPress={handlePress}
    >
      {/* 썸네일 */}
      <View style={styles.thumbnailWrap}>
        <Image
          source={{ uri: thumbnailUrl }}
          style={styles.thumbnail}
          contentFit="cover"
          transition={200}
        />
        {failedBids > 0 ? (
          <View style={[styles.failedBadgeOverlay, { backgroundColor: theme.auction.hot }]}>
            <Text style={styles.failedBadgeText}>{failedBids}회 유찰</Text>
          </View>
        ) : null}
      </View>

      {/* 정보 영역 */}
      <View style={styles.info}>
        {/* 상단: 제목 + 찜 버튼 */}
        <View style={styles.topRow}>
          <Text style={[styles.title, { color: theme.text.primary }]} numberOfLines={1}>
            {title}
          </Text>
          <Pressable onPress={handleFavorite} hitSlop={HIT_SLOP}>
            <Ionicons
              name={isFavorited ? 'heart' : 'heart-outline'}
              size={20}
              color={isFavorited ? theme.auction.hot : theme.text.tertiary}
            />
          </Pressable>
        </View>

        {/* 주소 */}
        <Text style={[styles.address, { color: theme.text.secondary }]} numberOfLines={1}>
          {address}
        </Text>

        {/* 최저 입찰가 */}
        <Text style={[styles.minimumBid, { color: theme.text.primary }]}>
          {formatPrice(minimumBid)}
        </Text>

        {/* 입찰률 프로그레스 바 */}
        <View style={styles.ratioRow}>
          <View style={[styles.barTrack, { backgroundColor: ratioTrackColor }]}>
            <View style={[styles.barFill, { width: barWidth, backgroundColor: ratioColor }]} />
          </View>
          <Text style={[styles.ratioLabel, { color: ratioColor }]}>{bidRatio}%</Text>
        </View>

        {/* 감정가 */}
        <Text style={[styles.appraisalPrice, { color: theme.text.tertiary }]}>
          감정가 {formatPrice(appraisalPrice)}
        </Text>

        {/* 메타 정보: 일자 + 면적 */}
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Ionicons name="calendar-outline" size={11} color={theme.text.tertiary} />
            <Text style={[styles.metaText, { color: theme.text.tertiary }]}>
              {formatShortDate(auctionDate)}
            </Text>
          </View>
          {area > 0 ? (
            <View style={styles.metaItem}>
              <Ionicons name="expand-outline" size={11} color={theme.text.tertiary} />
              <Text style={[styles.metaText, { color: theme.text.tertiary }]}>{area}㎡</Text>
            </View>
          ) : null}
        </View>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: Radius.xl,
    borderWidth: StyleSheet.hairlineWidth,
    marginHorizontal: Spacing.page,
    marginBottom: Spacing.xl,
    overflow: 'hidden',
    padding: Spacing.xl,
    gap: Spacing.xl,
  },
  thumbnailWrap: {
    position: 'relative',
  },
  thumbnail: {
    width: 96,
    height: 96,
    borderRadius: Radius.lg,
  },
  failedBadgeOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderBottomLeftRadius: Radius.lg,
    borderBottomRightRadius: Radius.lg,
    paddingVertical: 4,
    alignItems: 'center',
  },
  failedBadgeText: {
    fontSize: FontSize.xxs,
    fontFamily: FontFamily.bold,
    color: '#FFFFFF',
  },
  info: {
    flex: 1,
    gap: Spacing.xs,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: Spacing.xs,
  },
  title: {
    flex: 1,
    fontSize: FontSize.base,
    fontFamily: FontFamily.bold,
  },
  address: {
    fontSize: FontSize.sm,
  },
  minimumBid: {
    fontSize: FontSize.xl,
    fontFamily: FontFamily.extrabold,
    marginTop: Spacing.xxs,
  },
  ratioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  barTrack: {
    flex: 1,
    height: 5,
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: Radius.full,
  },
  ratioLabel: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.bold,
    minWidth: 32,
    textAlign: 'right',
  },
  appraisalPrice: {
    fontSize: FontSize.xs,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginTop: Spacing.xxs,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xxs,
  },
  metaText: {
    fontSize: FontSize.xs,
  },
})
