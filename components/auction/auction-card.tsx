import { StyleSheet, Text, View, Pressable } from 'react-native'
import { Image } from 'expo-image'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { Colors } from '@/constants/colors'
import { FontFamily, FontSize, HIT_SLOP, Radius, Spacing } from '@/constants/tokens'
import { Badge } from '@/components/ui/badge'
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
  const handlePress = () => {
    router.push(`/${id}`)
  }

  const handleFavorite = () => {
    onToggleFavorite(id)
  }

  return (
    <Pressable style={styles.container} onPress={handlePress}>
      <Image
        source={{ uri: thumbnailUrl }}
        style={styles.thumbnail}
        contentFit="cover"
      />
      <View style={styles.info}>
        <View style={styles.topRow}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          <Pressable onPress={handleFavorite} hitSlop={HIT_SLOP}>
            <Ionicons
              name={isFavorited ? 'heart' : 'heart-outline'}
              size={20}
              color={isFavorited ? Colors.increase : Colors.textTertiary}
            />
          </Pressable>
        </View>
        <Text style={styles.address} numberOfLines={1}>
          {address}
        </Text>
        <View style={styles.priceRow}>
          <Text style={styles.minimumBid}>{formatPrice(minimumBid)}</Text>
          <Badge label={`${bidRatio}%`} variant="primary" />
        </View>
        <Text style={styles.appraisalPrice}>
          {'감정가 '}
          {formatPrice(appraisalPrice)}
        </Text>
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Ionicons name="calendar-outline" size={12} color={Colors.textSecondary} />
            <Text style={styles.metaText}>{formatShortDate(auctionDate)}</Text>
          </View>
          {area > 0 ? (
            <View style={styles.metaItem}>
              <Ionicons name="expand-outline" size={12} color={Colors.textSecondary} />
              <Text style={styles.metaText}>{area}㎡</Text>
            </View>
          ) : null}
          {failedBids > 0 ? <Badge label={`${failedBids}회 유찰`} variant="danger" /> : null}
        </View>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: Radius.xl,
    marginHorizontal: Spacing.page,
    marginBottom: Spacing.lg,
    overflow: 'hidden',
    padding: Spacing.xl,
    gap: Spacing.xl,
  },
  thumbnail: {
    width: 90,
    height: 90,
    borderRadius: Radius.md,
    backgroundColor: Colors.border,
  },
  info: {
    flex: 1,
    gap: Spacing.xs,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    flex: 1,
    fontSize: FontSize.base,
    fontFamily: FontFamily.bold,
    color: Colors.textPrimary,
  },
  address: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.xxs,
  },
  minimumBid: {
    fontSize: FontSize.xl,
    fontFamily: FontFamily.extrabold,
    color: Colors.textPrimary,
  },
  appraisalPrice: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
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
    color: Colors.textSecondary,
  },
})
