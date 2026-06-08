import axios from 'axios';
import axiosInstance from './axiosInstance';
import { API_BASE_URL } from '../utils/constants';

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    isVerified: boolean;
    createdAt: string;
    profilePhoto?: string;
  };
}

export const registerUser = async (data: RegisterRequest): Promise<AuthResponse> => {
  const res = await axios.post(`${API_BASE_URL}/auth/register`, data);
  return res.data;
};

export const loginUser = async (data: LoginRequest): Promise<AuthResponse> => {
  const res = await axios.post(`${API_BASE_URL}/auth/login`, data);
  return res.data;
};

export const refreshTokens = async (refreshToken: string): Promise<AuthResponse> => {
  const res = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken });
  return res.data;
};

export const logoutUser = async (): Promise<void> => {
  await axiosInstance.post('/auth/logout');
};