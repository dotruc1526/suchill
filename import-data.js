const fs = require('fs');
const path = require('path');

// 1. Read temp_index.ts
let content = fs.readFileSync('temp_index.ts', 'utf8');

// 2. Convert TS exports to CommonJS
content = content.replace(/import type .*?\n/g, '');
content = content.replace(/: [A-Za-z\[\]]+ =/g, ' =');
content = content.replace(/as const/g, '');
content = content.replace(/export const /g, 'exports.');

// 3. Save to data.js
fs.writeFileSync(path.join('mock-backend', 'data.js'), content);

// 4. Append a new chapter (Thêm nội dung)
const dataScriptPath = path.join('mock-backend', 'data.js');
let dataJs = fs.readFileSync(dataScriptPath, 'utf8');
dataJs = dataJs.replace(/\]\s*exports\.userStats/g, `,
  {
    id: 6,
    year: '1986',
    title: 'ĐỔI MỚI',
    subtitle: 'Mở cửa và Hội nhập',
    description: 'Đại hội Đảng lần thứ VI năm 1986 mở ra bước ngoặt Đổi Mới, đưa Việt Nam vươn mình phát triển kinh tế và hội nhập quốc tế.',
    progress: 0,
    status: 'locked',
    unsplashId: '1583417319070-4a69db38a482',
    lessons: [],
    quiz: [],
  }
]\nexports.userStats`);
fs.writeFileSync(dataScriptPath, dataJs);

// 5. Update server.js to use data.js
const serverJs = `const express = require('express');
const cors = require('cors');
const data = require('./data');
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
  setTimeout(() => {
    res.json(data.chapters);
  }, 800);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(\`Mock backend on http://0.0.0.0:\${PORT}\`));
`;
fs.writeFileSync(path.join('mock-backend', 'server.js'), serverJs);

// 6. Update Card.tsx to match new data format
const cardCode = `import React from 'react';
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
`;
fs.writeFileSync(path.join('components', 'Card.tsx'), cardCode);

// 7. Update Home Screen to use new Card
const homeCode = `import React, { useEffect, useState } from 'react';
import { FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { Box } from '../../components/Box';
import { Text } from '../../components/Text';
import { Card } from '../../components/Card';
import { useTranslation } from 'react-i18next';
import { api } from '../../lib/api';

type Chapter = { id: number; year: string; title: string; subtitle: string; description: string; };

export default function HomeScreen() {
  const { t } = useTranslation();
  const [items, setItems] = useState<Chapter[]>([]);
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
          <Text marginTop="md" color="textDim">Đang tải dữ liệu lịch sử...</Text>
        </Box>
      ) : error ? (
        <Box flex={1} justifyContent="center" alignItems="center">
          <Text color="textDim">{error}</Text>
        </Box>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Card 
              year={item.year} 
              title={item.title} 
              subtitle={item.subtitle} 
              description={item.description} 
            />
          )}
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
