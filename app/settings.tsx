import { Box } from '../components/Box';
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
}