import React, { createContext, useEffect, useState, ReactNode } from "react";
import auth from '@react-native-firebase/auth';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator } from "react-native-paper";
import { View } from "react-native";

export interface UserType {
    id: string;
    nome: string;
    email: string | null;
    meta: number;
    saldo_anterior: number;
    data_ultima_alteracao: FirebaseFirestoreTypes.Timestamp;
    saldo_transfirido: boolean;
}

interface ContextType {
    currentUser: UserType | null;
    signOut: () => Promise<void>;
    checkUser: (callback: () => void) => Promise<void>;
}

export const ProviderContext = createContext<ContextType>({} as ContextType);

export const ContextProvider = ({ children }: {children: ReactNode}) => {
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [pending, setPending] = useState(true);

  useEffect(() => {
    auth().onAuthStateChanged(async (user) => {
      if (user) {
        let id = "";
        let nome = "";
        let meta = 0;
        let saldo_anterior = 0;
        let saldo_transfirido = false;
        let data_ultima_alteracao: FirebaseFirestoreTypes.Timestamp = {} as FirebaseFirestoreTypes.Timestamp;
        let userSearch = await firestore()
                .collection('Users')
                .where('email', '==', user.email)
                .get();

        userSearch.forEach(d => {
            id = d.id;
            nome = d.data().nome;
            meta = d.data().meta;
            saldo_anterior = d.data().saldo_anterior;
            data_ultima_alteracao = d.data().data_ultima_alteracao;
            saldo_transfirido = d.data().saldo_transfirido;
        })

        let userDTO: UserType = {
            id,
            nome,
            email: user.email,
            meta,
            saldo_anterior,
            data_ultima_alteracao,
            saldo_transfirido
        };

        setCurrentUser(userDTO);

        await AsyncStorage.setItem('@Projeto-Financeiro/user', JSON.stringify(userDTO));
    }
        
        setPending(false);
    });

    auth().onUserChanged(async (user) => {
      if (user) {
          let id = "";
          let nome = "";
          let meta = 0;
          let saldo_anterior = 0;
          let saldo_transfirido = false;
          let data_ultima_alteracao: FirebaseFirestoreTypes.Timestamp = {} as FirebaseFirestoreTypes.Timestamp;
          let userSearch = await firestore()
                  .collection('Users')
                  .where('email', '==', user.email)
                  .get();

          userSearch.forEach(d => {
              id = d.id;
              nome = d.data().nome;
              meta = d.data().meta;
              saldo_anterior = d.data().saldo_anterior;
              data_ultima_alteracao = d.data().data_ultima_alteracao;
              saldo_transfirido = d.data().saldo_transfirido;
          })

          let userDTO: UserType = {
              id,
              nome,
              email: user.email,
              meta,
              saldo_anterior,
              data_ultima_alteracao,
              saldo_transfirido
          };

          setCurrentUser(userDTO);

          await AsyncStorage.setItem('@Projeto-Financeiro/user', JSON.stringify(userDTO));
      }
  });
  }, []);

  async function signOut() {
    await auth().signOut();
    setCurrentUser(null);
    await AsyncStorage.removeItem('@Projeto-Financeiro/user');
  }

  async function checkUser(callback = () => {}) {
    let user = await AsyncStorage.getItem('@Projeto-Financeiro/user');
    
    if (!user) {
        callback();
    }
  }

  function Loading() {
    return (
        <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
            <ActivityIndicator animating={true} color={"#000"} />
        </View>
    )
  }

  return (
    <ProviderContext.Provider
      value={{
        currentUser,
        signOut,
        checkUser
      }}
    >
      {!pending && children}
      {pending && <Loading />}
    </ProviderContext.Provider>
  );
};