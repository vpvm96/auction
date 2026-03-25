import { StyleSheet, View } from 'react-native'
import { Colors } from '@/constants/colors'
import { Spacing } from '@/constants/tokens'

interface DividerProps {
  /**
   * - 'line'    → hairline (within a card, e.g. StatsCard)
   * - 'section' → thick gap between page sections (e.g. Detail screen)
   */
  variant?: 'line' | 'section'
}

export function Divider({ variant = 'line' }: DividerProps) {
  return <View style={variant === 'section' ? styles.section : styles.line} />
}

const styles = StyleSheet.create({
  line: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.border,
    marginVertical: Spacing.xs,
  },
  section: {
    height: Spacing.md,
    backgroundColor: Colors.background,
  },
})
