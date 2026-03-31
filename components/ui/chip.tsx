/**
 * Chip / Tag Component
 *
 * 카테고리 필터, 선택 상태, 태그 등에 사용하는 작은 알약형 UI.
 * selected 상태를 지원하며, onPress를 주면 토글 가능.
 *
 * 사용 예:
 *   <Chip label="아파트" />
 *   <Chip label="선택됨" selected />
 *   <Chip label="필터" selected onPress={() => setSelected(!selected)} />
 */
import { Pressable, StyleSheet, Text } from 'react-native'
import { useTheme } from '@/hooks/useTheme'
import { FontFamily, FontSize, Radius, Spacing } from '@/constants/tokens'

interface ChipProps {
  label: string
  selected?: boolean
  onPress?: () => void
}

export function Chip({ label, selected = false, onPress }: ChipProps) {
  const theme = useTheme()

  return (
    <Pressable
      style={[
        styles.base,
        {
          backgroundColor: selected ? theme.brand.primary : theme.bg.surface,
          borderColor: selected ? theme.brand.primary : theme.border.default,
        },
      ]}
      onPress={onPress}
      disabled={onPress == null}
    >
      <Text
        style={[
          styles.label,
          {
            color: selected ? theme.brand.onPrimary : theme.text.secondary,
          },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  base: {
    borderRadius: Radius.pill,
    borderWidth: 1,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.sm + 1,
  },
  label: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.medium,
  },
})
