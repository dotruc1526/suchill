import React from 'react';
import { Box } from './Box';
import { Text } from './Text';

export function Card({ title, description }: { title: string; description: string }) {
  return (
    <Box 
      backgroundColor="mainBackground" 
      padding="md" 
      borderRadius={8} 
      marginBottom="md" 
      shadowColor="text" 
      shadowOffset={{width: 0, height: 2}} 
      shadowOpacity={0.1} 
      shadowRadius={4} 
      elevation={2}
      borderWidth={1}
      borderColor="textDim"
    >
      <Text variant="header" fontSize={18} marginBottom="xs" color="primary">{title}</Text>
      <Text color="textDim">{description}</Text>
    </Box>
  );
}
