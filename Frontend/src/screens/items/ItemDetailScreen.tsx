import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../../navigation/types';
import { getItemById } from '../../api/itemsApi';
import { useItemStore } from '../../store/itemStore';
import { useAuthStore } from '../../store/authStore';
import { startConversation } from '../../api/messageApi';
import { Item } from '../../types/item.types';
import ItemImageCarousel from '../../components/items/ItemImageCarousel';

type Props = NativeStackScreenProps<HomeStackParamList, 'ItemDetail'>;

const ItemDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { itemId } = route.params;
  const setSelectedItem = useItemStore(state => state.setSelectedItem);
  const user = useAuthStore(state => state.user);

  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);

  

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const data = await getItemById(itemId);
        setItem(data);
        setSelectedItem(data);
      } catch {
        Alert.alert('Error', 'Failed to load item details');
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [itemId]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#e94560" />
      </View>
    );
  }

  if (!item) return null;

  const isOwner = user?.id === item.ownerId;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>

        {/* Image Carousel */}
        <ItemImageCarousel images={item.images} />

        {/* Item Info */}
        <View style={styles.content}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{item.title}</Text>
            <View style={[styles.badge, !item.isAvailable && styles.badgeUnavailable]}>
              <Text style={styles.badgeText}>
                {item.isAvailable ? 'Available' : 'Unavailable'}
              </Text>
            </View>
          </View>

          <Text style={styles.category}>
            {item.category.charAt(0) + item.category.slice(1).toLowerCase()}
          </Text>

          <Text style={styles.price}>
            GH₵ {item.dailyPrice.toFixed(2)}
            <Text style={styles.perDay}> / day</Text>
          </Text>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{item.description}</Text>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Listed by</Text>
          <Text style={styles.ownerName}>{item.ownerName}</Text>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.footer}>
        {isOwner ? (
          <View style={styles.ownerActions}>
            <TouchableOpacity style={styles.editButton}>
              <Text style={styles.editButtonText}>Edit Listing</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.renterActions}>
            <TouchableOpacity
        style={styles.messageButton}
        onPress={async () => {
          try {
            const conversation = await startConversation(item.ownerId);

            navigation.navigate('ChatScreen', {
              conversationId: conversation.id,
              receiverId: conversation.otherUserId,
              otherUserName: conversation.otherUserName,
            });
          } catch (error) {
            console.error('Failed to start conversation', error);
          }
        }}
      >
                  <Text style={styles.messageButtonText}>Message</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.bookButton,
                !item.isAvailable && styles.bookButtonDisabled,
              ]}
              disabled={!item.isAvailable}
              onPress={() =>
                navigation.navigate('BookingScreen', { itemId: item.id })
              }
            >
              <Text style={styles.bookButtonText}>Book Now</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
  },
  backButton: {
    position: 'absolute',
    top: 12,
    left: 16,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 13,
  },
  content: {
    padding: 20,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginRight: 12,
  },
  badge: {
    backgroundColor: '#0f3460',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeUnavailable: {
    backgroundColor: '#333',
  },
  badgeText: {
    color: '#4ecca3',
    fontSize: 11,
    fontWeight: 'bold',
  },
  category: {
    color: '#a0a0b0',
    fontSize: 13,
    marginBottom: 10,
  },
  price: {
    color: '#e94560',
    fontSize: 22,
    fontWeight: 'bold',
  },
  perDay: {
    color: '#a0a0b0',
    fontSize: 14,
    fontWeight: 'normal',
  },
  divider: {
    height: 1,
    backgroundColor: '#0f3460',
    marginVertical: 16,
  },
  sectionTitle: {
    color: '#a0a0b0',
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  description: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 22,
  },
  ownerName: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  footer: {
    padding: 16,
    backgroundColor: '#16213e',
    borderTopWidth: 1,
    borderTopColor: '#0f3460',
  },
  ownerActions: {
    flexDirection: 'row',
  },
  renterActions: {
    flexDirection: 'row',
    gap: 12,
  },
  messageButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e94560',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  messageButtonText: {
    color: '#e94560',
    fontSize: 15,
    fontWeight: 'bold',
  },
  bookButton: {
    flex: 2,
    backgroundColor: '#e94560',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  bookButtonDisabled: {
    opacity: 0.4,
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  editButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e94560',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#e94560',
    fontSize: 15,
    fontWeight: 'bold',
  },
});

export default ItemDetailScreen;