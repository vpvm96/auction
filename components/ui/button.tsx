import { FontFamily, FontSize, Radius, Spacing } from "@/constants/tokens";
import { useTheme } from "@/hooks/useTheme";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  type ViewStyle,
} from "react-native";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger";
export type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps {
  label: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
}

export function Button({
  label,
  onPress,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  fullWidth = false,
  style,
}: ButtonProps) {
  const theme = useTheme();

  const isDisabled = disabled || loading;

  const bgColor =
    variant === "primary"
      ? theme.brand.primary
      : variant === "secondary"
        ? theme.brand.primaryLight
        : variant === "danger"
          ? theme.status.dangerBg
          : "transparent";

  const textColor =
    variant === "primary"
      ? theme.brand.onPrimary
      : variant === "secondary"
        ? theme.text.brand
        : variant === "outline"
          ? theme.text.brand
          : variant === "ghost"
            ? theme.text.secondary
            : variant === "danger"
              ? theme.status.danger
              : theme.text.primary;

  return (
    <Pressable
      accessible={true}
      accessibilityLabel={label}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
      accessibilityHint={loading ? "로딩 중입니다" : undefined}
      style={[
        styles.base,
        sizeContainerStyles[size],
        {
          backgroundColor: bgColor,
          borderWidth: variant === "outline" ? 1.5 : 0,
          borderColor:
            variant === "outline" ? theme.brand.primary : "transparent",
          opacity: isDisabled ? 0.5 : 1,
          alignSelf: fullWidth ? ("stretch" as const) : ("flex-start" as const),
        },
        style,
      ]}
      onPress={onPress}
      disabled={isDisabled}
    >
      {loading ? (
        <ActivityIndicator size="small" color={textColor} />
      ) : (
        <Text
          style={[styles.label, sizeLabelStyles[size], { color: textColor }]}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: Radius.lg,
  },
  label: {
    fontFamily: FontFamily.semibold,
  },
});

const sizeContainerStyles = StyleSheet.create({
  sm: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.sm + 2,
    borderRadius: Radius.md,
    minHeight: 32,
  },
  md: {
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.lg + 1,
    borderRadius: Radius.lg,
    minHeight: 44,
  },
  lg: {
    paddingHorizontal: Spacing.section,
    paddingVertical: Spacing.xl + 2,
    borderRadius: Radius.xl,
    minHeight: 52,
  },
});

const sizeLabelStyles = StyleSheet.create({
  sm: { fontSize: FontSize.sm },
  md: { fontSize: FontSize.base },
  lg: { fontSize: FontSize.lg },
});
