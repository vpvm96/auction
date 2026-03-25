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
import { EMAIL_REGEX } from '@/lib/validation'

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('')
  const [isSent, setIsSent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSend = async () => {
    setError(null)
    if (!EMAIL_REGEX.test(email)) {
      setError('올바른 이메일 형식을 입력해주세요.')
      return
    }
    setIsLoading(true)
    await new Promise<void>((resolve) => setTimeout(resolve, 500))
    setIsLoading(false)
    setIsSent(true)
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
          <Text style={styles.navTitle}>비밀번호 재설정</Text>
          <View style={styles.navSpacer} />
        </View>

        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.description}>
            가입하신 이메일 주소를 입력하시면 비밀번호 재설정 링크를 보내드립니다.
          </Text>

          <FormInput
            label="이메일"
            value={email}
            onChangeText={setEmail}
            placeholder="이메일을 입력해주세요"
            keyboardType="email-address"
            autoCapitalize="none"
            returnKeyType="done"
            onSubmitEditing={handleSend}
          />

          {error != null ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : null}

          {isSent ? (
            <View style={styles.successCard}>
              <Ionicons name="checkmark-circle" size={40} color={Colors.success} />
              <Text style={styles.successTitle}>이메일을 확인해주세요</Text>
              <Text style={styles.successDesc}>
                입력하신 이메일로 재설정 링크를 보냈습니다.
              </Text>
            </View>
          ) : (
            <Pressable
              style={[styles.sendButton, isLoading ? styles.sendButtonDisabled : null]}
              onPress={handleSend}
              disabled={isLoading}
            >
              <Text style={styles.sendButtonText}>
                {isLoading ? '전송 중...' : '재설정 링크 보내기'}
              </Text>
            </Pressable>
          )}

          <Pressable style={styles.backLink} onPress={() => router.back()} hitSlop={8}>
            <Text style={styles.backLinkText}>로그인으로 돌아가기</Text>
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
  description: {
    fontSize: FontSize.base,
    color: Colors.textSecondary,
    fontFamily: FontFamily.regular,
    lineHeight: 22,
  },
  errorText: {
    fontSize: FontSize.sm,
    color: Colors.increase,
    fontFamily: FontFamily.regular,
    textAlign: 'center',
  },
  sendButton: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.xl,
    paddingVertical: Spacing.xl,
    alignItems: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.6,
  },
  sendButtonText: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.bold,
    color: Colors.white,
  },
  successCard: {
    backgroundColor: Colors.card,
    borderRadius: Radius.xl,
    padding: Spacing.xxxl,
    alignItems: 'center',
    gap: Spacing.xl,
  },
  successTitle: {
    fontSize: FontSize.xl,
    fontFamily: FontFamily.bold,
    color: Colors.textPrimary,
  },
  successDesc: {
    fontSize: FontSize.base,
    color: Colors.textSecondary,
    fontFamily: FontFamily.regular,
    textAlign: 'center',
    lineHeight: 22,
  },
  backLink: {
    alignItems: 'center',
  },
  backLinkText: {
    fontSize: FontSize.sm,
    color: Colors.primary,
    fontFamily: FontFamily.semibold,
  },
})
