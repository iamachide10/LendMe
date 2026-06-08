export type BookingStatus =
  | 'PENDING'
  | 'APPROVED'
  | 'REJECTED'
  | 'PAID'
  | 'ACTIVE'
  | 'COMPLETED'
  | 'CANCELLED';

export interface Booking {
  id: string;
  itemId: string;
  itemTitle: string;
  borrowerId: string;
  borrowerName: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: BookingStatus;
  createdAt: string;
}

export interface CreateBookingRequest {
  itemId: string;
  startDate: string;
  endDate: string;
}

export interface UpdateBookingStatusRequest {
  status: BookingStatus;
}