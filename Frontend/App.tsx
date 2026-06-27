import 'text-encoding';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Provider as PaperProvider } from 'react-native-paper';
import AppNavigator from './src/navigation/AppNavigator';

const App: React.FC = () => (
  <PaperProvider>
    <StatusBar style="light" backgroundColor="#1a1a2e" />
    <AppNavigator />
  </PaperProvider>
);

export default App;