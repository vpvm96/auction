import { AuthProvider } from "@/components/providers/auth-provider";
import { Colors } from "@/constants/colors";
import { FontFamily, FontSize, Radius, Spacing } from "@/constants/tokens";
import "@/global.css";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { useIsDark, useTheme } from "@/hooks/useTheme";
import { DevicePlatform, registerDevice } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { useNotificationStore } from "@/lib/store/useNotificationStore";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as Application from "expo-application";
import { useFonts } from "expo-font";
import { Image } from "expo-image";
import * as Notifications from "expo-notifications";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

// 네이티브 모듈 미설치 시 앱 크래시를 방지하기 위한 안전한 로딩
let LottieView: typeof import("lottie-react-native").default | null = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  LottieView = require("lottie-react-native").default;
} catch {
  LottieView = null;
}

// Kakao SDK 초기화 — 앱 시작 시 1회 실행
try {
  const kakaoNativeAppKey = process.env.EXPO_PUBLIC_KAKAO_NATIVE_APP_KEY;
  if (kakaoNativeAppKey != null && kakaoNativeAppKey.length > 0) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { initializeKakaoSDK } = require("@react-native-seoul/kakao-login");
    initializeKakaoSDK(kakaoNativeAppKey);
  }
} catch (err) {
  console.warn("Kakao SDK 초기화 실패:", err);
}

type SplashPhase = "lottie" | "done";

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

// 네이티브 스플래시 → Lottie 전환을 빠르게 하기 위해 짧은 페이드 설정
SplashScreen.setOptions({
  duration: 200,
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
  const theme = useTheme();
  // 폰트 로딩 + 인증 hydration 완료 시 앱 준비
  const appIsReady = fontsLoaded && hasHydrated;

  // LottieView가 로드되지 않았으면 Lottie 단계를 건너뜀
  const lottieAvailable = LottieView != null;

  // Lottie 사용 가능하면 바로 lottie 단계로 시작 (정적 이미지 깜빡임 방지)
  const [splashPhase, setSplashPhase] = useState<SplashPhase>(
    Platform.OS === "web" || !lottieAvailable ? "done" : "lottie",
  );
  const lottieFallbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const finishSplash = () => {
    if (lottieFallbackTimerRef.current) {
      clearTimeout(lottieFallbackTimerRef.current);
      lottieFallbackTimerRef.current = null;
    }
    setSplashPhase("done");
  };

  // 폰트 로드 완료 후 네이티브 스플래시를 숨기고 Lottie 폴백 타이머 설정
  useEffect(() => {
    if (!fontsLoaded) return;

    Promise.resolve(SplashScreen.hide()).then(() => {
      if (Platform.OS === "web" || !lottieAvailable) return;

      lottieFallbackTimerRef.current = setTimeout(() => {
        finishSplash();
      }, 2600);
    });

    return () => {
      if (lottieFallbackTimerRef.current) {
        clearTimeout(lottieFallbackTimerRef.current);
        lottieFallbackTimerRef.current = null;
      }
    };
  }, [fontsLoaded, lottieAvailable]);

  // 앱 준비 + Lottie 단계 완료 시 스플래시 제거
  const showSplashOverlay = splashPhase !== "done" || !appIsReady;

  if (!fontsLoaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={[styles.root, { backgroundColor: theme.bg.base }]}>
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
        {showSplashOverlay && Platform.OS !== "web" && (
          <View style={styles.splashOverlayContainer}>
            {splashPhase === "lottie" && LottieView != null ? (
              <LottieView
                source={require("@/assets/lottie/splash-lottie.json")}
                autoPlay={true}
                loop={false}
                onAnimationFinish={finishSplash}
                style={styles.splashOverlayImage}
              />
            ) : (
              <Image
                source={require("@/assets/images/splash-icon.png")}
                style={styles.splashOverlayImage}
                contentFit="contain"
                accessible={true}
                accessibilityRole="image"
                accessibilityLabel="앱 시작 스플래시 이미지"
              />
            )}
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
  splashOverlayContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
  },
  splashOverlayImage: {
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
