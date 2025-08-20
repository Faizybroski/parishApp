import React from "react";
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  GestureResponderEvent,
} from "react-native";

type ButtonVariant =
  | "default"
  | "destructive"
  | "outline"
  | "secondary"
  | "ghost"
  | "link"
  | "onboarding"
  | "onboardingSecondary"
  | "google";

type ButtonSize = "default" | "sm" | "lg" | "icon";

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  onPress?: (event: GestureResponderEvent) => void;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  loading?: boolean;
}

const VARIANT_STYLES: Record<ButtonVariant, ViewStyle> = {
  default: { backgroundColor: "#3b82f6" },
  destructive: { backgroundColor: "#ef4444" },
  outline: { borderWidth: 1, borderColor: "#d1d5db", backgroundColor: "#ffffff" },
  secondary: { backgroundColor: "#6b7280" },
  ghost: { backgroundColor: "transparent" },
  link: { backgroundColor: "transparent" },
  onboarding: { backgroundColor: "#6366f1" },
  onboardingSecondary: { backgroundColor: "#f3f4f6", borderWidth: 1, borderColor: "#d1d5db" },
  google: { backgroundColor: "#ffffff", borderWidth: 1, borderColor: "#d1d5db" },
};

const SIZE_STYLES: Record<ButtonSize, ViewStyle> = {
  default: { paddingVertical: 10, paddingHorizontal: 16 },
  sm: { paddingVertical: 8, paddingHorizontal: 12 },
  lg: { paddingVertical: 14, paddingHorizontal: 24 },
  icon: { width: 40, height: 40, justifyContent: "center", alignItems: "center" },
};

export const Button: React.FC<ButtonProps> = ({
  variant = "default",
  size = "default",
  children,
  onPress,
  disabled = false,
  style,
  textStyle,
  loading = false,
}) => {
  const buttonStyle = [
    styles.base,
    VARIANT_STYLES[variant],
    SIZE_STYLES[size],
    disabled && styles.disabled,
    style,
  ];

  const textColor =
    variant === "default" ||
    variant === "onboarding" ||
    variant === "secondary" ||
    variant === "destructive"
      ? "#ffffff"
      : "#000000";

  return (
    <TouchableOpacity style={buttonStyle} onPress={onPress} disabled={disabled}>
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <Text style={[{ color: textColor, textAlign: "center" }, textStyle]}>
          {children}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  disabled: {
    opacity: 0.5,
  },
});
