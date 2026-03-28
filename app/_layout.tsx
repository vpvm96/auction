import "@/global.css";
import { Colors } from "@/constants/colors";
import { FontFamily, FontSize, Radius, Spacing } from "@/constants/tokens";
import { AuthProvider } from "@/components/providers/auth-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: 2,
    },
  },
});

SplashScreen.preventAutoHideAsync();

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

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={styles.root}>
        <StatusBar style="dark" />
        <AuthProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="notifications" />
            <Stack.Screen name="auth" />
            <Stack.Screen
              name="region-select"
              options={{ presentation: "modal" }}
            />
          </Stack>
        </AuthProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
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
