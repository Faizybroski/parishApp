import React from 'react';
import {
  ScrollView,
  StyleProp, 
  ViewStyle, 
} from "react-native";
import { OnboardingCarousel } from '../OnboardingCarousal/Onboardingcarousel';
import { useTailwind } from "tailwindcss-react-native"; // Uncomment if using Tailwind CSS
import { useNavigation } from "@react-navigation/native";

const AuthPage = () => {
  const tailwind = useTailwind();

  return (
    <ScrollView style={tailwind("min-h-screen bg-background flex items-center justify-center p-4") as StyleProp<ViewStyle>}>
      <ScrollView style={tailwind("w-full max-w-md space-y-8") as StyleProp<ViewStyle>}>
          <OnboardingCarousel />
      </ScrollView>
    </ScrollView>
  );
};

export default AuthPage;