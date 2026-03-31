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
import { FontFamily, FontSize, Radius, Spacing } from '@/constants/tokens'
import { useAuthStore } from '@/lib/store/useAuthStore'
import { useTheme } from '@/hooks/useTheme'

export default function ProfileEditScreen() {
  const theme = useTheme()
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
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg.base }]} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={[styles.navBar, { backgroundColor: theme.bg.surface, borderBottomColor: theme.border.default }]}>
          <Pressable onPress={() => router.back()} hitSlop={8}>
            <Ionicons name="arrow-back" size={24} color={theme.text.primary} />
          </Pressable>
          <Text style={[styles.navTitle, { color: theme.text.primary }]}>프로필 수정</Text>
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
            <Text style={[styles.fieldLabel, { color: theme.text.primary }]}>이메일</Text>
            <View style={[styles.readonlyWrapper, { backgroundColor: theme.bg.sunken, borderColor: theme.border.default }]}>
              <Text style={[styles.readonlyText, { color: theme.text.secondary }]}>{user?.email ?? ''}</Text>
            </View>
            <Text style={[styles.fieldHint, { color: theme.text.tertiary }]}>이메일은 변경할 수 없습니다.</Text>
          </View>

          {isSaved ? (
            <View style={styles.successRow}>
              <Ionicons name="checkmark-circle" size={18} color={theme.status.success} />
              <Text style={[styles.successText, { color: theme.status.success }]}>저장되었습니다.</Text>
            </View>
          ) : null}

          <Pressable style={[styles.saveButton, { backgroundColor: theme.brand.primary }]} onPress={handleSave}>
            <Text style={[styles.saveButtonText, { color: theme.brand.onPrimary }]}>저장하기</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
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
  fieldGroup: {
    gap: Spacing.xs,
  },
  fieldLabel: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.semibold,
  },
  readonlyWrapper: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.xl,
  },
  readonlyText: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.regular,
  },
  fieldHint: {
    fontSize: FontSize.xs,
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
    fontFamily: FontFamily.semibold,
  },
  saveButton: {
    borderRadius: Radius.xl,
    paddingVertical: Spacing.xl,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.bold,
  },
})
