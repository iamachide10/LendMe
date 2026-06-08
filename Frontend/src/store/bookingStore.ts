import { create } from 'zustand';
import { Booking } from '../types/booking.types';

interface BookingState {
  bookings: Booking[];
  lenderBookings: Booking[];
  selectedStartDate: string | null;
  selectedEndDate: string | null;
  setBookings: (bookings: Booking[]) => void;
  setLenderBookings: (bookings: Booking[]) => void;
  setSelectedDates: (start: string | null, end: string | null) => void;
  clearDates: () => void;
}

export const useBookingStore = create<BookingState>(set => ({
  bookings: [],
  lenderBookings: [],
  selectedStartDate: null,
  selectedEndDate: null,
  setBookings: bookings => set({ bookings }),
  setLenderBookings: lenderBookings => set({ lenderBookings }),
  setSelectedDates: (start, end) =>
    set({ selectedStartDate: start, selectedEndDate: end }),
  clearDates: () => set({ selectedStartDate: null, selectedEndDate: null }),
}));