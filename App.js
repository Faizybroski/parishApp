import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "./src/contexts/AuthContext";
import { ScrollView, Text, View, TouchableOpacity, TextInput } from "react-native";
import { TailwindProvider } from 'tailwindcss-react-native';
import PendingApproval from "./src/pages/waitingApprovalPage";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { OnboardingCarousel } from './src/components/OnboardingCarousal/Onboardingcarousel'; // Adjust the import path as necessary

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <TailwindProvider platform="android">
            <AuthProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Onboarding">
            <Stack.Screen
              name="Onboarding"
              component={OnboardingCarousel}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="WaitingApproval"
              component={PendingApproval}
                options={{
    headerLeft: () => null,
    gestureEnabled: false, // disables swipe back on iOS
  }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </AuthProvider> 
    </TailwindProvider>
  );
}
