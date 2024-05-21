import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
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


import { MaterialBottomTabScreenProps } from '@react-navigation/material-bottom-tabs';
import { RootBottomTabParamList } from '../..';
import { Divider, FAB, RadioButton, SegmentedButtons, TextInput } from 'react-native-paper';
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { ProviderContext } from '../../../../context/ProviderContext';
import Icon from 'react-native-vector-icons/MaterialIcons';
import IconF from 'react-native-vector-icons/FontAwesome5';
import createAlert from '../../../../utils/createAlert';
import Card from '../../../../components/Card';

type Props = MaterialBottomTabScreenProps<RootBottomTabParamList, 'FinancePage'>;

function ModalCad({id_user, closeModal}: {id_user: string, closeModal: () => void}) {
  const [tipo, setTipo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [date, setDate] = useState(new Date());

  const onChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate;
    setDate(currentDate);
  };

  const showMode = (currentMode: any) => {
    DateTimePickerAndroid.open({
      value: date,
      onChange,
      mode: currentMode,
      is24Hour: true,
    });
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const handleCadCarteira = async () => {
    try {
      if (tipo == "") {
        Alert.alert("Selecione um tipo antes de salvar!");
        return;
      }

      if (descricao == "" || !date || valor == "") {
        Alert.alert("Formulario em branco, por favor preencha antes de salvar!");
        return;
      }

      let newDocUser = await firestore()
                    .collection('Reg')
                    .add({
                      descricao,
                      id_user,
                      tipo_invest: "",
                      tipo_reg: tipo,
                      valor: parseFloat(valor), 
                      tipo: "carteira", 
                      data: date, 
                    });
    
        closeModal();
    } catch (error: any) {
      Alert.alert(error);
    }
  };

  return (
    <ScrollView style={{flex: 1, width: "100%",}}>
      <View style={{flex: 1, paddingHorizontal: 20}}>
        <Text style={{color: "#000", fontSize: 20, fontWeight: "500", marginBottom: 10}}>Adicionar à carteira</Text>
        <Text style={{color: "#aaa", fontSize: 15, fontWeight: "500", marginBottom: 10, marginTop: 10}}>Tipo de Registro</Text>
        <SegmentedButtons
          style={{}}
          theme={{colors: {secondaryContainer: tipo == "entrada" ? "rgba(61,215,53, 0.5)" : "rgba(233,41,41, 0.5)", onSecondaryContainer: "#000"}}}
          value={tipo}
          onValueChange={setTipo}
          buttons={[
            {
              value: 'entrada',
              label: 'Entrada',
            },
            {
              value: 'saida',
              label: 'Saída',
            },
          ]}
        />

        <View style={{marginTop: 15, gap: 15}}>
          <TextInput
            label="Descrição"
            value={descricao}
            contentStyle={{backgroundColor: "#eee"}}
            activeUnderlineColor="#056608"
            onChangeText={text => setDescricao(text)}
            textColor='#000'
          />

          <TextInput
            label="Valor"
            value={valor}
            contentStyle={{backgroundColor: "#eee"}}
            activeUnderlineColor="#056608"
            onChangeText={text => setValor(text)}
            inputMode='numeric'
            textColor='#000'
          />

          <View style={{flexDirection: "row", alignItems: "center", gap: 10}}>
            <TextInput
              label="Data"
              value={`${date.getDate().toLocaleString().padStart(2, "0")}/${(date.getMonth() + 1).toLocaleString().padStart(2, "0")}/${date.getFullYear()}`}
              contentStyle={{backgroundColor: "#eee"}}
              activeUnderlineColor="#056608"
              readOnly
              style={{width: "80%"}}
              textColor='#000'
            />
            <TouchableOpacity onPress={showDatepicker} style={{backgroundColor: "#49AA26", paddingHorizontal: 15, paddingVertical: 15, borderRadius: 20}}>
              <Icon style={{}} name="date-range" size={25} color="#fff" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={handleCadCarteira}>
            <Text style={{backgroundColor: "#49AA26", textAlign: "center", borderRadius: 10, paddingVertical: 15, fontSize: 17, fontWeight: "500", color: "#fff"}}>Salvar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  )
}

function FinancePage({route, navigation}: Props): React.JSX.Element {

  const {currentUser} = useContext(ProviderContext);
  const [modalState, setModalState] = useState(0);
  const [valorTotal, setValorTotal] = useState(0);
  const [entradaTotal, setEntradaTotal] = useState(0);
  const [saidaTotal, setSaidaTotal] = useState(0);
  const [dataTable, setDataTable] = useState<any[]>([]);

  // ref
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // variables
  const snapPoints = useMemo(() => ['65%', '65%'], []);

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handleCloseModalPress = useCallback(() => {
    bottomSheetModalRef.current?.close();
  }, []);
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
    setModalState(index);
  }, []);

  React.useEffect(() => {
    if (currentUser) {
      firestore()
        .collection('Reg')
        .where('id_user', '==', currentUser.id)
        .where('tipo', '==', 'carteira')
        .get().then(res => {
          let entrada = 0;
          let saida = 0;

          let dataForTable: any[] = [];
          

          res.forEach(a => {
            let data = a.data();

            if (data.tipo_reg == "entrada") {
              entrada += data.valor;
            } else if (data.tipo_reg == "saida") {
              saida += data.valor;
            }

            console.log(data);
            dataForTable.push({
              key: dataForTable.length + 1,
              descricao: data.descricao,
              tipo_invest: data.tipo_invest,
              valor: data.valor,
              tipo_reg: data.tipo_reg,
            })
          })

          setDataTable(dataForTable);

          //setNumberOfItemsPerPageList([...numberOfItemsPerPageList, res.size])

          console.log(dataTable);
          
          setValorTotal(entrada - saida);
          setEntradaTotal(entrada);
          setSaidaTotal(saida);
        })
    }
  }, [modalState]);

  const formatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  return (
    <>
    <BottomSheetModalProvider>
    <View>
      <Card
        title='Entradas'
        type='entrada'
        value={formatter.format(entradaTotal)}
      />
      <Card
        title='Saídas'
        type='saida'
        value={formatter.format(saidaTotal)}
      />
      <Card
        title='Total'
        type='total'
        value={formatter.format(valorTotal)}
      />
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={1}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
      >
        <BottomSheetView style={styles.contentContainer}>
          <ModalCad  id_user={currentUser ? currentUser.id : ""} closeModal={handleCloseModalPress} />
        </BottomSheetView>
      </BottomSheetModal>
    </View>
    
    <FAB
      icon="plus"
      style={styles.fab}
      color='#fff'
      onPress={handlePresentModalPress}
    />
    </BottomSheetModalProvider>
    </>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: "#49AA26"
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    flexDirection: "column"
  },
});

export default FinancePage;
