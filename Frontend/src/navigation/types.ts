import type { NavigatorScreenParams } from '@react-navigation/native';


export type AuthStackParamList = {
  Splash: undefined;
  Login: undefined;
  Register: undefined;
};
export type HomeStackParamList = {
  HomeScreen: undefined;
  SearchResults: undefined;
  ItemDetail: { itemId: string };
  CreateListing: { itemId?: string } | undefined;
  BookingScreen: { itemId: string };
  BookingConfirm: { bookingId: string };
  PaymentSimulation: { bookingId: string; amount: number };
  LeaveReview: { bookingId: string; revieweeId: string; itemId: string };
  ChatScreen: { conversationId: string; otherUserName: string; receiverId: string };
};

export type MainTabParamList = {
  Home: NavigatorScreenParams<HomeStackParamList>;
  MyListings: undefined;
  Inbox: undefined;
  MyBookings: undefined;
  Profile: undefined;
};

export type BookingsStackParamList = {
  MyBookingsScreen: undefined;
  PaymentSimulation: { bookingId: string; amount: number };
};

export type InboxStackParamList = {
  InboxScreen: undefined;
 ChatScreen: { conversationId: string; otherUserName: string; receiverId: string };
};