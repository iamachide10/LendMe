import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text } from 'react-native';
import { MainTabParamList, HomeStackParamList ,InboxStackParamList} from './types';

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
import LeaveReviewScreen from '../screens/reviews/LeaveReviewScreen';
import PaymentSimulationScreen from '../screens/booking/PaymentSimulationScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();
const HomeStack = createNativeStackNavigator<HomeStackParamList>();

const InboxStack = createNativeStackNavigator<InboxStackParamList>();

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
    <InboxStack.Screen
      name="InboxScreen"
      component={InboxScreen}
    />

    <InboxStack.Screen
      name="ChatScreen"
      component={ChatScreen}
    />
  </InboxStack.Navigator>
);

const MainNavigator: React.FC = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarStyle: {
        backgroundColor: '#16213e',
        borderTopColor: '#0f3460',
        borderTopWidth: 1,
        height: 60,
        paddingBottom: 8,
        paddingTop: 6,
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
        tabBarIcon: ({ color }) => (
          <Text style={{ fontSize: 20, color }}>🏠</Text>
        ),
      }}
    />
    <Tab.Screen
      name="MyListings"
      component={MyListingsScreen}
      options={{
        title: 'Listings',
        tabBarIcon: ({ color }) => (
          <Text style={{ fontSize: 20, color }}>📦</Text>
        ),
      }}
    />
  <Tab.Screen
  name="Inbox"
  component={InboxStackNavigator}
  options={{
    tabBarIcon: ({ color }) => (
      <Text style={{ fontSize: 20, color }}>💬</Text>
    ),
  }}
/>
    <Tab.Screen
      name="MyBookings"
      component={MyBookingsScreen}
      options={{
        title: 'Bookings',
        tabBarIcon: ({ color }) => (
          <Text style={{ fontSize: 20, color }}>📅</Text>
        ),
      }}
    />
    <Tab.Screen
      name="Profile"
      component={ProfileScreen}
      options={{
        tabBarIcon: ({ color }) => (
          <Text style={{ fontSize: 20, color }}>👤</Text>
        ),
      }}
    />
  </Tab.Navigator>
);

export default MainNavigator;     