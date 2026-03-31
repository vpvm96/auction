import { Switch, StyleSheet, Text, View, Pressable } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { FontFamily, FontSize, Spacing } from '@/constants/tokens'
import { useNotificationStore, type NotificationSettings } from '@/lib/store/useNotificationStore'
import { useTheme } from '@/hooks/useTheme'
import type { ColorTheme } from '@/constants/theme'

interface SettingRowProps {
  label: string
  description: string
  value: boolean
  onToggle: () => void
  theme: ColorTheme
}

function SettingRow({ label, description, value, onToggle, theme }: SettingRowProps) {
  return (
    <View style={styles.settingRow}>
      <View style={styles.settingText}>
        <Text style={[styles.settingLabel, { color: theme.text.primary }]}>{label}</Text>
        <Text style={[styles.settingDesc, { color: theme.text.tertiary }]}>{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: theme.border.default, true: theme.brand.primaryLight }}
        thumbColor={value ? theme.brand.primary : theme.bg.elevated}
      />
    </View>
  )
}

const SETTING_KEYS: { key: keyof NotificationSettings; label: string; description: string }[] = [
  { key: 'auctionAlerts', label: '경매 알림', description: '관심 물건 경매 일정 및 결과 알림' },
  { key: 'priceAlerts', label: '낙찰가율 알림', description: '관심 지역 낙찰가율 변동 알림' },
  { key: 'systemAlerts', label: '시스템 알림', description: '서비스 점검, 공지사항 알림' },
]

export default function NotificationSettingsScreen() {
  const theme = useTheme()
  const settings = useNotificationStore((s) => s.settings)
  const toggleSetting = useNotificationStore((s) => s.toggleSetting)

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg.base }]} edges={['top']}>
      <View style={[styles.navBar, { backgroundColor: theme.bg.surface, borderBottomColor: theme.border.default }]}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="arrow-back" size={24} color={theme.text.primary} />
        </Pressable>
        <Text style={[styles.navTitle, { color: theme.text.primary }]}>알림 설정</Text>
        <View style={styles.navSpacer} />
      </View>

      <View style={[styles.settingsCard, { backgroundColor: theme.bg.surface }]}>
        {SETTING_KEYS.map((s, idx) => (
          <View key={s.key}>
            <SettingRow
              theme={theme}
              label={s.label}
              description={s.description}
              value={settings[s.key]}
              onToggle={() => toggleSetting(s.key)}
            />
            {idx < SETTING_KEYS.length - 1 ? (
              <View style={[styles.separator, { backgroundColor: theme.border.default }]} />
            ) : null}
          </View>
        ))}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.page,
    paddingVertical: Spacing.xl,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  navTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: FontSize.xl,
    fontFamily: FontFamily.bold,
    marginHorizontal: Spacing.xl,
  },
  navSpacer: {
    width: 24,
  },
  settingsCard: {
    marginTop: Spacing.xxl,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.page,
    paddingVertical: Spacing.xl,
    gap: Spacing.xl,
  },
  settingText: {
    flex: 1,
    gap: Spacing.xxs,
  },
  settingLabel: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.medium,
  },
  settingDesc: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.regular,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
  },
})
