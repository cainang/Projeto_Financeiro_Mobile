import 'react-native-gesture-handler';
import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginPage from './src/pages/login';
import HomePage from './src/pages/home';
import { ContextProvider } from './src/context/ProviderContext';
import { PaperProvider } from 'react-native-paper';

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
};

function App(): React.JSX.Element {

  const Stack = createStackNavigator<RootStackParamList>();

  return (
    <PaperProvider>
      <ContextProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName='Login' screenOptions={{headerShown: false}}>
            <Stack.Screen name="Login" component={LoginPage} />
            <Stack.Screen name="Home" component={HomePage} />
          </Stack.Navigator>
        </NavigationContainer>
      </ContextProvider>
    </PaperProvider>
  );
}

export default App;
