const fs = require('fs');
const path = require('path');

const files = {
  'theme.ts': `import { createTheme } from '@shopify/restyle';
const palette = { purplePrimary: '#5A31F4', black: '#0B0B0B', white: '#F0F2F3', greenPrimary: '#0ECD9D' };
export const theme = createTheme({
  colors: { mainBackground: palette.white, text: palette.black, accent: palette.greenPrimary },
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 40 },
  breakpoints: { phone: 0, tablet: 768 },
  textVariants: { defaults: { fontSize: 16, color: 'text' } }
});
export type Theme = typeof theme;`,

  'lib/auth.ts': `import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
const TOKEN_KEY = 'user_token';
export async function saveToken(token: string) {
  if (Platform.OS === 'web') localStorage.setItem(TOKEN_KEY, token);
  else await SecureStore.setItemAsync(TOKEN_KEY, token);
}
export async function getToken() {
  if (Platform.OS === 'web') return localStorage.getItem(TOKEN_KEY);
  return await SecureStore.getItemAsync(TOKEN_KEY);
}
export async function clearToken() {
  if (Platform.OS === 'web') localStorage.removeItem(TOKEN_KEY);
  else await SecureStore.deleteItemAsync(TOKEN_KEY);
}`,

  'lib/api.ts': `import { getToken } from './auth';
// UPDATE THIS IP to your machine's IPv4 address
const API_BASE_URL = 'http://192.168.1.100:5000';
async function request(path: string, options: RequestInit = {}) {
  const token = await getToken();
  const headers = new Headers(options.headers || {});
  if (token) headers.append('Authorization', \`Bearer \${token}\`);
  headers.append('Content-Type', 'application/json');
  const res = await fetch(\`\${API_BASE_URL}\${path}\`, { ...options, headers });
  if (!res.ok) throw new Error(\`API Error: \${res.status}\`);
  return res.status === 204 ? null : res.json();
}
export const api = {
  get: (path: string) => request(path),
  post: (path: string, body: any) => request(path, { method: 'POST', body: JSON.stringify(body) })
};`,

  'i18n/index.ts': `import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'expo-localization';
import en from './locales/en.json';
import vi from './locales/vi.json';
const deviceLanguage = getLocales()[0]?.languageCode || 'en';
i18n.use(initReactI18next).init({
  resources: { en: { translation: en }, vi: { translation: vi } },
  lng: deviceLanguage, fallbackLng: 'en', interpolation: { escapeValue: false }
});
export default i18n;`,

  'i18n/locales/en.json': `{"home":"Home","more":"More","settings":"Settings","about":"About","login":"Login","welcome":"Welcome to the App!"}`,
  'i18n/locales/vi.json': `{"home":"Trang chủ","more":"Thêm","settings":"Cài đặt","about":"Giới thiệu","login":"Đăng nhập","welcome":"Chào mừng đến với ứng dụng!"}`,

  'app/_layout.tsx': `import { useEffect, useState } from 'react';
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
}`,

  'app/login.tsx': `import { View, Text, Button } from 'react-native';
import { useRouter } from 'expo-router';
import { saveToken } from '../lib/auth';
import { useTranslation } from 'react-i18next';
import { api } from '../lib/api';
export default function LoginScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const handleLogin = async () => {
    try {
      const res = await api.post('/api/auth/login', { email: 'test@demo.local' });
      if (res.token) {
        await saveToken(res.token);
        router.replace('/(tabs)');
      }
    } catch (error) {
      console.error(error);
      alert('Login failed. Did you start the mock server?');
    }
  };
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>{t('login')}</Text>
      <Button title={t('login')} onPress={handleLogin} />
    </View>
  );
}`,

  'app/(tabs)/_layout.tsx': `import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
export default function TabsLayout() {
  const { t } = useTranslation();
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: t('home'), tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} /> }} />
      <Tabs.Screen name="more" options={{ title: t('more'), tabBarIcon: ({ color }) => <Ionicons name="menu" size={24} color={color} /> }} />
    </Tabs>
  );
}`,

  'app/(tabs)/index.tsx': `import { View, Text, Button } from 'react-native';
import { useTranslation } from 'react-i18next';
import { clearToken } from '../../lib/auth';
import { useRouter } from 'expo-router';
export default function HomeScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const handleLogout = async () => {
    await clearToken();
    router.replace('/login');
  };
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>{t('home')} - {t('welcome')}</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
}`,

  'app/(tabs)/more.tsx': `import { View, Text, Button } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
export default function MoreScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>{t('more')}</Text>
      <Button title={t('settings')} onPress={() => router.push('/settings')} />
      <View style={{ height: 10 }} />
      <Button title={t('about')} onPress={() => router.push('/about')} />
    </View>
  );
}`,

  'app/settings.tsx': `import { View, Text, Button } from 'react-native';
import { useRouter } from 'expo-router';
export default function SettingsScreen() {
  const router = useRouter();
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Settings</Text>
      <Button title="Go Back" onPress={() => router.back()} />
    </View>
  );
}`,

  'app/about.tsx': `import { View, Text, Button } from 'react-native';
import { useRouter } from 'expo-router';
export default function AboutScreen() {
  const router = useRouter();
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>About</Text>
      <Button title="Go Back" onPress={() => router.back()} />
    </View>
  );
}`,

  'mock-backend/server.js': `const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
app.post('/api/auth/login', (req, res) => {
  const { email } = req.body;
  if (email) res.json({ token: 'mock-jwt-token-12345' });
  else res.status(400).json({ error: 'Email required' });
});
app.get('/api/items', (req, res) => res.json([{ id: 1, name: 'Item 1' }]));
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(\`Mock backend on http://0.0.0.0:\${PORT}\`));`
};

for (const [filepath, content] of Object.entries(files)) {
  const fullPath = path.join(__dirname, filepath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content);
}
