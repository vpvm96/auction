import { ScrollView, StyleSheet, Text, View, Pressable } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { Colors } from '@/constants/colors'
import { FontFamily, FontSize, Radius, Spacing } from '@/constants/tokens'
import { useAuthStore } from '@/lib/store/useAuthStore'

interface MenuItemProps {
  icon: React.ComponentProps<typeof Ionicons>['name']
  label: string
  onPress?: () => void
}

function MenuItem({ icon, label, onPress }: MenuItemProps) {
  return (
    <Pressable style={styles.menuItem} onPress={onPress}>
      <Ionicons name={icon} size={20} color={Colors.textSecondary} />
      <Text style={styles.menuLabel}>{label}</Text>
      <Ionicons name="chevron-forward" size={16} color={Colors.textTertiary} />
    </Pressable>
  )
}

export default function MyScreen() {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>MY</Text>
      </View>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {isLoggedIn ? (
          <View style={styles.loginBanner}>
            <View style={styles.avatarCircle}>
              <Ionicons name="person" size={32} color={Colors.primary} />
            </View>
            <View style={styles.loginText}>
              <Text style={styles.loginTitle}>{user?.name ?? ''}</Text>
              <Text style={styles.loginDesc}>{user?.email ?? ''}</Text>
            </View>
            <Pressable style={styles.logoutButton} onPress={logout}>
              <Text style={styles.logoutButtonText}>로그아웃</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.loginBanner}>
            <View style={styles.avatarCircle}>
              <Ionicons name="person" size={32} color={Colors.textTertiary} />
            </View>
            <View style={styles.loginText}>
              <Text style={styles.loginTitle}>로그인이 필요합니다</Text>
              <Text style={styles.loginDesc}>로그인하고 더 많은 기능을 이용하세요</Text>
            </View>
            <Pressable
              style={styles.loginButton}
              onPress={() => router.push('/auth/login')}
            >
              <Text style={styles.loginButtonText}>로그인</Text>
            </Pressable>
          </View>
        )}

        <View style={styles.menuSection}>
          <Text style={styles.sectionLabel}>경매 활동</Text>
          <View style={styles.menuCard}>
            <MenuItem
              icon="eye-outline"
              label="최근 본 물건"
              onPress={() => router.push('/my/recently-viewed')}
            />
            <View style={styles.menuDivider} />
            <MenuItem icon="heart-outline" label="관심목록" onPress={() => router.push('/(tabs)/favorites')} />
            <View style={styles.menuDivider} />
            <MenuItem
              icon="notifications-outline"
              label="알림 설정"
              onPress={() => router.push('/my/notifications')}
            />
          </View>
        </View>

        {isLoggedIn ? (
          <View style={styles.menuSection}>
            <Text style={styles.sectionLabel}>계정 관리</Text>
            <View style={styles.menuCard}>
              <MenuItem
                icon="person-outline"
                label="프로필 수정"
                onPress={() => router.push('/my/profile-edit')}
              />
              <View style={styles.menuDivider} />
              <MenuItem
                icon="trash-outline"
                label="회원 탈퇴"
                onPress={() => router.push('/my/delete-account')}
              />
            </View>
          </View>
        ) : null}

        <View style={styles.menuSection}>
          <Text style={styles.sectionLabel}>앱 설정</Text>
          <View style={styles.menuCard}>
            <MenuItem
              icon="information-circle-outline"
              label="버전 정보"
              onPress={() => router.push('/my/version-info')}
            />
            <View style={styles.menuDivider} />
            <MenuItem
              icon="document-text-outline"
              label="이용약관"
              onPress={() => router.push('/my/terms')}
            />
            <View style={styles.menuDivider} />
            <MenuItem
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
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: Spacing.page,
    paddingVertical: 14,
    backgroundColor: Colors.white,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: FontSize.xxl,
    fontFamily: FontFamily.bold,
    color: Colors.textPrimary,
  },
  scroll: {
    flex: 1,
  },
  loginBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    padding: Spacing.xxl,
    marginBottom: Spacing.md,
    gap: Spacing.xl,
  },
  avatarCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.border,
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
    color: Colors.textPrimary,
  },
  loginDesc: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  loginButton: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    paddingHorizontal: 14,
    paddingVertical: Spacing.md,
  },
  loginButtonText: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.bold,
    color: Colors.white,
  },
  logoutButton: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingHorizontal: 14,
    paddingVertical: Spacing.md,
  },
  logoutButtonText: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.medium,
    color: Colors.textSecondary,
  },
  menuSection: {
    marginBottom: Spacing.md,
  },
  sectionLabel: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.semibold,
    color: Colors.textSecondary,
    paddingHorizontal: Spacing.page,
    paddingVertical: Spacing.lg,
  },
  menuCard: {
    backgroundColor: Colors.card,
  },
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
    color: Colors.textPrimary,
    fontFamily: FontFamily.medium,
  },
  menuDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.border,
    marginLeft: 48,
  },
})
