import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import WelcomeScreen from '../App';          // your existing App.js
import LoginScreen   from '../screens/LoginScreen';
import SignUpScreen  from '../screens/SignUpScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{
          headerShown: false,          // hides the default top bar on all screens
          animation: 'slide_from_right', // iOS-style slide; use 'fade' if you prefer
          contentStyle: { backgroundColor: '#12121b' },
        }}
      >
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login"   component={LoginScreen} />
        <Stack.Screen name="SignUp"  component={SignUpScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
