import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text } from 'react-native';
import { MainTabParamList, HomeStackParamList, InboxStackParamList, BookingsStackParamList } from './types';
import { Ionicons } from '@expo/vector-icons';


import MyListingsScreen from '../screens/items/MyListingsScreen';
import InboxScreen from '../screens/messaging/InboxScreen';
import MyBookingsScreen from '../screens/booking/MyBookingsScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';


import HomeScreen from '../screens/home/HomeScreen';
import ItemDetailScreen from '../screens/items/ItemDetailScreen';
import BookingScreen from '../screens/booking/BookingScreen';
import BookingConfirmScreen from '../screens/booking/BookingConfirmScreen';
import CreateListingScreen from '../screens/items/CreateListingScreen';
import ChatScreen from '../screens/messaging/ChatScreen';
import LeaveReviewScreen from '../screens/reviews/LeaveReviewScreen';
import PaymentSimulationScreen from '../screens/booking/PaymentSimulationScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();
const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const InboxStack = createNativeStackNavigator<InboxStackParamList>();
const BookingsStack = createNativeStackNavigator<BookingsStackParamList>();

const HomeStackNavigator: React.FC = () => (
  <HomeStack.Navigator screenOptions={{ headerShown: false }}>
    <HomeStack.Screen name="HomeScreen" component={HomeScreen} />
    <HomeStack.Screen name="ItemDetail" component={ItemDetailScreen} />
    <HomeStack.Screen name="BookingScreen" component={BookingScreen} />
    <HomeStack.Screen name="BookingConfirm" component={BookingConfirmScreen} />
    <HomeStack.Screen name="CreateListing" component={CreateListingScreen} />
    <HomeStack.Screen name="ChatScreen" component={ChatScreen} />
    <HomeStack.Screen name="LeaveReview" component={LeaveReviewScreen} />
    <HomeStack.Screen name="PaymentSimulation" component={PaymentSimulationScreen} />
  </HomeStack.Navigator>
);

const InboxStackNavigator: React.FC = () => (
  <InboxStack.Navigator screenOptions={{ headerShown: false }}>
    <InboxStack.Screen name="InboxScreen" component={InboxScreen} />
    <InboxStack.Screen name="ChatScreen" component={ChatScreen} />
  </InboxStack.Navigator>
);

const BookingsStackNavigator: React.FC = () => (
  <BookingsStack.Navigator screenOptions={{ headerShown: false }}>
    <BookingsStack.Screen name="MyBookingsScreen" component={MyBookingsScreen} />
    <BookingsStack.Screen name="PaymentSimulation" component={PaymentSimulationScreen} />
  </BookingsStack.Navigator>
);

const MainNavigator: React.FC = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarStyle: {
        backgroundColor: '#16213e',
        borderTopColor: '#0f3460',
        borderTopWidth: 2,
        height: 70,
        paddingBottom: 8,
        paddingTop: 6,
        paddingHorizontal:8
      },
      tabBarActiveTintColor: '#e94560',
      tabBarInactiveTintColor: '#a0a0b0',
      tabBarLabelStyle: {
        fontSize: 11,
        fontWeight: '600',
      },
    }}
  >
   <Tab.Screen
  name="Home"
  component={HomeStackNavigator}
  options={{
    tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
  }}
/>
<Tab.Screen
  name="MyListings"
  component={MyListingsScreen}
  options={{
    title: 'Listings',
    tabBarIcon: ({ color, size }) => <Ionicons name="cube" size={size} color={color} />,
  }}
/>
<Tab.Screen
  name="Inbox"
  component={InboxStackNavigator}
  options={{
    tabBarIcon: ({ color, size }) => <Ionicons name="chatbubble-ellipses" size={size} color={color} />,
  }}
/>
<Tab.Screen
  name="MyBookings"
  component={BookingsStackNavigator}
  options={{
    title: 'Bookings',
    tabBarIcon: ({ color, size }) => <Ionicons name="calendar" size={size} color={color} />,
  }}
/>
<Tab.Screen
  name="Profile"
  component={ProfileScreen}
  options={{
    tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} />,
  }}
/>
  </Tab.Navigator>
);

export default MainNavigator;