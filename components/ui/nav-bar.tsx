import { StyleSheet, Text, View, Pressable } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { Colors } from '@/constants/colors'
import { FontFamily, FontSize, Spacing } from '@/constants/tokens'

interface NavBarProps {
  title: string
  rightAction?: React.ReactNode
}

export function NavBar({ title, rightAction }: NavBarProps) {
  return (
    <View style={styles.container}>
      <Pressable onPress={() => router.back()} hitSlop={8}>
        <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
      </Pressable>
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
      {rightAction != null ? rightAction : <View style={styles.spacer} />}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.page,
    paddingVertical: Spacing.xl,
    backgroundColor: Colors.card,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: FontSize.xl,
    fontFamily: FontFamily.bold,
    color: Colors.textPrimary,
    marginHorizontal: Spacing.xl,
  },
  spacer: {
    width: 24,
  },
})
