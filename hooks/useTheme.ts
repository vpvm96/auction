import { darkTheme, lightTheme, type ColorTheme } from "@/constants/theme";
import { useThemeStore } from "@/lib/store/useThemeStore";
import { useColorScheme } from "react-native";

/**
 * 현재 활성 ColorTheme을 반환.
 * - preference가 'system'이면 OS 설정을 따름
 * - preference가 'light' | 'dark'이면 강제 적용
 *
 * 사용 예:
 *   const theme = useTheme()
 *   style={{ backgroundColor: theme.bg.surface }}
 */
export function useTheme(): ColorTheme {
  const preference = useThemeStore((s) => s.preference);
  const systemScheme = useColorScheme();

  const isDark =
    preference === "dark" ||
    (preference === "system" && systemScheme === "dark");

  return isDark ? darkTheme : lightTheme;
}

/**
 * 현재 다크 모드 여부만 boolean으로 반환.
 * 아이콘 색상 등 간단한 분기에 사용.
 */
export function useIsDark(): boolean {
  const preference = useThemeStore((s) => s.preference);
  const systemScheme = useColorScheme();

  return (
    preference === "dark" ||
    (preference === "system" && systemScheme === "dark")
  );
}
