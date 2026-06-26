// export const BASE_URL = 'http://10.144.178.200:8080';
// export const API_BASE_URL = 'http://10.144.178.200:8080/api';
// export const WEBSOCKET_URL = 'http://10.144.178.200:8080/ws';
export const WEBSOCKET_URL = 'https://lendme-kjm7.onrender.com/ws';
export const API_BASE_URL = 'https://lendme-kjm7.onrender.com/api';
export const BASE_URL = 'https://lendme-kjm7.onrender.com';
export const ITEM_CATEGORIES = [
  'ELECTRONICS',
  'CLOTHING',
  'TOOLS',
  'BOOKS',
  'SPORTS',
  'CAMPING',
  'PHOTOGRAPHY',
  'OTHER',
] as const;

export const TOKEN_KEYS = {
  ACCESS: 'accessToken',
  REFRESH: 'refreshToken',
} as const;