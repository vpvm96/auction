import { FontFamily, FontSize, Radius, Spacing } from "@/constants/tokens";
import { useTheme } from "@/hooks/useTheme";
import { useState } from "react";
import {
    KeyboardTypeOptions,
    ReturnKeyTypeOptions,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

interface FormInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  returnKeyType?: ReturnKeyTypeOptions;
  onSubmitEditing?: () => void;
  error?: string;
}

export function FormInput({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType,
  autoCapitalize = "none",
  returnKeyType,
  onSubmitEditing,
  error,
}: FormInputProps) {
  const theme = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  const borderColor =
    error != null
      ? theme.status.danger
      : isFocused
        ? theme.brand.primary
        : theme.border.default;

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: theme.text.primary }]}>{label}</Text>
      <View
        style={[
          styles.inputWrapper,
          { backgroundColor: theme.bg.surface, borderColor },
        ]}
      >
        <TextInput
          accessible={true}
          accessibilityLabel={label}
          accessibilityRole="adjustable"
          accessibilityState={{ disabled: false }}
          accessibilityHint={error || placeholder}
          style={[styles.input, { color: theme.text.primary }]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.text.tertiary}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          autoCorrect={false}
        />
      </View>
      {error != null ? (
        <Text
          accessible={true}
          accessibilityLiveRegion="polite"
          style={[styles.errorText, { color: theme.status.danger }]}
        >
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.xs,
  },
  label: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.semibold,
  },
  inputWrapper: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.xl,
  },
  input: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.regular,
    padding: 0,
  },
  errorText: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.regular,
  },
});
