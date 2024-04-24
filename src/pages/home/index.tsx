import React, { useContext, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';

import { ProviderContext } from '../../context/ProviderContext';
import { NativeStackScreenProps } from 'react-native-screens/lib/typescript/native-stack/types';
import { RootStackParamList } from '../../../App';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import FinancePage from './screens/financePage';
import InvestPage from './screens/investPage';
import ConfigPage from './screens/configPage';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export type RootBottomTabParamList = {
  InvestPage: undefined;
  FinancePage: undefined;
  ConfigPage: undefined;
};

const Tab = createMaterialBottomTabNavigator<RootBottomTabParamList>();

function HomePage({ route, navigation }: Props): React.JSX.Element {

  const {checkUser, currentUser} = useContext(ProviderContext);

  useEffect(() => {
    checkUser(() => navigation.navigate("Login"));
  }, [currentUser])

  return (
    <Tab.Navigator 
      initialRouteName='FinancePage' 
      activeColor='red' 
      activeIndicatorStyle={{backgroundColor: "black", paddingVertical: 30, borderRadius: 100,}}
      barStyle={{backgroundColor: "yellow",}}
      labeled={false}
    >
      <Tab.Screen name="InvestPage" options={{tabBarIcon: "finance"}} component={InvestPage} />
      <Tab.Screen name="FinancePage" options={{tabBarIcon: "wallet"}} component={FinancePage} />
      <Tab.Screen name="ConfigPage" options={{tabBarIcon: "account"}} component={ConfigPage} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default HomePage;
