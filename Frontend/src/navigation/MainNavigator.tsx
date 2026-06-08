import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainTabParamList, HomeStackParamList } from './types';

// Tab Screens
import MyListingsScreen from '../screens/items/MyListingsScreen';
import InboxScreen from '../screens/messaging/InboxScreen';
import MyBookingsScreen from '../screens/booking/MyBookingsScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';

// Home Stack Screens
import HomeScreen from '../screens/home/HomeScreen';
import ItemDetailScreen from '../screens/items/ItemDetailScreen';
import BookingScreen from '../screens/booking/BookingScreen';
import BookingConfirmScreen from '../screens/booking/BookingConfirmScreen';
import CreateListingScreen from '../screens/items/CreateListingScreen';
import ChatScreen from '../screens/messaging/ChatScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();
const HomeStack = createNativeStackNavigator<HomeStackParamList>();

const HomeStackNavigator: React.FC = () => (
  <HomeStack.Navigator screenOptions={{ headerShown: false }}>
    <HomeStack.Screen name="HomeScreen" component={HomeScreen} />
    <HomeStack.Screen name="ItemDetail" component={ItemDetailScreen} />
    <HomeStack.Screen name="BookingScreen" component={BookingScreen} />
    <HomeStack.Screen name="BookingConfirm" component={BookingConfirmScreen} />
    <HomeStack.Screen name="CreateListing" component={CreateListingScreen} />
    <HomeStack.Screen name="ChatScreen" component={ChatScreen} />
  </HomeStack.Navigator>
);

const MainNavigator: React.FC = () => (
  <Tab.Navigator screenOptions={{ headerShown: false }}>
    <Tab.Screen name="Home" component={HomeStackNavigator} />
    <Tab.Screen
      name="MyListings"
      component={MyListingsScreen}
      options={{ title: 'My Listings' }}
    />
    <Tab.Screen name="Inbox" component={InboxScreen} />
    <Tab.Screen
      name="MyBookings"
      component={MyBookingsScreen}
      options={{ title: 'Bookings' }}
    />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

export default MainNavigator;