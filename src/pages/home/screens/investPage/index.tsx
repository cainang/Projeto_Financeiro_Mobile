import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Dimensions,
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
import { BottomSheetModal, BottomSheetModalProvider, BottomSheetView } from '@gorhom/bottom-sheet';
import { DataTable, FAB, SegmentedButtons, TextInput } from 'react-native-paper';
import { LineChart, ProgressChart } from 'react-native-chart-kit';
import Icon from 'react-native-vector-icons/MaterialIcons';
import IconF from 'react-native-vector-icons/FontAwesome5';
import { ProviderContext } from '../../../../context/ProviderContext';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';

type Props = MaterialBottomTabScreenProps<RootBottomTabParamList, 'InvestPage'>;

function ModalCad({id_user, closeModal, valorRendaFixa, valorRendaVariavel}: {id_user: string, closeModal: () => void, valorRendaFixa: number, valorRendaVariavel: number}) {
  const [tipo, setTipo] = useState("");
  const [tipoInvest, setTipoInvest] = useState("");
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

  const handleCadInvest = async () => {
    try {
      if (tipo == "saida") {
        if ((tipoInvest == "renda_fixa" && valorRendaFixa < parseFloat(valor)) || (tipoInvest == "renda_variavel" && valorRendaVariavel < parseFloat(valor))) {
          Alert.alert("Saida maior que total cadastrado!")

          return;
        }
      }

      let newDocUser = await firestore()
                    .collection('Reg')
                    .add({
                      descricao,
                      id_user,
                      tipo_invest: tipoInvest,
                      tipo_reg: tipo,
                      valor: parseFloat(valor), 
                      tipo: "investimento", 
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
        <Text style={{color: "#000", fontSize: 20, fontWeight: "500", marginBottom: 10}}>Adicionar Investimentos</Text>
        <Text style={{color: "#aaa", fontSize: 15, fontWeight: "500", marginBottom: 10, marginTop: 10}}>Tipo de Registro</Text>
        <SegmentedButtons
          style={{}}
          theme={{colors: {secondaryContainer: tipo == "entrada" ? "rgba(61,215,53, 0.5)" : "rgba(233,41,41, 0.5)"}}}
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

        <Text style={{color: "#aaa", fontSize: 15, fontWeight: "500", marginBottom: 10, marginTop: 10}}>Tipo do Investimento</Text>
        <SegmentedButtons
          style={{}}
          theme={{colors: {secondaryContainer: "rgba(61,215,53, 0.5)"}}}
          value={tipoInvest}
          onValueChange={setTipoInvest}
          buttons={[
            {
              value: 'renda_fixa',
              label: 'Renda Fixa',
            },
            {
              value: 'renda_variavel',
              label: 'Renda Variável',
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
          />

          <TextInput
            label="Valor"
            value={valor}
            contentStyle={{backgroundColor: "#eee"}}
            activeUnderlineColor="#056608"
            onChangeText={text => setValor(text)}
          />

          <View style={{flexDirection: "row", alignItems: "center", gap: 10}}>
            <TextInput
              label="Data"
              value={`${date.getDate().toLocaleString().padStart(2, "0")}/${(date.getMonth() + 1).toLocaleString().padStart(2, "0")}/${date.getFullYear()}`}
              contentStyle={{backgroundColor: "#eee"}}
              activeUnderlineColor="#056608"
              readOnly
              style={{width: "80%"}}
            />
            <TouchableOpacity onPress={showDatepicker} style={{backgroundColor: "#49AA26", paddingHorizontal: 15, paddingVertical: 15, borderRadius: 20}}>
              <Icon style={{}} name="date-range" size={25} color="#fff" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={handleCadInvest}>
            <Text style={{backgroundColor: "#49AA26", textAlign: "center", borderRadius: 10, paddingVertical: 15, fontSize: 17, fontWeight: "500", color: "#fff"}}>Salvar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  )
}

function InvestPage({route, navigation}: Props): React.JSX.Element {

  const {currentUser} = useContext(ProviderContext);

  const [valorTotal, setValorTotal] = useState(0);
  const [valorRendaFixa, setValorRendaFixa] = useState(0);
  const [valorRendaVariavel, setValorRendaVariavel] = useState(0);
  const [dataChartRing, setDataChartRing] = useState<{
    labels: string[], // optional
    data: number[],
    colors: string[]
  }>({
    labels: ["Renda Fixa", "Renda Variável",], // optional
    data: [0.4, 0.6],
    colors: ["#7FA653", "#CFE0BC"]
  });
  const [dataTable, setDataTable] = useState<any[]>([]);
  const [dataLineChart, setDataLineChart] = useState<{
    labels: string[],
    datasets: {
        data: number[],
        color: (opacity: number) => string, // optional
        strokeWidth: number // optional
      }[],
    legend: string[] // optional
  }>({
    labels: ["Janeiro"],
    datasets: [
      {
        data: [0],
        color: (opacity = 1) => `rgba(99,120,61, ${opacity})`, // optional
        strokeWidth: 2 // optional
      }
    ],
    legend: ["  Evolução dos Investimentos"] // optional
  });
  const [modalState, setModalState] = useState(0);

  // ref
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // variables
  const snapPoints = useMemo(() => ['78%', '78%'], []);

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

  const data = {
    labels: ["Renda Fixa", "Renda Variável",], // optional
    data: [0.4, 0.6],
    colors: ["#7FA653", "#CFE0BC"]
  };

  const getDataLine = () => {
    firestore()
        .collection('Reg')
        .where('id_user', '==', currentUser?.id)
        .where('tipo', '==', 'investimento')
        .get().then(data => {
          let mesesComReg: {mes: string, numMes: number}[] = [];
          let mesesData: {mes: string, total: number, numMes: number}[] = [];

          data.docs.forEach((d, index) => {
            let dateData = new Date(d.data().data.toDate());
            let mouthName = "";

            switch (dateData.getMonth()) {
              case 0:
                  mouthName = "Janeiro";
                break;
              case 1:
                  mouthName = "Fevereiro";
                break;
              case 2:
                  mouthName = "Março";
                break;
              case 3:
                  mouthName = "Abril";
                break;
              case 4:
                  mouthName = "Maio";
                break;
              case 5:
                  mouthName = "Junho";
                break;
              case 6:
                  mouthName = "Julho";
                break;
              case 7:
                  mouthName = "Agosto";
                break;
              case 8:
                  mouthName = "Setembro";
                break;
              case 9:
                  mouthName = "Outubro";
                break;
              case 10:
                  mouthName = "Novembro";
                break;
              case 11:
                  mouthName = "Dezembro";
                break;
            
              default:
                break;
            }

            if (mesesComReg.findIndex(m => m.mes == mouthName) == -1) {
              mesesComReg.push({mes: mouthName, numMes: dateData.getMonth()});
            }
          })
          mesesComReg.sort((a, b) => a.numMes - b.numMes);

          mesesComReg.forEach(m => {
            let dataPorMes = data.docs.filter(dt => {
              return new Date(dt.data().data.toDate()).getMonth() == m.numMes;
            });

            dataPorMes.forEach((dpm, index) => {
              let entrada = dpm.data().tipo_reg == "entrada" ? parseFloat(dpm.data().valor) : 0;
              let saida = dpm.data().tipo_reg == "saida" ? parseFloat(dpm.data().valor) : 0;

              let totalMes = entrada - saida;
              if (mesesData.length > 0) {
                mesesData.push({mes: m.mes, total: totalMes + mesesData[mesesData.length - 1].total, numMes: new Date(dpm.data().data.toDate()).getMonth()});
              } else {
                mesesData.push({mes: m.mes, total: totalMes, numMes: new Date(dpm.data().data.toDate()).getMonth()});
              }
              mesesData.sort((a, b) => a.numMes - b.numMes);
            })
          })
 
          if (mesesComReg.length > 0) {
            mesesData.sort((a, b) => a.numMes - b.numMes);
            let labelMeses = mesesData.map(md => md.mes);
            let dataMeses = mesesData.map(md => md.total);
            console.log(mesesData);
            
            const data_line = {
              labels: labelMeses,
              datasets: [
                {
                  data: dataMeses,
                  color: (opacity = 1) => `rgba(99,120,61, ${opacity})`, // optional
                  strokeWidth: 2 // optional
                }
              ],
              legend: ["  Evolução dos Investimentos"] // optional
            };

            setDataLineChart(data_line);
          }
        });
  }

  const chartConfig = {
    backgroundGradientFrom: "#fff",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#fff",
    backgroundGradientToOpacity: 0,
    color: (opacity = 1) => `rgba(0,25,0, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false // optional
  };
  const screenWidth = Dimensions.get("window").width;

  const [page, setPage] = React.useState<number>(0);
  const [numberOfItemsPerPageList, setNumberOfItemsPerPageList] = React.useState([2, 3, 4]);
  const [itemsPerPage, onItemsPerPageChange] = React.useState(
    numberOfItemsPerPageList[0]
  );

  const [items_page] = React.useState([
   {
     key: 1,
     name: 'Cupcake',
     calories: 356,
     fat: 16,
   },
   {
     key: 2,
     name: 'Eclair',
     calories: 262,
     fat: 16,
   },
   {
     key: 3,
     name: 'Frozen yogurt',
     calories: 159,
     fat: 6,
   },
   {
     key: 4,
     name: 'Gingerbread',
     calories: 305,
     fat: 3.7,
   },
  ]);

  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, dataTable.length);

  React.useEffect(() => {
    setPage(0);
  }, [itemsPerPage]);

  React.useEffect(() => {
    if (currentUser) {
      getDataLine();
      firestore()
        .collection('Reg')
        .where('id_user', '==', currentUser.id)
        .where('tipo', '==', 'investimento')
        .get().then(res => {
          let entrada = 0;
          let saida = 0;

          let rendaFixa = 0;
          let rendaVariavel = 0;

          let dataForTable: any[] = [];
          

          res.forEach(a => {
            let data = a.data();

            if (data.tipo_reg == "entrada") {
              entrada += data.valor;

              if (data.tipo_invest == "renda_fixa") {
                rendaFixa += data.valor;
              } else if (data.tipo_invest == "renda_variavel") {
                rendaVariavel += data.valor;
              }
            } else if (data.tipo_reg == "saida") {
              saida += data.valor;

              if (data.tipo_invest == "renda_fixa") {
                rendaFixa -= data.valor;
              } else if (data.tipo_invest == "renda_variavel") {
                rendaVariavel -= data.valor;
              }
            }

            //console.log(data);
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

          //console.log(dataTable);
          

          let rendaFixaPercent = 0;
          let rendaVariavelPercent = 0;

          if ((rendaFixa * 100) != 0 && (entrada - saida) != 0) {
            rendaFixaPercent = ((rendaFixa * 100) / (entrada - saida)) / 100;
          }

          if ((rendaVariavel * 100) != 0 && (entrada - saida) != 0) {
            rendaVariavelPercent = ((rendaVariavel * 100) / (entrada - saida)) / 100;
          }

          

          setValorTotal(entrada - saida);
          setValorRendaFixa(rendaFixa);
          setValorRendaVariavel(rendaVariavel);
          setDataChartRing({
            labels: ["Renda Fixa", "Renda Variável",], // optional
            data: [rendaFixaPercent, rendaVariavelPercent],
            colors: ["#7FA653", "#CFE0BC"]
          });
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
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <Text style={styles.topLabelContainer}>Valor Total dos Investimentos</Text>
        <Text style={styles.topValorContainer}>{formatter.format(valorTotal)}</Text>
      </View>

      <ScrollView style={{flex: 1, backgroundColor: "#fff", borderTopLeftRadius: 40, borderTopRightRadius: 40,}}>
        <View style={styles.bottomContainer}>
          <View>
            <LineChart
              data={dataLineChart}
              width={screenWidth}
              height={220}
              chartConfig={chartConfig}
              style={{marginTop: 15}}
            />
          </View>
          <View style={{flexDirection: "row", alignItems: "center", gap: 20}}>
            <ProgressChart
              data={dataChartRing}
              width={screenWidth * 0.5}
              height={220}
              strokeWidth={16}
              radius={32}
              chartConfig={{...chartConfig,}}
              hideLegend={true}
              style={{marginTop: 10, }}
              withCustomBarColorFromData
            />
            <View style={{flexDirection: "column", gap: 10}}>
              {data && data.labels.map((d, index) => {
                let color = data.colors[index];

                return (
                  <View style={{flexDirection: "row", gap: 10}}>
                    <View style={{width: 20, height: 20, borderRadius: 20, backgroundColor: color}}></View>
                    <Text>{d}</Text>
                  </View>
                )
              })}
            </View>
          </View>

          <View>
            <DataTable>
              <DataTable.Header>
                <DataTable.Title>Descrição</DataTable.Title>
                <DataTable.Title numeric>Tipo de Inves.</DataTable.Title>
                <DataTable.Title numeric>Valor</DataTable.Title>
                <DataTable.Title numeric>Tipo Movim.</DataTable.Title>
              </DataTable.Header>

              {dataTable.slice(from, to).map((item) => (
                <DataTable.Row key={item.key}>
                  <DataTable.Cell>{item.descricao}</DataTable.Cell>
                  <DataTable.Cell numeric>{item.tipo_invest == "renda_fixa" ? "Renda Fixa" : item.tipo_invest == "renda_variavel" ? "Renda Variável" : ""}</DataTable.Cell>
                  <DataTable.Cell numeric>{formatter.format(item.valor)}</DataTable.Cell>
                  <DataTable.Cell numeric>{item.tipo_reg == "entrada" ? <IconF style={{}} name="arrow-circle-up" size={25} color="#3dd705" /> : <IconF style={{}} name="arrow-circle-down" size={25} color="#e92929" />}</DataTable.Cell>
                </DataTable.Row>
              ))}

              <DataTable.Pagination
                page={page}
                numberOfPages={Math.ceil(dataTable.length / itemsPerPage)}
                onPageChange={(page) => setPage(page)}
                label={`${from + 1}-${to} of ${dataTable.length}`}
                numberOfItemsPerPageList={numberOfItemsPerPageList}
                numberOfItemsPerPage={itemsPerPage}
                onItemsPerPageChange={onItemsPerPageChange}
                showFastPaginationControls
                selectPageDropdownLabel={'Linhas por pagina'}
              />
            </DataTable>
          </View>
        </View>
      </ScrollView>
      
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={1}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
      >
        <BottomSheetView style={styles.contentContainer}>
          <ModalCad id_user={currentUser ? currentUser.id : ""} closeModal={handleCloseModalPress} valorRendaFixa={valorRendaFixa} valorRendaVariavel={valorRendaVariavel} />
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
  container: {
    flex: 1,
    backgroundColor: "#056608",
  },
  topContainer: {
    //flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  topLabelContainer: {
    color: "rgba(255,255,255, 0.5)",
    fontSize: 15,
    fontWeight: "400",
    marginBottom: 5,
  },
  topValorContainer: {
    color: "#fff",
    fontSize: 23,
    fontWeight: "bold",
  },
  bottomContainer: {
    
    alignItems: "flex-start"
  },
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

export default InvestPage;
