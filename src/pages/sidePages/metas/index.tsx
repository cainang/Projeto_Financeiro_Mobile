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
import { colors } from '../../../utils/colors';

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
            <IconFh style={{}} name="arrow-left" size={25} color={colors.white} />
          </TouchableOpacity>

          <View>
            <Text style={styles.headerNome}>Defina sua meta</Text>
            <Text style={styles.headerEmail}>Defina a quantidade de dinheiro para investir</Text>
          </View>
        </View>
        
      </View>
      <ScrollView style={{flex: 1, backgroundColor: colors.darkGray}}>
        <View style={styles.body}>
          <TextInput
            label="Valor"
            value={meta}
            theme={{colors: {onSurfaceVariant: colors.terciary}}}
            contentStyle={{backgroundColor: colors.lightGray,}}
            activeUnderlineColor={colors.terciary}
            underlineColor={colors.primaryDisabled}
            onChangeText={text => setMeta(text)}
            inputMode='numeric'
            textColor={colors.white}
          />

          <TouchableOpacity onPress={handleCadMeta} disabled={(meta == "")}>
            <Text style={{backgroundColor: (meta == "") ? colors.primaryDisabled : colors.primary, textAlign: "center", borderRadius: 10, paddingVertical: 15, fontSize: 17, fontWeight: "500", color: "#fff"}}>Salvar</Text>
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
    alignItems: "center",
    backgroundColor: colors.darkGray
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
    color: colors.white,
  },
  headerEmail: {
    color: "#ccc",
  },
});

export default MetasPage;
