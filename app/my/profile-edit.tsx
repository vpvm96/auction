import { FormInput } from "@/components/auth/form-input";
import { FontFamily, FontSize, Radius, Spacing } from "@/constants/tokens";
import { useTheme } from "@/hooks/useTheme";
import { ApiError } from "@/lib/api/client";
import * as usersApi from "@/lib/api/users";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileEditScreen() {
  const theme = useTheme();
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const hasHydrated = useAuthStore((s) => s.hasHydrated);
  const user = useAuthStore((s) => s.user);
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const queryClient = useQueryClient();

  const profileQuery = useQuery({
    queryKey: ["users", "me"],
    queryFn: usersApi.fetchCurrentUser,
    enabled: isLoggedIn && hasHydrated,
  });

  const [nickname, setNickname] = useState(user?.name ?? "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasInitializedProfile = useRef(false);

  useEffect(() => {
    if (profileQuery.data == null || hasInitializedProfile.current) {
      return;
    }

    setNickname(profileQuery.data.nickname);
    hasInitializedProfile.current = true;
  }, [profileQuery.data]);

  useEffect(() => {
    return () => {
      if (saveTimer.current != null) {
        clearTimeout(saveTimer.current);
      }
    };
  }, []);

  const saveMutation = useMutation({
    mutationFn: usersApi.updateCurrentUser,
    onSuccess: (response) => {
      updateProfile(response.nickname);
      queryClient.invalidateQueries({ queryKey: ["users", "me"] });
      setNickname(response.nickname);
      setCurrentPassword("");
      setNewPassword("");
      setError(null);
      setIsSaved(true);

      if (saveTimer.current != null) {
        clearTimeout(saveTimer.current);
      }

      saveTimer.current = setTimeout(() => {
        setIsSaved(false);
      }, 2000);
    },
    onError: (err) => {
      const message =
        err instanceof ApiError
          ? err.message || `프로필 수정에 실패했습니다. (${err.status})`
          : "네트워크 오류가 발생했습니다.";
      setError(message);
    },
  });

  const email = profileQuery.data?.email ?? user?.email ?? "";

  const handleSave = () => {
    const trimmedNickname = nickname.trim();

    if (trimmedNickname.length === 0) {
      setError("닉네임을 입력해주세요.");
      return;
    }

    const isChangingPassword =
      currentPassword.length > 0 || newPassword.length > 0;
    if (
      isChangingPassword &&
      (currentPassword.length === 0 || newPassword.length === 0)
    ) {
      setError(
        "비밀번호를 변경하려면 현재 비밀번호와 새 비밀번호를 모두 입력해주세요.",
      );
      return;
    }

    if (isChangingPassword && newPassword.length < 6) {
      setError("새 비밀번호는 6자 이상이어야 합니다.");
      return;
    }

    setError(null);
    saveMutation.mutate({
      nickname: trimmedNickname,
      currentPassword: isChangingPassword ? currentPassword : null,
      newPassword: isChangingPassword ? newPassword : null,
    });
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
        <View
          style={[
            styles.navBar,
            {
              backgroundColor: theme.bg.surface,
              borderBottomColor: theme.border.default,
            },
          ]}
        >
          <Pressable
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="뒤로 가기"
            onPress={() => router.back()}
            hitSlop={8}
          >
            <Ionicons name="arrow-back" size={24} color={theme.text.primary} />
          </Pressable>
          <Text style={[styles.navTitle, { color: theme.text.primary }]}>
            프로필 수정
          </Text>
          <View style={styles.navSpacer} />
        </View>

        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {profileQuery.isLoading ? (
            <View style={styles.loadingRow}>
              <ActivityIndicator color={theme.brand.primary} />
              <Text
                style={[styles.loadingText, { color: theme.text.secondary }]}
              >
                프로필 정보를 불러오는 중입니다.
              </Text>
            </View>
          ) : profileQuery.isError ? (
            <View
              style={[styles.errorCard, { borderColor: theme.border.default }]}
            >
              <Text style={[styles.errorText, { color: theme.status.danger }]}>
                프로필 정보를 불러오지 못했습니다.
              </Text>
              <Pressable
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="프로필 정보 다시 시도"
                style={[
                  styles.retryButton,
                  { borderColor: theme.border.default },
                ]}
                onPress={() => profileQuery.refetch()}
              >
                <Text
                  style={[
                    styles.retryButtonText,
                    { color: theme.text.secondary },
                  ]}
                >
                  다시 시도
                </Text>
              </Pressable>
            </View>
          ) : null}

          <FormInput
            label="닉네임"
            value={nickname}
            onChangeText={(text) => {
              setNickname(text);
              setError(null);
              setIsSaved(false);
            }}
            placeholder="닉네임을 입력해주세요"
            returnKeyType="done"
            onSubmitEditing={handleSave}
            error={error ?? undefined}
          />

          <View style={styles.fieldGroup}>
            <Text style={[styles.fieldLabel, { color: theme.text.primary }]}>
              이메일
            </Text>
            <View
              style={[
                styles.readonlyWrapper,
                {
                  backgroundColor: theme.bg.sunken,
                  borderColor: theme.border.default,
                },
              ]}
            >
              <Text
                style={[styles.readonlyText, { color: theme.text.secondary }]}
              >
                {email || "이메일 정보 없음"}
              </Text>
            </View>
            <Text style={[styles.fieldHint, { color: theme.text.tertiary }]}>
              이메일은 변경할 수 없습니다.
            </Text>
          </View>

          <FormInput
            label="현재 비밀번호"
            value={currentPassword}
            onChangeText={(text) => {
              setCurrentPassword(text);
              setError(null);
              setIsSaved(false);
            }}
            placeholder="비밀번호 변경 시 입력해주세요"
            secureTextEntry={true}
            autoCapitalize="none"
            returnKeyType="next"
          />

          <FormInput
            label="새 비밀번호"
            value={newPassword}
            onChangeText={(text) => {
              setNewPassword(text);
              setError(null);
              setIsSaved(false);
            }}
            placeholder="새 비밀번호를 입력해주세요"
            secureTextEntry={true}
            autoCapitalize="none"
            returnKeyType="done"
            onSubmitEditing={handleSave}
          />

          <Text style={[styles.helperText, { color: theme.text.tertiary }]}>
            비밀번호를 변경하지 않으면 두 칸을 비워두세요.
          </Text>

          {isSaved ? (
            <View style={styles.successRow}>
              <Ionicons
                name="checkmark-circle"
                size={18}
                color={theme.status.success}
              />
              <Text
                style={[styles.successText, { color: theme.status.success }]}
              >
                저장되었습니다.
              </Text>
            </View>
          ) : null}

          <Pressable
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="프로필 저장"
            disabled={saveMutation.isPending}
            style={[
              styles.saveButton,
              { backgroundColor: theme.brand.primary },
              saveMutation.isPending ? styles.saveButtonDisabled : null,
            ]}
            onPress={handleSave}
          >
            <Text
              style={[styles.saveButtonText, { color: theme.brand.onPrimary }]}
            >
              {saveMutation.isPending ? "저장 중..." : "저장하기"}
            </Text>
          </Pressable>
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
  navBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.page,
    paddingVertical: Spacing.xl,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  navTitle: {
    flex: 1,
    textAlign: "center",
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
  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  loadingText: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.medium,
  },
  errorCard: {
    borderWidth: 1,
    borderRadius: Radius.lg,
    padding: Spacing.xl,
    gap: Spacing.md,
  },
  errorText: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.semibold,
  },
  retryButton: {
    alignSelf: "flex-start",
    borderWidth: 1,
    borderRadius: Radius.md,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  retryButtonText: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.medium,
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
  helperText: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.regular,
  },
  successRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.xs,
  },
  successText: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.semibold,
  },
  saveButton: {
    borderRadius: Radius.xl,
    paddingVertical: Spacing.xl,
    alignItems: "center",
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.bold,
  },
});
