import React, { useMemo } from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { useAuthStore } from '../store/authStore';
import { useTheme } from '../theme';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';

const AppNavigator: React.FC = () => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const { colors, isDark } = useTheme();

  const navTheme = useMemo(() => {
    const base = isDark ? DarkTheme : DefaultTheme;
    return {
      ...base,
      colors: {
        ...base.colors,
        background: colors.background,
        card: colors.card,
        text: colors.text,
        primary: colors.primary,
        border: colors.border,
        notification: colors.primary,
      },
    };
  }, [colors, isDark]);

  return (
    <NavigationContainer theme={navTheme}>
      {isAuthenticated ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default AppNavigator;
