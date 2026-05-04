import { Switch, StyleSheet, Text, View, Pressable, Alert, AppState, type AppStateStatus } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import * as Notifications from 'expo-notifications'
import { useEffect, useState } from 'react'
import { FontFamily, FontSize, Radius, Spacing } from '@/constants/tokens'
import { useNotificationStore } from '@/lib/store/useNotificationStore'
import { useTheme } from '@/hooks/useTheme'
import { openPushSettings, type PushPermissionStatus } from '@/hooks/usePushNotifications'
import {
  useNotificationSettings,
  useUpdateNotificationSettings,
} from '@/lib/queries/notifications'
import { useAuthStore } from '@/lib/store/useAuthStore'
import { useToast } from '@/components/ui/toast'

export default function NotificationSettingsScreen() {
  const theme = useTheme()
  const toast = useToast()
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)

  const localEnabled = useNotificationStore((s) => s.settings.isEnabled)
  const setLocalEnabled = useNotificationStore((s) => s.setEnabled)

  const settingsQuery = useNotificationSettings({ enabled: isLoggedIn })
  const updateMutation = useUpdateNotificationSettings()

  // 서버 응답이 도착하면 로컬 store와 동기화 (오프라인/비로그인 시엔 로컬 값 사용)
  useEffect(() => {
    if (settingsQuery.data == null) return
    if (settingsQuery.data.isEnabled !== localEnabled) {
      setLocalEnabled(settingsQuery.data.isEnabled)
    }
  }, [settingsQuery.data, localEnabled, setLocalEnabled])

  const isEnabled = settingsQuery.data?.isEnabled ?? localEnabled

  const [permissionStatus, setPermissionStatus] =
    useState<PushPermissionStatus>('undetermined')

  const refreshPermission = async () => {
    const { status } = await Notifications.getPermissionsAsync()
    setPermissionStatus(status as PushPermissionStatus)
  }

  useEffect(() => {
    refreshPermission()

    const sub = AppState.addEventListener('change', (state: AppStateStatus) => {
      if (state === 'active') {
        refreshPermission()
      }
    })
    return () => sub.remove()
  }, [])

  const systemAllowed = permissionStatus === 'granted'
  const effectiveOn = isEnabled && systemAllowed

  const persistEnabled = (next: boolean) => {
    setLocalEnabled(next)
    if (!isLoggedIn) return
    updateMutation.mutate(
      { isEnabled: next },
      {
        onError: () => {
          setLocalEnabled(!next)
          toast.show({
            message: '설정 저장에 실패했어요. 다시 시도해주세요.',
            variant: 'error',
          })
        },
      },
    )
  }

  const promptOpenSettings = () => {
    Alert.alert(
      '시스템 알림이 꺼져 있어요',
      '경매 마감, 입찰 결과 등 중요한 소식을 받으려면 시스템 설정에서 알림을 허용해주세요.',
      [
        { text: '다음에', style: 'cancel' },
        {
          text: '설정 열기',
          onPress: () => {
            openPushSettings().catch(() => undefined)
          },
        },
      ],
    )
  }

  const handleToggle = async (next: boolean) => {
    if (!next) {
      persistEnabled(false)
      toast.show({ message: '알림이 꺼졌어요', variant: 'info' })
      return
    }

    if (systemAllowed) {
      persistEnabled(true)
      toast.show({ message: '알림이 켜졌어요', variant: 'success' })
      return
    }

    if (permissionStatus === 'undetermined') {
      const { status } = await Notifications.requestPermissionsAsync()
      setPermissionStatus(status as PushPermissionStatus)
      if (status === 'granted') {
        persistEnabled(true)
        toast.show({ message: '알림이 켜졌어요', variant: 'success' })
        return
      }
    }

    persistEnabled(true)
    toast.show({
      message: '시스템 알림을 켜주세요',
      variant: 'warning',
    })
    promptOpenSettings()
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg.base }]} edges={['top']}>
      <View
        style={[
          styles.navBar,
          { backgroundColor: theme.bg.surface, borderBottomColor: theme.border.default },
        ]}
      >
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="arrow-back" size={24} color={theme.text.primary} />
        </Pressable>
        <Text style={[styles.navTitle, { color: theme.text.primary }]}>알림 설정</Text>
        <View style={styles.navSpacer} />
      </View>

      <View style={[styles.settingsCard, { backgroundColor: theme.bg.surface }]}>
        <View style={styles.settingRow}>
          <View style={styles.settingText}>
            <Text style={[styles.settingLabel, { color: theme.text.primary }]}>푸시 알림</Text>
            <Text style={[styles.settingDesc, { color: theme.text.tertiary }]}>
              경매 일정, 입찰 결과 등 모든 알림을 받습니다
            </Text>
          </View>
          <Switch
            value={effectiveOn}
            onValueChange={handleToggle}
            disabled={updateMutation.isPending}
            trackColor={{ false: theme.border.default, true: theme.brand.primaryLight }}
            thumbColor={effectiveOn ? theme.brand.primary : theme.bg.elevated}
          />
        </View>
      </View>

      {isEnabled && !systemAllowed ? (
        <Pressable
          style={[
            styles.banner,
            { backgroundColor: theme.bg.surface, borderColor: theme.border.subtle },
          ]}
          onPress={() => {
            openPushSettings().catch(() => undefined)
          }}
          accessibilityRole="button"
          accessibilityLabel="시스템 알림 설정 열기"
        >
          <Ionicons
            name="notifications-off-outline"
            size={20}
            color={theme.status.danger}
          />
          <View style={styles.bannerText}>
            <Text style={[styles.bannerTitle, { color: theme.text.primary }]}>
              시스템 알림이 꺼져 있어요
            </Text>
            <Text style={[styles.bannerDesc, { color: theme.text.tertiary }]}>
              알림을 받으려면 시스템 설정에서 허용해주세요
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={theme.text.tertiary} />
        </Pressable>
      ) : null}
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
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginTop: Spacing.xl,
    marginHorizontal: Spacing.page,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
  },
  bannerText: {
    flex: 1,
    gap: Spacing.xxs,
  },
  bannerTitle: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.semibold,
  },
  bannerDesc: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.regular,
  },
})
