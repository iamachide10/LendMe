import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BookingsStackParamList } from '../../navigation/types';
import { submitReview } from '../../api/reviewApi';
import { useTheme, ThemeColors } from '../../theme';

type Props = NativeStackScreenProps<BookingsStackParamList, 'LeaveReview'>;

const LeaveReviewScreen: React.FC<Props> = ({ route, navigation }) => {
  const { bookingId, revieweeId, itemId } = route.params;
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const [rating, setRating] = useState<1 | 2 | 3 | 4 | 5 | null>(null);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!rating) {
      Alert.alert('Rating Required', 'Please select a star rating');
      return;
    }
    setLoading(true);
    try {
      await submitReview({
        bookingId,
        revieweeId,
        itemId,
        rating,
        comment: comment.trim() || undefined,
      });
      Alert.alert('Review Submitted', 'Thank you for your feedback!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err: any) {
      Alert.alert(
        'Failed',
        err?.response?.data?.message || 'Could not submit review'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Leave a Review</Text>
          <View style={{ width: 50 }} />
        </View>

        {/* Icon */}
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>⭐</Text>
        </View>

        <Text style={styles.title}>How was your experience?</Text>
        <Text style={styles.subtitle}>
          Your honest feedback helps the KNUST community
        </Text>

        {/* Star Rating */}
        <View style={styles.starsContainer}>
          {([1, 2, 3, 4, 5] as const).map(star => (
            <TouchableOpacity
              key={star}
              onPress={() => setRating(star)}
              style={styles.starButton}
            >
              <Text
                style={[
                  styles.star,
                  rating !== null && star <= rating
                    ? styles.starActive
                    : styles.starInactive,
                ]}
              >
                ★
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {rating && (
          <Text style={styles.ratingLabel}>
            {rating === 1 && 'Poor'}
            {rating === 2 && 'Fair'}
            {rating === 3 && 'Good'}
            {rating === 4 && 'Very Good'}
            {rating === 5 && 'Excellent'}
          </Text>
        )}

        {/* Comment */}
        <Text style={styles.label}>Comment (optional)</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Share your experience..."
          placeholderTextColor={colors.placeholder}
          multiline
          numberOfLines={5}
          value={comment}
          onChangeText={setComment}
        />

        {/* Submit */}
        <TouchableOpacity
          style={[styles.submitButton, loading ? styles.submitDisabled : null]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.primaryContrast} />
          ) : (
            <Text style={styles.submitButtonText}>Submit Review</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const makeStyles = (colors: ThemeColors) =>
  StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
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
  iconContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  icon: {
    fontSize: 60,
  },
  title: {
    color: colors.text,
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 20,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 12,
    gap: 8,
  },
  starButton: {
    padding: 4,
  },
  star: {
    fontSize: 44,
  },
  starActive: {
    color: colors.warning,
  },
  starInactive: {
    color: colors.border,
  },
  ratingLabel: {
    color: colors.warning,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
  },
  label: {
    color: colors.textMuted,
    fontSize: 13,
    marginBottom: 8,
  },
  textArea: {
    backgroundColor: colors.card,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    height: 120,
    textAlignVertical: 'top',
    marginBottom: 24,
  },
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  submitDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: colors.primaryContrast,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LeaveReviewScreen;
