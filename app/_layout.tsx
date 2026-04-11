import { AuthProvider } from "@/components/providers/auth-provider";
import { Colors } from "@/constants/colors";
import { FontFamily, FontSize, Radius, Spacing } from "@/constants/tokens";
import "@/global.css";
import { useIsDark } from "@/hooks/useTheme";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { DevicePlatform, registerDevice } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { useNotificationStore } from "@/lib/store/useNotificationStore";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as Application from "expo-application";
import { useFonts } from "expo-font";
import * as Notifications from "expo-notifications";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import LottieView from "lottie-react-native";
import { useEffect, useRef, useState } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

// 포그라운드 알림 동작 설정
// 앱이 켜져 있는 상태에서도 시스템 상단바 배너 알림이 노출되도록 설정
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    priority: Notifications.AndroidNotificationPriority.HIGH,
  }),
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: (failureCount, error) => {
        if (error instanceof ApiError && error.status === 401) return false;
        return failureCount < 2;
      },
    },
  },
});

SplashScreen.preventAutoHideAsync();

// 스플래시 스크린 페이드 아웃 애니메이션 설정 (Android/iOS 공통)
SplashScreen.setOptions({
  duration: 800,
  fade: true,
});

export function ErrorBoundary({
  error,
  retry,
}: {
  error: Error;
  retry: () => void;
}) {
  return (
    <View style={styles.errorContainer}>
      <Text style={styles.errorTitle}>오류가 발생했습니다</Text>
      <Text style={styles.errorMessage}>{error.message}</Text>
      <Pressable style={styles.retryButton} onPress={retry}>
        <Text style={styles.retryText}>다시 시도</Text>
      </Pressable>
    </View>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "Pretendard-Regular": require("@/assets/fonts/Pretendard-Regular.otf"),
    "Pretendard-Medium": require("@/assets/fonts/Pretendard-Medium.otf"),
    "Pretendard-SemiBold": require("@/assets/fonts/Pretendard-SemiBold.otf"),
    "Pretendard-Bold": require("@/assets/fonts/Pretendard-Bold.otf"),
    "Pretendard-ExtraBold": require("@/assets/fonts/Pretendard-ExtraBold.otf"),
  });

  const { expoPushToken } = usePushNotifications();
  const setExpoPushToken = useNotificationStore((s) => s.setExpoPushToken);
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const hasHydrated = useAuthStore((s) => s.hasHydrated);
  const deviceRegistered = useRef(false);

  // 발급된 Expo Push Token을 Zustand 스토어에 저장
  useEffect(() => {
    if (expoPushToken) {
      setExpoPushToken(expoPushToken);
    }
  }, [expoPushToken, setExpoPushToken]);

  // 로그아웃 시 디바이스 등록 플래그 리셋
  useEffect(() => {
    if (!isLoggedIn) {
      deviceRegistered.current = false;
    }
  }, [isLoggedIn]);

  // 로그인 상태 + 푸시 토큰이 준비되면 디바이스 등록
  useEffect(() => {
    if (
      !hasHydrated ||
      !isLoggedIn ||
      !expoPushToken ||
      deviceRegistered.current
    )
      return;

    const register = async () => {
      try {
        const installationId =
          Platform.OS === "ios"
            ? ((await Application.getIosIdForVendorAsync()) ??
              Application.applicationId ??
              "unknown-ios-device")
            : Application.getAndroidId();
        const platform =
          Platform.OS === "ios" ? DevicePlatform.iOS : DevicePlatform.Android;

        await registerDevice({
          platform,
          deviceIdentifier: installationId,
          pushToken: expoPushToken,
        });

        deviceRegistered.current = true;
        console.log("[Device] 디바이스 등록 완료");
      } catch (err) {
        console.log("[Device] 디바이스 등록 실패:", err);
      }
    };

    register();
  }, [hasHydrated, isLoggedIn, expoPushToken]);

  const isDark = useIsDark();
  // 폰트 로딩 + 인증 hydration 완료 시 앱 준비
  const appIsReady = fontsLoaded && hasHydrated;

  // Lottie 애니메이션 상태 (웹에서는 Lottie 미지원 → 즉시 완료 처리)
  const lottieRef = useRef<LottieView>(null);
  const [lottieFinished, setLottieFinished] = useState(Platform.OS === "web");

  // 폰트 로드 완료 시 네이티브 스플래시 페이드 아웃 → 완료 후 Lottie 시작
  useEffect(() => {
    if (!fontsLoaded) return;
    Promise.resolve(SplashScreen.hide()).then(() => {
      if (Platform.OS !== "web") {
        lottieRef.current?.play();
      }
    });
  }, [fontsLoaded]);

  // Lottie + 앱 준비가 모두 완료될 때 스플래시 오버레이 제거
  const showLottieSplash = !lottieFinished || !appIsReady;

  if (!fontsLoaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={styles.root}>
        <StatusBar style={isDark ? "light" : "dark"} />
        {appIsReady && (
          <AuthProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="notifications" />
              <Stack.Screen name="auth" />
              <Stack.Screen name="quiz" />
              <Stack.Screen
                name="region-select"
                options={{ presentation: "modal" }}
              />
            </Stack>
          </AuthProvider>
        )}
        {showLottieSplash && Platform.OS !== "web" && (
          <View style={styles.lottieContainer}>
            <LottieView
              ref={lottieRef}
              source={require("@/assets/lottie/splash-lottie.json")}
              autoPlay={false}
              loop={false}
              onAnimationFinish={() => setLottieFinished(true)}
              style={styles.lottieView}
            />
          </View>
        )}
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  lottieContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  lottieView: {
    width: "100%",
    height: "100%",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.section,
    backgroundColor: Colors.background,
    gap: Spacing.xl,
  },
  errorTitle: {
    fontSize: FontSize.xxl,
    fontFamily: FontFamily.bold,
    color: Colors.textPrimary,
  },
  errorMessage: {
    fontSize: FontSize.base,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
  },
  retryButton: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.xl,
    paddingHorizontal: Spacing.xxxl,
    paddingVertical: Spacing.xl,
    marginTop: Spacing.xl,
  },
  retryText: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.bold,
    color: Colors.white,
  },
});
