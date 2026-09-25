import { Button } from 'react-native';
import { Box } from '../components/Box';
import { Text } from '../components/Text';
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
    <Box flex={1} justifyContent="center" alignItems="center" backgroundColor="mainBackground">
      <Text variant="header" marginBottom="lg">{t('login')}</Text>
      <Button title={t('login')} onPress={handleLogin} />
    </Box>
  );
}