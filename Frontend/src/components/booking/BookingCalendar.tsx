import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';

interface Props {
  startDate: string | null;
  endDate: string | null;
  onDayPress: (day: { dateString: string }) => void;
}

const BookingCalendar: React.FC<Props> = ({ startDate, endDate, onDayPress }) => {
  const getMarkedDates = () => {
    const marked: Record<string, any> = {};

    if (!startDate) return marked;

    if (startDate && !endDate) {
      marked[startDate] = {
        startingDay: true,
        endingDay: true,
        color: '#e94560',
        textColor: '#fff',
      };
      return marked;
    }

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const current = new Date(start);

      while (current <= end) {
        const dateStr = current.toISOString().split('T')[0];
        if (dateStr === startDate) {
          marked[dateStr] = {
            startingDay: true,
            color: '#e94560',
            textColor: '#fff',
          };
        } else if (dateStr === endDate) {
          marked[dateStr] = {
            endingDay: true,
            color: '#e94560',
            textColor: '#fff',
          };
        } else {
          marked[dateStr] = {
            color: '#0f3460',
            textColor: '#fff',
          };
        }
        current.setDate(current.getDate() + 1);
      }
    }

    return marked;
  };

  return (
    <View style={styles.container}>
      <Calendar
        onDayPress={onDayPress}
        markedDates={getMarkedDates()}
        markingType="period"
        minDate={new Date().toISOString().split('T')[0]}
        theme={{
          backgroundColor: '#16213e',
          calendarBackground: '#16213e',
          textSectionTitleColor: '#a0a0b0',
          selectedDayBackgroundColor: '#e94560',
          selectedDayTextColor: '#fff',
          todayTextColor: '#e94560',
          dayTextColor: '#fff',
          textDisabledColor: '#444',
          arrowColor: '#e94560',
          monthTextColor: '#fff',
          indicatorColor: '#e94560',
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
    marginHorizontal: 16,
  },
});

export default BookingCalendar;