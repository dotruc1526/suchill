const fs = require('fs');
const path = require('path');

// 1. Nâng cấp Mock Backend
const backendCode = `const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/auth/login', (req, res) => {
  const body = req.body || {};
  const email = body.email;
  if (email) res.json({ token: 'mock-jwt-token-12345' });
  else res.status(400).json({ error: 'Email required' });
});

app.get('/api/items', (req, res) => {
  // Giả lập mạng chậm 1 giây
  setTimeout(() => {
    res.json([
      { id: '1', title: 'Learn React Native', description: 'Hiểu về Components, Hooks và vòng đời ứng dụng.' },
      { id: '2', title: 'Master Expo & Router', description: 'Sử dụng Expo Router để điều hướng đa màn hình.' },
      { id: '3', title: 'Client-Server Auth', description: 'Lưu trữ JWT Token an toàn với SecureStore.' },
      { id: '4', title: 'Styling with Restyle', description: 'Xây dựng Design System chuyên nghiệp, Type-safe.' },
      { id: '5', title: 'Agile & QA Testing', description: 'Quy trình lặp lại: Code, Test, Refactor liên tục.' }
    ]);
  }, 1000);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(\`Mock backend on http://0.0.0.0:\${PORT}\`));
`;
fs.writeFileSync(path.join('mock-backend', 'server.js'), backendCode);

// 2. Tạo Component Card
const cardCode = `import React from 'react';
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
`;
fs.writeFileSync(path.join('components', 'Card.tsx'), cardCode);

// 3. Nâng cấp màn hình Home
const homeCode = `import React, { useEffect, useState } from 'react';
import { FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { Box } from '../../components/Box';
import { Text } from '../../components/Text';
import { Card } from '../../components/Card';
import { useTranslation } from 'react-i18next';
import { api } from '../../lib/api';

type Item = { id: string; title: string; description: string };

export default function HomeScreen() {
  const { t } = useTranslation();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const fetchItems = async () => {
    try {
      setError('');
      const data = await api.get('/api/items');
      setItems(data);
    } catch (err) {
      setError('Failed to fetch items. Is server running?');
    }
  };

  const loadInitial = async () => {
    setLoading(true);
    await fetchItems();
    setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchItems();
    setRefreshing(false);
  };

  useEffect(() => {
    loadInitial();
  }, []);

  return (
    <Box flex={1} backgroundColor="mainBackground" padding="md" paddingTop="xl">
      <Text variant="header" marginBottom="lg">{t('home')}</Text>
      
      {loading ? (
        <Box flex={1} justifyContent="center" alignItems="center">
          <ActivityIndicator size="large" color="#5A31F4" />
          <Text marginTop="md" color="textDim">Loading API...</Text>
        </Box>
      ) : error ? (
        <Box flex={1} justifyContent="center" alignItems="center">
          <Text color="textDim">{error}</Text>
        </Box>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <Card title={item.title} description={item.description} />}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </Box>
  );
}
`;
fs.writeFileSync(path.join('app', '(tabs)', 'index.tsx'), homeCode);
