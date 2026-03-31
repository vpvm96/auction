import { StyleSheet, Text, View, Pressable } from 'react-native'
import { useTheme } from '@/hooks/useTheme'
import { FontFamily, FontSize, Spacing } from '@/constants/tokens'

interface SectionHeaderProps {
  title: string
  /** Right-side action label (e.g. "전체보기") */
  action?: string
  onActionPress?: () => void
}

export function SectionHeader({ title, action, onActionPress }: SectionHeaderProps) {
  const theme = useTheme()

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.text.primary }]}>{title}</Text>
      {action != null ? (
        <Pressable onPress={onActionPress} hitSlop={8}>
          <Text style={[styles.action, { color: theme.text.brand }]}>{action}</Text>
        </Pressable>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.page,
    marginBottom: Spacing.xl,
  },
  title: {
    fontSize: FontSize.lg,
    fontFamily: FontFamily.bold,
  },
  action: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.medium,
  },
})
