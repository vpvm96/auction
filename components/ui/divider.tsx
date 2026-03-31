import { StyleSheet, View } from 'react-native'
import { useTheme } from '@/hooks/useTheme'
import { Spacing } from '@/constants/tokens'

interface DividerProps {
  /**
   * - 'line'    → hairline (카드 내부 구분선)
   * - 'section' → 섹션 사이 굵은 여백 구분
   */
  variant?: 'line' | 'section'
}

export function Divider({ variant = 'line' }: DividerProps) {
  const theme = useTheme()

  if (variant === 'section') {
    return <View style={[styles.section, { backgroundColor: theme.bg.sunken }]} />
  }

  return <View style={[styles.line, { backgroundColor: theme.border.default }]} />
}

const styles = StyleSheet.create({
  line: {
    height: StyleSheet.hairlineWidth,
    marginVertical: Spacing.xs,
  },
  section: {
    height: Spacing.md,
  },
})
