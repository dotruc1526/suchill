import React from 'react';
import { TouchableOpacity, ActivityIndicator } from 'react-native';
import { Box } from './Box';
import { Text } from './Text';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../theme';

export function Button({ onPress, title, loading }: { onPress: () => void, title: string, loading?: boolean }) {
  const theme = useTheme<Theme>();
  return (
    <TouchableOpacity onPress={onPress} disabled={loading} style={{ width: '100%' }}>
      <Box backgroundColor="primary" padding="md" borderRadius={8} alignItems="center">
        {loading ? <ActivityIndicator color={theme.colors.mainBackground} /> : <Text color="mainBackground" fontWeight="bold">{title}</Text>}
      </Box>
    </TouchableOpacity>
  );
}