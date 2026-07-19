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
  Payment: { bookingId: string; amount: number };
 ChatScreen: {
   conversationId: string;
   otherUserName: string;
   receiverId: string;
   itemContext?: { itemId: string; title: string; price: number };
 };
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
  Payment: { bookingId: string; amount: number };
  LeaveReview: { bookingId: string; revieweeId: string; itemId: string };
};

export type InboxStackParamList = {
  InboxScreen: undefined;
 ChatScreen: {
   conversationId: string;
   otherUserName: string;
   receiverId: string;
   itemContext?: { itemId: string; title: string; price: number };
 };
};