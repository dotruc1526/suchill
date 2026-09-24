import { View, Text, Button } from 'react-native';
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
}