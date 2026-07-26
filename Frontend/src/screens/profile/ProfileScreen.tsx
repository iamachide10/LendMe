import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useAuthStore } from '../../store/authStore';
import { clearTokens } from '../../utils/tokenStorage';
import { logoutUser } from '../../api/authApi';
import { uploadProfilePhoto, updateMomoDetails } from '../../api/userApi';
import { getMyPayouts, retryPayout } from '../../api/payoutApi';
import { Payout, PayoutStatus } from '../../types/payout.types';
import { getMyItems } from '../../api/itemsApi';
import { getMyBookings } from '../../api/bookingApi';
import { getUserReviews } from '../../api/reviewApi';
import axiosInstance from '../../api/axiosInstance';
import { BASE_URL } from '../../utils/constants';
import { useTheme, ThemeColors, ThemeMode } from '../../theme';

const MOMO_PROVIDERS: { label: string; value: 'MTN' | 'VOD' | 'ATL' }[] = [
  { label: 'MTN', value: 'MTN' },
  { label: 'Telecel', value: 'VOD' },
  { label: 'AT', value: 'ATL' },
];

const getPayoutStatusColor = (colors: ThemeColors): Record<PayoutStatus, string> => ({
  HELD: colors.warning,
  RELEASED: colors.primary,
  PAID: colors.success,
  FAILED: colors.error,
  REFUNDED: colors.textMuted,
});

const THEME_OPTIONS: { label: string; value: ThemeMode }[] = [
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' },
  { label: 'System', value: 'system' },
];

const ProfileScreen: React.FC = () => {
  const { user, setAuth, logout } = useAuthStore();
  const accessToken = useAuthStore(state => state.accessToken);
  const refreshToken = useAuthStore(state => state.refreshToken);
  const { colors, mode, setMode } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [loading, setLoading] = useState(false);
  const [photoUploading, setPhotoUploading] = useState(false);

  const [momoNumber, setMomoNumber] = useState(user?.momoNumber || '');
  const [momoProvider, setMomoProvider] = useState<'MTN' | 'VOD' | 'ATL'>(
    (user?.momoProvider as 'MTN' | 'VOD' | 'ATL') || 'MTN'
  );
  const [momoSaving, setMomoSaving] = useState(false);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const payoutStatusColors = useMemo(() => getPayoutStatusColor(colors), [colors]);

  const [stats, setStats] = useState<{
    listings: number | null;
    bookings: number | null;
    rating: number | null;
  }>({ listings: null, bookings: null, rating: null });

  useEffect(() => {
    getMyPayouts()
      .then(setPayouts)
      .catch(() => {});

    getMyItems()
      .then(items => setStats(prev => ({ ...prev, listings: items.length })))
      .catch(() => {});

    getMyBookings()
      .then(bookings => setStats(prev => ({ ...prev, bookings: bookings.length })))
      .catch(() => {});

    if (user?.id) {
      getUserReviews(user.id)
        .then(reviews => {
          const avg = reviews.length
            ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
            : null;
          setStats(prev => ({ ...prev, rating: avg }));
        })
        .catch(() => {});
    }
  }, [user?.id]);

  const handleSaveMomo = async () => {
    if (!/^0\d{9}$/.test(momoNumber.trim())) {
      Alert.alert('Error', 'Enter a valid 10-digit MoMo number starting with 0');
      return;
    }
    setMomoSaving(true);
    try {
      const updated = await updateMomoDetails({
        momoNumber: momoNumber.trim(),
        momoProvider,
      });
      if (user && accessToken && refreshToken) {
        setAuth(
          {
            ...user,
            momoNumber: updated.momoNumber,
            momoProvider: updated.momoProvider,
          },
          accessToken,
          refreshToken
        );
      }
      Alert.alert('Saved', 'Your mobile money details have been saved. Payouts will be sent to this wallet.');
    } catch {
      Alert.alert('Error', 'Failed to save mobile money details');
    } finally {
      setMomoSaving(false);
    }
  };

  const handleRetryPayout = async (payoutId: string) => {
    try {
      const updated = await retryPayout(payoutId);
      setPayouts(prev => prev.map(p => (p.id === payoutId ? updated : p)));
      if (updated.status === 'FAILED') {
        Alert.alert('Payout Failed', updated.failureReason || 'Transfer failed again');
      }
    } catch {
      Alert.alert('Error', 'Failed to retry payout');
    }
  };

  const handleChangePhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Please allow access to your photo library in Settings to upload a profile picture.',
        [{ text: 'OK' }]
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (result.canceled) return;

    setPhotoUploading(true);
    try {
      const updated = await uploadProfilePhoto(result.assets[0].uri);
      if (user && accessToken && refreshToken) {
        setAuth(
          { ...user, profilePhoto: updated.profilePhoto },
          accessToken,
          refreshToken
        );
      }
    } catch {
      Alert.alert('Error', 'Failed to upload profile picture');
    } finally {
      setPhotoUploading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          try {
            await logoutUser();
          } catch {
            // Continue logout even if API fails
          } finally {
            await clearTokens();
            logout();
          }
        },
      },
    ]);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Name cannot be empty');
      return;
    }
    setLoading(true);
    try {
      const res = await axiosInstance.put('/users/me', { name: name.trim() });
      if (user && accessToken && refreshToken) {
        setAuth({ ...user, name: res.data.name }, accessToken, refreshToken);
      }
      setEditing(false);
    } catch {
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setEditing(!editing)}
          >
            <Text style={styles.editButtonText}>
              {editing ? 'Cancel' : 'Edit'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Avatar */}
        <View style={styles.avatarContainer}>
          <TouchableOpacity
            style={styles.avatarWrapper}
            onPress={handleChangePhoto}
            disabled={photoUploading}
            activeOpacity={0.7}
          >
            {user?.profilePhoto ? (
              <Image
                source={{ uri: `${BASE_URL}${user.profilePhoto}` }}
                style={styles.avatarImage}
              />
            ) : (
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {user?.name?.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
            <View style={styles.cameraBadge}>
              {photoUploading ? (
                <ActivityIndicator size="small" color={colors.primaryContrast} />
              ) : (
                <Ionicons name="camera" size={16} color={colors.primaryContrast} />
              )}
            </View>
          </TouchableOpacity>
          {user?.isVerified && (
            <View style={styles.verifiedBadge}>
              <Text style={styles.verifiedText}>✓ Verified</Text>
            </View>
          )}
        </View>

        {/* Info Card */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Full Name</Text>
          {editing ? (
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Your name"
              placeholderTextColor={colors.placeholder}
            />
          ) : (
            <Text style={styles.cardValue}>{user?.name}</Text>
          )}

          <View style={styles.divider} />

          <Text style={styles.cardLabel}>Email</Text>
          <Text style={styles.cardValue}>{user?.email}</Text>

          <View style={styles.divider} />

          <Text style={styles.cardLabel}>Member Since</Text>
          <Text style={styles.cardValue}>
            {user?.createdAt
              ? new Date(user.createdAt).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })
              : '—'}
          </Text>
        </View>

        {/* Save Button */}
        {editing && (
          <TouchableOpacity
            style={[styles.saveButton, loading ? styles.saveButtonDisabled : null]}
            onPress={handleSave}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.primaryContrast} />
            ) : (
              <Text style={styles.saveButtonText}>Save Changes</Text>
            )}
          </TouchableOpacity>
        )}

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>
              {stats.listings !== null ? stats.listings : '—'}
            </Text>
            <Text style={styles.statLabel}>Listings</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statValue}>
              {stats.bookings !== null ? stats.bookings : '—'}
            </Text>
            <Text style={styles.statLabel}>Bookings</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statValue}>
              {stats.rating !== null ? `${stats.rating.toFixed(1)} ★` : '—'}
            </Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
        </View>

        {/* Payout wallet */}
        <Text style={styles.sectionLabel}>Payouts</Text>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Mobile Money Number</Text>
          <TextInput
            style={styles.input}
            value={momoNumber}
            onChangeText={setMomoNumber}
            placeholder="e.g. 0241234567"
            placeholderTextColor={colors.placeholder}
            keyboardType="phone-pad"
            maxLength={10}
          />
          <Text style={[styles.cardLabel, { marginTop: 12 }]}>Network</Text>
          <View style={styles.segmentTrack}>
            {MOMO_PROVIDERS.map(option => {
              const selected = momoProvider === option.value;
              return (
                <TouchableOpacity
                  key={option.value}
                  style={[styles.segment, selected && styles.segmentSelected]}
                  onPress={() => setMomoProvider(option.value)}
                >
                  <Text
                    style={[
                      styles.segmentText,
                      selected && styles.segmentTextSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          <TouchableOpacity
            style={[styles.saveButton, { marginTop: 16, marginBottom: 0 }, momoSaving ? styles.saveButtonDisabled : null]}
            onPress={handleSaveMomo}
            disabled={momoSaving}
          >
            {momoSaving ? (
              <ActivityIndicator color={colors.primaryContrast} />
            ) : (
              <Text style={styles.saveButtonText}>
                {user?.momoNumber ? 'Update Wallet' : 'Save Wallet'}
              </Text>
            )}
          </TouchableOpacity>
          <Text style={styles.momoHint}>
            Money you earn from lending is sent to this wallet when a rental is completed.
          </Text>
        </View>

        {/* Earnings */}
        {payouts.length > 0 && (
          <>
            <Text style={styles.sectionLabel}>Earnings</Text>
            <View style={styles.card}>
              {payouts.map((payout, index) => (
                <View key={payout.id}>
                  {index > 0 && <View style={styles.divider} />}
                  <View style={styles.payoutRow}>
                    <View style={styles.payoutInfo}>
                      <Text style={styles.cardValue} numberOfLines={1}>
                        {payout.itemTitle}
                      </Text>
                      <Text style={styles.payoutAmount}>
                        GH₵ {payout.netAmount.toFixed(2)}
                      </Text>
                      {payout.status === 'FAILED' && payout.failureReason ? (
                        <Text style={styles.payoutError} numberOfLines={2}>
                          {payout.failureReason}
                        </Text>
                      ) : null}
                    </View>
                    <View style={styles.payoutRight}>
                      <View
                        style={[
                          styles.payoutBadge,
                          { backgroundColor: payoutStatusColors[payout.status] + '22' },
                        ]}
                      >
                        <Text
                          style={[
                            styles.payoutBadgeText,
                            { color: payoutStatusColors[payout.status] },
                          ]}
                        >
                          {payout.status}
                        </Text>
                      </View>
                      {payout.status === 'FAILED' && (
                        <TouchableOpacity
                          style={styles.retryButton}
                          onPress={() => handleRetryPayout(payout.id)}
                        >
                          <Text style={styles.retryButtonText}>Retry</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </>
        )}

        {/* Settings */}
        <Text style={styles.sectionLabel}>Settings</Text>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Appearance</Text>
          <View style={styles.segmentTrack}>
            {THEME_OPTIONS.map(option => {
              const selected = mode === option.value;
              return (
                <TouchableOpacity
                  key={option.value}
                  style={[styles.segment, selected && styles.segmentSelected]}
                  onPress={() => setMode(option.value)}
                >
                  <Text
                    style={[
                      styles.segmentText,
                      selected && styles.segmentTextSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
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
      paddingBottom: 120,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 24,
    },
    headerTitle: {
      color: colors.text,
      fontSize: 20,
      fontWeight: 'bold',
    },
    editButton: {
      paddingHorizontal: 14,
      paddingVertical: 6,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.primary,
    },
    editButtonText: {
      color: colors.primary,
      fontSize: 13,
      fontWeight: 'bold',
    },
    avatarContainer: {
      alignItems: 'center',
      marginBottom: 24,
    },
    avatarWrapper: {
      marginBottom: 10,
    },
    avatar: {
      width: 90,
      height: 90,
      borderRadius: 45,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    avatarImage: {
      width: 90,
      height: 90,
      borderRadius: 45,
      backgroundColor: colors.card,
    },
    cameraBadge: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      width: 30,
      height: 30,
      borderRadius: 15,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: colors.background,
    },
    avatarText: {
      color: colors.primaryContrast,
      fontSize: 36,
      fontWeight: 'bold',
    },
    verifiedBadge: {
      backgroundColor: colors.successMuted,
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 12,
    },
    verifiedText: {
      color: colors.success,
      fontSize: 12,
      fontWeight: 'bold',
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 20,
      marginBottom: 16,
    },
    cardLabel: {
      color: colors.textMuted,
      fontSize: 12,
      marginBottom: 6,
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
    cardValue: {
      color: colors.text,
      fontSize: 15,
      fontWeight: '600',
      marginBottom: 4,
    },
    divider: {
      height: 1,
      backgroundColor: colors.border,
      marginVertical: 14,
    },
    input: {
      backgroundColor: colors.inputBackground,
      borderRadius: 8,
      paddingHorizontal: 14,
      paddingVertical: 10,
      fontSize: 15,
      color: colors.text,
      marginBottom: 4,
    },
    saveButton: {
      backgroundColor: colors.primary,
      borderRadius: 10,
      paddingVertical: 14,
      alignItems: 'center',
      marginBottom: 16,
    },
    saveButtonDisabled: {
      opacity: 0.6,
    },
    saveButtonText: {
      color: colors.primaryContrast,
      fontSize: 16,
      fontWeight: 'bold',
    },
    statsRow: {
      flexDirection: 'row',
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 20,
      marginBottom: 24,
    },
    statBox: {
      flex: 1,
      alignItems: 'center',
    },
    statValue: {
      color: colors.text,
      fontSize: 22,
      fontWeight: 'bold',
      marginBottom: 4,
    },
    statLabel: {
      color: colors.textMuted,
      fontSize: 12,
    },
    statDivider: {
      width: 1,
      backgroundColor: colors.border,
    },
    sectionLabel: {
      color: colors.textMuted,
      fontSize: 12,
      textTransform: 'uppercase',
      letterSpacing: 1,
      marginBottom: 8,
      marginLeft: 4,
    },
    segmentTrack: {
      flexDirection: 'row',
      backgroundColor: colors.inputBackground,
      borderRadius: 10,
      padding: 3,
    },
    segment: {
      flex: 1,
      paddingVertical: 8,
      borderRadius: 8,
      alignItems: 'center',
    },
    segmentSelected: {
      backgroundColor: colors.primary,
    },
    segmentText: {
      color: colors.textMuted,
      fontSize: 13,
      fontWeight: '600',
    },
    segmentTextSelected: {
      color: colors.primaryContrast,
    },
    momoHint: {
      color: colors.textMuted,
      fontSize: 12,
      marginTop: 10,
      lineHeight: 17,
    },
    payoutRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    payoutInfo: {
      flex: 1,
      marginRight: 10,
    },
    payoutAmount: {
      color: colors.primary,
      fontSize: 14,
      fontWeight: 'bold',
      marginTop: 2,
    },
    payoutError: {
      color: colors.error,
      fontSize: 11,
      marginTop: 4,
    },
    payoutRight: {
      alignItems: 'flex-end',
      gap: 6,
    },
    payoutBadge: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
    },
    payoutBadgeText: {
      fontSize: 11,
      fontWeight: 'bold',
    },
    retryButton: {
      borderWidth: 1,
      borderColor: colors.primary,
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 4,
    },
    retryButtonText: {
      color: colors.primary,
      fontSize: 12,
      fontWeight: 'bold',
    },
    logoutButton: {
      borderWidth: 1,
      borderColor: colors.error,
      borderRadius: 10,
      paddingVertical: 14,
      alignItems: 'center',
    },
    logoutButtonText: {
      color: colors.error,
      fontSize: 17,
      fontWeight: 'bold',
    },
  });

export default ProfileScreen;
