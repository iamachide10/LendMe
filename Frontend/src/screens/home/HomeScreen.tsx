import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../../navigation/types';
import { useAuthStore } from '../../store/authStore';
import { Item, ItemCategory } from '../../types/item.types';
import ItemCard from '../../components/items/ItemCard';
import CategoryPicker from '../../components/items/CategoryPicker';

type NavProp = NativeStackNavigationProp<HomeStackParamList, 'HomeScreen'>;

const FAKE_ITEMS: Item[] = [
  {
    id: 'item-1',
    ownerId: '99',
    ownerName: 'Kwame Mensah',
    title: 'Canon EOS 1500D DSLR Camera',
    description: 'Perfect for photography assignments. Comes with 18-55mm lens, bag and charger. Good condition.',
    category: 'PHOTOGRAPHY',
    dailyPrice: 80,
    isAvailable: true,
    images: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'item-2',
    ownerId: '99',
    ownerName: 'Abena Asante',
    title: 'HP Laptop 15"',
    description: 'Intel Core i5, 8GB RAM, 256GB SSD. Great for projects and assignments.',
    category: 'ELECTRONICS',
    dailyPrice: 120,
    isAvailable: true,
    images: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'item-3',
    ownerId: '99',
    ownerName: 'Kofi Boateng',
    title: 'Engineering Textbook Set',
    description: 'Complete set of Year 2 Engineering textbooks. Very good condition.',
    category: 'BOOKS',
    dailyPrice: 20,
    isAvailable: true,
    images: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'item-4',
    ownerId: '99',
    ownerName: 'Ama Owusu',
    title: 'Camping Tent (4 Person)',
    description: 'Waterproof tent, perfect for outdoor trips. Easy to set up.',
    category: 'CAMPING',
    dailyPrice: 50,
    isAvailable: true,
    images: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'item-5',
    ownerId: '99',
    ownerName: 'Yaw Darko',
    title: 'Football Boots (Size 42)',
    description: 'Adidas football boots, size 42. Used twice only.',
    category: 'SPORTS',
    dailyPrice: 30,
    isAvailable: false,
    images: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'item-6',
    ownerId: '99',
    ownerName: 'Efua Mensah',
    title: 'Power Drill & Tool Set',
    description: 'Bosch power drill with full accessory set. Perfect for projects.',
    category: 'TOOLS',
    dailyPrice: 45,
    isAvailable: true,
    images: [],
    createdAt: new Date().toISOString(),
  },
];

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const user = useAuthStore(state => state.user);

  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ItemCategory | undefined>();

  const filteredItems = FAKE_ITEMS.filter(item => {
    const matchesSearch = item.title
      .toLowerCase()
      .includes(searchText.toLowerCase());
    const matchesCategory = selectedCategory
      ? item.category === selectedCategory
      : true;
    return matchesSearch && matchesCategory;
  });

  const renderItem = ({ item }: { item: Item }) => (
    <ItemCard
      item={item}
      onPress={() => navigation.navigate('ItemDetail', { itemId: item.id })}
    />
  );

return (
  <SafeAreaView style={styles.container}>
    <FlatList
      data={filteredItems}
      keyExtractor={item => item.id}
      renderItem={renderItem}
      numColumns={2}
      columnWrapperStyle={
        filteredItems.length > 0 ? styles.row : undefined
      }
      contentContainerStyle={styles.grid}
      ListHeaderComponent={
        <>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>
                Hello, {user?.name?.split(' ')[0]} 👋
              </Text>
              <Text style={styles.subheading}>
                What do you need today?
              </Text>
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
              onChangeText={setSearchText}
            />
          </View>

          {/* Category Filter */}
          <CategoryPicker
            selected={selectedCategory}
            onSelect={setSelectedCategory}
          />

        </>
      }
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No items found</Text>
        </View>
      }
    />
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
    flexGrow: 1, // Allows empty state to center properly
  },

  row: {
    justifyContent: 'space-between',
  },

  emptyContainer: {
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