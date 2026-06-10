import React, { useState } from 'react';
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
import { HomeStackParamList } from '../../navigation/types';
import { submitReview } from '../../api/reviewApi';

type Props = NativeStackScreenProps<HomeStackParamList, 'LeaveReview'>;

const LeaveReviewScreen: React.FC<Props> = ({ route, navigation }) => {
  const { bookingId, revieweeId, itemId } = route.params;

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
        { text: 'OK', onPress: () => navigation.navigate('HomeScreen') },
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
          placeholderTextColor="#666"
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
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Submit Review</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
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
    color: '#e94560',
    fontSize: 14,
  },
  headerTitle: {
    color: '#fff',
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
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    color: '#a0a0b0',
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
    color: '#f0a500',
  },
  starInactive: {
    color: '#0f3460',
  },
  ratingLabel: {
    color: '#f0a500',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
  },
  label: {
    color: '#a0a0b0',
    fontSize: 13,
    marginBottom: 8,
  },
  textArea: {
    backgroundColor: '#16213e',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#fff',
    borderWidth: 1,
    borderColor: '#0f3460',
    height: 120,
    textAlignVertical: 'top',
    marginBottom: 24,
  },
  submitButton: {
    backgroundColor: '#e94560',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  submitDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LeaveReviewScreen;