export interface User {
  id: string;
  name: string;
  email: string;
  profilePhoto?: string;
  isVerified: boolean;
  momoNumber?: string;
  momoProvider?: string;
  createdAt: string;
}

export interface MomoDetailsRequest {
  momoNumber: string;
  momoProvider: 'MTN' | 'VOD' | 'ATL';
}

export interface UpdateProfileRequest {
  name?: string;
  profilePhoto?: string;
}