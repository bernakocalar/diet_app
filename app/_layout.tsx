import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { AuthProvider, useAuth } from '../src/contexts/AuthContext';
import { useColorScheme } from '../src/hooks/useColorScheme';

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { user, userProfile, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === 'auth';
    const inOnboardingGroup = segments[0] === '(onboarding)';
    const inTabsGroup = segments[0] === '(tabs)';

    if (!user && !inAuthGroup) {
      // 1. Not logged in -> Go to Login
      router.replace('/auth/login');
    } else if (user) {
      // 2. Logged in
      const isProfileComplete = userProfile?.age && userProfile?.height && userProfile?.weight;

      if (!isProfileComplete) {
        // 2a. Profile Incomplete -> Go to Profile Setup
        // Check if we are already in the profile-setup screen to avoid loop
        if (segments[1] !== 'profile-setup') {
          router.replace('/(onboarding)/profile-setup');
        }
      } else if (!userProfile?.packageId) {
        // 2b. No Package Selected -> Go to Package Selection
        if (segments[1] !== 'package-selection') {
          router.replace('/(onboarding)/package-selection');
        }
      } else {
        // 2c. Everything set -> Go to Main App (Tabs)
        if (inAuthGroup || inOnboardingGroup) {
          router.replace('/(tabs)');
        }
      }
    }
  }, [user, userProfile, loading, segments]);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="auth" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
