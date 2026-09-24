import { useEffect, useState } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { ThemeProvider } from '@shopify/restyle';
import { theme } from '../theme';
import '../i18n';
import { getToken } from '../lib/auth';
import { View, Text } from 'react-native';
export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const segments = useSegments();
  const router = useRouter();
  useEffect(() => {
    (async () => {
      const token = await getToken();
      setIsAuthenticated(!!token);
      setIsReady(true);
    })();
  }, []);
  useEffect(() => {
    if (!isReady) return;
    const inTabsGroup = segments[0] === '(tabs)';
    if (!isAuthenticated && inTabsGroup) router.replace('/login');
    else if (isAuthenticated && !inTabsGroup) router.replace('/(tabs)');
  }, [isAuthenticated, isReady, segments]);
  if (!isReady) return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text>Loading...</Text></View>;
  return (
    <ThemeProvider theme={theme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="login" />
        <Stack.Screen name="settings" options={{ presentation: 'modal' }} />
        <Stack.Screen name="about" options={{ presentation: 'modal' }} />
      </Stack>
    </ThemeProvider>
  );
}