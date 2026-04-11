import { Ionicons } from '@expo/vector-icons'
import { Pressable, StyleSheet } from 'react-native'
import { useTheme } from '@/hooks/useTheme'
import { useThemeStore, type ThemePreference } from '@/lib/store/useThemeStore'
import { Spacing } from '@/constants/tokens'

type IconName = React.ComponentProps<typeof Ionicons>['name']

const PREFERENCE_ICON: Record<ThemePreference, IconName> = {
  system: 'contrast-outline',
  light: 'sunny-outline',
  dark: 'moon-outline',
}

const NEXT_PREFERENCE: Record<ThemePreference, ThemePreference> = {
  system: 'light',
  light: 'dark',
  dark: 'system',
}

export function ThemeToggleButton() {
  const theme = useTheme()
  const preference = useThemeStore((s) => s.preference)
  const setPreference = useThemeStore((s) => s.setPreference)

  const handlePress = () => {
    setPreference(NEXT_PREFERENCE[preference])
  }

  return (
    <Pressable style={styles.button} onPress={handlePress}>
      <Ionicons
        name={PREFERENCE_ICON[preference]}
        size={22}
        color={theme.text.secondary}
      />
    </Pressable>
  )
}

const styles = StyleSheet.create({
  button: {
    padding: Spacing.xs,
  },
})
