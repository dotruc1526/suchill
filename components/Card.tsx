import React from 'react';
import { Box } from './Box';
import { Text } from './Text';

export function Card({ year, title, subtitle, description }: { year: string; title: string; subtitle: string; description: string; }) {
  return (
    <Box 
      backgroundColor="mainBackground" 
      padding="md" 
      borderRadius={12} 
      marginBottom="md" 
      shadowColor="text" 
      shadowOffset={{width: 0, height: 4}} 
      shadowOpacity={0.05} 
      shadowRadius={8} 
      elevation={3}
      borderWidth={1}
      borderColor="textDim"
      flexDirection="row"
    >
      <Box backgroundColor="primary" padding="md" borderRadius={8} justifyContent="center" alignItems="center" marginRight="md" width={70}>
        <Text color="mainBackground" fontWeight="bold" fontSize={18}>{year}</Text>
      </Box>
      <Box flex={1} justifyContent="center">
        <Text variant="header" fontSize={18} color="primary" marginBottom="xs">{title}</Text>
        <Text fontWeight="bold" color="text" marginBottom="xs">{subtitle}</Text>
        <Text color="textDim" fontSize={13}>{description}</Text>
      </Box>
    </Box>
  );
}
