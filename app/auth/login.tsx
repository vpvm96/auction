import { SocialLoginButton } from "@/components/auth/social-login-button";
import { Colors } from "@/constants/colors";
import { FontFamily, FontSize, Radius, Spacing } from "@/constants/tokens";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { Ionicons } from "@expo/vector-icons";
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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const login = useAuthStore((s) => s.login);
  const isLoading = useAuthStore((s) => s.isLoading);
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const error = useAuthStore((s) => s.error);
  const clearError = useAuthStore((s) => s.clearError);

  useEffect(() => {
    if (isLoggedIn) {
      router.replace("/(tabs)");
    }
  }, [isLoggedIn]);

  const handleLogin = async () => {
    clearError();
    await login(email, password);
  };

  const handleSocialLogin = () => {
    // SNS 로그인 미구현 (목업)
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
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
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="이메일 또는 전화번호"
                placeholderTextColor={Colors.textTertiary}
                keyboardType="email-address"
                autoCapitalize="none"
                returnKeyType="next"
                autoCorrect={false}
                selectionColor={Colors.primary}
                underlineColorAndroid="transparent"
              />
            </View>

            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="비밀번호"
                placeholderTextColor={Colors.textTertiary}
                secureTextEntry={!showPassword}
                returnKeyType="done"
                onSubmitEditing={handleLogin}
                autoCorrect={false}
                selectionColor={Colors.primary}
                underlineColorAndroid="transparent"
              />
              <Pressable
                onPress={() => setShowPassword((prev) => !prev)}
                hitSlop={8}
              >
                <Ionicons
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={22}
                  color={Colors.textTertiary}
                />
              </Pressable>
            </View>
          </View>

          {error != null ? <Text style={styles.errorText}>{error}</Text> : null}

          <Pressable
            style={styles.forgotLink}
            onPress={() => router.push("/auth/forgot-password")}
            hitSlop={8}
          >
            <Text style={styles.forgotText}>비밀번호를 잊으셨나요?</Text>
          </Pressable>

          <Pressable
            style={[
              styles.loginButton,
              isLoading ? styles.loginButtonDisabled : null,
            ]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text style={styles.loginButtonText}>
              {isLoading ? "로그인 중..." : "로그인"}
            </Text>
          </Pressable>

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>Or Login with</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.socialRow}>
            <SocialLoginButton
              provider="kakao"
              variant="icon"
              onPress={handleSocialLogin}
            />
            <SocialLoginButton
              provider="naver"
              variant="icon"
              onPress={handleSocialLogin}
            />
            <SocialLoginButton
              provider="apple"
              variant="icon"
              onPress={handleSocialLogin}
            />
            <SocialLoginButton
              provider="google"
              variant="icon"
              onPress={handleSocialLogin}
            />
          </View>

          <View style={styles.signupRow}>
            <Text style={styles.signupText}>HB Auction이 처음이신가요? </Text>
            <Pressable onPress={() => router.push("/auth/signup")} hitSlop={8}>
              <Text style={styles.signupLink}>Sign up</Text>
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
    backgroundColor: Colors.white,
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
    backgroundColor: Colors.white,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 22,
    height: 54,
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
    textAlign: "center",
    marginTop: Spacing.xl,
  },
  forgotLink: {
    alignSelf: "flex-end",
    marginTop: Spacing.xxl,
    marginBottom: 28,
  },
  forgotText: {
    fontSize: FontSize.sm,
    color: Colors.primary,
    fontFamily: FontFamily.medium,
  },
  loginButton: {
    backgroundColor: Colors.primary,
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
    color: Colors.white,
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
    backgroundColor: Colors.border,
  },
  dividerText: {
    fontSize: FontSize.sm,
    color: Colors.textTertiary,
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
    color: Colors.textSecondary,
    fontFamily: FontFamily.regular,
  },
  signupLink: {
    fontSize: FontSize.sm,
    color: Colors.primary,
    fontFamily: FontFamily.bold,
  },
});
