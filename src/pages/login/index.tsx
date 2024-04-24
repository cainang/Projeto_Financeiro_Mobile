/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useContext, useEffect, useState} from 'react';
import {
    Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import firestore from '@react-native-firebase/firestore';
import { RootStackParamList } from '../../../App';
import { NativeStackScreenProps } from 'react-native-screens/lib/typescript/native-stack/types';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ProviderContext, UserType } from '../../context/ProviderContext';
  
type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

function LoginComponent({navigation}: {navigation: Props}): React.JSX.Element {
    const [viewPassword, setViewPassword] = useState(false);
    const [isCad, setIsCad] = useState(false);
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");

    const {currentUser} = useContext(ProviderContext);

    useEffect(() => {
        (async () => {
            let user = await AsyncStorage.getItem('@Projeto-Financeiro/user');
    
            if (user) {
                navigation.navigation.navigate("Home");
            }
        })()
    }, [currentUser])

    async function handleSubmit() {
        if(isCad){
            try {
                let userSearch = await firestore()
                    .collection('Users')
                    .where('email', '==', email)
                    .get()

                if (!userSearch.empty) {
                    Alert.alert("Usuario já existente!");
                    return;
                }

                if (senha.length < 6) {
                    Alert.alert("Senha deve ter pelo menos 6 caracteres!");
                    return;
                }

               
                let user = await auth().createUserWithEmailAndPassword(email, senha);
                
                let newDocUser = await firestore()
                    .collection('Users')
                    .add({
                        nome,
                        email,
                    });
                
                await auth().signInWithEmailAndPassword(email, senha);
            } catch (error: any) {
                if (error.code === 'auth/email-already-in-use') {
                    console.log('That email address is already in use!');
                }
            
                if (error.code === 'auth/invalid-email') {
                    console.log('That email address is invalid!');
                }
            
                console.error(error);
            }
        } else {
            try {
                await auth().signInWithEmailAndPassword(email, senha);
                
                navigation.navigation.push("Home");
                
            } catch (error: any) {
                Alert.alert(error);
            }
        }
    }

    return (
        <SafeAreaView style={styles.containerLoginComponent}>
            <View style={styles.cardLoginComponent}>
                <View style={styles.headerContainerLoginComponent}>
                    <Text style={styles.headerTextLoginComponent}>Projeto financeiro</Text>
                    <Text style={styles.headerDescLoginComponent}>Faça login para controlar suas finanças!</Text>
                </View>

                <View style={styles.inputsContainerLoginComponent}>
                    {isCad && (
                        <View style={[styles.inputContainerLoginComponent, {marginBottom: 20}]}>
                            <Text style={styles.textLoginComponent}>Nome</Text>
                            <TextInput style={styles.InputLoginComponent} inputMode='text' onChangeText={setNome} />
                        </View>
                    )}
                    <View style={[styles.inputContainerLoginComponent, {marginBottom: 20}]}>
                        <Text style={styles.textLoginComponent}>Email</Text>
                        <TextInput style={styles.InputLoginComponent} inputMode='email' onChangeText={setEmail} />
                    </View>
                    <View style={styles.inputContainerLoginComponent}>
                        <Text style={styles.textLoginComponent}>Senha</Text>
                        <TextInput style={styles.InputLoginComponent} secureTextEntry={!viewPassword} onChangeText={setSenha} />
                        <TouchableOpacity style={{}} onPress={() =>setViewPassword(!viewPassword)}>
                            {!viewPassword && <Icon style={styles.eyeIconLoginComponent} name="eye" size={25} color="#aeaeae" />}
                            {viewPassword && <Icon style={styles.eyeIconLoginComponent} name="eye-slash" size={25} color="#aeaeae" />}
                        </TouchableOpacity>
                    </View>
                    <View style={{marginBottom: 20}}>
                        <TouchableOpacity onPress={() => setIsCad(!isCad)}>
                            {!isCad && <Text style={styles.textLoginComponent}>Não tem uma conta? Cadastre-se</Text>}
                            {isCad && <Text style={styles.textLoginComponent}>Já tem uma conta? Faça Login</Text>}
                        </TouchableOpacity>
                    </View>
                    <View style={styles.inputContainerLoginComponent}>
                        <TouchableOpacity style={styles.buttonLoginComponent} onPress={handleSubmit}>
                            {!isCad && <Text style={styles.buttonTextLoginComponent}>Entrar</Text>}
                            {isCad && <Text style={styles.buttonTextLoginComponent}>Cadastrar</Text>}
                        </TouchableOpacity>
                    </View>
                    
                </View>
            </View>
        </SafeAreaView>
    )
}

function LoginPage({ route, navigation }: Props): React.JSX.Element {

  return (
    
    <LoginComponent navigation={{ route, navigation }} />
        
  );
}

const styles = StyleSheet.create({
    containerLoginComponent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    cardLoginComponent: {
        backgroundColor: "#fff",
        paddingHorizontal: 20,
        paddingVertical: 20,
        borderRadius: 20,
    },
    headerContainerLoginComponent: {
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 40
    },
    headerTextLoginComponent: {
        fontSize: 20,
        fontWeight: "bold"
    },
    headerDescLoginComponent: {
        fontWeight: "300"
    },
    inputsContainerLoginComponent: {},
    inputContainerLoginComponent: {},
    textLoginComponent: {},
    InputLoginComponent: {
        borderColor: "#000",
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginTop: 10
    },
    buttonLoginComponent: {
        backgroundColor: "gray",
        paddingVertical: 10,
        alignItems: "center",
        borderRadius: 10
    },
    buttonTextLoginComponent: {
        color: "#fff"
    },
    eyeIconLoginComponent: {
        position: "absolute",
        left: "85%",
        bottom: 8
    }
});

export default LoginPage;
