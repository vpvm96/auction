import { StyleSheet, Text, View } from 'react-native'
import { Colors } from '@/constants/colors'
import { FontFamily, FontSize, Radius, Spacing } from '@/constants/tokens'

type BadgeVariant = 'primary' | 'danger' | 'success' | 'neutral'

interface BadgeProps {
  label: string
  variant?: BadgeVariant
}

export function Badge({ label, variant = 'primary' }: BadgeProps) {
  return (
    <View style={[styles.base, variantBgStyles[variant]]}>
      <Text style={[styles.text, variantTextStyles[variant]]}>{label}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  base: {
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xxs,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.bold,
  },
})

const variantBgStyles = StyleSheet.create({
  primary: { backgroundColor: Colors.primaryBg },
  danger: { backgroundColor: '#FFF5F5' },
  success: { backgroundColor: Colors.success },
  neutral: { backgroundColor: Colors.border },
})

const variantTextStyles = StyleSheet.create({
  primary: { color: Colors.primary },
  danger: { color: Colors.increase },
  success: { color: Colors.white },
  neutral: { color: Colors.textSecondary },
})
