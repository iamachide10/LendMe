import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../../navigation/types';
import { getItems, searchItems } from '../../api/itemsApi';
import { useItemStore } from '../../store/itemStore';
import { useAuthStore } from '../../store/authStore';
import { Item, ItemCategory } from '../../types/item.types';
import ItemCard from '../../components/items/ItemCard';
import CategoryPicker from '../../components/items/CategoryPicker';

type NavProp = NativeStackNavigationProp<HomeStackParamList, 'HomeScreen'>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const { items, setItems, filters, setFilters } = useItemStore();
  const user = useAuthStore(state => state.user);

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getItems();
      setItems(data);
    } catch (err) {
      console.error('Failed to fetch items', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSearch = async (text: string) => {
    setSearchText(text);
    if (text.trim().length === 0 && !filters.category) {
      fetchItems();
      return;
    }
    try {
      const data = await searchItems({ ...filters, search: text.trim() });
      setItems(data);
    } catch (err) {
      console.error('Search failed', err);
    }
  };

  const handleCategorySelect = async (category: ItemCategory | undefined) => {
    setFilters({ category });
    try {
      const data = await searchItems({ category, search: searchText.trim() });
      setItems(data);
    } catch (err) {
      console.error('Filter failed', err);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchItems();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const renderItem = ({ item }: { item: Item }) => (
    <ItemCard
      item={item}
      onPress={() => navigation.navigate('ItemDetail', { itemId: item.id })}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {user?.name?.split(' ')[0]} 👋</Text>
          <Text style={styles.subheading}>What do you need today?</Text>
        </View>
        <TouchableOpacity
          style={styles.listButton}
          onPress={() => navigation.navigate('CreateListing')}
        >
          <Text style={styles.listButtonText}>+ List Item</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search items..."
          placeholderTextColor="#666"
          value={searchText}
          onChangeText={handleSearch}
        />
      </View>

      {/* Category Filter */}
      <CategoryPicker
        selected={filters.category}
        onSelect={handleCategorySelect}
      />

      {/* Items Grid */}
      {loading && !refreshing ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#e94560" />
        </View>
      ) : items.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.emptyText}>No items found</Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.grid}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor="#e94560"
            />
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  greeting: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  subheading: {
    fontSize: 13,
    color: '#a0a0b0',
    marginTop: 2,
  },
  listButton: {
    backgroundColor: '#e94560',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  listButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  searchContainer: {
    paddingHorizontal: 16,
    marginBottom: 4,
  },
  searchInput: {
    backgroundColor: '#16213e',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 14,
    color: '#fff',
    borderWidth: 1,
    borderColor: '#0f3460',
  },
  grid: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  row: {
    justifyContent: 'space-between',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#a0a0b0',
    fontSize: 15,
  },
});

export default HomeScreen;