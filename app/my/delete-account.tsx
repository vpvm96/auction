import { useState } from 'react'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { Colors } from '@/constants/colors'
import { FontFamily, FontSize, Radius, Spacing } from '@/constants/tokens'
import { useAuthStore } from '@/lib/store/useAuthStore'

const DELETE_WARNINGS = [
  '관심목록 및 최근 본 물건이 삭제됩니다.',
  '알림 설정 및 개인화 정보가 삭제됩니다.',
  '경매 참여 이력이 삭제됩니다.',
  '삭제된 계정 정보는 복구할 수 없습니다.',
]

export default function DeleteAccountScreen() {
  const deleteAccount = useAuthStore((s) => s.deleteAccount)
  const [confirmed, setConfirmed] = useState(false)

  const handleDelete = () => {
    deleteAccount()
    router.replace('/(tabs)')
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.navBar}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </Pressable>
        <Text style={styles.navTitle}>회원 탈퇴</Text>
        <View style={styles.navSpacer} />
      </View>

      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.warningCard}>
          <Ionicons name="warning" size={44} color={Colors.warning} />
          <Text style={styles.warningTitle}>탈퇴 전 확인해주세요</Text>
          <Text style={styles.warningDesc}>
            탈퇴하시면 아래 정보가 모두 삭제되며 복구할 수 없습니다.
          </Text>
        </View>

        <View style={styles.infoCard}>
          {DELETE_WARNINGS.map((item, idx) => (
            <View key={idx} style={styles.infoRow}>
              <View style={styles.infoDot} />
              <Text style={styles.infoText}>{item}</Text>
            </View>
          ))}
        </View>

        <Pressable
          style={styles.checkRow}
          onPress={() => setConfirmed((prev) => !prev)}
        >
          <View style={[styles.checkbox, confirmed ? styles.checkboxChecked : null]}>
            {confirmed ? (
              <Ionicons name="checkmark" size={14} color={Colors.white} />
            ) : null}
          </View>
          <Text style={styles.checkLabel}>
            위 내용을 확인하였으며 탈퇴에 동의합니다.
          </Text>
        </Pressable>

        <Pressable
          style={[styles.deleteButton, confirmed ? null : styles.deleteButtonDisabled]}
          onPress={handleDelete}
          disabled={!confirmed}
        >
          <Text style={styles.deleteButtonText}>탈퇴하기</Text>
        </Pressable>

        <Pressable style={styles.cancelLink} onPress={() => router.back()} hitSlop={8}>
          <Text style={styles.cancelLinkText}>취소</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  flex: {
    flex: 1,
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
  scrollContent: {
    paddingHorizontal: Spacing.page,
    paddingTop: Spacing.xxxl,
    paddingBottom: Spacing.section,
    gap: Spacing.xxl,
  },
  warningCard: {
    backgroundColor: Colors.card,
    borderRadius: Radius.xl,
    padding: Spacing.xxxl,
    alignItems: 'center',
    gap: Spacing.xl,
  },
  warningTitle: {
    fontSize: FontSize.xl,
    fontFamily: FontFamily.bold,
    color: Colors.textPrimary,
  },
  warningDesc: {
    fontSize: FontSize.base,
    color: Colors.textSecondary,
    fontFamily: FontFamily.regular,
    textAlign: 'center',
    lineHeight: 22,
  },
  infoCard: {
    backgroundColor: Colors.card,
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
    backgroundColor: Colors.textTertiary,
    marginTop: 7,
  },
  infoText: {
    flex: 1,
    fontSize: FontSize.base,
    color: Colors.textSecondary,
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
    borderColor: Colors.border,
    backgroundColor: Colors.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: Colors.increase,
    borderColor: Colors.increase,
  },
  checkLabel: {
    flex: 1,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
    fontFamily: FontFamily.medium,
    lineHeight: 22,
  },
  deleteButton: {
    backgroundColor: Colors.increase,
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
    color: Colors.white,
  },
  cancelLink: {
    alignItems: 'center',
  },
  cancelLinkText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontFamily: FontFamily.semibold,
  },
})
