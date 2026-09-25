import React from 'react';
import { TextInput, TextInputProps } from 'react-native';
import { Box } from './Box';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../theme';

export function Input(props: TextInputProps) {
  const theme = useTheme<Theme>();
  return (
    <Box width="100%" marginBottom="md">
      <TextInput
        style={{
          borderWidth: 1,
          borderColor: theme.colors.textDim,
          borderRadius: 8,
          padding: theme.spacing.md,
          color: theme.colors.text,
        }}
        placeholderTextColor={theme.colors.textDim}
        {...props}
      />
    </Box>
  );
}