import React, { useState } from 'react';
import {
  View, Text, FlatList, StyleSheet,
  TouchableOpacity, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BookingsStackParamList } from '../../navigation/types';
import { Booking, BookingStatus } from '../../types/booking.types';
import { formatDate } from '../../utils/dateHelpers';

type Props = NativeStackScreenProps<BookingsStackParamList, 'MyBookingsScreen'>;

const STATUS_COLORS: Record<BookingStatus, string> = {
  PENDING: '#f0a500',
  APPROVED: '#4ecca3',
  REJECTED: '#e94560',
  PAID: '#4ecca3',
  ACTIVE: '#4ecca3',
  COMPLETED: '#a0a0b0',
  CANCELLED: '#e94560',
};

const FAKE_BOOKINGS: Booking[] = [
  {
    id: 'booking-1',
    itemId: 'item-1',
    itemTitle: 'Canon EOS 1500D DSLR Camera',
    borrowerId: '1',
    borrowerName: 'Test User',
    startDate: '2026-06-15',
    endDate: '2026-06-18',
    totalPrice: 320,
    status: 'APPROVED',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'booking-2',
    itemId: 'item-2',
    itemTitle: 'HP Laptop 15"',
    borrowerId: '1',
    borrowerName: 'Test User',
    startDate: '2026-06-20',
    endDate: '2026-06-22',
    totalPrice: 240,
    status: 'PENDING',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'booking-3',
    itemId: 'item-3',
    itemTitle: 'Engineering Textbook Set',
    borrowerId: '1',
    borrowerName: 'Test User',
    startDate: '2026-05-10',
    endDate: '2026-05-15',
    totalPrice: 100,
    status: 'COMPLETED',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'booking-4',
    itemId: 'item-6',
    itemTitle: 'Power Drill & Tool Set',
    borrowerId: '1',
    borrowerName: 'Test User',
    startDate: '2026-06-01',
    endDate: '2026-06-03',
    totalPrice: 90,
    status: 'CANCELLED',
    createdAt: new Date().toISOString(),
  },
];

const MyBookingsScreen: React.FC<Props> = ({ navigation }) => {
  const [bookings, setBookings] = useState<Booking[]>(FAKE_BOOKINGS);

  const handleCancel = (bookingId: string) => {
    Alert.alert('Cancel Booking', 'Are you sure you want to cancel this booking?', [
      { text: 'No', style: 'cancel' },
      {
        text: 'Yes, Cancel',
        style: 'destructive',
        onPress: () =>
          setBookings(prev =>
            prev.map(b => b.id === bookingId ? { ...b, status: 'CANCELLED' } : b)
          ),
      },
    ]);
  };

  const renderItem = ({ item }: { item: Booking }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.itemTitle} numberOfLines={1}>{item.itemTitle}</Text>
        <View style={[styles.statusBadge, { backgroundColor: STATUS_COLORS[item.status] + '22' }]}>
          <Text style={[styles.statusText, { color: STATUS_COLORS[item.status] }]}>
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
        <Text style={styles.totalPrice}>GH₵ {item.totalPrice.toFixed(2)}</Text>
        <View style={styles.actions}>
          {item.status === 'APPROVED' && (
            <TouchableOpacity
              style={styles.payButton}
              onPress={() =>
                navigation.navigate('PaymentSimulation', {
                  bookingId: item.id,
                  amount: item.totalPrice,
                })
              }
            >
              <Text style={styles.payButtonText}>Pay Now</Text>
            </TouchableOpacity>
          )}
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
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Bookings</Text>
      </View>
      <FlatList
        data={bookings}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e' },
  header: { paddingHorizontal: 16, paddingVertical: 12 },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  list: { padding: 16, paddingBottom: 40 },
  card: { backgroundColor: '#16213e', borderRadius: 12, padding: 16, marginBottom: 12 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  itemTitle: { color: '#fff', fontSize: 15, fontWeight: 'bold', flex: 1, marginRight: 8 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusText: { fontSize: 11, fontWeight: 'bold' },
  dateRow: {
    flexDirection: 'row', alignItems: 'center', marginBottom: 12,
    backgroundColor: '#0f3460', borderRadius: 8, padding: 12,
  },
  dateBox: { flex: 1 },
  dateArrow: { color: '#a0a0b0', fontSize: 16, marginHorizontal: 8 },
  dateLabel: { color: '#a0a0b0', fontSize: 11, marginBottom: 4 },
  dateValue: { color: '#fff', fontSize: 13, fontWeight: '600' },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalPrice: { color: '#e94560', fontSize: 16, fontWeight: 'bold' },
  actions: { flexDirection: 'row', gap: 8 },
  payButton: {
    backgroundColor: '#e94560', borderRadius: 8,
    paddingHorizontal: 14, paddingVertical: 6,
  },
  payButtonText: { color: '#fff', fontSize: 13, fontWeight: 'bold' },
  cancelButton: {
    borderWidth: 1, borderColor: '#e94560',
    borderRadius: 8, paddingHorizontal: 14, paddingVertical: 6,
  },
  cancelButtonText: { color: '#e94560', fontSize: 13, fontWeight: 'bold' },
});

export default MyBookingsScreen;