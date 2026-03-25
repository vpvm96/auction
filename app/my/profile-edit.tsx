import { useState } from 'react'
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { FormInput } from '@/components/auth/form-input'
import { Colors } from '@/constants/colors'
import { FontFamily, FontSize, Radius, Spacing } from '@/constants/tokens'
import { useAuthStore } from '@/lib/store/useAuthStore'

export default function ProfileEditScreen() {
  const user = useAuthStore((s) => s.user)
  const updateProfile = useAuthStore((s) => s.updateProfile)

  const [name, setName] = useState(user?.name ?? '')
  const [error, setError] = useState<string | null>(null)
  const [isSaved, setIsSaved] = useState(false)

  const handleSave = () => {
    if (name.trim().length === 0) {
      setError('이름을 입력해주세요.')
      return
    }
    setError(null)
    updateProfile(name.trim())
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 2000)
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.navBar}>
          <Pressable onPress={() => router.back()} hitSlop={8}>
            <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
          </Pressable>
          <Text style={styles.navTitle}>프로필 수정</Text>
          <View style={styles.navSpacer} />
        </View>

        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <FormInput
            label="이름"
            value={name}
            onChangeText={(text) => {
              setName(text)
              setError(null)
            }}
            placeholder="이름을 입력해주세요"
            returnKeyType="done"
            onSubmitEditing={handleSave}
            error={error ?? undefined}
          />

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>이메일</Text>
            <View style={styles.readonlyWrapper}>
              <Text style={styles.readonlyText}>{user?.email ?? ''}</Text>
            </View>
            <Text style={styles.fieldHint}>이메일은 변경할 수 없습니다.</Text>
          </View>

          {isSaved ? (
            <View style={styles.successRow}>
              <Ionicons name="checkmark-circle" size={18} color={Colors.success} />
              <Text style={styles.successText}>저장되었습니다.</Text>
            </View>
          ) : null}

          <Pressable style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>저장하기</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
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
  fieldGroup: {
    gap: Spacing.xs,
  },
  fieldLabel: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.semibold,
    color: Colors.textPrimary,
  },
  readonlyWrapper: {
    backgroundColor: Colors.border,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.xl,
  },
  readonlyText: {
    fontSize: FontSize.base,
    color: Colors.textSecondary,
    fontFamily: FontFamily.regular,
  },
  fieldHint: {
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
    fontFamily: FontFamily.regular,
  },
  successRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
  },
  successText: {
    fontSize: FontSize.sm,
    color: Colors.success,
    fontFamily: FontFamily.semibold,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.xl,
    paddingVertical: Spacing.xl,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.bold,
    color: Colors.white,
  },
})
