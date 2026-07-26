export type PayoutStatus =
  | 'HELD'
  | 'RELEASED'
  | 'PAID'
  | 'FAILED'
  | 'REFUNDED';

export interface Payout {
  id: string;
  bookingId: string;
  itemTitle: string;
  grossAmount: number;
  platformFee: number;
  netAmount: number;
  status: PayoutStatus;
  failureReason?: string;
  createdAt: string;
  releasedAt?: string;
}
