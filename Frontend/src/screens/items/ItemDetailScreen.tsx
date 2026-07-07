import React, { useEffect, useMemo, useState } from 'react';
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
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../../navigation/types';
import { getItemById } from '../../api/itemsApi';
import { useItemStore } from '../../store/itemStore';
import { useAuthStore } from '../../store/authStore';
import { startConversation } from '../../api/messageApi';
import { getItemReviews } from '../../api/reviewApi';
import { Review } from '../../types/review.types';
import { Item } from '../../types/item.types';
import { formatDate } from '../../utils/dateHelpers';
import ItemImageCarousel from '../../components/items/ItemImageCarousel';
import { useTheme, ThemeColors } from '../../theme';

type Props = NativeStackScreenProps<HomeStackParamList, 'ItemDetail'>;

const ItemDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { itemId } = route.params;
  const setSelectedItem = useItemStore(state => state.setSelectedItem);
  const user = useAuthStore(state => state.user);
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const [item, setItem] = useState<Item | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
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
    const fetchReviews = async () => {
      try {
        const data = await getItemReviews(itemId);
        setReviews(data);
      } catch {
        console.error('Failed to load reviews');
      }
    };
    fetchItem();
    fetchReviews();
  }, [itemId]);

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
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

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Reviews</Text>
          {reviews.length === 0 ? (
            <Text style={styles.noReviews}>No reviews yet</Text>
          ) : (
            <>
              <View style={styles.ratingSummary}>
                <Ionicons name="star" size={18} color={colors.warning} />
                <Text style={styles.ratingAverage}>
                  {averageRating.toFixed(1)}
                </Text>
                <Text style={styles.ratingCount}>
                  ({reviews.length} review{reviews.length > 1 ? 's' : ''})
                </Text>
              </View>
              {reviews.map(review => (
                <View key={review.id} style={styles.reviewCard}>
                  <View style={styles.reviewHeader}>
                    <Text style={styles.reviewerName}>
                      {review.reviewerName}
                    </Text>
                    <View style={styles.reviewStars}>
                      {[1, 2, 3, 4, 5].map(star => (
                        <Ionicons
                          key={star}
                          name={star <= review.rating ? 'star' : 'star-outline'}
                          size={13}
                          color={colors.warning}
                        />
                      ))}
                    </View>
                  </View>
                  {review.comment ? (
                    <Text style={styles.reviewComment}>{review.comment}</Text>
                  ) : null}
                  <Text style={styles.reviewDate}>
                    {formatDate(review.createdAt)}
                  </Text>
                </View>
              ))}
            </>
          )}
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.footer}>
       {isOwner ? (
        <View style={styles.ownerActions}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => navigation.navigate('CreateListing', { itemId: item.id })}
          >
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
              otherUserName: item.ownerName,
              receiverId: item.ownerId,
              itemContext: {
                itemId: item.id,
                title: item.title,
                price: item.dailyPrice,
              },
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

const makeStyles = (colors: ThemeColors) =>
  StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  backButton: {
    position: 'absolute',
    top: 12,
    left: 16,
    zIndex: 10,
    backgroundColor: colors.overlay,
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
    color: colors.text,
    marginRight: 12,
  },
  badge: {
    backgroundColor: colors.successMuted,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeUnavailable: {
    backgroundColor: colors.border,
  },
  badgeText: {
    color: colors.success,
    fontSize: 11,
    fontWeight: 'bold',
  },
  category: {
    color: colors.textMuted,
    fontSize: 13,
    marginBottom: 10,
  },
  price: {
    color: colors.primary,
    fontSize: 22,
    fontWeight: 'bold',
  },
  perDay: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: 'normal',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 16,
  },
  sectionTitle: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  description: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 22,
  },
  ownerName: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
  },
  noReviews: {
    color: colors.textMuted,
    fontSize: 14,
  },
  ratingSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  ratingAverage: {
    color: colors.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  ratingCount: {
    color: colors.textMuted,
    fontSize: 13,
  },
  reviewCard: {
    backgroundColor: colors.card,
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  reviewerName: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  reviewStars: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewComment: {
    color: colors.text,
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 6,
  },
  reviewDate: {
    color: colors.textMuted,
    fontSize: 11,
  },
  footer: {
    padding: 16,
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
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
    borderColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  messageButtonText: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: 'bold',
  },
  bookButton: {
    flex: 2,
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  bookButtonDisabled: {
    opacity: 0.4,
  },
  bookButtonText: {
    color: colors.primaryContrast,
    fontSize: 15,
    fontWeight: 'bold',
  },
  editButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  editButtonText: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: 'bold',
  },
});

export default ItemDetailScreen;
