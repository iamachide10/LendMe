import axiosInstance from './axiosInstance';
import { Payout } from '../types/payout.types';

export const getMyPayouts = async (): Promise<Payout[]> => {
  const res = await axiosInstance.get('/payouts/me');
  return res.data;
};

export const retryPayout = async (payoutId: string): Promise<Payout> => {
  const res = await axiosInstance.post(`/payouts/${payoutId}/retry`);
  return res.data;
};
