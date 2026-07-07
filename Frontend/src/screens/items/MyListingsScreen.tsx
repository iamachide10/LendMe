import React, { useEffect, useMemo, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { getItems, deleteItem } from '../../api/itemsApi';
import { useAuthStore } from '../../store/authStore';
import { Item } from '../../types/item.types';
import ItemCard from '../../components/items/ItemCard';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { MainTabParamList, HomeStackParamList } from '../../navigation/types';
import { useTheme, ThemeColors } from '../../theme';



type NavProp = CompositeNavigationProp<BottomTabNavigationProp<MainTabParamList, 'MyListings'>,NativeStackNavigationProp<HomeStackParamList>>;


const MyListingsScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const user = useAuthStore(state => state.user);
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const [listings, setListings] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchListings = useCallback(async () => {
    try {
      const data = await getItems();
      const mine = data.filter(item => item.ownerId === user?.id);
      setListings(mine);
    } catch {
      console.error('Failed to fetch listings');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchListings();
    setRefreshing(false);
  };

  const handleDelete = (itemId: string) => {
    Alert.alert(
      'Delete Listing',
      'Are you sure you want to delete this listing?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteItem(itemId);
              setListings(prev => prev.filter(item => item.id !== itemId));
            } catch {
              Alert.alert('Error', 'Failed to delete listing');
            }
          },
        },
      ]
    );
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const renderItem = ({ item }: { item: Item }) => (
    <View style={styles.cardWrapper}>
      <ItemCard
        item={item}
      onPress={() => navigation.navigate('Home', { screen: 'ItemDetail', params: { itemId: item.id } })}
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
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Listings</Text>
        <TouchableOpacity
          style={styles.addButton}

        onPress={() => navigation.navigate('Home', { screen: 'CreateListing' })}
        >
          <Text style={styles.addButtonText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : listings.length === 0 ? (
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
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={colors.primary}
            />
          }
        />
      )}
    </SafeAreaView>
  );
};

const makeStyles = (colors: ThemeColors) =>
  StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: colors.primaryContrast,
    fontSize: 13,
    fontWeight: 'bold',
  },
  grid: {
    paddingHorizontal: 16,
    paddingBottom: 120,
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
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.error,
    borderRadius: 8,
    paddingVertical: 6,
    alignItems: 'center',
    marginTop: 4,
  },
  deleteButtonText: {
    color: colors.error,
    fontSize: 12,
    fontWeight: 'bold',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: 15,
    marginBottom: 20,
  },
  createButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  createButtonText: {
    color: colors.primaryContrast,
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default MyListingsScreen;
