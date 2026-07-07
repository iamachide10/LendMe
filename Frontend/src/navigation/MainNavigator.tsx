import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { getFocusedRouteNameFromRoute, RouteProp } from '@react-navigation/native';
import { ViewStyle } from 'react-native';
import { MainTabParamList, HomeStackParamList, InboxStackParamList, BookingsStackParamList } from './types';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, ThemeColors } from '../theme';


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
    <BookingsStack.Screen name="LeaveReview" component={LeaveReviewScreen} />
  </BookingsStack.Navigator>
);

const makeFloatingTabBar = (colors: ThemeColors): ViewStyle => ({
  position: 'absolute',
  bottom: 24,
  left: 16,
  right: 16,
  height: 64,
  borderRadius: 32,
  backgroundColor: colors.card,
  borderTopWidth: 0,
  paddingBottom: 10,
  paddingTop: 10,
  paddingHorizontal: 8,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.2,
  shadowRadius: 16,
  elevation: 12,
});

// Hide the floating bar on nested screens (chat input, item detail
// footer, etc. would otherwise sit behind it)
const isOnNestedScreen = (
  route: RouteProp<MainTabParamList, keyof MainTabParamList>,
  rootScreen: string
): boolean => {
  const focused = getFocusedRouteNameFromRoute(route) ?? rootScreen;
  return focused !== rootScreen;
};

const MainNavigator: React.FC = () => {
  const { colors } = useTheme();
  const floatingTabBar = makeFloatingTabBar(colors);

  return (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarStyle: floatingTabBar,
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: colors.textMuted,
      tabBarLabelStyle: {
        fontSize: 11,
        fontWeight: '600',
      },
    }}
  >
   <Tab.Screen
  name="Home"
  component={HomeStackNavigator}
  options={({ route }) => ({
    tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
    tabBarStyle: [floatingTabBar, isOnNestedScreen(route, 'HomeScreen') && { display: 'none' }],
  })}
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
  options={({ route }) => ({
    tabBarIcon: ({ color, size }) => <Ionicons name="chatbubble-ellipses" size={size} color={color} />,
    tabBarStyle: [floatingTabBar, isOnNestedScreen(route, 'InboxScreen') && { display: 'none' }],
  })}
/>
<Tab.Screen
  name="MyBookings"
  component={BookingsStackNavigator}
  options={({ route }) => ({
    title: 'Bookings',
    tabBarIcon: ({ color, size }) => <Ionicons name="calendar" size={size} color={color} />,
    tabBarStyle: [floatingTabBar, isOnNestedScreen(route, 'MyBookingsScreen') && { display: 'none' }],
  })}
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
};

export default MainNavigator;