import React, { useContext, useEffect, useState } from 'react';
import {
    Alert,
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
import auth from '@react-native-firebase/auth';


import { ProviderContext } from '../../../context/ProviderContext';
import { Avatar, List, TextInput } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import IconFh from 'react-native-vector-icons/Feather';
import { RootStackParamList } from '../../../../App';
import { NativeStackScreenProps } from 'react-native-screens/lib/typescript/native-stack/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Atualizar'>;

function AtualizarPage({route, navigation}: Props): React.JSX.Element {

  const {signOut, currentUser} = useContext(ProviderContext);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (currentUser) {
        firestore()
            .collection('Users')
            .doc(currentUser.id)
            .get().then(u => {
                let data = u.data();

                if(data){
                    setNome(data.nome);
                    setEmail(data.email);
                }
            });
    }
  }, [])

  const handleCadMeta = async () => {
    try {
        if (currentUser) {
            let newDocUser = await firestore()
                    .collection('Users')
                    .doc(currentUser.id)
                    .update({
                      nome,
                      email,
                    });
            
            auth().onAuthStateChanged(user => {
                user?.updateEmail(email);
            })
            
            navigation.navigate("Home", {
                screen: "ConfigPage"
            })
        }
    } catch (error: any) {
        console.log(error);
        
        Alert.alert(JSON.stringify(error));
    }
  };

  return (
    <>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.navigate("Home", {
            screen: "ConfigPage"
          })}>
            <IconFh style={{}} name="arrow-left" size={25} color="#000" />
          </TouchableOpacity>

          <View>
            <Text style={styles.headerNome}>Atualiza Cadastro</Text>
            <Text style={styles.headerEmail}>Mude alguns parametros...</Text>
          </View>
        </View>
        
      </View>
      <ScrollView style={{flex: 1}}>
        <View style={styles.body}>
          <TextInput
            label="Nome"
            value={nome}
            contentStyle={{backgroundColor: "#eee",}}
            activeUnderlineColor="#056608"
            onChangeText={text => setNome(text)}
          />

        <TextInput
            label="Email"
            value={email}
            contentStyle={{backgroundColor: "#eee",}}
            activeUnderlineColor="#056608"
            onChangeText={text => setEmail(text)}
          />

          <TouchableOpacity onPress={handleCadMeta}>
            <Text style={{backgroundColor: "#49AA26", textAlign: "center", borderRadius: 10, paddingVertical: 15, fontSize: 17, fontWeight: "500", color: "#fff"}}>Salvar</Text>
          </TouchableOpacity>
        </View>
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
    alignItems: "center"
  },
  body: {
    paddingHorizontal: 20,
    marginTop: 20,
    gap: 20
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    flex: 1
  },
  headerNome: {
    fontSize: 25,
    fontWeight: "500",
    color: "#000",
  },
  headerEmail: {
    
  },
});

export default AtualizarPage;
