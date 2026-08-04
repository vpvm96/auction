import { FontFamily, FontSize, Radius, Spacing } from "@/constants/tokens";
import { useTheme } from "@/hooks/useTheme";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { EMAIL_REGEX } from "@/lib/validation";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import Animated, {
    Easing,
    FadeIn,
    FadeOut,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const TOTAL_STEPS = 5;

const TERMS_STEP = 0;

const TERMS_CONFIG = {
  title: "이용 약관에\n동의해주세요",
  subtitle: "서비스 이용을 위해 약관 동의가 필요해요",
};

interface InputStepConfig {
  title: string;
  subtitle: string;
  placeholder: string;
  keyboardType: "default" | "email-address";
  autoCapitalize: "words" | "none";
  secureTextEntry: boolean;
  hasEye: boolean;
}

// 입력 스텝 설정 (TERMS_STEP 이후의 스텝, step 1~4에 매핑)
const INPUT_STEP_CONFIG: InputStepConfig[] = [
  {
    title: "반가워요!\n이름이 무엇인가요?",
    subtitle: "HB Auction에서 사용할 이름을 알려주세요",
    placeholder: "홍길동",
    keyboardType: "default",
    autoCapitalize: "words",
    secureTextEntry: false,
    hasEye: false,
  },
  {
    title: "이메일을\n입력해주세요",
    subtitle: "로그인에 사용할 이메일이에요",
    placeholder: "example@email.com",
    keyboardType: "email-address",
    autoCapitalize: "none",
    secureTextEntry: false,
    hasEye: false,
  },
  {
    title: "비밀번호를\n설정해주세요",
    subtitle: "영문, 숫자 포함 6자 이상",
    placeholder: "비밀번호 입력",
    keyboardType: "default",
    autoCapitalize: "none",
    secureTextEntry: true,
    hasEye: true,
  },
  {
    title: "비밀번호를\n한 번 더 확인할게요",
    subtitle: "동일한 비밀번호를 입력해주세요",
    placeholder: "비밀번호 재입력",
    keyboardType: "default",
    autoCapitalize: "none",
    secureTextEntry: true,
    hasEye: true,
  },
];

export default function SignupScreen() {
  const theme = useTheme();

  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const inputRef = useRef<TextInput>(null);
  const agreeAll = agreeTerms && agreePrivacy;

  const signup = useAuthStore((s) => s.signup);
  const isLoading = useAuthStore((s) => s.isLoading);
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const storeError = useAuthStore((s) => s.error);
  const clearError = useAuthStore((s) => s.clearError);

  const progress = useSharedValue(0);

  // 입력 스텝 (step 1~4)에서 사용. 약관 스텝(0)에서는 참조하지 않음.
  const inputValues = [name, email, password, confirmPassword];
  const inputSetters = [setName, setEmail, setPassword, setConfirmPassword];

  useEffect(() => {
    clearError();
  }, [clearError]);

  useEffect(() => {
    if (isLoggedIn) {
      router.replace("/(tabs)");
    }
  }, [isLoggedIn]);

  useEffect(() => {
    progress.set(
      withTiming((step + 1) / TOTAL_STEPS, {
        duration: 260,
        easing: Easing.out(Easing.quad),
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  useEffect(() => {
    if (step === TERMS_STEP) return;
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 350);
    return () => clearTimeout(timer);
  }, [step]);

  const progressStyle = useAnimatedStyle(() => ({
    transform: [{ scaleX: progress.get() }],
  }));

  const validateAndNext = () => {
    setLocalError(null);
    clearError();

    switch (step) {
      case 0:
        if (!agreeAll) {
          setLocalError("필수 약관에 모두 동의해주세요.");
          return;
        }
        break;
      case 1:
        if (name.trim().length === 0) {
          setLocalError("이름을 입력해주세요.");
          return;
        }
        break;
      case 2:
        if (!EMAIL_REGEX.test(email)) {
          setLocalError("올바른 이메일 형식을 입력해주세요.");
          return;
        }
        break;
      case 3:
        if (password.length < 6) {
          setLocalError("비밀번호는 6자 이상이어야 합니다.");
          return;
        }
        break;
      case 4:
        if (password !== confirmPassword) {
          setLocalError("비밀번호가 일치하지 않습니다.");
          return;
        }
        handleSignup();
        return;
    }

    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    if (step > 0) {
      setLocalError(null);
      setStep((prev) => prev - 1);
    } else {
      router.back();
    }
  };

  const handleSignup = async () => {
    setLocalError(null);
    clearError();
    await signup(name.trim(), email, password, agreeAll);
  };

  const displayError = localError ?? storeError;
  const isTermsStep = step === TERMS_STEP;
  const inputIndex = step - 1;
  const inputConfig = isTermsStep ? null : INPUT_STEP_CONFIG[inputIndex];
  const currentValue = isTermsStep ? "" : inputValues[inputIndex];
  const currentSetter = isTermsStep ? null : inputSetters[inputIndex];
  const isLastStep = step === TOTAL_STEPS - 1;
  const hasValue = isTermsStep ? agreeAll : currentValue.trim().length > 0;
  const isSecure =
    inputConfig != null && inputConfig.secureTextEntry && !showPassword;
  const headerTitle = isTermsStep ? TERMS_CONFIG.title : inputConfig!.title;
  const headerSubtitle = isTermsStep
    ? TERMS_CONFIG.subtitle
    : inputConfig!.subtitle;

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.bg.base }]}
      edges={["top", "bottom"]}
    >
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.navBar}>
          <Pressable
            onPress={handleBack}
            hitSlop={12}
            style={styles.backButton}
          >
            <Ionicons
              name="chevron-back"
              size={24}
              color={theme.text.primary}
            />
          </Pressable>
        </View>

        <View
          style={[
            styles.progressTrack,
            { backgroundColor: theme.border.default },
          ]}
        >
          <Animated.View
            style={[
              styles.progressFill,
              { backgroundColor: theme.brand.primary },
              progressStyle,
            ]}
          />
        </View>

        <View style={styles.body}>
          <Animated.View
            key={`step-${step}`}
            entering={FadeIn.duration(220)}
            exiting={FadeOut.duration(120)}
            style={styles.stepContent}
          >
            <Text style={[styles.stepTitle, { color: theme.text.primary }]}>
              {headerTitle}
            </Text>
            <Text
              style={[styles.stepSubtitle, { color: theme.text.secondary }]}
            >
              {headerSubtitle}
            </Text>

            {isTermsStep ? (
              <View style={styles.agreementGroup}>
                <Pressable
                  style={[
                    styles.agreementAllRow,
                    { borderColor: theme.border.default },
                  ]}
                  onPress={() => {
                    setLocalError(null);
                    const next = !agreeAll;
                    setAgreeTerms(next);
                    setAgreePrivacy(next);
                  }}
                >
                  <Ionicons
                    name={agreeAll ? "checkmark-circle" : "ellipse-outline"}
                    size={26}
                    color={
                      agreeAll ? theme.brand.primary : theme.text.tertiary
                    }
                  />
                  <Text
                    style={[
                      styles.agreementAllText,
                      { color: theme.text.primary },
                    ]}
                  >
                    전체 동의
                  </Text>
                </Pressable>

                <Pressable
                  style={styles.agreementItemRow}
                  onPress={() => {
                    setLocalError(null);
                    setAgreeTerms((prev) => !prev);
                  }}
                >
                  <Ionicons
                    name={
                      agreeTerms ? "checkmark-circle" : "ellipse-outline"
                    }
                    size={22}
                    color={
                      agreeTerms ? theme.brand.primary : theme.text.tertiary
                    }
                  />
                  <Text
                    style={[
                      styles.agreementItemText,
                      { color: theme.text.primary },
                    ]}
                  >
                    [필수] 이용약관 동의
                  </Text>
                  <Pressable
                    hitSlop={12}
                    onPress={() => router.push("/my/terms")}
                    style={styles.agreementViewButton}
                  >
                    <Text
                      style={[
                        styles.agreementViewText,
                        { color: theme.text.tertiary },
                      ]}
                    >
                      보기
                    </Text>
                    <Ionicons
                      name="chevron-forward"
                      size={16}
                      color={theme.text.tertiary}
                    />
                  </Pressable>
                </Pressable>

                <Pressable
                  style={styles.agreementItemRow}
                  onPress={() => {
                    setLocalError(null);
                    setAgreePrivacy((prev) => !prev);
                  }}
                >
                  <Ionicons
                    name={
                      agreePrivacy ? "checkmark-circle" : "ellipse-outline"
                    }
                    size={22}
                    color={
                      agreePrivacy ? theme.brand.primary : theme.text.tertiary
                    }
                  />
                  <Text
                    style={[
                      styles.agreementItemText,
                      { color: theme.text.primary },
                    ]}
                  >
                    [필수] 개인정보처리방침 동의
                  </Text>
                  <Pressable
                    hitSlop={12}
                    onPress={() => router.push("/my/privacy")}
                    style={styles.agreementViewButton}
                  >
                    <Text
                      style={[
                        styles.agreementViewText,
                        { color: theme.text.tertiary },
                      ]}
                    >
                      보기
                    </Text>
                    <Ionicons
                      name="chevron-forward"
                      size={16}
                      color={theme.text.tertiary}
                    />
                  </Pressable>
                </Pressable>
              </View>
            ) : (
              <View
                style={[
                  styles.inputContainer,
                  { borderBottomColor: theme.border.default },
                ]}
              >
                <TextInput
                  ref={inputRef}
                  style={[styles.input, { color: theme.text.primary }]}
                  value={currentValue}
                  onChangeText={(text) => {
                    setLocalError(null);
                    currentSetter?.(text);
                  }}
                  placeholder={inputConfig!.placeholder}
                  placeholderTextColor={theme.text.tertiary}
                  keyboardType={inputConfig!.keyboardType}
                  autoCapitalize={inputConfig!.autoCapitalize}
                  secureTextEntry={isSecure}
                  returnKeyType={isLastStep ? "done" : "next"}
                  onSubmitEditing={validateAndNext}
                  autoCorrect={false}
                  selectionColor={theme.brand.primary}
                  underlineColorAndroid="transparent"
                />

                {inputConfig!.hasEye ? (
                  <Pressable
                    style={styles.eyeButton}
                    onPress={() => setShowPassword((prev) => !prev)}
                    hitSlop={12}
                  >
                    <Ionicons
                      name={showPassword ? "eye-outline" : "eye-off-outline"}
                      size={22}
                      color={theme.text.tertiary}
                    />
                  </Pressable>
                ) : null}
              </View>
            )}

            {displayError != null ? (
              <Animated.View
                entering={FadeIn.duration(180)}
                style={styles.errorRow}
              >
                <Ionicons
                  name="alert-circle"
                  size={16}
                  color={theme.status.danger}
                />
                <Text
                  style={[styles.errorText, { color: theme.status.danger }]}
                >
                  {displayError}
                </Text>
              </Animated.View>
            ) : null}
          </Animated.View>
        </View>

        <View style={styles.bottomArea}>
          {isTermsStep ? (
            <View style={styles.loginRow}>
              <Text style={[styles.loginText, { color: theme.text.secondary }]}>
                이미 계정이 있으신가요?{" "}
              </Text>
              <Pressable onPress={() => router.back()} hitSlop={8}>
                <Text
                  style={[styles.loginLink, { color: theme.brand.primary }]}
                >
                  로그인
                </Text>
              </Pressable>
            </View>
          ) : null}

          <Pressable
            style={[
              styles.nextButton,
              { backgroundColor: theme.brand.primary },
              hasValue && !isLoading
                ? null
                : { backgroundColor: theme.bg.sunken },
            ]}
            onPress={validateAndNext}
            disabled={!hasValue || isLoading}
          >
            <Text
              style={[
                styles.nextButtonText,
                { color: theme.brand.onPrimary },
                hasValue && !isLoading ? null : { color: theme.text.tertiary },
              ]}
            >
              {isLoading ? "가입 중..." : isLastStep ? "가입 완료" : "다음"}
            </Text>
            {!isLastStep && !isLoading ? (
              <Ionicons
                name="arrow-forward"
                size={20}
                color={theme.brand.onPrimary}
              />
            ) : null}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  navBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.page,
    height: 48,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  progressTrack: {
    height: 2,
    overflow: "hidden",
  },
  progressFill: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
    transformOrigin: "left",
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
    lineHeight: 40,
  },
  stepSubtitle: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.regular,
    marginTop: Spacing.lg,
    marginBottom: 40,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 2,
    paddingBottom: Spacing.xl,
  },
  agreementGroup: {
    gap: Spacing.xl,
  },
  agreementAllRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xl,
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.xl,
    borderWidth: 1,
    borderRadius: Radius.md,
  },
  agreementAllText: {
    fontSize: FontSize.lg,
    fontFamily: FontFamily.bold,
  },
  agreementItemRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xl,
    paddingHorizontal: Spacing.xl,
  },
  agreementItemText: {
    flex: 1,
    fontSize: FontSize.base,
    fontFamily: FontFamily.regular,
  },
  agreementViewButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xxs,
  },
  agreementViewText: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.regular,
  },
  input: {
    flex: 1,
    fontSize: 22,
    fontFamily: FontFamily.medium,
    padding: 0,
  },
  eyeButton: {
    padding: Spacing.xs,
    marginLeft: Spacing.md,
  },
  errorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginTop: Spacing.xl,
  },
  errorText: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.regular,
  },
  bottomArea: {
    paddingHorizontal: Spacing.section,
    paddingBottom: Spacing.xxl,
    gap: Spacing.xxl,
  },
  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  loginText: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.regular,
  },
  loginLink: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.bold,
  },
  nextButton: {
    borderRadius: Radius.full,
    height: 56,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: Spacing.md,
  },
  nextButtonText: {
    fontSize: FontSize.xl,
    fontFamily: FontFamily.bold,
  },
});
