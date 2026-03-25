import { useEffect, useState } from 'react'
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

export default function SignupScreen() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [localError, setLocalError] = useState<string | null>(null)

  const signup = useAuthStore((s) => s.signup)
  const isLoading = useAuthStore((s) => s.isLoading)
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)
  const storeError = useAuthStore((s) => s.error)
  const clearError = useAuthStore((s) => s.clearError)

  useEffect(() => {
    if (isLoggedIn) {
      router.replace('/(tabs)')
    }
  }, [isLoggedIn])

  const handleSignup = async () => {
    setLocalError(null)
    clearError()

    if (password !== confirmPassword) {
      setLocalError('비밀번호가 일치하지 않습니다.')
      return
    }

    await signup(name, email, password)
  }

  const displayError = localError ?? storeError

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
          <Text style={styles.navTitle}>회원가입</Text>
          <View style={styles.navSpacer} />
        </View>

        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.form}>
            <FormInput
              label="이름"
              value={name}
              onChangeText={setName}
              placeholder="이름을 입력해주세요"
              autoCapitalize="words"
              returnKeyType="next"
            />
            <FormInput
              label="이메일"
              value={email}
              onChangeText={setEmail}
              placeholder="이메일을 입력해주세요"
              keyboardType="email-address"
              autoCapitalize="none"
              returnKeyType="next"
            />
            <FormInput
              label="비밀번호"
              value={password}
              onChangeText={setPassword}
              placeholder="비밀번호 6자 이상"
              secureTextEntry
              returnKeyType="next"
            />
            <FormInput
              label="비밀번호 확인"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="비밀번호를 다시 입력해주세요"
              secureTextEntry
              returnKeyType="done"
              onSubmitEditing={handleSignup}
            />
          </View>

          {displayError != null ? (
            <Text style={styles.errorText}>{displayError}</Text>
          ) : null}

          <Pressable
            style={[styles.submitButton, isLoading ? styles.submitButtonDisabled : null]}
            onPress={handleSignup}
            disabled={isLoading}
          >
            <Text style={styles.submitButtonText}>
              {isLoading ? '가입 중...' : '가입하기'}
            </Text>
          </Pressable>

          <View style={styles.loginLinkRow}>
            <Text style={styles.loginLinkText}>이미 계정이 있으신가요? </Text>
            <Pressable onPress={() => router.back()} hitSlop={8}>
              <Text style={styles.loginLinkAction}>로그인</Text>
            </Pressable>
          </View>
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
  },
  navTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: FontSize.xl,
    fontFamily: FontFamily.bold,
    color: Colors.textPrimary,
  },
  navSpacer: {
    width: 24,
  },
  scrollContent: {
    paddingHorizontal: Spacing.page,
    paddingBottom: Spacing.section,
    gap: Spacing.xxl,
  },
  form: {
    gap: Spacing.xl,
  },
  errorText: {
    fontSize: FontSize.sm,
    color: Colors.increase,
    fontFamily: FontFamily.regular,
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.xl,
    paddingVertical: Spacing.xl,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.bold,
    color: Colors.white,
  },
  loginLinkRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginLinkText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontFamily: FontFamily.regular,
  },
  loginLinkAction: {
    fontSize: FontSize.sm,
    color: Colors.primary,
    fontFamily: FontFamily.semibold,
  },
})
