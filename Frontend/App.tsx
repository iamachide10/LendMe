import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import AppNavigator from './src/navigation/AppNavigator';
import { StatusBar } from 'expo-status-bar';


const App: React.FC = () => (
  <PaperProvider>
    <StatusBar style='light' backgroundColor='#1a1a2e'/>
    <AppNavigator />
  </PaperProvider>

);

export default App;