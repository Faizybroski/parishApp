import React from "react";
import { ScrollView, Text, StyleProp, ViewStyle, TextStyle } from "react-native";
import { useTailwind } from "tailwindcss-react-native";

const Card = React.forwardRef<ScrollView, { className?: string; onPress?: () => void, children?: React.ReactNode }>(
  ({ className, children, onPress, ...props }, ref) => {
    const tailwind = useTailwind();
    return (
      <ScrollView
        ref={ref}
        style={tailwind(`rounded-lg border bg-white shadow-sm ${className || ""}`) as StyleProp<ViewStyle>}
        {...props}
      >
        {children}
      </ScrollView>
    );
  }
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<ScrollView, { className?: string; children?: React.ReactNode }>(
  ({ className, children, ...props }, ref) => {
    const tailwind = useTailwind();
    return (
      <ScrollView
        ref={ref}
        style={tailwind(`flex flex-col space-y-2 p-6 ${className || ""}`) as StyleProp<ViewStyle>}
        {...props}
      >
        {children}
      </ScrollView>
    );
  }
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<Text, { className?: string; children?: React.ReactNode }>(
  ({ className, children, ...props }, ref) => {
    const tailwind = useTailwind();
    return (
      <Text
        ref={ref}
        style={tailwind(`text-2xl font-semibold tracking-tight ${className || ""}`) as StyleProp<TextStyle>}
        {...props}
      >
        {children}
      </Text>
    );
  }
);
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<Text, { className?: string; children?: React.ReactNode }>(
  ({ className, children, ...props }, ref) => {
    const tailwind = useTailwind();
    return (
      <Text
        ref={ref}
        style={tailwind(`text-sm text-gray-500 ${className || ""}`) as StyleProp<TextStyle>}
        {...props}
      >
        {children}
      </Text>
    );
  }
);
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<ScrollView, { className?: string; children?: React.ReactNode }>(
  ({ className, children, ...props }, ref) => {
    const tailwind = useTailwind();
    return (
      <ScrollView ref={ref} style={tailwind(`p-6 pt-0 ${className || ""}`) as StyleProp<ViewStyle>} {...props}>
        {children}
      </ScrollView>
    );
  }
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<ScrollView, { className?: string; children?: React.ReactNode }>(
  ({ className, children, ...props }, ref) => {
    const tailwind = useTailwind();
    return (
      <ScrollView
        ref={ref}
        style={tailwind(`flex flex-row items-center p-6 pt-0 ${className || ""}`) as StyleProp<ViewStyle>}
        {...props}
      >
        {children}
      </ScrollView>
    );
  }
);
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
