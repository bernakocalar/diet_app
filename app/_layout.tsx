import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import '../src/i18n'; // Init i18n

import { AuthProvider, useAuth } from '../src/contexts/AuthContext';
import { useColorScheme } from '../src/hooks/useColorScheme';

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { user, userProfile, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = (segments[0] as string) === '(auth)';
    const inOnboardingGroup = (segments[0] as string) === '(onboarding)';

    if (!user && !inAuthGroup) {
      router.replace('/login' as any);
    } else if (user) {
      const isProfileComplete =
        userProfile?.age && userProfile?.height && userProfile?.weight;

      if (!isProfileComplete) {
        const atProfileSetup = (segments[0] as string) === '(onboarding)' && (segments[1] as string) === 'profile-setup';
        if (!atProfileSetup) {
          router.replace('/profile-setup' as any);
        }
      } else if (!userProfile?.packageId) {
        const atPackageSelection = (segments[0] as string) === '(onboarding)' && (segments[1] as string) === 'package-selection';
        if (!atPackageSelection) {
          router.replace('/package-selection' as any);
        }
      } else {
        if (inAuthGroup || inOnboardingGroup) {
          router.replace('/' as any);
        }
      }
    }
  }, [user, userProfile, loading, segments]);


  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />

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
