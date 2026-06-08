import React, { useEffect, useState, useCallback } from 'react';
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
import { getMyBookings, cancelBooking } from '../../api/bookingApi';
import { Booking, BookingStatus } from '../../types/booking.types';
import { formatDate } from '../../utils/dateHelpers';

const STATUS_COLORS: Record<BookingStatus, string> = {
  PENDING: '#f0a500',
  APPROVED: '#4ecca3',
  REJECTED: '#e94560',
  PAID: '#4ecca3',
  ACTIVE: '#4ecca3',
  COMPLETED: '#a0a0b0',
  CANCELLED: '#e94560',
};

const MyBookingsScreen: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchBookings = useCallback(async () => {
    try {
      const data = await getMyBookings();
      setBookings(data);
    } catch {
      console.error('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchBookings();
    setRefreshing(false);
  };

  const handleCancel = (bookingId: string) => {
    Alert.alert(
      'Cancel Booking',
      'Are you sure you want to cancel this booking?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            try {
              await cancelBooking(bookingId);
              setBookings(prev =>
                prev.map(b =>
                  b.id === bookingId ? { ...b, status: 'CANCELLED' } : b
                )
              );
            } catch {
              Alert.alert('Error', 'Failed to cancel booking');
            }
          },
        },
      ]
    );
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const renderItem = ({ item }: { item: Booking }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.itemTitle} numberOfLines={1}>
          {item.itemTitle}
        </Text>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: STATUS_COLORS[item.status] + '22' },
          ]}
        >
          <Text
            style={[styles.statusText, { color: STATUS_COLORS[item.status] }]}
          >
            {item.status}
          </Text>
        </View>
      </View>

      <View style={styles.dateRow}>
        <View style={styles.dateBox}>
          <Text style={styles.dateLabel}>Check In</Text>
          <Text style={styles.dateValue}>{formatDate(item.startDate)}</Text>
        </View>
        <Text style={styles.dateArrow}>→</Text>
        <View style={styles.dateBox}>
          <Text style={styles.dateLabel}>Check Out</Text>
          <Text style={styles.dateValue}>{formatDate(item.endDate)}</Text>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <Text style={styles.totalPrice}>
          GH₵ {item.totalPrice.toFixed(2)}
        </Text>
        {(item.status === 'PENDING' || item.status === 'APPROVED') && (
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => handleCancel(item.id)}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Bookings</Text>
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#e94560" />
        </View>
      ) : bookings.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.emptyText}>You have no bookings yet</Text>
        </View>
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
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
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  list: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#16213e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemTitle: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#0f3460',
    borderRadius: 8,
    padding: 12,
  },
  dateBox: {
    flex: 1,
  },
  dateArrow: {
    color: '#a0a0b0',
    fontSize: 16,
    marginHorizontal: 8,
  },
  dateLabel: {
    color: '#a0a0b0',
    fontSize: 11,
    marginBottom: 4,
  },
  dateValue: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalPrice: {
    color: '#e94560',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: '#e94560',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  cancelButtonText: {
    color: '#e94560',
    fontSize: 13,
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
  },
});

export default MyBookingsScreen;