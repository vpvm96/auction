// react-native-web 환경에서는 WebView를 쓸 수 없어 안내 메시지만 표시
import { useTheme } from "@/hooks/useTheme";
import { FontFamily, FontSize, Radius } from "@/constants/tokens";
import { StyleSheet, Text, View } from "react-native";

interface KakaoMapProps {
  query: string;
  fallbackQuery?: string;
  height?: number;
}

export function KakaoMap({ height = 240 }: KakaoMapProps) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.fallback,
        { height, backgroundColor: theme.bg.sunken },
      ]}
    >
      <Text style={[styles.fallbackText, { color: theme.text.tertiary }]}>
        지도는 모바일 앱에서 확인할 수 있습니다
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  fallback: {
    width: "100%",
    borderRadius: Radius.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  fallbackText: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.medium,
  },
});
