import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../../navigation/types';
import axiosInstance from '../../api/axiosInstance';

type Props = NativeStackScreenProps<HomeStackParamList, 'PaymentSimulation'>;

const PaymentSimulationScreen: React.FC<Props> = ({ route, navigation }) => {
  const { bookingId, amount } = route.params;
  const [loading, setLoading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  const paymentMethods = [
    { id: 'momo', label: 'MTN Mobile Money', icon: '📱' },
    { id: 'vodafone', label: 'Vodafone Cash', icon: '💳' },
    { id: 'airteltigo', label: 'AirtelTigo Money', icon: '💰' },
  ];

  const handlePayment = async () => {
    if (!selectedMethod) {
      Alert.alert('Select Method', 'Please select a payment method');
      return;
    }
    setLoading(true);
    try {
      await axiosInstance.post('/payments/simulate', { bookingId });
      Alert.alert(
        'Payment Successful! 🎉',
        `Your payment of GH₵ ${amount.toFixed(2)} was successful.`,
        [
          {
            text: 'View Booking',
            onPress: () => navigation.navigate('HomeScreen'),
          },
        ]
      );
    } catch (err: any) {
      Alert.alert(
        'Payment Failed',
        err?.response?.data?.message || 'Could not process payment'
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
          <Text style={styles.headerTitle}>Payment</Text>
          <View style={{ width: 50 }} />
        </View>

        {/* Amount */}
        <View style={styles.amountCard}>
          <Text style={styles.amountLabel}>Amount to Pay</Text>
          <Text style={styles.amountValue}>GH₵ {amount.toFixed(2)}</Text>
          <View style={styles.demoBadge}>
            <Text style={styles.demoBadgeText}>DEMO MODE</Text>
          </View>
        </View>

        {/* Payment Methods */}
        <Text style={styles.sectionTitle}>Select Payment Method</Text>
        {paymentMethods.map(method => (
          <TouchableOpacity
            key={method.id}
            style={[
              styles.methodCard,
              selectedMethod === method.id ? styles.methodCardActive : null,
            ]}
            onPress={() => setSelectedMethod(method.id)}
          >
            <Text style={styles.methodIcon}>{method.icon}</Text>
            <Text style={styles.methodLabel}>{method.label}</Text>
            <View
              style={[
                styles.radio,
                selectedMethod === method.id ? styles.radioActive : null,
              ]}
            >
              {selectedMethod === method.id && (
                <View style={styles.radioInner} />
              )}
            </View>
          </TouchableOpacity>
        ))}

        {/* Note */}
        <View style={styles.noteCard}>
          <Text style={styles.noteText}>
            ℹ️ This is a simulated payment for demo purposes. No real money
            will be charged.
          </Text>
        </View>

        {/* Pay Button */}
        <TouchableOpacity
          style={[styles.payButton, loading ? styles.payButtonDisabled : null]}
          onPress={handlePayment}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.payButtonText}>
              Pay GH₵ {amount.toFixed(2)}
            </Text>
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
    marginBottom: 24,
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
  amountCard: {
    backgroundColor: '#16213e',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
  },
  amountLabel: {
    color: '#a0a0b0',
    fontSize: 13,
    marginBottom: 8,
  },
  amountValue: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  demoBadge: {
    backgroundColor: '#f0a50022',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  demoBadgeText: {
    color: '#f0a500',
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  sectionTitle: {
    color: '#a0a0b0',
    fontSize: 13,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16213e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#0f3460',
  },
  methodCardActive: {
    borderColor: '#e94560',
  },
  methodIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  methodLabel: {
    flex: 1,
    color: '#fff',
    fontSize: 15,
    fontWeight: '500',
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#0f3460',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioActive: {
    borderColor: '#e94560',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#e94560',
  },
  noteCard: {
    backgroundColor: '#0f346022',
    borderRadius: 10,
    padding: 14,
    marginTop: 8,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#0f3460',
  },
  noteText: {
    color: '#a0a0b0',
    fontSize: 13,
    lineHeight: 20,
  },
  payButton: {
    backgroundColor: '#e94560',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  payButtonDisabled: {
    opacity: 0.6,
  },
  payButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PaymentSimulationScreen;