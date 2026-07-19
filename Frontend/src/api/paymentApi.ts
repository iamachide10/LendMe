import axiosInstance from './axiosInstance';

export interface InitializePaymentResponse {
  authorizationUrl: string;
  accessCode: string;
  reference: string;
  callbackUrl: string;
}

export interface PaymentResponse {
  id: string;
  bookingId: string;
  amount: number;
  transactionRef: string;
  status: 'SIMULATED' | 'PENDING' | 'SUCCESS' | 'FAILED';
  paidAt: string;
}

export const initializePayment = async (
  bookingId: string
): Promise<InitializePaymentResponse> => {
  const res = await axiosInstance.post('/payments/initialize', { bookingId });
  return res.data;
};

export const verifyPayment = async (
  reference: string
): Promise<PaymentResponse> => {
  const res = await axiosInstance.get(`/payments/verify/${reference}`);
  return res.data;
};
