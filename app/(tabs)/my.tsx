import { ScrollView, StyleSheet, Text, View, Pressable } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { FontFamily, FontSize, Radius, Spacing } from '@/constants/tokens'
import { useAuthStore } from '@/lib/store/useAuthStore'
import { useTheme } from '@/hooks/useTheme'
import type { ColorTheme } from '@/constants/theme'

interface MenuItemProps {
  icon: React.ComponentProps<typeof Ionicons>['name']
  label: string
  onPress?: () => void
  theme: ColorTheme
}

function MenuItem({ icon, label, onPress, theme }: MenuItemProps) {
  return (
    <Pressable style={styles.menuItem} onPress={onPress}>
      <Ionicons name={icon} size={20} color={theme.text.secondary} />
      <Text style={[styles.menuLabel, { color: theme.text.primary }]}>{label}</Text>
      <Ionicons name="chevron-forward" size={16} color={theme.text.tertiary} />
    </Pressable>
  )
}

export default function MyScreen() {
  const theme = useTheme()
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg.base }]} edges={['top']}>
      <View style={[styles.header, { backgroundColor: theme.bg.surface, borderBottomColor: theme.border.default }]}>
        <Text style={[styles.headerTitle, { color: theme.text.primary }]}>MY</Text>
      </View>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {isLoggedIn ? (
          <View style={[styles.loginBanner, { backgroundColor: theme.bg.surface }]}>
            <View style={[styles.avatarCircle, { backgroundColor: theme.border.default }]}>
              <Ionicons name="person" size={32} color={theme.brand.primary} />
            </View>
            <View style={styles.loginText}>
              <Text style={[styles.loginTitle, { color: theme.text.primary }]}>{user?.name ?? ''}</Text>
              <Text style={[styles.loginDesc, { color: theme.text.secondary }]}>{user?.email ?? ''}</Text>
            </View>
            <Pressable style={[styles.logoutButton, { borderColor: theme.border.default }]} onPress={logout}>
              <Text style={[styles.logoutButtonText, { color: theme.text.secondary }]}>로그아웃</Text>
            </Pressable>
          </View>
        ) : (
          <View style={[styles.loginBanner, { backgroundColor: theme.bg.surface }]}>
            <View style={[styles.avatarCircle, { backgroundColor: theme.border.default }]}>
              <Ionicons name="person" size={32} color={theme.text.tertiary} />
            </View>
            <View style={styles.loginText}>
              <Text style={[styles.loginTitle, { color: theme.text.primary }]}>로그인이 필요합니다</Text>
              <Text style={[styles.loginDesc, { color: theme.text.secondary }]}>로그인하고 더 많은 기능을 이용하세요</Text>
            </View>
            <Pressable
              style={[styles.loginButton, { backgroundColor: theme.brand.primary }]}
              onPress={() => router.push('/auth/login')}
            >
              <Text style={[styles.loginButtonText, { color: theme.brand.onPrimary }]}>로그인</Text>
            </Pressable>
          </View>
        )}

        <View style={styles.menuSection}>
          <Text style={[styles.sectionLabel, { color: theme.text.secondary }]}>경매 활동</Text>
          <View style={[styles.menuCard, { backgroundColor: theme.bg.surface }]}>
            <MenuItem
              theme={theme}
              icon="eye-outline"
              label="최근 본 물건"
              onPress={() => router.push('/my/recently-viewed')}
            />
            <View style={[styles.menuDivider, { backgroundColor: theme.border.default }]} />
            <MenuItem theme={theme} icon="heart-outline" label="관심목록" onPress={() => router.push('/(tabs)/favorites')} />
            <View style={[styles.menuDivider, { backgroundColor: theme.border.default }]} />
            <MenuItem
              theme={theme}
              icon="notifications-outline"
              label="알림 설정"
              onPress={() => router.push('/my/notifications')}
            />
          </View>
        </View>

        {isLoggedIn ? (
          <View style={styles.menuSection}>
            <Text style={[styles.sectionLabel, { color: theme.text.secondary }]}>계정 관리</Text>
            <View style={[styles.menuCard, { backgroundColor: theme.bg.surface }]}>
              <MenuItem
                theme={theme}
                icon="person-outline"
                label="프로필 수정"
                onPress={() => router.push('/my/profile-edit')}
              />
              <View style={[styles.menuDivider, { backgroundColor: theme.border.default }]} />
              <MenuItem
                theme={theme}
                icon="trash-outline"
                label="회원 탈퇴"
                onPress={() => router.push('/my/delete-account')}
              />
            </View>
          </View>
        ) : null}

        <View style={styles.menuSection}>
          <Text style={[styles.sectionLabel, { color: theme.text.secondary }]}>앱 설정</Text>
          <View style={[styles.menuCard, { backgroundColor: theme.bg.surface }]}>
            <MenuItem
              theme={theme}
              icon="information-circle-outline"
              label="버전 정보"
              onPress={() => router.push('/my/version-info')}
            />
            <View style={[styles.menuDivider, { backgroundColor: theme.border.default }]} />
            <MenuItem
              theme={theme}
              icon="document-text-outline"
              label="이용약관"
              onPress={() => router.push('/my/terms')}
            />
            <View style={[styles.menuDivider, { backgroundColor: theme.border.default }]} />
            <MenuItem
              theme={theme}
              icon="lock-closed-outline"
              label="개인정보처리방침"
              onPress={() => router.push('/my/privacy')}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.page,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerTitle: {
    fontSize: FontSize.xxl,
    fontFamily: FontFamily.bold,
  },
  scroll: {
    flex: 1,
  },
  loginBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.xxl,
    marginBottom: Spacing.md,
    gap: Spacing.xl,
  },
  avatarCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    flex: 1,
    gap: Spacing.xs,
  },
  loginTitle: {
    fontSize: FontSize.lg,
    fontFamily: FontFamily.bold,
  },
  loginDesc: {
    fontSize: FontSize.sm,
  },
  loginButton: {
    borderRadius: Radius.md,
    paddingHorizontal: 14,
    paddingVertical: Spacing.md,
  },
  loginButtonText: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.bold,
  },
  logoutButton: {
    borderWidth: 1,
    borderRadius: Radius.md,
    paddingHorizontal: 14,
    paddingVertical: Spacing.md,
  },
  logoutButtonText: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.medium,
  },
  menuSection: {
    marginBottom: Spacing.md,
  },
  sectionLabel: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.semibold,
    paddingHorizontal: Spacing.page,
    paddingVertical: Spacing.lg,
  },
  menuCard: {},
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.page,
    paddingVertical: 14,
    gap: Spacing.xl,
  },
  menuLabel: {
    flex: 1,
    fontSize: FontSize.base,
    fontFamily: FontFamily.medium,
  },
  menuDivider: {
    height: StyleSheet.hairlineWidth,
    marginLeft: 48,
  },
})
