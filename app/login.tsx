import React, { useState } from 'react';
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
}