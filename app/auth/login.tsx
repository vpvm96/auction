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
import { SocialLoginButton } from '@/components/auth/social-login-button'
import { Colors } from '@/constants/colors'
import { FontFamily, FontSize, Radius, Spacing } from '@/constants/tokens'
import { useAuthStore } from '@/lib/store/useAuthStore'

export default function LoginScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const login = useAuthStore((s) => s.login)
  const isLoading = useAuthStore((s) => s.isLoading)
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)
  const error = useAuthStore((s) => s.error)
  const clearError = useAuthStore((s) => s.clearError)

  useEffect(() => {
    if (isLoggedIn) {
      router.replace('/(tabs)')
    }
  }, [isLoggedIn])

  const handleLogin = async () => {
    clearError()
    await login(email, password)
  }

  const handleSocialLogin = () => {
    // SNS 로그인 미구현 (목업)
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
        </View>

        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.title}>로그인</Text>
            <Text style={styles.subtitle}>경매 정보를 더 편리하게 이용하세요</Text>
          </View>

          <View style={styles.form}>
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
              placeholder="비밀번호를 입력해주세요"
              secureTextEntry
              returnKeyType="done"
              onSubmitEditing={handleLogin}
            />
          </View>

          {error != null ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : null}

          <Pressable
            style={[styles.loginButton, isLoading ? styles.loginButtonDisabled : null]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text style={styles.loginButtonText}>
              {isLoading ? '로그인 중...' : '로그인'}
            </Text>
          </Pressable>

          <View style={styles.linkRow}>
            <Pressable onPress={() => router.push('/auth/forgot-password')} hitSlop={8}>
              <Text style={styles.linkSecondary}>비밀번호 찾기</Text>
            </Pressable>
            <Pressable onPress={() => router.push('/auth/signup')} hitSlop={8}>
              <Text style={styles.linkPrimary}>회원가입</Text>
            </Pressable>
          </View>

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>또는</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.socialList}>
            <SocialLoginButton provider="kakao" onPress={handleSocialLogin} />
            <SocialLoginButton provider="naver" onPress={handleSocialLogin} />
            <SocialLoginButton provider="apple" onPress={handleSocialLogin} />
            <SocialLoginButton provider="google" onPress={handleSocialLogin} />
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
  scrollContent: {
    paddingHorizontal: Spacing.page,
    paddingBottom: Spacing.section,
    gap: Spacing.xxl,
  },
  header: {
    gap: Spacing.xs,
    marginTop: Spacing.xl,
  },
  title: {
    fontSize: FontSize.display,
    fontFamily: FontFamily.extrabold,
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: FontSize.base,
    color: Colors.textSecondary,
    fontFamily: FontFamily.regular,
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
  loginButton: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.xl,
    paddingVertical: Spacing.xl,
    alignItems: 'center',
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.bold,
    color: Colors.white,
  },
  linkRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  linkSecondary: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontFamily: FontFamily.regular,
  },
  linkPrimary: {
    fontSize: FontSize.sm,
    color: Colors.primary,
    fontFamily: FontFamily.semibold,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xl,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    fontSize: FontSize.sm,
    color: Colors.textTertiary,
    fontFamily: FontFamily.regular,
  },
  socialList: {
    gap: Spacing.xl,
  },
})
