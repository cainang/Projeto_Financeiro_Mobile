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
import { NavigationContainer, NavigatorScreenParams } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginPage from './src/pages/login';
import HomePage, { RootBottomTabParamList } from './src/pages/home';
import { ContextProvider } from './src/context/ProviderContext';
import { PaperProvider, MD3LightTheme as DefaultTheme, } from 'react-native-paper';
import MetasPage from './src/pages/sidePages/metas';
import AtualizarPage from './src/pages/sidePages/atualizarCad';

export type RootStackParamList = {
  Login: undefined;
  Home: NavigatorScreenParams<RootBottomTabParamList>;
  Metas: undefined;
  Atualizar: undefined;
};

function App(): React.JSX.Element {

  const Stack = createStackNavigator<RootStackParamList>();

  return (
    <PaperProvider theme={{...DefaultTheme, colors: {...DefaultTheme.colors, text: "#000", primary: "#056608"}}}>
      <ContextProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName='Login' screenOptions={{headerShown: false}}>
            <Stack.Screen name="Login" component={LoginPage} />
            <Stack.Screen name="Home" component={HomePage} />
            <Stack.Screen name="Metas" component={MetasPage} />
            <Stack.Screen name="Atualizar" component={AtualizarPage} />
          </Stack.Navigator>
        </NavigationContainer>
      </ContextProvider>
    </PaperProvider>
  );
}

export default App;
