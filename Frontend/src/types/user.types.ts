export interface User {
  id: string;
  name: string;
  email: string;
  profilePhoto?: string;
  isVerified: boolean;
  createdAt: string;
}

export interface UpdateProfileRequest {
  name?: string;
  profilePhoto?: string;
}