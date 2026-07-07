export type ThemeColors = {
  background: string;
  card: string;
  border: string;
  inputBackground: string;
  text: string;
  textMuted: string;
  placeholder: string;
  primary: string;
  primaryContrast: string;
  primaryMuted: string;
  success: string;
  successMuted: string;
  warning: string;
  warningMuted: string;
  error: string;
  overlay: string;
};

export const lightColors: ThemeColors = Object.freeze({
  background: '#F8FAFC',
  card: '#FFFFFF',
  border: '#E2E8F0',
  inputBackground: '#F1F5F9',
  text: '#0F172A',
  textMuted: '#64748B',
  placeholder: '#94A3B8',
  primary: '#6366F1',
  primaryContrast: '#FFFFFF',
  primaryMuted: '#6366F122',
  success: '#10B981',
  successMuted: '#10B98122',
  warning: '#D97706',
  warningMuted: '#D9770622',
  error: '#DC2626',
  overlay: 'rgba(15,23,42,0.5)',
});

export const darkColors: ThemeColors = Object.freeze({
  background: '#000000',
  card: '#171717',
  border: '#2F2F2F',
  inputBackground: '#212121',
  text: '#ECECEC',
  textMuted: '#9B9B9B',
  placeholder: '#6E6E6E',
  primary: '#818CF8',
  primaryContrast: '#FFFFFF',
  primaryMuted: '#818CF822',
  success: '#4ECCA3',
  successMuted: '#4ECCA322',
  warning: '#F0A500',
  warningMuted: '#F0A50022',
  error: '#F87171',
  overlay: 'rgba(0,0,0,0.6)',
});
