import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
    Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';


import { ProviderContext } from '../../../context/ProviderContext';
import { Avatar, Button, Dialog, Divider, List, SegmentedButtons, TextInput, Text as TextP } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome5';
import IconFh from 'react-native-vector-icons/Feather';
import IconM from 'react-native-vector-icons/MaterialIcons';
import { RootStackParamList } from '../../../../App';
import { NativeStackScreenProps } from 'react-native-screens/lib/typescript/native-stack/types';
import { Dropdown } from 'react-native-element-dropdown';
import { colors } from '../../../utils/colors';
import { RectButton, Swipeable } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { BottomSheetModal, BottomSheetModalProvider, BottomSheetView } from '@gorhom/bottom-sheet';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
//import Swipeable from 'react-native-swipeable';

type Props = NativeStackScreenProps<RootStackParamList, 'ListReg'>;

const data = [
  { label: 'Entradas', value: 'entrada' },
  { label: 'Saídas', value: 'saida' },
  { label: 'Total', value: 'total' },
];

const data_month = [
  { label: 'Janeiro', value: '0' },
  { label: 'Fevereiro', value: '1' },
  { label: 'Março', value: '2' },
  { label: 'Abril', value: '3' },
  { label: 'Maio', value: '4' },
  { label: 'Junho', value: '5' },
  { label: 'Julho', value: '6' },
  { label: 'Agosto', value: '7' },
  { label: 'Setembro', value: '8' },
  { label: 'Outubro', value: '9' },
  { label: 'Novembro', value: '10' },
  { label: 'Dezembro', value: '11' },
];

interface regProps {
  descricao: string,
  id_user: string,
  tipo_invest: string,
  tipo_reg: string,
  valor: number, 
  tipo: string, 
  data: any,
}

let row: Array<Swipeable | null> = [];
let prevOpenedRow: any;

function ModalCad({id_user, closeModal, codDialog}: {id_user: string, closeModal: () => void, codDialog: string}) {
  const [tipo, setTipo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    let query = firestore()
      .collection('Reg')
      .doc(codDialog).get().then(res => {
        let data = res.data() as regProps;
        console.log("sadhdfisuhfiau", data);
        

        setTipo(data.tipo_reg);
        setDescricao(data.descricao);
        setValor(String(data.valor));
        setDate(new Date(data.data.toDate()));
      });
  }, [])

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
        Alert.alert("Selecione um tipo antes de editar!");
        return;
      }

      if (descricao == "" || !date || valor == "") {
        Alert.alert("Formulario em branco, por favor preencha antes de editar!");
        return;
      }

      let newDocUser = await firestore()
                    .collection('Reg')
                    .doc(codDialog)
                    .update({
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
    <ScrollView style={{flex: 1, width: "100%", backgroundColor: colors.darkGray}}>
      <View style={{flex: 1, paddingHorizontal: 20}}>
        <Text style={{color: "#fff", fontSize: 20, fontWeight: "500", marginBottom: 10}}>Adicionar à carteira</Text>
        <Text style={{color: "#ccc", fontSize: 15, fontWeight: "500", marginBottom: 10, marginTop: 10}}>Tipo de Registro</Text>
        <SegmentedButtons
          style={{}}
          theme={{colors: {secondaryContainer: tipo == "entrada" ? "rgba(61,215,53, 0.5)" : "rgba(233,41,41, 0.5)", onSecondaryContainer: "#fff", onSurface: "#ccc"}}}
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
            theme={{colors: {onSurfaceVariant: colors.terciary}}}
            contentStyle={{backgroundColor: colors.lightGray,}}
            activeUnderlineColor={colors.terciary}
            underlineColor={colors.primaryDisabled}
            onChangeText={text => setDescricao(text)}
            textColor={colors.white}
          />

          <TextInput
            label="Valor"
            value={valor}
            theme={{colors: {onSurfaceVariant: colors.terciary}}}
            contentStyle={{backgroundColor: colors.lightGray,}}
            activeUnderlineColor={colors.terciary}
            underlineColor={colors.primaryDisabled}
            onChangeText={text => setValor(text)}
            inputMode='numeric'
            textColor={colors.white}
          />

          <View style={{flexDirection: "row", alignItems: "center", gap: 10}}>
            <TextInput
              label="Data"
              value={`${date.getDate().toLocaleString().padStart(2, "0")}/${(date.getMonth() + 1).toLocaleString().padStart(2, "0")}/${date.getFullYear()}`}
              theme={{colors: {onSurfaceVariant: colors.terciary}}}
              contentStyle={{backgroundColor: colors.lightGray,}}
              activeUnderlineColor={colors.terciary}
              underlineColor={colors.primaryDisabled}
              readOnly
              style={{width: "80%"}}
              textColor={colors.white}
            />
            <TouchableOpacity onPress={showDatepicker} style={{backgroundColor: colors.primary, paddingHorizontal: 15, paddingVertical: 15, borderRadius: 20}}>
              <IconM style={{}} name="date-range" size={25} color="#fff" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={handleCadCarteira} disabled={(descricao == "" || valor == "" || tipo == "")}>
            <Text style={{backgroundColor: (descricao == "" || valor == "" || tipo == "") ? colors.primaryDisabled : colors.primary, textAlign: "center", borderRadius: 10, paddingVertical: 15, fontSize: 17, fontWeight: "500", color: "#fff"}}>Editar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  )
}

function ListRegPage({route, navigation}: Props): React.JSX.Element {

  const {signOut, currentUser} = useContext(ProviderContext);
  const [type, setType] = useState(route.params.type);
  const [isFocus, setIsFocus] = useState(false);
  const [valueMonth, setValueMonth] = useState(String(route.params.mouth));
  const [isFocusMonth, setIsFocusMonth] = useState(false);
  const [valueAdic, setValueAdic] = useState(route.params.value_adic);
  const [dataTable, setDataTable] = useState<any[]>([]);
  const [visibleDialog, setVisibleDialog] = useState(false);
  const [codDialog, setCodDialog] = useState("");
  const [modalState, setModalState] = useState(0);

  const [updateValues, setUpdateValues] = useState(false);
  const [selectedRow, setSelectedRow] = useState<Swipeable | null>(null);

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
  
  useEffect(() => {
    if (currentUser) {
      let date = new Date(new Date().getFullYear(), Number(valueMonth), 1), y = date.getFullYear(), m = date.getMonth();
      let firstDay = new Date(y, m, 1);
      let lastDay = new Date(y, m + 1, 0);

      let query = firestore()
      .collection('Reg')
      .where('id_user', '==', currentUser.id)
      .where('tipo', '==', 'carteira')
      .where('data', '>=', firstDay)
      .where('data', '<=', lastDay);

      if (type != "total") {
        query = query.where('tipo_reg', "==", type);
      }

      query.get().then(res => {
        let entrada = 0;
        let saida = 0;
        let total = 0;

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
            data: new Date(data.data.toDate()).toLocaleDateString("pt-BR"),
            cod: a.id
          })
        })

        total = type == "entrada" ? entrada : type == "saida" ? saida : entrada - saida;

        setDataTable(dataForTable);
        setValueAdic(total);

        //setNumberOfItemsPerPageList([...numberOfItemsPerPageList, res.size])

        console.log(dataTable);
      }).catch(err => console.log(err))
    }
  }, [type, valueMonth, updateValues])

  useEffect(() => {
    row.forEach(r => {
      r?.close();
    })
  }, [type, valueMonth])

  /* const handleCadMeta = async () => {
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
  }; */

  const formatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  const deleteReg = (cod: string) => {
    setCodDialog(cod);
    setVisibleDialog(true);
  }

  const deleteRegConfirmed = (cod: string) => {
    console.log(cod);
    let query = firestore()
      .collection('Reg')
      .doc(cod).delete().then(res => {
        setVisibleDialog(false);
        setUpdateValues(!updateValues);
        setCodDialog("");
      });
  }

  const editReg = (cod: string, row: Swipeable | null) => {
    setCodDialog(cod);
    setSelectedRow(row);
    handlePresentModalPress();
  }

  function closeRow(index: number) {
    if (prevOpenedRow && prevOpenedRow !== row[index]) {
      prevOpenedRow.close();
    }
    prevOpenedRow = row[index];
  }

  return (
    <BottomSheetModalProvider>
    <View style={{backgroundColor: colors.lightGray, flex: 1}}>
      <View style={styles.container}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.navigate("Home", {
            screen: "FinancePage"
          })}>
            <IconFh style={{}} name="arrow-left" size={25} color="#fff" />
          </TouchableOpacity>

          <View style={{flexDirection: 'row', gap: 40}}>
            <View style={{width: 120}}>
              <Dropdown
                style={[isFocus && { borderColor: 'blue' }]}
                data={data}
                maxHeight={300}
                labelField="label"
                valueField="value"
                itemContainerStyle={{backgroundColor: colors.darkGray}}
                containerStyle={{borderWidth: 0}}
                activeColor={colors.primary}
                itemTextStyle={{color: colors.white}}
                iconColor={colors.white}
                selectedTextStyle={{color: colors.white}}
                value={type}
                renderItem={({label, value}) => {
                  return (
                    <View style={{paddingVertical: 15, paddingHorizontal: 10, flexDirection: "row", alignItems: "center", gap: 10}}>
                      <View style={{width: 15, height: 15, borderRadius: 20, backgroundColor: value == 'entrada' ? colors.greenNeon : value == 'saida' ? colors.redNeon : colors.terciary}}></View>
                      <Text style={{color: colors.white, fontSize: 15}}>{label}</Text>
                    </View>
                  )
                }}  
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                onChange={item => {
                  setType(item.value);
                  setIsFocus(false);
                }}
                //renderLeftIcon={() => ()}
              />
            </View>

            <View style={{width: 120}}>
              <Dropdown
                style={[isFocusMonth && { borderColor: 'blue' }]}
                data={data_month}
                maxHeight={300}
                labelField="label"
                valueField="value"
                itemContainerStyle={{backgroundColor: colors.darkGray}}
                containerStyle={{borderWidth: 0}}
                activeColor={colors.primary}
                itemTextStyle={{color: colors.white}}
                iconColor={colors.white}
                selectedTextStyle={{color: colors.white}}
                value={valueMonth}
                onFocus={() => setIsFocusMonth(true)}
                onBlur={() => setIsFocusMonth(false)}
                onChange={item => {
                  setValueMonth(item.value);
                  setIsFocusMonth(false);
                }}
                //renderLeftIcon={() => ()}
              />
            </View>
          </View>
        </View>
      </View>

      <View style={{backgroundColor: colors.primary, flexDirection: "row", gap: 20, justifyContent: "center", alignItems: "center", paddingVertical: 20, borderBottomRightRadius: 30, borderBottomLeftRadius: 30}}>
        <Icon style={{}} name="wallet" size={25} color="#fff" />
        <View>
          <Text style={{color: colors.white, fontSize: 15, fontWeight: "400"}}>Total {type == 'entrada' ? "de Entradas" : type == 'saida' ? "de Saidas" : "da Carteira"}</Text>
          <Text style={{color: type == 'entrada' ? colors.greenNeon : type == 'saida' ? colors.redNeon : colors.greenNeon, fontSize: 18, fontWeight: "bold"}}>{valueAdic && formatter.format(valueAdic)}</Text>
        </View>
      </View>

      <View style={{alignItems: "center"}}>
        <Divider style={{width: 300, marginVertical: 5}} />
      </View>

      <ScrollView style={{flex: 1, backgroundColor: colors.lightGray, paddingVertical: 20, borderBottomRightRadius: 30, borderBottomLeftRadius: 30,}}>
        <View style={{gap: 20}}>
          {dataTable && dataTable.map((d, index) => (
            <Swipeable key={d.key} ref={ref => row[index] = ref} onSwipeableOpen={() => closeRow(index)} renderRightActions={(progress, dragX) => {
              const trans = dragX.interpolate({
                inputRange: [0, 50, 100, 101],
                outputRange: [-20, 0, 0, 1],
              });
              return (
                <>
                  <RectButton style={{backgroundColor: colors.redNeon, justifyContent: "center", alignItems: "center", paddingHorizontal: 20}} onPress={() => deleteReg(d.cod)}>
                    <Icon style={{}} name="trash" size={25} color="#fff" />
                  </RectButton>
                  <RectButton style={{backgroundColor: colors.primary, justifyContent: "center", alignItems: "center", paddingHorizontal: 20}} onPress={() => editReg(d.cod, row[index])}>
                    <Icon style={{}} name="edit" size={25} color="#fff" />
                  </RectButton>
                </>
              )}}>
              <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, backgroundColor: colors.lightGray}}>
                <View style={{flexDirection: "row", gap: 20, alignItems: "center", justifyContent: "center",}}>
                  <View style={{backgroundColor: d.tipo_reg == 'entrada' ? colors.greenNeon : d.tipo_reg == 'saida' ? colors.redNeon : colors.white, paddingHorizontal: 15, paddingVertical: 15, borderRadius: 50}}>
                    <Icon style={{}} name="wallet" size={25} color="#fff" />
                  </View>
                  <View>
                    <Text style={{color: colors.white, fontSize: 18, fontWeight: "700"}}>{d.descricao}</Text>
                    <Text style={{color: "#ccc", fontSize: 18, fontWeight: "300"}}>{d.tipo_reg == 'entrada' ? "Entrada" : d.tipo_reg == 'saida' ? "Saida" : ""} | Carteira</Text>
                  </View>
                </View>

                <View style={{alignItems: "flex-end", justifyContent: "center"}}>
                  <Text style={{color: d.tipo_reg == 'entrada' ? colors.greenNeon : d.tipo_reg == 'saida' ? colors.redNeon : colors.greenNeon, fontSize: 18, fontWeight: "bold"}}>{d.valor && formatter.format(d.valor)}</Text>
                  <Text style={{color: "#ccc", fontSize: 15, fontWeight: "300"}}>{d.data}</Text>
                </View>
              </View>
            </Swipeable>
          ))}
        </View>
      </ScrollView>
      <Dialog visible={visibleDialog} onDismiss={() => setVisibleDialog(false)}>
        <Dialog.Title>Deseja deletar esse registro?</Dialog.Title>
        <Dialog.Actions>
          <Button onPress={() => deleteRegConfirmed(codDialog)}>Deletar</Button>
          <Button onPress={() => setVisibleDialog(false)}>Cancelar</Button>
        </Dialog.Actions>
      </Dialog>

      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={1}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        handleIndicatorStyle={{backgroundColor: colors.white}}
        handleStyle={{backgroundColor: colors.darkGray, borderTopRightRadius: 15, borderTopLeftRadius: 15}}
      >
        <BottomSheetView style={styles.contentContainer}>
          <ModalCad id_user={currentUser ? currentUser.id : ""} closeModal={() => {
            setUpdateValues(!updateValues);
            selectedRow?.close();
            handleCloseModalPress();
          }} codDialog={codDialog} />
        </BottomSheetView>
      </BottomSheetModal>
    </View>
    </BottomSheetModalProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 30,
    paddingHorizontal: 20,
    flexDirection: "row",
    gap: 20,
    backgroundColor: colors.darkGray,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    flexDirection: "column",
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

export default ListRegPage;
