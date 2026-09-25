import { Box } from '../../components/Box';
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
}