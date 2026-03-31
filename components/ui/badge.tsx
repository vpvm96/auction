/**
 * Badge Component
 *
 * variants:
 *   primary   — 브랜드 (낙찰가 비율, 카테고리)
 *   danger    — 경고/유찰 (빨간 계열)
 *   success   — 성공/낙찰 (초록 계열)
 *   warning   — 주의 (황금 계열)
 *   neutral   — 기본 정보 (회색)
 *   hot       — 경쟁 치열 (로즈)
 *   upcoming  — 예정 (보라)
 *
 * outline 모드를 추가로 지원 (배경 없이 테두리만).
 */
import { StyleSheet, Text, View } from 'react-native'
import { useTheme } from '@/hooks/useTheme'
import { FontFamily, FontSize, Radius, Spacing } from '@/constants/tokens'

export type BadgeVariant =
  | 'primary'
  | 'danger'
  | 'success'
  | 'warning'
  | 'neutral'
  | 'hot'
  | 'upcoming'

interface BadgeProps {
  label: string
  variant?: BadgeVariant
  outline?: boolean
}

export function Badge({ label, variant = 'primary', outline = false }: BadgeProps) {
  const theme = useTheme()

  const { bg, text } = variantColors(theme, variant)

  return (
    <View
      style={[
        styles.base,
        {
          backgroundColor: outline ? 'transparent' : bg,
          borderWidth: outline ? 1 : 0,
          borderColor: outline ? text : 'transparent',
        },
      ]}
    >
      <Text style={[styles.text, { color: text }]}>{label}</Text>
    </View>
  )
}

function variantColors(theme: ReturnType<typeof useTheme>, variant: BadgeVariant) {
  switch (variant) {
    case 'primary':
      return { bg: theme.brand.primaryLight, text: theme.text.brand }
    case 'danger':
      return { bg: theme.status.dangerBg, text: theme.status.danger }
    case 'success':
      return { bg: theme.status.successBg, text: theme.status.success }
    case 'warning':
      return { bg: theme.status.warningBg, text: theme.status.warning }
    case 'neutral':
      return { bg: theme.bg.sunken, text: theme.text.secondary }
    case 'hot':
      return { bg: theme.auction.hotBg, text: theme.auction.hot }
    case 'upcoming':
      return { bg: theme.auction.upcomingBg, text: theme.auction.upcoming }
  }
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
