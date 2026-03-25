import { useEffect } from 'react'
import { StyleSheet, View, type ViewStyle, type StyleProp } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated'
import { Colors } from '@/constants/colors'
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
          backgroundColor: Colors.border,
        },
        animatedStyle,
        style,
      ]}
    />
  )
}

export function AuctionCardSkeleton() {
  return (
    <View style={skeletonStyles.card}>
      <Skeleton width={100} height={100} borderRadius={Radius.md} />
      <View style={skeletonStyles.content}>
        <Skeleton width="40%" height={14} />
        <Skeleton width="80%" height={16} />
        <Skeleton width="60%" height={12} />
        <View style={skeletonStyles.row}>
          <Skeleton width="45%" height={14} />
          <Skeleton width="30%" height={14} />
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

const skeletonStyles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: Spacing.page,
    gap: Spacing.xl,
  },
  content: {
    flex: 1,
    gap: Spacing.md,
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.xl,
  },
  list: {
    gap: Spacing.xs,
  },
})
