import { Box } from '../components/Box';
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
}