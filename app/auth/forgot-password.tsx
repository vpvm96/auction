import { useState } from 'react'
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
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
            <Ionicons name="chevron-back" size={24} color={Colors.textPrimary} />
          </Pressable>
        </View>

        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <View style={styles.iconWrap}>
              <Ionicons name="mail-outline" size={28} color={Colors.primary} />
            </View>
            <Text style={styles.title}>비밀번호 재설정</Text>
            <Text style={styles.description}>
              가입하신 이메일 주소를 입력하시면{'\n'}
              비밀번호 재설정 링크를 보내드립니다.
            </Text>
          </View>

          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="이메일을 입력해주세요"
              placeholderTextColor={Colors.textTertiary}
              keyboardType="email-address"
              autoCapitalize="none"
              returnKeyType="done"
              onSubmitEditing={handleSend}
              autoCorrect={false}
              selectionColor={Colors.primary}
              underlineColorAndroid="transparent"
            />
          </View>

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
    backgroundColor: Colors.white,
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
    paddingHorizontal: Spacing.section,
    paddingBottom: Spacing.section * 2,
  },
  header: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 36,
    gap: Spacing.xl,
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: Radius.full,
    backgroundColor: Colors.primaryBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: 22,
    fontFamily: FontFamily.bold,
    color: Colors.textPrimary,
  },
  description: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontFamily: FontFamily.regular,
    textAlign: 'center',
    lineHeight: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 22,
    height: 54,
    marginBottom: Spacing.xxl,
  },
  input: {
    flex: 1,
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
    fontFamily: FontFamily.regular,
    padding: 0,
  },
  errorText: {
    fontSize: FontSize.sm,
    color: Colors.increase,
    fontFamily: FontFamily.regular,
    textAlign: 'center',
    marginBottom: Spacing.xxl,
  },
  sendButton: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    height: 54,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.section,
  },
  sendButtonDisabled: {
    opacity: 0.6,
  },
  sendButtonText: {
    fontSize: FontSize.xl,
    fontFamily: FontFamily.bold,
    color: Colors.white,
  },
  successCard: {
    backgroundColor: Colors.background,
    borderRadius: Radius.xl,
    padding: Spacing.section,
    alignItems: 'center',
    gap: Spacing.xl,
    marginBottom: Spacing.section,
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
    fontFamily: FontFamily.medium,
  },
})
