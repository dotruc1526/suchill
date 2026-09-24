import { View, Text, Button } from 'react-native';
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
}