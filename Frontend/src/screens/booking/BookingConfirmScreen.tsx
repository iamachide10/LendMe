import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../../navigation/types';
import { getMyBookings } from '../../api/bookingApi';
import { Booking } from '../../types/booking.types';
import { formatDate } from '../../utils/dateHelpers';
import { useTheme, ThemeColors } from '../../theme';

type Props = NativeStackScreenProps<HomeStackParamList, 'BookingConfirm'>;

const BookingConfirmScreen: React.FC<Props> = ({ route, navigation }) => {
  const { bookingId } = route.params;
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const bookings = await getMyBookings();
        const found = bookings.find(b => b.id === bookingId);
        if (found) setBooking(found);
      } catch {
        console.error('Failed to load booking');
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [bookingId]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Success Icon */}
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>✓</Text>
        </View>

        <Text style={styles.title}>Booking Requested!</Text>
        <Text style={styles.subtitle}>
          Your booking request has been sent to the owner. You will be
          notified once it is approved.
        </Text>

        {/* Booking Details */}
        {booking && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{booking.itemTitle}</Text>

            <View style={styles.row}>
              <Text style={styles.rowLabel}>Check In</Text>
              <Text style={styles.rowValue}>{formatDate(booking.startDate)}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.rowLabel}>Check Out</Text>
              <Text style={styles.rowValue}>{formatDate(booking.endDate)}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.row}>
              <Text style={styles.rowLabel}>Total Price</Text>
              <Text style={styles.totalPrice}>
                GH₵ {booking.totalPrice.toFixed(2)}
              </Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.rowLabel}>Status</Text>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>{booking.status}</Text>
              </View>
            </View>
          </View>
        )}
      </View>

      {/* Actions */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.bookingsButton}
          onPress={() => navigation.navigate('HomeScreen')}
        >
          <Text style={styles.bookingsButtonText}>Back to Home</Text>
        </TouchableOpacity>
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
  content: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.success,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 24,
  },
  icon: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
  },
  title: {
    color: colors.text,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  card: {
    width: '100%',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
  },
  cardTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  rowLabel: {
    color: colors.textMuted,
    fontSize: 13,
  },
  rowValue: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 12,
  },
  totalPrice: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  statusBadge: {
    backgroundColor: colors.successMuted,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: colors.success,
    fontSize: 11,
    fontWeight: 'bold',
  },
  footer: {
    padding: 16,
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  bookingsButton: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  bookingsButtonText: {
    color: colors.primaryContrast,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BookingConfirmScreen;
