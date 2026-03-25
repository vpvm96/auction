import { StyleSheet, View, ViewProps } from 'react-native'
import { Colors } from '@/constants/colors'
import { Radius, Shadow, Spacing } from '@/constants/tokens'

interface CardProps extends ViewProps {
  /** Remove the default horizontal page margin (e.g. when card fills full width) */
  noMargin?: boolean
  /** Add bottom margin between stacked cards (default: true) */
  withGap?: boolean
  /** Apply subtle shadow instead of flat surface */
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
  return (
    <View
      style={[
        styles.base,
        !noMargin && styles.margin,
        withGap && styles.gap,
        elevated && Shadow.md,
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
    backgroundColor: Colors.card,
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
