import { Box } from '../../components/Box';
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
}