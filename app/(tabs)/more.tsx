import { View, Text, Button } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
export default function MoreScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>{t('more')}</Text>
      <Button title={t('settings')} onPress={() => router.push('/settings')} />
      <View style={{ height: 10 }} />
      <Button title={t('about')} onPress={() => router.push('/about')} />
    </View>
  );
}