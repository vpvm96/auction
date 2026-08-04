import { useAuthStore } from "@/lib/store/useAuthStore";
import { useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";

interface AuthProviderProps {
  children: React.ReactNode;
}

// 로그인 없이 열람 가능한 화면. 회원가입 약관 동의 단계에서 "보기"로 진입한다.
const PUBLIC_ROUTES = new Set(["my/terms", "my/privacy"]);

export function AuthProvider({ children }: AuthProviderProps) {
  const segments = useSegments();
  const router = useRouter();

  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const hasHydrated = useAuthStore((s) => s.hasHydrated);

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!hasHydrated || !isMounted) return;

    const inAuthGroup = segments[0] === "auth";
    const isPublicRoute = PUBLIC_ROUTES.has(segments.join("/"));

    if (!isLoggedIn && !inAuthGroup && !isPublicRoute) {
      router.replace("/auth/login");
    } else if (isLoggedIn && inAuthGroup) {
      router.replace("/(tabs)");
    }
  }, [isLoggedIn, hasHydrated, isMounted, segments, router]);

  return <>{children}</>;
}
