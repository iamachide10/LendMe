import { useColorScheme } from 'react-native';
import { useThemeStore } from '../store/themeStore';
import { lightColors, darkColors, ThemeColors } from './colors';

export const useTheme = () => {
  const systemScheme = useColorScheme();
  const mode = useThemeStore(state => state.mode);
  const setMode = useThemeStore(state => state.setMode);

  const isDark = mode === 'system' ? systemScheme !== 'light' : mode === 'dark';
  const colors: ThemeColors = isDark ? darkColors : lightColors;

  return { colors, isDark, mode, setMode };
};
