import React from "react";
import { TextInput, StyleSheet, TextInputProps, ScrollView, ViewStyle } from "react-native";

interface InputProps extends TextInputProps {
  style?: ViewStyle;
}

export const Input = React.forwardRef<TextInput, InputProps>(
  ({ style, ...props }, ref) => {
    return (
      <TextInput
        ref={ref}
        style={[styles.input, style]}
        placeholderTextColor="#6b7280" // muted color
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

const styles = StyleSheet.create({
  input: {
    height: 40, // equivalent to h-10
    width: "100%",
    borderRadius: 8, // rounded-md
    borderWidth: 1,
    borderColor: "#d1d5db", // border-input
    backgroundColor: "#ffffff", // bg-background
    paddingHorizontal: 12, // px-3
    paddingVertical: 8, // py-2
    fontSize: 16, // text-base
    color: "#111827", // default text color
  },
});
