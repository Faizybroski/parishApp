import React from "react";
import { Text, StyleSheet, TextStyle } from "react-native";

interface LabelProps {
  children: React.ReactNode;
  style?: TextStyle;
  disabled?: boolean;
}

export const Label = React.forwardRef<Text, LabelProps>(
  ({ children, style, disabled = false }, ref) => {
    return (
      <Text
        ref={ref}
        style={[styles.label, disabled && styles.disabled, style]}
      >
        {children}
      </Text>
    );
  }
);

Label.displayName = "Label";

const styles = StyleSheet.create({
  label: {
    fontSize: 14, // text-sm
    fontWeight: "500", // font-medium
    lineHeight: 18, // approximate leading-none
  },
  disabled: {
    opacity: 0.7,
    // You can also set color to gray if you like
    // color: "#9ca3af"
  },
});
