import React from "react";
import { ScrollView, Animated } from "react-native";
import { useTailwind } from "tailwindcss-react-native";

interface ProgressProps {
  value?: number; // 0–100
  className?: string; // extra Tailwind classes
}

export const Progress: React.FC<ProgressProps> = ({ value = 0, className }) => {
  const tailwind = useTailwind();
  const progressAnim = React.useRef(new Animated.Value(value)).current;

  React.useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: value,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [value]);

  const widthInterpolated = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  });

  return (
    <ScrollView style={tailwind(`h-4 w-full rounded-full bg-secondary overflow-hidden ${className || ""}`) as any}>
      <Animated.ScrollView
        style={[
          tailwind("h-full bg-primary") as any, // Use 'as any' to avoid type issues with Tailwind
          { width: widthInterpolated },
        ]}
      />
    </ScrollView>
  );
};
