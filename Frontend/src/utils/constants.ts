export const API_BASE_URL = 'http://10.0.2.2:8080/api';
export const WEBSOCKET_URL = 'ws://10.0.2.2:8080/ws';

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