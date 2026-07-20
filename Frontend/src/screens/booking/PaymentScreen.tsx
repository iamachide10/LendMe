import React, { useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { WebView } from 'react-native-webview';
import { HomeStackParamList } from '../../navigation/types';
import { initializePayment, verifyPayment } from '../../api/paymentApi';
import { useTheme, ThemeColors } from '../../theme';

type Props = NativeStackScreenProps<HomeStackParamList, 'Payment'>;

const PaymentScreen: React.FC<Props> = ({ route, navigation }) => {
  const { bookingId, amount } = route.params;
  const [loading, setLoading] = useState(false);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [callbackUrl, setCallbackUrl] = useState<string | null>(null);
  const referenceRef = useRef<string | null>(null);
  const verifyingRef = useRef(false);
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const startPayment = async () => {
    setLoading(true);
    try {
      const data = await initializePayment(bookingId);
      referenceRef.current = data.reference;
      setCallbackUrl(data.callbackUrl);
      setCheckoutUrl(data.authorizationUrl);
    }catch (err: any) {
      Alert.alert(
        'Payment Error',
        err?.response?.data?.message || 'Could not start payment'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (verifyingRef.current || !referenceRef.current) return;
    verifyingRef.current = true;
    setCheckoutUrl(null);
    setLoading(true);
    try {
      const payment = await verifyPayment(referenceRef.current);
      if (payment.status === 'SUCCESS') {
        Alert.alert(
          'Payment Successful! 🎉',
          `Your payment of GH₵ ${amount.toFixed(2)} was successful.`,
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      } else {
        Alert.alert(
          'Payment Not Completed',
          'Your payment was not completed. You can try again.'
        );
      }
    } catch (err: any) {
      Alert.alert(
        'Verification Error',
        err?.response?.data?.message || 'Could not verify payment'
      );
    } finally {
      verifyingRef.current = false;
      setLoading(false);
    }
  };

  // Paystack redirects to our callback URL when the transaction finishes.
  const handleNavChange = (navState: { url: string }) => {
    if (callbackUrl && navState.url.startsWith(callbackUrl)) {
      handleVerify();
    }
  };

  if (checkoutUrl) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() =>
              Alert.alert('Cancel Payment?', 'Your payment is not complete.', [
                { text: 'Stay', style: 'cancel' },
                {
                  text: 'Cancel Payment',
                  style: 'destructive',
                  onPress: () => setCheckoutUrl(null),
                },
              ])
            }
          >
            <Text style={styles.backText}>✕ Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Secure Checkout</Text>
          <View style={{ width: 50 }} />
        </View>
        <WebView
          source={{ uri: checkoutUrl }}
          onNavigationStateChange={handleNavChange}
          startInLoadingState
          renderLoading={() => (
            <View style={styles.webviewLoader}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          )}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Payment</Text>
          <View style={{ width: 50 }} />
        </View>

        <View style={styles.amountCard}>
          <Text style={styles.amountLabel}>Amount to Pay</Text>
          <Text style={styles.amountValue}>GH₵ {amount.toFixed(2)}</Text>
          <View style={styles.paystackBadge}>
            <Text style={styles.paystackBadgeText}>Secured by Paystack</Text>
          </View>
        </View>

        <View style={styles.noteCard}>
          <Text style={styles.noteText}>
            🔒 You will be redirected to Paystack's secure checkout where you
            can pay with Mobile Money (MTN, Telecel, AirtelTigo) or card.
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.payButton, loading ? styles.payButtonDisabled : null]}
          onPress={startPayment}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.primaryContrast} />
          ) : (
            <Text style={styles.payButtonText}>
              Pay GH₵ {amount.toFixed(2)}
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
    content: {
      padding: 16,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 24,
      paddingHorizontal: 4,
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
    amountCard: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 24,
      alignItems: 'center',
      marginBottom: 24,
    },
    amountLabel: {
      color: colors.textMuted,
      fontSize: 13,
      marginBottom: 8,
    },
    amountValue: {
      color: colors.text,
      fontSize: 36,
      fontWeight: 'bold',
      marginBottom: 12,
    },
    paystackBadge: {
      backgroundColor: colors.primaryMuted,
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 12,
    },
    paystackBadgeText: {
      color: colors.primary,
      fontSize: 11,
      fontWeight: 'bold',
      letterSpacing: 1,
    },
    noteCard: {
      backgroundColor: colors.primaryMuted,
      borderRadius: 10,
      padding: 14,
      marginBottom: 24,
      borderWidth: 1,
      borderColor: colors.border,
    },
    noteText: {
      color: colors.textMuted,
      fontSize: 13,
      lineHeight: 20,
    },
    payButton: {
      backgroundColor: colors.primary,
      borderRadius: 10,
      paddingVertical: 14,
      alignItems: 'center',
    },
    payButtonDisabled: {
      opacity: 0.6,
    },
    payButtonText: {
      color: colors.primaryContrast,
      fontSize: 16,
      fontWeight: 'bold',
    },
    webviewLoader: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.background,
    },
  });

export default PaymentScreen;
