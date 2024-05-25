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


import { MaterialBottomTabScreenProps } from '@react-navigation/material-bottom-tabs';
import { RootBottomTabParamList } from '../..';
import { ProviderContext } from '../../../../context/ProviderContext';
import { Avatar, List } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import { CompositeScreenProps } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../../../../App';
import { colors } from '../../../../utils/colors';

//type Props = MaterialBottomTabScreenProps<RootBottomTabParamList, 'ConfigPage'>;
type Props = CompositeScreenProps<
  MaterialBottomTabScreenProps<RootBottomTabParamList, 'ConfigPage'>,
  StackScreenProps<RootStackParamList>
>;

function ConfigPage({route, navigation}: Props): React.JSX.Element {

  const {signOut, currentUser} = useContext(ProviderContext);

  return (
    <>
      <View style={styles.header}>
        <Avatar.Text size={50} style={{borderRadius: 30}} label={currentUser ? currentUser.nome.split(" ").map(n => n[0]).join("").toUpperCase(): "EU"} />

        <View style={styles.headerLeft}>
          <View>
            <Text style={[styles.headerNome, styles.text]}>{currentUser ? currentUser.nome : "Eu"}</Text>
            <Text style={[styles.headerEmail, styles.text]}>{currentUser ? currentUser.email : "Eu"}</Text>
          </View>

          <TouchableOpacity onPress={signOut}>
            <Icon style={{}} name="sign-out" size={25} color={colors.white} />
          </TouchableOpacity>
        </View>
        
      </View>
      <ScrollView style={{flex: 1, backgroundColor: colors.darkGray}}>
        <View style={styles.body}>
          <Text style={[styles.text]}>Menu</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate("Metas")}>
          <List.Item
              title="Definir metas"
              description=""
              style={{paddingLeft: 5, paddingVertical: 30}}
              titleStyle={{color: colors.white}}
              left={props => <List.Icon {...props} color={colors.white} icon="target" />}
            />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Atualizar")}>
          <List.Item
            title="Atualizar cadastro"
            description=""
            titleStyle={{color: colors.white}}
            style={{paddingLeft: 5, paddingBottom: 30}}
            left={props => <List.Icon {...props} color={colors.white} icon="account-edit" />}
          />
        </TouchableOpacity>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingVertical: 30,
    paddingHorizontal: 20,
    flexDirection: "row",
    gap: 20,
    alignItems: "center",
    backgroundColor: colors.darkGray
  },
  body: {
    paddingHorizontal: 20,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flex: 1
  },
  headerNome: {
    fontSize: 20,
    fontWeight: "500",
    color: "#000",
  },
  headerEmail: {
    
  },
  text: {
    color: colors.white
  }
});

export default ConfigPage;
