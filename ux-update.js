const fs = require('fs');

let themeContent = fs.readFileSync('theme.ts', 'utf8');
themeContent = themeContent.replace(
  "colors: { mainBackground: palette.white, text: palette.black, accent: palette.greenPrimary }",
  "colors: { mainBackground: palette.white, text: palette.black, textDim: '#888', primary: palette.purplePrimary, accent: palette.greenPrimary }"
);
fs.writeFileSync('theme.ts', themeContent);

fs.writeFileSync('components/Button.tsx', `import React from 'react';
import { TouchableOpacity, ActivityIndicator } from 'react-native';
import { Box } from './Box';
import { Text } from './Text';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../theme';

export function Button({ onPress, title, loading }: { onPress: () => void, title: string, loading?: boolean }) {
  const theme = useTheme<Theme>();
  return (
    <TouchableOpacity onPress={onPress} disabled={loading} style={{ width: '100%' }}>
      <Box backgroundColor="primary" padding="md" borderRadius={8} alignItems="center">
        {loading ? <ActivityIndicator color={theme.colors.mainBackground} /> : <Text color="mainBackground" fontWeight="bold">{title}</Text>}
      </Box>
    </TouchableOpacity>
  );
}`);

fs.writeFileSync('components/Input.tsx', `import React from 'react';
import { TextInput, TextInputProps } from 'react-native';
import { Box } from './Box';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../theme';

export function Input(props: TextInputProps) {
  const theme = useTheme<Theme>();
  return (
    <Box width="100%" marginBottom="md">
      <TextInput
        style={{
          borderWidth: 1,
          borderColor: theme.colors.textDim,
          borderRadius: 8,
          padding: theme.spacing.md,
          color: theme.colors.text,
        }}
        placeholderTextColor={theme.colors.textDim}
        {...props}
      />
    </Box>
  );
}`);

const enLoc = JSON.parse(fs.readFileSync('i18n/locales/en.json', 'utf8'));
enLoc.email = "Email";
enLoc.password = "Password";
enLoc.logout = "Log out";
fs.writeFileSync('i18n/locales/en.json', JSON.stringify(enLoc, null, 2));

const viLoc = JSON.parse(fs.readFileSync('i18n/locales/vi.json', 'utf8'));
viLoc.email = "Email";
viLoc.password = "Mật khẩu";
viLoc.logout = "Đăng xuất";
fs.writeFileSync('i18n/locales/vi.json', JSON.stringify(viLoc, null, 2));

fs.writeFileSync('app/login.tsx', `import React, { useState } from 'react';
import { Box } from '../components/Box';
import { Text } from '../components/Text';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { useRouter } from 'expo-router';
import { saveToken } from '../lib/auth';
import { useTranslation } from 'react-i18next';
import { api } from '../lib/api';

export default function LoginScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email) return alert('Please enter email');
    setLoading(true);
    try {
      const res = await api.post('/api/auth/login', { email });
      if (res.token) {
        await saveToken(res.token);
        router.replace('/(tabs)');
      }
    } catch (error) {
      console.error(error);
      alert('Login failed. Check your network or mock server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box flex={1} justifyContent="center" alignItems="center" backgroundColor="mainBackground" padding="xl">
      <Text variant="header" marginBottom="xl">{t('login')}</Text>
      <Input placeholder={t('email')} value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
      <Input placeholder={t('password')} value={password} onChangeText={setPassword} secureTextEntry />
      <Box height={16} />
      <Button title={t('login')} onPress={handleLogin} loading={loading} />
    </Box>
  );
}`);

fs.writeFileSync('app/(tabs)/index.tsx', `import { Box } from '../../components/Box';
import { Text } from '../../components/Text';
import { useTranslation } from 'react-i18next';

export default function HomeScreen() {
  const { t } = useTranslation();
  return (
    <Box flex={1} justifyContent="center" alignItems="center" backgroundColor="mainBackground">
      <Text variant="header" marginBottom="lg">{t('home')}</Text>
      <Text>{t('welcome')}</Text>
    </Box>
  );
}`);

fs.writeFileSync('app/settings.tsx', `import { Box } from '../components/Box';
import { Text } from '../components/Text';
import { Button } from '../components/Button';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { clearToken } from '../lib/auth';

export default function SettingsScreen() {
  const router = useRouter();
  const { t } = useTranslation();

  const handleLogout = async () => {
    await clearToken();
    router.replace('/login');
  };

  return (
    <Box flex={1} justifyContent="center" alignItems="center" backgroundColor="mainBackground" padding="xl">
      <Text variant="header" marginBottom="xl">{t('settings')}</Text>
      <Button title={t('logout')} onPress={handleLogout} />
      <Box height={16} />
      <Button title="Go Back" onPress={() => router.back()} />
    </Box>
  );
}`);

fs.writeFileSync('app/about.tsx', `import { Box } from '../components/Box';
import { Text } from '../components/Text';
import { Button } from '../components/Button';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

export default function AboutScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  return (
    <Box flex={1} justifyContent="center" alignItems="center" backgroundColor="mainBackground" padding="xl">
      <Text variant="header" marginBottom="xl">{t('about')}</Text>
      <Button title="Go Back" onPress={() => router.back()} />
    </Box>
  );
}`);

fs.writeFileSync('app/(tabs)/more.tsx', `import { Box } from '../../components/Box';
import { Text } from '../../components/Text';
import { Button } from '../../components/Button';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';

export default function MoreScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  return (
    <Box flex={1} justifyContent="center" alignItems="center" backgroundColor="mainBackground" padding="xl">
      <Text variant="header" marginBottom="xl">{t('more')}</Text>
      <Button title={t('settings')} onPress={() => router.push('/settings')} />
      <Box height={16} />
      <Button title={t('about')} onPress={() => router.push('/about')} />
    </Box>
  );
}`);
