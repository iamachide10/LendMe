import React, { useState, useCallback } from 'react';
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
import { useFocusEffect } from '@react-navigation/native';
import {
  getMyBookings,
  getLenderBookings,
  cancelBooking,
  updateBookingStatus,
} from '../../api/bookingApi';
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
  const [activeTab, setActiveTab] = useState<'mine' | 'lender'>('mine');
  const [myBookings, setMyBookings] = useState<Booking[]>([]);
  const [lenderBookings, setLenderBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAll = useCallback(async () => {
    try {
      const [mine, lender] = await Promise.all([
        getMyBookings(),
        getLenderBookings(),
      ]);
      setMyBookings(mine);
      setLenderBookings(lender);
    } catch {
      console.error('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchAll();
    }, [])
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAll();
    setRefreshing(false);
  };

  const handleCancel = (bookingId: string) => {
    Alert.alert('Cancel Booking', 'Are you sure?', [
      { text: 'No', style: 'cancel' },
      {
        text: 'Yes, Cancel',
        style: 'destructive',
        onPress: async () => {
          try {
            await cancelBooking(bookingId);
            setMyBookings(prev =>
              prev.map(b =>
                b.id === bookingId ? { ...b, status: 'CANCELLED' } : b
              )
            );
          } catch {
            Alert.alert('Error', 'Failed to cancel booking');
          }
        },
      },
    ]);
  };

  const handleUpdateStatus = (bookingId: string, status: BookingStatus) => {
    const label = status === 'APPROVED' ? 'Approve' : 'Reject';
    Alert.alert(`${label} Booking`, `Are you sure you want to ${label.toLowerCase()} this booking?`, [
      { text: 'No', style: 'cancel' },
      {
        text: label,
        style: status === 'REJECTED' ? 'destructive' : 'default',
        onPress: async () => {
          try {
            await updateBookingStatus(bookingId, { status });
            setLenderBookings(prev =>
              prev.map(b => b.id === bookingId ? { ...b, status } : b)
            );
          } catch {
            Alert.alert('Error', `Failed to ${label.toLowerCase()} booking`);
          }
        },
      },
    ]);
  };

  const renderBorrowerItem = ({ item }: { item: Booking }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.itemTitle} numberOfLines={1}>
          {item.itemTitle}
        </Text>
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

  const renderLenderItem = ({ item }: { item: Booking }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.itemTitle} numberOfLines={1}>
          {item.itemTitle}
        </Text>
        <View style={[styles.statusBadge, { backgroundColor: STATUS_COLORS[item.status] + '22' }]}>
          <Text style={[styles.statusText, { color: STATUS_COLORS[item.status] }]}>
            {item.status}
          </Text>
        </View>
      </View>

      <Text style={styles.borrowerName}>
        Requested by: <Text style={styles.borrowerNameBold}>{item.borrowerName}</Text>
      </Text>

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
        {item.status === 'PENDING' && (
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.rejectButton}
              onPress={() => handleUpdateStatus(item.id, 'REJECTED')}
            >
              <Text style={styles.rejectButtonText}>Reject</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.approveButton}
              onPress={() => handleUpdateStatus(item.id, 'APPROVED')}
            >
              <Text style={styles.approveButtonText}>Approve</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );

  const currentData = activeTab === 'mine' ? myBookings : lenderBookings;
  const currentRenderer = activeTab === 'mine' ? renderBorrowerItem : renderLenderItem;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bookings</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'mine' ? styles.tabActive : null]}
          onPress={() => setActiveTab('mine')}
        >
          <Text style={[styles.tabText, activeTab === 'mine' ? styles.tabTextActive : null]}>
            My Requests
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'lender' ? styles.tabActive : null]}
          onPress={() => setActiveTab('lender')}
        >
          <Text style={[styles.tabText, activeTab === 'lender' ? styles.tabTextActive : null]}>
            My Listings
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#e94560" />
        </View>
      ) : currentData.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.emptyText}>
            {activeTab === 'mine'
              ? 'You have no booking requests yet'
              : 'No bookings on your listings yet'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={currentData}
          keyExtractor={item => item.id}
          renderItem={currentRenderer}
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
  tabs: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: '#16213e',
    borderRadius: 10,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabActive: {
    backgroundColor: '#e94560',
  },
  tabText: {
    color: '#a0a0b0',
    fontSize: 13,
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#fff',
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
    marginBottom: 8,
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
  borrowerName: {
    color: '#a0a0b0',
    fontSize: 13,
    marginBottom: 10,
  },
  borrowerNameBold: {
    color: '#fff',
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
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  rejectButton: {
    borderWidth: 1,
    borderColor: '#e94560',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  rejectButtonText: {
    color: '#e94560',
    fontSize: 13,
    fontWeight: 'bold',
  },
  approveButton: {
    backgroundColor: '#4ecca3',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  approveButtonText: {
    color: '#1a1a2e',
    fontSize: 13,
    fontWeight: 'bold',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    color: '#a0a0b0',
    fontSize: 15,
    textAlign: 'center',
  },
});

export default MyBookingsScreen;