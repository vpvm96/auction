import { FontFamily, FontSize, Radius, Spacing } from '@/constants/tokens'
import { useTheme } from '@/hooks/useTheme'
import { StyleSheet, Text, View } from 'react-native'

interface RecentLoginTooltipProps {
  /** 'top' = bubble above target with tail pointing down. */
  position?: 'top' | 'bottom'
  align?: 'center' | 'start' | 'end'
}

export function RecentLoginTooltip({
  position = 'top',
  align = 'center',
}: RecentLoginTooltipProps) {
  const theme = useTheme()
  const bg = theme.brand.primary
  const textColor = theme.brand.onPrimary

  const wrapperStyle = [
    styles.wrapper,
    position === 'top' ? styles.wrapperTop : styles.wrapperBottom,
    align === 'start'
      ? styles.alignStart
      : align === 'end'
        ? styles.alignEnd
        : styles.alignCenter,
  ]

  return (
    <View pointerEvents="none" style={wrapperStyle}>
      <View style={[styles.bubble, { backgroundColor: bg }]}>
        <Text style={[styles.text, { color: textColor }]}>최근 로그인</Text>
      </View>
      <View
        style={[
          styles.tail,
          position === 'top' ? styles.tailDown : styles.tailUp,
          { borderTopColor: bg, borderBottomColor: bg },
        ]}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 10,
  },
  wrapperTop: {
    bottom: '100%',
    marginBottom: 6,
  },
  wrapperBottom: {
    top: '100%',
    marginTop: 6,
  },
  alignCenter: {
    left: 0,
    right: 0,
  },
  alignStart: {
    left: 0,
    alignItems: 'flex-start',
  },
  alignEnd: {
    right: 0,
    alignItems: 'flex-end',
  },
  bubble: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.md,
  },
  text: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.bold,
  },
  tail: {
    width: 0,
    height: 0,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  tailDown: {
    borderTopWidth: 5,
    borderBottomWidth: 0,
    borderBottomColor: 'transparent',
  },
  tailUp: {
    borderBottomWidth: 5,
    borderTopWidth: 0,
    borderTopColor: 'transparent',
  },
})
