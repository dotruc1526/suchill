import { Button } from 'react-native';
import { Box } from '../components/Box';
import { Text } from '../components/Text';
import { useRouter } from 'expo-router';
export default function AboutScreen() {
  const router = useRouter();
  return (
    <Box flex={1} justifyContent="center" alignItems="center" backgroundColor="mainBackground">
      <Text variant="header" marginBottom="lg">About</Text>
      <Button title="Go Back" onPress={() => router.back()} />
    </Box>
  );
}