import { StyleSheet, View, type ViewProps } from 'react-native'
import { useTheme } from '@/hooks/useTheme'
import { Radius, Spacing } from '@/constants/tokens'

interface CardProps extends ViewProps {
  /** Remove the default horizontal page margin (e.g. when card fills full width) */
  noMargin?: boolean
  /** Add bottom margin between stacked cards (default: true) */
  withGap?: boolean
  /** Apply themed shadow instead of flat surface */
  elevated?: boolean
  children: React.ReactNode
}

export function Card({
  noMargin = false,
  withGap = true,
  elevated = false,
  style,
  children,
  ...rest
}: CardProps) {
  const theme = useTheme()

  return (
    <View
      style={[
        styles.base,
        { backgroundColor: theme.bg.surface },
        !noMargin && styles.margin,
        withGap && styles.gap,
        elevated && theme.shadow.md,
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  base: {
    borderRadius: Radius.xl,
    padding: Spacing.xxl,
  },
  margin: {
    marginHorizontal: Spacing.page,
  },
  gap: {
    marginBottom: Spacing.xl,
  },
})
