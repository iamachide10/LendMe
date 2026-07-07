import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useTheme } from '../../theme';

interface Props {
  startDate: string | null;
  endDate: string | null;
  onDayPress: (day: { dateString: string }) => void;
}

const BookingCalendar: React.FC<Props> = ({ startDate, endDate, onDayPress }) => {
  const { colors, isDark } = useTheme();

  const getMarkedDates = () => {
    const marked: Record<string, any> = {};

    if (!startDate) return marked;

    if (startDate && !endDate) {
      marked[startDate] = {
        startingDay: true,
        endingDay: true,
        color: colors.primary,
        textColor: colors.primaryContrast,
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
            color: colors.primary,
            textColor: colors.primaryContrast,
          };
        } else if (dateStr === endDate) {
          marked[dateStr] = {
            endingDay: true,
            color: colors.primary,
            textColor: colors.primaryContrast,
          };
        } else {
          marked[dateStr] = {
            color: colors.primaryMuted,
            textColor: colors.text,
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
        key={isDark ? 'dark' : 'light'}
        onDayPress={onDayPress}
        markedDates={getMarkedDates()}
        markingType="period"
        minDate={new Date().toISOString().split('T')[0]}
        theme={{
          backgroundColor: colors.card,
          calendarBackground: colors.card,
          textSectionTitleColor: colors.textMuted,
          selectedDayBackgroundColor: colors.primary,
          selectedDayTextColor: colors.primaryContrast,
          todayTextColor: colors.primary,
          dayTextColor: colors.text,
          textDisabledColor: colors.border,
          arrowColor: colors.primary,
          monthTextColor: colors.text,
          indicatorColor: colors.primary,
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
