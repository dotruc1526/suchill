import React, { useEffect, useState } from 'react';
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
