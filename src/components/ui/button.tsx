import React from "react";
import { TouchableOpacity, Text, StyleProp, ViewStyle, TextStyle } from "react-native";
import { useTailwind } from "tailwindcss-react-native";

type Variant = "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
type Size = "default" | "sm" | "lg" | "icon";

interface ButtonProps {
  variant?: Variant;
  size?: Size;
  children: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  className?: string;
}

export function Button({
  variant = "default",
  size = "default",
  children,
  onPress,
  disabled,
  className = "",
}: ButtonProps) {
  const tailwind = useTailwind();

  const base = "flex-row items-center justify-center rounded-md";
  const variants: Record<Variant, string> = {
    default: "bg-primary",
    destructive: "bg-red-600",
    outline: "border border-gray-300 bg-white",
    secondary: "bg-gray-200",
    ghost: "bg-transparent",
    link: "bg-transparent",
  };

  const sizes: Record<Size, string> = {
    default: "h-10 px-4",
    sm: "h-9 px-3",
    lg: "h-11 px-8",
    icon: "h-10 w-10",
  };

  const textColors: Record<Variant, string> = {
    default: "text-white",
    destructive: "text-white",
    outline: "text-gray-800",
    secondary: "text-gray-800",
    ghost: "text-gray-800",
    link: "text-blue-600 underline",
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={tailwind(`${base} ${variants[variant]} ${sizes[size]} ${className}`) as StyleProp<ViewStyle>}
    >
      <Text style={tailwind(`${textColors[variant]} text-sm font-medium`) as StyleProp<TextStyle>}>
        {children}
      </Text>
    </TouchableOpacity>
  );
}
