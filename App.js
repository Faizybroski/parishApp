import * as React from "react";
import { AuthProvider } from "./src/contexts/AuthContext";
import { TailwindProvider } from "tailwindcss-react-native";
import PendingApproval from "./src/pages/waitingApprovalPage";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import RejectedRegistration from "./src/pages/rejectRegistration";
import ProtectedRoute from "./src/components/ProtectedRoutes";
import { View, Text } from "react-native";
import * as Sentry from "@sentry/react-native";
import New from "./src/pages/new";
import Dashboard from "./src/pages/dashboard";

Sentry.init({
  dsn: "https://7d03d09b85a8197b3fd000272b59f4e7@o4509917462134784.ingest.us.sentry.io/4509917635280896",
  enableInExpoDevelopment: true,
  debug: true,
});

if (__DEV__) {
  import("./ReactotronConfig").then(() =>
    console.log("✅ Reactotron Configured")
  );
}

const Stack = createNativeStackNavigator();

function App() {
  return (
    <TailwindProvider platform="android">
      <AuthProvider>
        <NavigationContainer>
          <Stack.Navigator>
            {/* Protected */}
            <Stack.Screen
              name="WaitingApproval"
              options={{ headerShown: false }}
            >
              {(props) => (
                <ProtectedRoute>
                  <PendingApproval {...props} />
                </ProtectedRoute>
              )}
            </Stack.Screen>

            <Stack.Screen
              name="RejectedRegistration"
              options={{ headerShown: false }}
            >
              {(props) => (
                <ProtectedRoute>
                  <RejectedRegistration {...props} />
                </ProtectedRoute>
              )}
            </Stack.Screen>
            <Stack.Screen name="dashboard" options={{ headerShown: false }}>
              {(props) => (
                <ProtectedRoute>
                  <Dashboard {...props} />
                </ProtectedRoute>
              )}
            </Stack.Screen>
          </Stack.Navigator>
        </NavigationContainer>
      </AuthProvider>
    </TailwindProvider>
  );
}

export default Sentry.wrap(App);
