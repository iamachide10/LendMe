import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAuthStore } from '../../store/authStore';

const SplashScreen: React.FC = () => {
  const setAuth = useAuthStore(state => state.setAuth);

  useEffect(() => {
    // Temporary: fake login to test Home screen
    setAuth(
      {
        id: '1',
        name: 'Test User',
        email: 'test@knust.edu.gh',
        isVerified: true,
        createdAt: new Date().toISOString(),
      },
      'fake-access-token',
      'fake-refresh-token'
    );
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>UniSwap</Text>
      <Text style={styles.tagline}>KNUST Campus Rentals</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
  },
  logo: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#e94560',
    letterSpacing: 2,
  },
  tagline: {
    fontSize: 14,
    color: '#a0a0b0',
    marginTop: 8,
    letterSpacing: 1,
  },
});

export default SplashScreen;