import React, { useEffect, useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { getAccessToken, getRefreshToken, saveTokens } from '../../utils/tokenStorage';
import { refreshTokens } from '../../api/authApi';
import { useAuthStore } from '../../store/authStore';
import { useTheme, ThemeColors } from '../../theme';

type Props = NativeStackScreenProps<AuthStackParamList, 'Splash'>;

const SplashScreen: React.FC<Props> = ({ navigation }) => {
  const setAuth = useAuthStore(state => state.setAuth);
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

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

const makeStyles = (colors: ThemeColors) =>
  StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  logo: {
    fontSize: 42,
    fontWeight: 'bold',
    color: colors.primary,
    letterSpacing: 2,
  },
  tagline: {
    fontSize: 14,
    color: colors.textMuted,
    marginTop: 8,
    letterSpacing: 1,
  },
});

export default SplashScreen;
