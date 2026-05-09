import { useEffect } from 'react'
import { StyleSheet, View, type ViewStyle, type StyleProp } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated'
import { useTheme } from '@/hooks/useTheme'
import { Radius, Spacing } from '@/constants/tokens'

interface SkeletonProps {
  width?: number | `${number}%`
  height?: number
  borderRadius?: number
  style?: StyleProp<ViewStyle>
}

export function Skeleton({
  width = '100%',
  height = 16,
  borderRadius = Radius.sm,
  style,
}: SkeletonProps) {
  const theme = useTheme()
  const opacity = useSharedValue(0.3)

  useEffect(() => {
    opacity.set(
      withRepeat(
        withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) }),
        -1,
        true,
      ),
    )
  }, [opacity])

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.get(),
  }))

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: theme.bg.sunken,
        },
        animatedStyle,
        style,
      ]}
    />
  )
}

export function AuctionCardSkeleton() {
  const theme = useTheme()
  return (
    <View
      style={[
        skeletonStyles.card,
        {
          backgroundColor: theme.bg.surface,
          borderColor: theme.border.default,
        },
      ]}
    >
      <Skeleton width={96} height={96} borderRadius={Radius.lg} />
      <View style={skeletonStyles.content}>
        <View style={skeletonStyles.topRow}>
          <Skeleton width="55%" height={14} />
          <Skeleton width={28} height={20} borderRadius={Radius.sm} />
        </View>
        <Skeleton width="70%" height={12} />
        <Skeleton width="45%" height={20} />
        <View style={skeletonStyles.barRow}>
          <Skeleton
            width="100%"
            height={5}
            borderRadius={Radius.full}
            style={skeletonStyles.barFlex}
          />
          <Skeleton width={32} height={11} />
        </View>
        <View style={skeletonStyles.row}>
          <Skeleton width="40%" height={11} />
          <Skeleton width="25%" height={11} />
        </View>
      </View>
    </View>
  )
}

export function AuctionListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <View style={skeletonStyles.list}>
      {Array.from({ length: count }, (_, i) => (
        <AuctionCardSkeleton key={i} />
      ))}
    </View>
  )
}

export function AuctionListFooterSkeleton({ count = 2 }: { count?: number }) {
  return (
    <View style={skeletonStyles.footer}>
      {Array.from({ length: count }, (_, i) => (
        <AuctionCardSkeleton key={i} />
      ))}
    </View>
  )
}

export function StatsCardSkeleton() {
  const theme = useTheme()
  return (
    <View
      style={[
        skeletonStyles.statsCard,
        { backgroundColor: theme.bg.surface, borderColor: theme.border.subtle },
      ]}
    >
      <View style={skeletonStyles.statsHeader}>
        <Skeleton width={70} height={14} />
        <Skeleton width={60} height={11} />
      </View>
      <View style={skeletonStyles.statsRow}>
        <View style={skeletonStyles.statsItem}>
          <Skeleton width={40} height={40} borderRadius={Radius.lg} />
          <View style={skeletonStyles.statsBody}>
            <Skeleton width="50%" height={12} />
            <Skeleton width="80%" height={22} />
            <Skeleton width="100%" height={4} borderRadius={Radius.full} />
          </View>
        </View>
        <View style={skeletonStyles.statsItem}>
          <Skeleton width={40} height={40} borderRadius={Radius.lg} />
          <View style={skeletonStyles.statsBody}>
            <Skeleton width="50%" height={12} />
            <Skeleton width="80%" height={22} />
            <Skeleton width="100%" height={4} borderRadius={Radius.full} />
          </View>
        </View>
      </View>
    </View>
  )
}

const skeletonStyles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: Radius.xl,
    borderWidth: StyleSheet.hairlineWidth,
    marginHorizontal: Spacing.page,
    marginBottom: Spacing.xl,
    padding: Spacing.xl,
    gap: Spacing.xl,
  },
  content: {
    flex: 1,
    gap: Spacing.sm,
    justifyContent: 'center',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.xs,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  barFlex: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.xl,
  },
  list: {
    paddingTop: Spacing.lg,
  },
  footer: {
    paddingTop: 0,
  },
  statsCard: {
    borderRadius: Radius.xl,
    marginHorizontal: Spacing.page,
    marginBottom: Spacing.xl,
    borderWidth: StyleSheet.hairlineWidth,
    padding: Spacing.xxl,
    gap: Spacing.xl,
  },
  statsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.xxl,
  },
  statsItem: {
    flex: 1,
    flexDirection: 'row',
    gap: Spacing.xl,
    alignItems: 'flex-start',
  },
  statsBody: {
    flex: 1,
    gap: Spacing.sm,
  },
})
