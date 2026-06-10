export type AuthStackParamList = {
  Splash: undefined;
  Login: undefined;
  Register: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  MyListings: undefined;
  Inbox: undefined;
  MyBookings: undefined;
  Profile: undefined;
};

export type HomeStackParamList = {
  HomeScreen: undefined;
  SearchResults: undefined;
  ItemDetail: { itemId: string };
  CreateListing: undefined;
  BookingScreen: { itemId: string };
  BookingConfirm: { bookingId: string };
  PaymentSimulation: { bookingId: string; amount: number };
  LeaveReview: { bookingId: string; revieweeId: string; itemId: string };
  ChatScreen: { conversationId: string; otherUserName: string };
};

export type InboxStackParamList = {
  InboxScreen: undefined;

  ChatScreen: {
    conversationId: string;
    otherUserName: string;
  };
};