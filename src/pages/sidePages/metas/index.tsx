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


import { ProviderContext } from '../../../context/ProviderContext';
import { Avatar, List, TextInput } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import IconFh from 'react-native-vector-icons/Feather';
import { RootStackParamList } from '../../../../App';
import { NativeStackScreenProps } from 'react-native-screens/lib/typescript/native-stack/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Metas'>;

function MetasPage({route, navigation}: Props): React.JSX.Element {

  const {signOut, currentUser} = useContext(ProviderContext);
  const [meta, setMeta] = useState("");

  useEffect(() => {
    if (currentUser) {
        firestore()
            .collection('Users')
            .doc(currentUser.id)
            .get().then(u => {
                let data = u.data();

                if(data){
                    setMeta(String(data.meta));
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
                      meta: parseFloat(meta)
                    });
            
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
            <Text style={styles.headerNome}>Defina sua meta</Text>
            <Text style={styles.headerEmail}>Defina a quantidade de dinheiro para investir</Text>
          </View>
        </View>
        
      </View>
      <ScrollView style={{flex: 1}}>
        <View style={styles.body}>
          <TextInput
            label="Valor"
            value={meta}
            contentStyle={{backgroundColor: "#eee",}}
            activeUnderlineColor="#056608"
            onChangeText={text => setMeta(text)}
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

export default MetasPage;
