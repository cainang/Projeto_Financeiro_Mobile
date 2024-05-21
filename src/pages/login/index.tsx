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
import Svg, { Path } from "react-native-svg"
  
type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const LogoSVG = (props: any) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={172}
    height={24}
    fill="none"
    {...props}
  >
    <Path
      fill="#fff"
      d="M0 13.662c0-1.53.305-2.885.914-4.065.628-1.18 1.47-2.093 2.529-2.738 1.076-.664 2.268-.996 3.577-.996.968 0 1.919.222 2.851.664.95.424 1.704.996 2.26 1.715V.885h3.093v20.466H12.13v-2.295c-.502.737-1.2 1.345-2.097 1.825-.88.48-1.892.719-3.04.719a6.632 6.632 0 0 1-3.55-.996c-1.058-.682-1.9-1.622-2.529-2.82C.304 16.566 0 15.192 0 13.662Zm12.13.056c0-1.051-.215-1.964-.645-2.738-.412-.775-.96-1.365-1.64-1.77A4.237 4.237 0 0 0 7.638 8.6c-.79 0-1.524.203-2.206.609-.681.387-1.237.968-1.667 1.742-.413.756-.62 1.66-.62 2.71 0 1.051.207 1.973.62 2.766.43.793.986 1.401 1.667 1.825a4.33 4.33 0 0 0 2.206.609c.789 0 1.524-.203 2.205-.608.682-.406 1.229-.996 1.641-1.77.43-.793.646-1.715.646-2.766ZM32.834 13.358c0 .572-.036 1.088-.108 1.549H21.404c.09 1.217.529 2.194 1.318 2.932.789.737 1.757 1.106 2.905 1.106 1.65 0 2.815-.71 3.496-2.13h3.309a6.905 6.905 0 0 1-2.448 3.457c-1.166.886-2.618 1.328-4.357 1.328-1.417 0-2.69-.323-3.82-.968-1.111-.664-1.99-1.586-2.636-2.766-.627-1.198-.941-2.581-.941-4.148 0-1.567.305-2.941.915-4.121.627-1.199 1.497-2.12 2.609-2.766 1.13-.645 2.42-.968 3.873-.968 1.398 0 2.644.314 3.738.94A6.535 6.535 0 0 1 31.92 9.46c.61 1.124.915 2.424.915 3.9Zm-3.2-.995c-.019-1.162-.422-2.093-1.211-2.794-.789-.7-1.766-1.05-2.932-1.05-1.058 0-1.963.35-2.716 1.05-.753.682-1.202 1.614-1.345 2.794h8.203ZM41.58 18.53l4.197-12.418h3.254l-5.648 15.24h-3.658l-5.622-15.24h3.282L41.58 18.53ZM52.586 21.545a1.873 1.873 0 0 1-1.399-.581c-.376-.387-.564-.867-.564-1.438 0-.572.188-1.051.564-1.438.377-.388.843-.581 1.4-.581.537 0 .994.193 1.37.58.377.388.566.867.566 1.439 0 .571-.189 1.05-.565 1.438-.377.387-.834.58-1.372.58ZM64.05 8.684h-2.744v12.667h-3.093V8.684h-1.748V6.112h1.748V5.034c0-1.752.448-3.024 1.345-3.817C60.473.406 61.898 0 63.835 0v2.627c-.933 0-1.587.185-1.964.554-.376.35-.565.968-.565 1.853v1.078h2.744v2.572ZM68.327 4.093a1.873 1.873 0 0 1-1.398-.58c-.377-.388-.565-.867-.565-1.439 0-.571.188-1.05.565-1.438.376-.387.842-.58 1.398-.58.538 0 .996.193 1.372.58.377.387.565.867.565 1.438 0 .572-.188 1.051-.565 1.438-.376.388-.834.581-1.372.581Zm1.507 2.02V21.35h-3.067V6.112h3.067ZM81.337 5.863c1.165 0 2.205.25 3.12.747.932.498 1.658 1.235 2.178 2.213.52.977.78 2.157.78 3.54v8.988h-3.039v-8.518c0-1.365-.332-2.406-.995-3.125-.664-.738-1.57-1.107-2.717-1.107s-2.062.369-2.743 1.107c-.664.719-.996 1.76-.996 3.125v8.518H73.86V6.112h3.067v1.743a5.113 5.113 0 0 1 1.91-1.466 6.096 6.096 0 0 1 2.5-.526ZM90.304 13.662c0-1.53.305-2.885.915-4.065.628-1.18 1.47-2.093 2.528-2.738a6.631 6.631 0 0 1 3.55-.996c1.166 0 2.18.24 3.04.72.879.46 1.578 1.041 2.098 1.742V6.112h3.093v15.24h-3.093v-2.269c-.52.72-1.228 1.319-2.125 1.798-.897.48-1.919.719-3.066.719a6.45 6.45 0 0 1-3.497-.996c-1.058-.682-1.9-1.622-2.528-2.82-.61-1.217-.915-2.591-.915-4.121Zm12.131.056c0-1.051-.215-1.964-.646-2.738-.412-.775-.959-1.365-1.64-1.77a4.239 4.239 0 0 0-2.206-.609c-.789 0-1.524.203-2.205.609-.682.387-1.238.968-1.668 1.742-.412.756-.619 1.66-.619 2.71 0 1.051.207 1.973.619 2.766.43.793.986 1.401 1.668 1.825a4.33 4.33 0 0 0 2.205.609c.79 0 1.524-.203 2.206-.608.681-.406 1.228-.996 1.64-1.77.431-.793.646-1.715.646-2.766ZM117.033 5.863c1.165 0 2.205.25 3.12.747.932.498 1.659 1.235 2.179 2.213.52.977.78 2.157.78 3.54v8.988h-3.04v-8.518c0-1.365-.332-2.406-.995-3.125-.663-.738-1.569-1.107-2.717-1.107-1.147 0-2.062.369-2.743 1.107-.664.719-.995 1.76-.995 3.125v8.518h-3.066V6.112h3.066v1.743a5.11 5.11 0 0 1 1.909-1.466 6.097 6.097 0 0 1 2.502-.526ZM126.001 13.718c0-1.567.305-2.941.914-4.121.628-1.199 1.488-2.12 2.582-2.766 1.094-.645 2.349-.968 3.766-.968 1.793 0 3.272.443 4.438 1.328 1.183.866 1.981 2.11 2.394 3.734h-3.309c-.269-.757-.699-1.347-1.291-1.77-.591-.425-1.336-.637-2.232-.637-1.255 0-2.259.461-3.013 1.383-.735.904-1.102 2.176-1.102 3.817 0 1.64.367 2.922 1.102 3.844.754.922 1.758 1.383 3.013 1.383 1.775 0 2.95-.802 3.523-2.406h3.309c-.431 1.549-1.238 2.784-2.421 3.706-1.184.903-2.654 1.355-4.411 1.355-1.417 0-2.672-.323-3.766-.968-1.094-.664-1.954-1.586-2.582-2.766-.609-1.198-.914-2.581-.914-4.148ZM156.733 13.358a10.1 10.1 0 0 1-.107 1.549h-11.324c.09 1.217.529 2.194 1.318 2.932.789.737 1.757 1.106 2.905 1.106 1.65 0 2.815-.71 3.497-2.13h3.308a6.9 6.9 0 0 1-2.448 3.457c-1.165.886-2.618 1.328-4.357 1.328-1.417 0-2.69-.323-3.819-.968-1.112-.664-1.991-1.586-2.636-2.766-.628-1.198-.942-2.581-.942-4.148 0-1.567.305-2.941.915-4.121.627-1.199 1.497-2.12 2.609-2.766 1.13-.645 2.421-.968 3.873-.968 1.399 0 2.645.314 3.739.94 1.094.627 1.945 1.512 2.555 2.656.61 1.124.914 2.424.914 3.9Zm-3.2-.995c-.018-1.162-.422-2.093-1.211-2.794-.789-.7-1.766-1.05-2.931-1.05-1.058 0-1.964.35-2.717 1.05-.753.682-1.201 1.614-1.345 2.794h8.204Z"
    />
    <Path
      fill="#49AA26"
      d="M52.587 21.545a1.873 1.873 0 0 1-1.4-.581c-.376-.387-.564-.867-.564-1.438 0-.572.188-1.051.565-1.438.376-.388.843-.581 1.398-.581.538 0 .996.193 1.372.58.377.388.565.867.565 1.439 0 .571-.188 1.05-.565 1.438-.376.387-.834.58-1.371.58ZM171.999 17.325c0 .78-.226 1.515-.678 2.202-.435.687-1.086 1.264-1.955 1.733-.851.468-1.864.75-3.04.843V24h-1.765v-1.897c-1.701-.14-3.076-.601-4.126-1.382-1.05-.78-1.575-1.811-1.575-3.091h3.312c.055.608.281 1.116.679 1.522.398.39.968.64 1.71.75v-5.153c-1.212-.266-2.199-.531-2.959-.797a4.925 4.925 0 0 1-1.954-1.311c-.525-.594-.788-1.405-.788-2.436 0-1.296.525-2.366 1.575-3.209 1.05-.859 2.425-1.358 4.126-1.499V3.6h1.765v1.897c1.592.125 2.868.562 3.827 1.312.978.734 1.53 1.749 1.656 3.045h-3.312c-.054-.484-.271-.914-.651-1.289-.38-.39-.887-.655-1.52-.796v5.06c1.212.249 2.198.514 2.959.795.76.266 1.402.695 1.927 1.289.525.577.787 1.381.787 2.412Zm-9.99-7.26c0 .64.218 1.14.652 1.498.452.36 1.086.648 1.9.867V7.699c-.778.078-1.402.32-1.873.726-.452.406-.679.952-.679 1.64Zm4.317 9.836c.796-.109 1.42-.382 1.873-.82.452-.452.678-.99.678-1.616 0-.624-.226-1.108-.678-1.452-.435-.359-1.059-.648-1.873-.866V19.9Z"
    />
  </Svg>
)

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
                navigation.navigation.navigate("Home", {
                    screen: 'FinancePage',
                  });
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
                
                navigation.navigation.navigate("Home", {
                    screen: 'FinancePage',
                  });
                
            } catch (error: any) {
                Alert.alert(error);
            }
        }
    }

    return (
        <SafeAreaView style={styles.containerLoginComponent}>
            <View style={styles.cardLoginComponent}>
                <View style={styles.headerContainerLoginComponent}>
                    <LogoSVG />
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
        alignItems: 'center',
        backgroundColor: "#b1efae"
    },
    cardLoginComponent: {
        backgroundColor: "#056608",
        paddingHorizontal: 30,
        paddingVertical: 20,
        borderRadius: 20,
    },
    headerContainerLoginComponent: {
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 40,
    },
    headerTextLoginComponent: {
        fontSize: 20,
        fontWeight: "bold"
    },
    headerDescLoginComponent: {
        fontWeight: "300",
        marginTop: 20,
        color: "#fff",
    },
    inputsContainerLoginComponent: {},
    inputContainerLoginComponent: {},
    textLoginComponent: {
        color: "#fff",
    },
    InputLoginComponent: {
        borderColor: "#fff",
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginTop: 10,
        color: "#fff",
    },
    buttonLoginComponent: {
        backgroundColor: "#fff",
        paddingVertical: 10,
        alignItems: "center",
        borderRadius: 10
    },
    buttonTextLoginComponent: {
        color: "#056608"
    },
    eyeIconLoginComponent: {
        position: "absolute",
        left: "85%",
        bottom: 8,
        color: "#fff",
    }
});

export default LoginPage;
