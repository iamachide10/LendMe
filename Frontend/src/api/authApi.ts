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






// ╭─── Claude Code v2.1.201 ─────────────────────────────────────────────────────────────────────────────────────────────╮
// │                                                 │ Tips for getting started                                           │
// │                  Welcome back!                  │ Ask Claude to create a new app or clone a repository               │
// │                                                 │────────────────────────────────────────────────────────────────── │
// │                     ▐▛███▜▌                    │What's new                                                         │
// │                    ▝▜█████▛▘                 │ Claude Sonnet 5 sessions no longer use the mid-conversation syste… │
// │                      ▘▘ ▝▝                   │ Changed `AskUserQuestion` dialogs to no longer auto-continue by d… │
// │                                                 │ Changed the "default" permission mode to "Manual" across the CLI,… │
// │   Fable 5 with low effort · API Usage Billing   │ /release-notes for more                                            │
// │              ~\Desktop\testClaude               │                                                                    │
// ╰──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╯

                                                                                                                                                                                                                       
// ✻ Unable to connect to API (ConnectionRefused) · Retrying in 18s · attempt 6/10

