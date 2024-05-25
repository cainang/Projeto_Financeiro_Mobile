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
import ListRegPage from './src/pages/sidePages/listRegPage';
import { colors } from './src/utils/colors';

export type RootStackParamList = {
  Login: undefined;
  Home: NavigatorScreenParams<RootBottomTabParamList>;
  Metas: undefined;
  Atualizar: undefined;
  ListReg: {
    type: string,
    mouth: number,
    mouth_desc: string,
    value_adic?: number
  };
};

function App(): React.JSX.Element {

  const Stack = createStackNavigator<RootStackParamList>();

  return (
    <PaperProvider theme={{...DefaultTheme, colors: {...DefaultTheme.colors, text: "#000", primary: colors.primary}}}>
      <ContextProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName='Login' screenOptions={{headerShown: false}}>
            <Stack.Screen name="Login" component={LoginPage} />
            <Stack.Screen name="Home" component={HomePage} />
            <Stack.Screen name="Metas" component={MetasPage} />
            <Stack.Screen name="Atualizar" component={AtualizarPage} />
            <Stack.Screen name="ListReg" component={ListRegPage} />
          </Stack.Navigator>
        </NavigationContainer>
      </ContextProvider>
    </PaperProvider>
  );
}

export default App;
