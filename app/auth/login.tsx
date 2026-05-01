import { SocialLoginButton } from "@/components/auth/social-login-button";
import { FontFamily, FontSize, Radius, Spacing } from "@/constants/tokens";
import { useTheme } from "@/hooks/useTheme";
import { SAVED_EMAIL_KEY } from "@/lib/auth/storage-keys";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const LOGO = require("@/assets/images/logo/hb_acution_cutout.png");

export default function LoginScreen() {
  const theme = useTheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberEmail, setRememberEmail] = useState(false);

  const login = useAuthStore((s) => s.login);
  const oauthLogin = useAuthStore((s) => s.oauthLogin);
  const isLoading = useAuthStore((s) => s.isLoading);
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const error = useAuthStore((s) => s.error);
  const clearError = useAuthStore((s) => s.clearError);

  useEffect(() => {
    clearError();
  }, [clearError]);

  useEffect(() => {
    AsyncStorage.getItem(SAVED_EMAIL_KEY).then((saved) => {
      if (saved != null && saved.length > 0) {
        setEmail(saved);
        setRememberEmail(true);
      }
    });
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      router.replace("/(tabs)");
    }
  }, [isLoggedIn]);

  const handleLogin = async () => {
    clearError();
    if (rememberEmail) {
      await AsyncStorage.setItem(SAVED_EMAIL_KEY, email);
    } else {
      await AsyncStorage.removeItem(SAVED_EMAIL_KEY);
    }
    await login(email, password);
  };

  const handleSocialLogin = async (
    provider: "kakao" | "naver" | "google" | "apple",
  ) => {
    clearError();
    await oauthLogin(provider);
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.bg.base }]}
      edges={["top", "bottom"]}
    >
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.logoArea}>
            <Image source={LOGO} style={styles.logo} contentFit="contain" />
          </View>

          <View style={styles.form}>
            <View
              style={[
                styles.inputWrapper,
                {
                  backgroundColor: theme.bg.surface,
                  borderColor: theme.border.default,
                },
              ]}
            >
              <TextInput
                accessible={true}
                accessibilityLabel="이메일 또는 전화번호"
                accessibilityRole="adjustable"
                accessibilityHint="로그인할 이메일 또는 전화번호를 입력하세요"
                style={[styles.input, { color: theme.text.primary }]}
                value={email}
                onChangeText={setEmail}
                placeholder="이메일 또는 전화번호"
                placeholderTextColor={theme.text.tertiary}
                keyboardType="email-address"
                autoCapitalize="none"
                returnKeyType="next"
                autoCorrect={false}
                selectionColor={theme.brand.primary}
                underlineColorAndroid="transparent"
              />
            </View>

            <View
              style={[
                styles.inputWrapper,
                {
                  backgroundColor: theme.bg.surface,
                  borderColor: theme.border.default,
                },
              ]}
            >
              <TextInput
                accessible={true}
                accessibilityLabel="비밀번호"
                accessibilityRole="adjustable"
                accessibilityHint="로그인할 비밀번호를 입력하세요"
                style={[styles.input, { color: theme.text.primary }]}
                value={password}
                onChangeText={setPassword}
                placeholder="비밀번호"
                placeholderTextColor={theme.text.tertiary}
                secureTextEntry={!showPassword}
                returnKeyType="done"
                onSubmitEditing={handleLogin}
                autoCorrect={false}
                selectionColor={theme.brand.primary}
                underlineColorAndroid="transparent"
              />
              <Pressable
                accessible={true}
                accessibilityLabel={
                  showPassword ? "비밀번호 숨기기" : "비밀번호 보기"
                }
                accessibilityRole="button"
                accessibilityState={{ checked: showPassword }}
                onPress={() => setShowPassword((prev) => !prev)}
                hitSlop={8}
              >
                <Ionicons
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={22}
                  color={theme.text.tertiary}
                />
              </Pressable>
            </View>
          </View>

          {error != null ? (
            <Text style={[styles.errorText, { color: theme.status.danger }]}>
              {error}
            </Text>
          ) : null}

          <View style={styles.optionsRow}>
            <Pressable
              accessible={true}
              accessibilityLabel="아이디 저장"
              accessibilityRole="checkbox"
              accessibilityState={{ checked: rememberEmail }}
              style={styles.rememberRow}
              onPress={() => setRememberEmail((prev) => !prev)}
              hitSlop={8}
            >
              <Ionicons
                name={rememberEmail ? "checkbox" : "square-outline"}
                size={20}
                color={
                  rememberEmail ? theme.brand.primary : theme.text.tertiary
                }
              />
              <Text
                style={[styles.rememberText, { color: theme.text.secondary }]}
              >
                아이디 저장
              </Text>
            </Pressable>

            <Pressable
              accessible={true}
              accessibilityLabel="비밀번호 찾기"
              accessibilityRole="button"
              onPress={() => router.push("/auth/forgot-password")}
              hitSlop={8}
            >
              <Text style={[styles.forgotText, { color: theme.brand.primary }]}>
                비밀번호를 잊으셨나요?
              </Text>
            </Pressable>
          </View>

          <Pressable
            accessible={true}
            accessibilityLabel="로그인"
            accessibilityRole="button"
            accessibilityState={{ disabled: isLoading }}
            accessibilityHint={
              isLoading ? "로그인 중입니다" : "이메일과 비밀번호로 로그인합니다"
            }
            style={[
              styles.loginButton,
              { backgroundColor: theme.brand.primary },
              isLoading ? styles.loginButtonDisabled : null,
            ]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text
              style={[styles.loginButtonText, { color: theme.brand.onPrimary }]}
            >
              {isLoading ? "로그인 중..." : "로그인"}
            </Text>
          </Pressable>

          <View style={styles.dividerRow}>
            <View
              style={[
                styles.dividerLine,
                { backgroundColor: theme.border.default },
              ]}
            />
            <Text style={[styles.dividerText, { color: theme.text.tertiary }]}>
              Or Login with
            </Text>
            <View
              style={[
                styles.dividerLine,
                { backgroundColor: theme.border.default },
              ]}
            />
          </View>

          <View style={styles.socialRow}>
            <SocialLoginButton
              provider="kakao"
              variant="icon"
              onPress={() => handleSocialLogin("kakao")}
            />
            <SocialLoginButton
              provider="naver"
              variant="icon"
              onPress={() => handleSocialLogin("naver")}
            />
            {Platform.OS === "ios" ? (
              <SocialLoginButton
                provider="apple"
                variant="icon"
                onPress={() => handleSocialLogin("apple")}
              />
            ) : null}
            <SocialLoginButton
              provider="google"
              variant="icon"
              onPress={() => handleSocialLogin("google")}
            />
          </View>

          <View style={styles.signupRow}>
            <Text style={[styles.signupText, { color: theme.text.secondary }]}>
              HB Auction이 처음이신가요?{" "}
            </Text>
            <Pressable onPress={() => router.push("/auth/signup")} hitSlop={8}>
              <Text style={[styles.signupLink, { color: theme.brand.primary }]}>
                Sign up
              </Text>
            </Pressable>
          </View>
        </ScrollView>
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
  scrollContent: {
    paddingHorizontal: Spacing.section,
    paddingBottom: Spacing.section * 2,
  },
  logoArea: {
    alignItems: "center",
    paddingTop: 36,
    paddingBottom: 36,
  },
  logo: {
    width: 280,
    height: 160,
  },
  form: {
    gap: 14,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: Radius.full,
    borderWidth: 1,
    paddingHorizontal: 22,
    height: 54,
  },
  input: {
    flex: 1,
    fontSize: FontSize.lg,
    fontFamily: FontFamily.regular,
    padding: 0,
  },
  errorText: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.regular,
    textAlign: "center",
    marginTop: Spacing.xl,
  },
  optionsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: Spacing.xxl,
    marginBottom: 28,
  },
  rememberRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  rememberText: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.medium,
  },
  forgotText: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.medium,
  },
  loginButton: {
    borderRadius: Radius.full,
    height: 54,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 28,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    fontSize: FontSize.xl,
    fontFamily: FontFamily.bold,
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xxl,
    marginBottom: 28,
  },
  dividerLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
  },
  dividerText: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.regular,
  },
  socialRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: Spacing.xxl,
    marginBottom: 44,
  },
  signupRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  signupText: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.regular,
  },
  signupLink: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.bold,
  },
});
