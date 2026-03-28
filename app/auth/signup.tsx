import { useEffect, useRef, useState } from 'react'
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import Animated, {
  FadeInDown,
  FadeInUp,
  FadeOutUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated'
import { Colors } from '@/constants/colors'
import { FontFamily, FontSize, Radius, Spacing } from '@/constants/tokens'
import { useAuthStore } from '@/lib/store/useAuthStore'
import { EMAIL_REGEX } from '@/lib/validation'

const TOTAL_STEPS = 4

const STEP_CONFIG = [
  {
    title: '반가워요!\n이름이 무엇인가요?',
    subtitle: 'HB Auction에서 사용할 이름을 알려주세요',
    placeholder: '홍길동',
    keyboardType: 'default' as const,
    autoCapitalize: 'words' as const,
    secureTextEntry: false,
    hasEye: false,
  },
  {
    title: '이메일을\n입력해주세요',
    subtitle: '로그인에 사용할 이메일이에요',
    placeholder: 'example@email.com',
    keyboardType: 'email-address' as const,
    autoCapitalize: 'none' as const,
    secureTextEntry: false,
    hasEye: false,
  },
  {
    title: '비밀번호를\n설정해주세요',
    subtitle: '영문, 숫자 포함 6자 이상',
    placeholder: '비밀번호 입력',
    keyboardType: 'default' as const,
    autoCapitalize: 'none' as const,
    secureTextEntry: true,
    hasEye: true,
  },
  {
    title: '비밀번호를\n한 번 더 확인할게요',
    subtitle: '동일한 비밀번호를 입력해주세요',
    placeholder: '비밀번호 재입력',
    keyboardType: 'default' as const,
    autoCapitalize: 'none' as const,
    secureTextEntry: true,
    hasEye: true,
  },
]

export default function SignupScreen() {
  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [localError, setLocalError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const inputRef = useRef<TextInput>(null)

  const signup = useAuthStore((s) => s.signup)
  const isLoading = useAuthStore((s) => s.isLoading)
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)
  const storeError = useAuthStore((s) => s.error)
  const clearError = useAuthStore((s) => s.clearError)

  const progress = useSharedValue(0)

  const values = [name, email, password, confirmPassword]
  const setters = [setName, setEmail, setPassword, setConfirmPassword]

  useEffect(() => {
    if (isLoggedIn) {
      router.replace('/(tabs)')
    }
  }, [isLoggedIn])

  useEffect(() => {
    progress.set(withSpring((step + 1) / TOTAL_STEPS, { damping: 20, stiffness: 90 }))
  }, [step])

  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus()
    }, 350)
    return () => clearTimeout(timer)
  }, [step])

  const progressStyle = useAnimatedStyle(() => ({
    transform: [{ scaleX: progress.get() }],
  }))

  const validateAndNext = () => {
    setLocalError(null)
    clearError()

    switch (step) {
      case 0:
        if (name.trim().length === 0) {
          setLocalError('이름을 입력해주세요.')
          return
        }
        break
      case 1:
        if (!EMAIL_REGEX.test(email)) {
          setLocalError('올바른 이메일 형식을 입력해주세요.')
          return
        }
        break
      case 2:
        if (password.length < 6) {
          setLocalError('비밀번호는 6자 이상이어야 합니다.')
          return
        }
        break
      case 3:
        if (password !== confirmPassword) {
          setLocalError('비밀번호가 일치하지 않습니다.')
          return
        }
        handleSignup()
        return
    }

    setStep((prev) => prev + 1)
  }

  const handleBack = () => {
    if (step > 0) {
      setLocalError(null)
      setStep((prev) => prev - 1)
    } else {
      router.back()
    }
  }

  const handleSignup = async () => {
    setLocalError(null)
    clearError()
    await signup(name.trim(), email, password)
  }

  const displayError = localError ?? storeError
  const current = STEP_CONFIG[step]
  const currentValue = values[step]
  const currentSetter = setters[step]
  const isLastStep = step === TOTAL_STEPS - 1
  const hasValue = currentValue.trim().length > 0
  const isSecure = current.secureTextEntry && !showPassword

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.navBar}>
          <Pressable onPress={handleBack} hitSlop={12} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color={Colors.textPrimary} />
          </Pressable>
        </View>

        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressFill, progressStyle]} />
        </View>

        <View style={styles.body}>
          <Animated.View
            key={`step-${step}`}
            entering={FadeInUp.duration(400).springify().damping(18)}
            exiting={FadeOutUp.duration(200)}
            style={styles.stepContent}
          >
            <Text style={styles.stepTitle}>{current.title}</Text>
            <Text style={styles.stepSubtitle}>{current.subtitle}</Text>

            <View style={styles.inputContainer}>
              <TextInput
                ref={inputRef}
                style={styles.input}
                value={currentValue}
                onChangeText={(text) => {
                  setLocalError(null)
                  currentSetter(text)
                }}
                placeholder={current.placeholder}
                placeholderTextColor={Colors.textTertiary}
                keyboardType={current.keyboardType}
                autoCapitalize={current.autoCapitalize}
                secureTextEntry={isSecure}
                returnKeyType={isLastStep ? 'done' : 'next'}
                onSubmitEditing={validateAndNext}
                autoCorrect={false}
                selectionColor={Colors.primary}
                underlineColorAndroid="transparent"
              />

              {current.hasEye ? (
                <Pressable
                  style={styles.eyeButton}
                  onPress={() => setShowPassword((prev) => !prev)}
                  hitSlop={12}
                >
                  <Ionicons
                    name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                    size={22}
                    color={Colors.textTertiary}
                  />
                </Pressable>
              ) : null}
            </View>

            {displayError != null ? (
              <Animated.View
                entering={FadeInDown.duration(250)}
                style={styles.errorRow}
              >
                <Ionicons name="alert-circle" size={16} color={Colors.increase} />
                <Text style={styles.errorText}>{displayError}</Text>
              </Animated.View>
            ) : null}
          </Animated.View>
        </View>

        <View style={styles.bottomArea}>
          {step === 0 ? (
            <View style={styles.loginRow}>
              <Text style={styles.loginText}>이미 계정이 있으신가요? </Text>
              <Pressable onPress={() => router.back()} hitSlop={8}>
                <Text style={styles.loginLink}>로그인</Text>
              </Pressable>
            </View>
          ) : null}

          <Pressable
            style={[
              styles.nextButton,
              hasValue && !isLoading ? null : styles.nextButtonDisabled,
            ]}
            onPress={validateAndNext}
            disabled={!hasValue || isLoading}
          >
            <Text
              style={[
                styles.nextButtonText,
                hasValue && !isLoading ? null : styles.nextButtonTextDisabled,
              ]}
            >
              {isLoading ? '가입 중...' : isLastStep ? '가입 완료' : '다음'}
            </Text>
            {!isLastStep && !isLoading ? (
              <Ionicons name="arrow-forward" size={20} color={Colors.white} />
            ) : null}
          </Pressable>
        </View>
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
    height: 48,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressTrack: {
    height: 2,
    backgroundColor: Colors.border,
    overflow: 'hidden',
  },
  progressFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
    backgroundColor: Colors.primary,
    transformOrigin: 'left',
  },
  body: {
    flex: 1,
    paddingHorizontal: Spacing.section,
    paddingTop: 40,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 28,
    fontFamily: FontFamily.bold,
    color: Colors.textPrimary,
    lineHeight: 40,
  },
  stepSubtitle: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.regular,
    color: Colors.textSecondary,
    marginTop: Spacing.lg,
    marginBottom: 40,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: Colors.border,
    paddingBottom: Spacing.xl,
  },
  input: {
    flex: 1,
    fontSize: 22,
    fontFamily: FontFamily.medium,
    color: Colors.textPrimary,
    padding: 0,
  },
  eyeButton: {
    padding: Spacing.xs,
    marginLeft: Spacing.md,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.xl,
  },
  errorText: {
    fontSize: FontSize.sm,
    color: Colors.increase,
    fontFamily: FontFamily.regular,
  },
  bottomArea: {
    paddingHorizontal: Spacing.section,
    paddingBottom: Spacing.xxl,
    gap: Spacing.xxl,
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontFamily: FontFamily.regular,
  },
  loginLink: {
    fontSize: FontSize.sm,
    color: Colors.primary,
    fontFamily: FontFamily.bold,
  },
  nextButton: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    height: 56,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.md,
  },
  nextButtonDisabled: {
    backgroundColor: Colors.background,
  },
  nextButtonText: {
    fontSize: FontSize.xl,
    fontFamily: FontFamily.bold,
    color: Colors.white,
  },
  nextButtonTextDisabled: {
    color: Colors.textTertiary,
  },
})
