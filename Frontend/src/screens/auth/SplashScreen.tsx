import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { getAccessToken, getRefreshToken, saveTokens } from '../../utils/tokenStorage';
import { refreshTokens } from '../../api/authApi';
import { useAuthStore } from '../../store/authStore';

type Props = NativeStackScreenProps<AuthStackParamList, 'Splash'>;

const SplashScreen: React.FC<Props> = ({ navigation }) => {
  const setAuth = useAuthStore(state => state.setAuth);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const accessToken = await getAccessToken();
        const refreshToken = await getRefreshToken();

        if (accessToken && refreshToken) {
          const res = await refreshTokens(refreshToken);
          await saveTokens(res.accessToken, res.refreshToken);
          setAuth(res.user, res.accessToken, res.refreshToken);
        } else {
          navigation.replace('Login');
        }
      } catch {
        navigation.replace('Login');
      }
    };

    checkToken();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>LendMe</Text>
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