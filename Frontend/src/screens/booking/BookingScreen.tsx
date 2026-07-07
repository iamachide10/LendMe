import React, { useMemo, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../../navigation/types';
import { getItemById } from '../../api/itemsApi';
import { createBooking } from '../../api/bookingApi';
import { useBookingStore } from '../../store/bookingStore';
import { Item } from '../../types/item.types';
import { calcRentalPrice, formatDate } from '../../utils/dateHelpers';
import BookingCalendar from '../../components/booking/BookingCalendar';
import { useTheme, ThemeColors } from '../../theme';

type Props = NativeStackScreenProps<HomeStackParamList, 'BookingScreen'>;

const BookingScreen: React.FC<Props> = ({ route, navigation }) => {
  const { itemId } = route.params;
  const { selectedStartDate, selectedEndDate, setSelectedDates, clearDates } =
    useBookingStore();
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    clearDates();
    const fetchItem = async () => {
      try {
        const data = await getItemById(itemId);
        setItem(data);
      } catch {
        Alert.alert('Error', 'Failed to load item');
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [itemId]);

  const handleDayPress = (day: { dateString: string }) => {
    if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
      setSelectedDates(day.dateString, null);
    } else {
      if (day.dateString < selectedStartDate) {
        setSelectedDates(day.dateString, null);
      } else {
        setSelectedDates(selectedStartDate, day.dateString);
      }
    }
  };

  const totalPrice =
    item && selectedStartDate && selectedEndDate
      ? calcRentalPrice(item.dailyPrice, selectedStartDate, selectedEndDate)
      : null;

  const handleBooking = async () => {
    if (!selectedStartDate || !selectedEndDate) {
      Alert.alert('Select Dates', 'Please select both start and end dates');
      return;
    }
    setBooking(true);
    try {
      const res = await createBooking({
        itemId,
        startDate: selectedStartDate,
        endDate: selectedEndDate,
      });
      navigation.replace('BookingConfirm', { bookingId: res.id });
    } catch (err: any) {
      Alert.alert(
        'Booking Failed',
        err?.response?.data?.message || 'Could not create booking'
      );
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Select Dates</Text>
          <View style={{ width: 50 }} />
        </View>

        {/* Item Summary */}
        {item && (
          <View style={styles.itemSummary}>
            <Text style={styles.itemTitle}>{item.title}</Text>
            <Text style={styles.itemPrice}>
              GH₵ {item.dailyPrice.toFixed(2)} / day
            </Text>
          </View>
        )}

        {/* Calendar */}
        <BookingCalendar
          startDate={selectedStartDate}
          endDate={selectedEndDate}
          onDayPress={handleDayPress}
        />

        {/* Date Summary */}
        <View style={styles.dateSummary}>
          <View style={styles.dateBox}>
            <Text style={styles.dateLabel}>Check In</Text>
            <Text style={styles.dateValue}>
              {selectedStartDate ? formatDate(selectedStartDate) : '—'}
            </Text>
          </View>
          <View style={styles.dateDivider} />
          <View style={styles.dateBox}>
            <Text style={styles.dateLabel}>Check Out</Text>
            <Text style={styles.dateValue}>
              {selectedEndDate ? formatDate(selectedEndDate) : '—'}
            </Text>
          </View>
        </View>

        {/* Price Summary */}
        {totalPrice && (
          <View style={styles.priceSummary}>
            <Text style={styles.priceSummaryLabel}>Total Price</Text>
            <Text style={styles.priceSummaryValue}>
              GH₵ {totalPrice.toFixed(2)}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Book Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.bookButton,
            (!selectedStartDate || !selectedEndDate) && styles.bookButtonDisabled,
          ]}
          onPress={handleBooking}
          disabled={booking || !selectedStartDate || !selectedEndDate}
        >
          {booking ? (
            <ActivityIndicator color={colors.primaryContrast} />
          ) : (
            <Text style={styles.bookButtonText}>
              {totalPrice ? `Book for GH₵ ${totalPrice.toFixed(2)}` : 'Book Now'}
            </Text>
          )}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backText: {
    color: colors.primary,
    fontSize: 14,
  },
  headerTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemSummary: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    backgroundColor: colors.card,
    borderRadius: 12,
  },
  itemTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  itemPrice: {
    color: colors.primary,
    fontSize: 14,
  },
  dateSummary: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
  },
  dateBox: {
    flex: 1,
    alignItems: 'center',
  },
  dateDivider: {
    width: 1,
    backgroundColor: colors.border,
    marginHorizontal: 8,
  },
  dateLabel: {
    color: colors.textMuted,
    fontSize: 12,
    marginBottom: 6,
  },
  dateValue: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  priceSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 12,
    padding: 16,
    backgroundColor: colors.card,
    borderRadius: 12,
  },
  priceSummaryLabel: {
    color: colors.textMuted,
    fontSize: 14,
  },
  priceSummaryValue: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    padding: 16,
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  bookButton: {
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
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BookingScreen;
