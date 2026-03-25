import { ScrollView, StyleSheet, Text, View, Pressable } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { Colors } from '@/constants/colors'
import { FontFamily, FontSize, Radius, Spacing } from '@/constants/tokens'

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
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.navBar}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </Pressable>
        <Text style={styles.navTitle}>버전 정보</Text>
        <View style={styles.navSpacer} />
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.logoSection}>
          <View style={styles.logoCircle}>
            <Ionicons name="hammer-outline" size={40} color={Colors.primary} />
          </View>
          <Text style={styles.appName}>경매의정석</Text>
          <Text style={styles.appVersion}>v{APP_VERSION}</Text>
        </View>

        <View style={styles.infoCard}>
          {INFO_ROWS.map((row, idx) => (
            <View key={row.label}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>{row.label}</Text>
                <Text style={styles.infoValue}>{row.value}</Text>
              </View>
              {idx < INFO_ROWS.length - 1 ? <View style={styles.separator} /> : null}
            </View>
          ))}
        </View>

        <Text style={styles.copyright}>
          {'Copyright © 2026 경매의정석\nAll rights reserved.'}
        </Text>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.page,
    paddingVertical: Spacing.xl,
    backgroundColor: Colors.card,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  navTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: FontSize.xl,
    fontFamily: FontFamily.bold,
    color: Colors.textPrimary,
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
    backgroundColor: Colors.card,
    marginBottom: Spacing.md,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: Radius.xxl,
    backgroundColor: Colors.primaryBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  appName: {
    fontSize: FontSize.xxl,
    fontFamily: FontFamily.bold,
    color: Colors.textPrimary,
  },
  appVersion: {
    fontSize: FontSize.base,
    color: Colors.textSecondary,
    fontFamily: FontFamily.regular,
  },
  infoCard: {
    backgroundColor: Colors.card,
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
    color: Colors.textSecondary,
    fontFamily: FontFamily.regular,
  },
  infoValue: {
    fontSize: FontSize.base,
    color: Colors.textPrimary,
    fontFamily: FontFamily.medium,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.border,
    marginLeft: Spacing.page,
  },
  copyright: {
    textAlign: 'center',
    fontSize: FontSize.sm,
    color: Colors.textTertiary,
    fontFamily: FontFamily.regular,
    lineHeight: 20,
    paddingBottom: Spacing.section,
  },
})
