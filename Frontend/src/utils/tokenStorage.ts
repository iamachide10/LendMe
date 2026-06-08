import AsyncStorage from '@react-native-async-storage/async-storage';
import { TOKEN_KEYS } from './constants';

export const saveTokens = async (
  accessToken: string,
  refreshToken: string
): Promise<void> => {
  await AsyncStorage.multiSet([
    [TOKEN_KEYS.ACCESS, accessToken],
    [TOKEN_KEYS.REFRESH, refreshToken],
  ]);
};

export const getAccessToken = async (): Promise<string | null> => {
  return AsyncStorage.getItem(TOKEN_KEYS.ACCESS);
};

export const getRefreshToken = async (): Promise<string | null> => {
  return AsyncStorage.getItem(TOKEN_KEYS.REFRESH);
};

export const clearTokens = async (): Promise<void> => {
  await AsyncStorage.multiRemove([TOKEN_KEYS.ACCESS, TOKEN_KEYS.REFRESH]);
};