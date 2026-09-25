import { Button } from 'react-native';
import { Box } from '../../components/Box';
import { Text } from '../../components/Text';
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
    <Box flex={1} justifyContent="center" alignItems="center" backgroundColor="mainBackground">
      <Text variant="header" marginBottom="lg">{t('home')} - {t('welcome')}</Text>
      <Button title="Logout" onPress={handleLogout} />
    </Box>
  );
}