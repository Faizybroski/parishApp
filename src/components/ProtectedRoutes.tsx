import React, { useEffect } from 'react';
import {
  Alert,
  // Button,
  ScrollView,
  Text,
  TouchableOpacity,
  Button,
  Image,
  StyleProp, 
  ViewStyle, 
  TextStyle,
  StyleSheet,
  ActivityIndicator,
  Switch,
} from "react-native";
import { useTailwind } from "tailwindcss-react-native"; 
import { useAuth } from '../contexts/AuthContext';
import { useProfile } from '../hooks/useProfile';
import AuthPage from './auth/AuthPage';
import OnboardingFlow from './onboarding/OnboardingFlow';
import { Loader2 } from 'lucide-react-native';
// import { AdminLogin } from '@/components/adminLogin/AdminLogin';
import { useNavigation, useRoute } from "@react-navigation/native";


interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
const tailwind = useTailwind();
  const navigate = useNavigation();
  const route = useRoute();
  const currentPath = route.name; 

  // ALL HOOKS MUST BE CALLED FIRST - before any conditional logic or early returns
  useEffect(() => {

    if (!authLoading && !profileLoading && profile) {
      if (profile && profile.approval_status === "pending" && profile.onboarding_completed) {
        return navigate.navigate('/WaitingApproval' as never);
      }

      if (profile && profile.approval_status === "rejected") {
        return navigate.navigate('/rejected-profile' as never);
      }

      if (profile && profile.is_suspended) {
        return navigate.navigate("/suspended-user" as never);
      }
    }
        // Only run redirection logic when we have both user and profile data
    if (user && profile && !authLoading && !profileLoading) {
      // const currentPath = location.pathname;

      console.log('🔍 ProtectedRoute: Checking user role and redirection', {
        userEmail: user.email,
        profileRole: profile.role,
        currentPath,
        onboardingCompleted: profile.onboarding_completed,
        approvalStatus: profile.approval_status
      });

      if (profile && profile.approval_status === 'pending' 
          && profile.onboarding_completed 
          && currentPath !== '/WaitingApproval') {
        console.log('⏳ ProtectedRoute: User approval pending, redirecting...');
        navigate.navigate('/WaitingApproval' as never);
        return;
      }

      if (profile && profile.approval_status === 'rejected' && currentPath !== '/rejected-profile') {
        navigate.navigate('/rejected-profile' as never);
        return;
      }

      if (profile && profile.is_suspended && currentPath !== "/suspended-user") {
        navigate.navigate("/suspended-user" as never);
        return;
    }

    if(profile && profile.role === 'user' && profile.approval_status === 'approved') {
      navigate.navigate('dashboard' as never);
    }  

      if (profile && currentPath === '/WaitingApproval' && profile.approval_status !== 'pending') {
        console.log('✅ ProtectedRoute: Approval granted, redirecting to home');
        navigate.navigate('dashboard' as never);
        return;
      }

      if (profile && currentPath === '/rejected-profile' && profile.approval_status !== 'rejected') {
        console.log('✅ ProtectedRoute: User is not rejected, redirecting to home');
        navigate.navigate('dashboard' as never);
        return;
      }

      if (profile && currentPath === '/suspended-user' && !profile.is_suspended ) {
        console.log('✅ ProtectedRoute: User is not suspended, redirecting to home');
        navigate.navigate('dashboard' as never);
        return;
      }
  
      // Skip redirection if we're already on auth pages
      if (currentPath.startsWith('/auth')) {
        console.log('🔄 ProtectedRoute: Skipping redirect - on auth page');
        return;
      }

      // if (profile.role === 'admin') {
      //   console.log('🚫 ProtectedRoute: Admin already logged in, redirecting...');
      //   navigate.navigate('/admin/dashboard' as never);
      //   return;
      // }

      // Role-based redirection logic - Admins should ALWAYS be redirected to admin area
      if (profile.role === 'admin') {
        console.log('🛡️ ProtectedRoute: Admin detected');
        // Admin should always go to /admin/dashboard unless already on admin routes
        if (!currentPath.startsWith('/admin')) {
          console.log('🔄 ProtectedRoute: Redirecting admin to /admin/dashboard');
          navigate.navigate('/admin/dashboard' as never);
          return;
        }
      } else if (profile.role === 'user') {
        console.log('👤 ProtectedRoute: Regular user detected');
        // Prevent users from accessing admin routes
        if (currentPath.startsWith('/admin')) {
          console.log('🔒 ProtectedRoute: Redirecting user away from admin area to /');
          navigate.navigate('dashboard' as never);
          return;
        }
        
        // Handle user onboarding flow - if not completed, show onboarding
        if (!profile.onboarding_completed) {
          console.log('📝 ProtectedRoute: User needs onboarding');
          // The onboarding check below will handle this
          return;
        }
        
        // User is completed and should stay on regular user routes
        console.log('✅ ProtectedRoute: User has completed onboarding, staying on user routes');
      }
    } else {
      console.log('⏳ ProtectedRoute: Waiting for user/profile data', {
        hasUser: !!user,
        hasProfile: !!profile,
        authLoading,
        profileLoading
      });
    }
  }, [user, profile, navigate, currentPath, authLoading, profileLoading]);

  // NOW we can do conditional logic and early returns
  if (authLoading || profileLoading) {
    return (
      <ScrollView style={tailwind("min-h-screen bg-background flex items-center justify-center") as StyleProp<ViewStyle>}>
        <ScrollView style={tailwind("text-center space-y-4") as StyleProp<ViewStyle>}>
                <ActivityIndicator size="large" color="#d4af37" /> 
          <Text style={tailwind("text-muted-foreground") as StyleProp<TextStyle>}>Loading...</Text>
        </ScrollView>
      </ScrollView>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  if (profile && !profile.onboarding_completed && profile.role === 'user') {
    return <OnboardingFlow />;
  }

  // Admin don't need onboarding - they go directly to admin panel
  // The useEffect above handles their redirection

  return <>{children}</>;
};

export default ProtectedRoute;