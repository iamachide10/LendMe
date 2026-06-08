import axiosInstance from './axiosInstance';
import {
  Booking,
  CreateBookingRequest,
  UpdateBookingStatusRequest,
} from '../types/booking.types';

export const createBooking = async (data: CreateBookingRequest): Promise<Booking> => {
  const res = await axiosInstance.post('/bookings', data);
  return res.data;
};

export const getMyBookings = async (): Promise<Booking[]> => {
  const res = await axiosInstance.get('/bookings/mine');
  return res.data;
};

export const getLenderBookings = async (): Promise<Booking[]> => {
  const res = await axiosInstance.get('/bookings/lender');
  return res.data;
};

export const updateBookingStatus = async (
  id: string,
  data: UpdateBookingStatusRequest
): Promise<Booking> => {
  const res = await axiosInstance.put(`/bookings/${id}/status`, data);
  return res.data;
};

export const cancelBooking = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/bookings/${id}`);
};