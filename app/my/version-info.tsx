import { ScrollView, StyleSheet, Text, View, Pressable } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { FontFamily, FontSize, Radius, Spacing } from '@/constants/tokens'
import { useTheme } from '@/hooks/useTheme'

const APP_VERSION = '1.0.0'
const BUILD_NUMBER = '100'

const INFO_ROWS = [
  { label: '앱 버전', value: APP_VERSION },
  { label: '빌드 번호', value: BUILD_NUMBER },
  { label: '플랫폼', value: 'iOS / Android' },
  { label: '개발사', value: '경매의정석 주식회사' },
  { label: '문의 이메일', value: 'support@example.com' },
]

export default function VersionInfoScreen() {
  const theme = useTheme()

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg.base }]} edges={['top']}>
      <View style={[styles.navBar, { backgroundColor: theme.bg.surface, borderBottomColor: theme.border.default }]}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="arrow-back" size={24} color={theme.text.primary} />
        </Pressable>
        <Text style={[styles.navTitle, { color: theme.text.primary }]}>버전 정보</Text>
        <View style={styles.navSpacer} />
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={[styles.logoSection, { backgroundColor: theme.bg.surface }]}>
          <View style={[styles.logoCircle, { backgroundColor: theme.brand.primaryLight }]}>
            <Ionicons name="hammer-outline" size={40} color={theme.brand.primary} />
          </View>
          <Text style={[styles.appName, { color: theme.text.primary }]}>경매의정석</Text>
          <Text style={[styles.appVersion, { color: theme.text.secondary }]}>v{APP_VERSION}</Text>
        </View>

        <View style={[styles.infoCard, { backgroundColor: theme.bg.surface }]}>
          {INFO_ROWS.map((row, idx) => (
            <View key={row.label}>
              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, { color: theme.text.secondary }]}>{row.label}</Text>
                <Text style={[styles.infoValue, { color: theme.text.primary }]}>{row.value}</Text>
              </View>
              {idx < INFO_ROWS.length - 1 ? (
                <View style={[styles.separator, { backgroundColor: theme.border.default }]} />
              ) : null}
            </View>
          ))}
        </View>

        <Text style={[styles.copyright, { color: theme.text.tertiary }]}>
          {'Copyright © 2026 경매의정석\nAll rights reserved.'}
        </Text>
      </ScrollView>
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
  scroll: {
    flex: 1,
  },
  logoSection: {
    alignItems: 'center',
    paddingVertical: Spacing.section,
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: Radius.xxl,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  appName: {
    fontSize: FontSize.xxl,
    fontFamily: FontFamily.bold,
  },
  appVersion: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.regular,
  },
  infoCard: {
    marginBottom: Spacing.xxl,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.page,
    paddingVertical: 14,
  },
  infoLabel: {
    flex: 1,
    fontSize: FontSize.base,
    fontFamily: FontFamily.regular,
  },
  infoValue: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.medium,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    marginLeft: Spacing.page,
  },
  copyright: {
    textAlign: 'center',
    fontSize: FontSize.sm,
    fontFamily: FontFamily.regular,
    lineHeight: 20,
    paddingBottom: Spacing.section,
  },
})
