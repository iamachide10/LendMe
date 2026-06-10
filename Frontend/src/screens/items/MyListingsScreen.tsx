import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../../navigation/types';
import { Item } from '../../types/item.types';
import ItemCard from '../../components/items/ItemCard';

type NavProp = NativeStackNavigationProp<HomeStackParamList, 'HomeScreen'>;

const FAKE_LISTINGS: Item[] = [
  {
    id: 'my-item-1',
    ownerId: '1',
    ownerName: 'Test User',
    title: 'Nikon D3500 Camera',
    description: 'Great camera for photography students. Includes kit lens and bag.',
    category: 'PHOTOGRAPHY',
    dailyPrice: 75,
    isAvailable: true,
    images: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'my-item-2',
    ownerId: '1',
    ownerName: 'Test User',
    title: 'Scientific Calculator',
    description: 'Casio FX-991ES Plus. Perfect for engineering and math courses.',
    category: 'ELECTRONICS',
    dailyPrice: 10,
    isAvailable: true,
    images: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'my-item-3',
    ownerId: '1',
    ownerName: 'Test User',
    title: 'Mountain Bike',
    description: 'Trek mountain bike, great condition. Helmet included.',
    category: 'SPORTS',
    dailyPrice: 40,
    isAvailable: false,
    images: [],
    createdAt: new Date().toISOString(),
  },
];

const MyListingsScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const [listings, setListings] = useState<Item[]>(FAKE_LISTINGS);

  const handleDelete = (itemId: string) => {
    Alert.alert(
      'Delete Listing',
      'Are you sure you want to delete this listing?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setListings(prev => prev.filter(item => item.id !== itemId));
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: Item }) => (
    <View style={styles.cardWrapper}>
      <ItemCard
        item={item}
        onPress={() => navigation.navigate('ItemDetail', { itemId: item.id })}
      />
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDelete(item.id)}
      >
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Listings</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('CreateListing')}
        >
          <Text style={styles.addButtonText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      {listings.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.emptyText}>You have no listings yet</Text>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => navigation.navigate('CreateListing')}
          >
            <Text style={styles.createButtonText}>Create Your First Listing</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={listings}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.grid}
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
    paddingVertical: 12,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#e94560',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  grid: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  row: {
    justifyContent: 'space-between',
  },
  cardWrapper: {
    flex: 1,
    maxWidth: '48%',
    marginBottom: 16,
  },
  deleteButton: {
    backgroundColor: '#16213e',
    borderWidth: 1,
    borderColor: '#e94560',
    borderRadius: 8,
    paddingVertical: 6,
    alignItems: 'center',
    marginTop: 4,
  },
  deleteButtonText: {
    color: '#e94560',
    fontSize: 12,
    fontWeight: 'bold',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#a0a0b0',
    fontSize: 15,
    marginBottom: 20,
  },
  createButton: {
    backgroundColor: '#e94560',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default MyListingsScreen;