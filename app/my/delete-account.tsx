import { useState } from 'react'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { FontFamily, FontSize, Radius, Spacing } from '@/constants/tokens'
import { useAuthStore } from '@/lib/store/useAuthStore'
import { useTheme } from '@/hooks/useTheme'

const DELETE_WARNINGS = [
  '관심목록 및 최근 본 물건이 삭제됩니다.',
  '알림 설정 및 개인화 정보가 삭제됩니다.',
  '경매 참여 이력이 삭제됩니다.',
  '삭제된 계정 정보는 복구할 수 없습니다.',
]

export default function DeleteAccountScreen() {
  const theme = useTheme()
  const deleteAccount = useAuthStore((s) => s.deleteAccount)
  const [confirmed, setConfirmed] = useState(false)

  const handleDelete = () => {
    deleteAccount()
    router.replace('/(tabs)')
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg.base }]} edges={['top', 'bottom']}>
      <View style={[styles.navBar, { backgroundColor: theme.bg.surface, borderBottomColor: theme.border.default }]}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="arrow-back" size={24} color={theme.text.primary} />
        </Pressable>
        <Text style={[styles.navTitle, { color: theme.text.primary }]}>회원 탈퇴</Text>
        <View style={styles.navSpacer} />
      </View>

      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.warningCard, { backgroundColor: theme.bg.surface }]}>
          <Ionicons name="warning" size={44} color={theme.status.warning} />
          <Text style={[styles.warningTitle, { color: theme.text.primary }]}>탈퇴 전 확인해주세요</Text>
          <Text style={[styles.warningDesc, { color: theme.text.secondary }]}>
            탈퇴하시면 아래 정보가 모두 삭제되며 복구할 수 없습니다.
          </Text>
        </View>

        <View style={[styles.infoCard, { backgroundColor: theme.bg.surface }]}>
          {DELETE_WARNINGS.map((item, idx) => (
            <View key={idx} style={styles.infoRow}>
              <View style={[styles.infoDot, { backgroundColor: theme.text.tertiary }]} />
              <Text style={[styles.infoText, { color: theme.text.secondary }]}>{item}</Text>
            </View>
          ))}
        </View>

        <Pressable
          style={styles.checkRow}
          onPress={() => setConfirmed((prev) => !prev)}
        >
          <View style={[
            styles.checkbox,
            { borderColor: theme.border.default, backgroundColor: theme.bg.surface },
            confirmed ? { backgroundColor: theme.status.danger, borderColor: theme.status.danger } : null,
          ]}>
            {confirmed ? (
              <Ionicons name="checkmark" size={14} color="#FFFFFF" />
            ) : null}
          </View>
          <Text style={[styles.checkLabel, { color: theme.text.primary }]}>
            위 내용을 확인하였으며 탈퇴에 동의합니다.
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.deleteButton,
            { backgroundColor: theme.status.danger },
            confirmed ? null : styles.deleteButtonDisabled,
          ]}
          onPress={handleDelete}
          disabled={!confirmed}
        >
          <Text style={styles.deleteButtonText}>탈퇴하기</Text>
        </Pressable>

        <Pressable style={styles.cancelLink} onPress={() => router.back()} hitSlop={8}>
          <Text style={[styles.cancelLinkText, { color: theme.text.secondary }]}>취소</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flex: {
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
  scrollContent: {
    paddingHorizontal: Spacing.page,
    paddingTop: Spacing.xxxl,
    paddingBottom: Spacing.section,
    gap: Spacing.xxl,
  },
  warningCard: {
    borderRadius: Radius.xl,
    padding: Spacing.xxxl,
    alignItems: 'center',
    gap: Spacing.xl,
  },
  warningTitle: {
    fontSize: FontSize.xl,
    fontFamily: FontFamily.bold,
  },
  warningDesc: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.regular,
    textAlign: 'center',
    lineHeight: 22,
  },
  infoCard: {
    borderRadius: Radius.xl,
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.xl,
    gap: Spacing.xl,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
  },
  infoDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    marginTop: 7,
  },
  infoText: {
    flex: 1,
    fontSize: FontSize.base,
    fontFamily: FontFamily.regular,
    lineHeight: 22,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xl,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: Radius.sm,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkLabel: {
    flex: 1,
    fontSize: FontSize.base,
    fontFamily: FontFamily.medium,
    lineHeight: 22,
  },
  deleteButton: {
    borderRadius: Radius.xl,
    paddingVertical: Spacing.xl,
    alignItems: 'center',
  },
  deleteButtonDisabled: {
    opacity: 0.4,
  },
  deleteButtonText: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.bold,
    color: '#FFFFFF',
  },
  cancelLink: {
    alignItems: 'center',
  },
  cancelLinkText: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.semibold,
  },
})
