import { StyleSheet, Text, View, Pressable } from 'react-native'
import { Colors } from '@/constants/colors'
import { FontFamily, FontSize, Spacing } from '@/constants/tokens'

interface SectionHeaderProps {
  title: string
  /** Right-side action label (e.g. "상세보기 →") */
  action?: string
  onActionPress?: () => void
}

export function SectionHeader({ title, action, onActionPress }: SectionHeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {action != null ? (
        <Pressable onPress={onActionPress} hitSlop={8}>
          <Text style={styles.action}>{action}</Text>
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
    color: Colors.textPrimary,
  },
  action: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
})
