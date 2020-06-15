import React,  {useState, useEffect} from 'react';
import { Feather as Icon, FontAwesome} from '@expo/vector-icons'
import { View, ImageBackground, TextInput, StyleSheet, Text, SafeAreaView, TouchableOpacity, ScrollView, Keyboard, KeyboardType, Platform } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import * as SQLite from 'expo-sqlite';

interface produtos { 
  cd: string;
  nm: string;
  gp: string;
  pr: string;
}
interface check {
  checked: string;
  color1: string;
  color2: string;
  placeholder: string;
  teclado: KeyboardType;
}

interface porTrecho {
  checked: string;
  color: string;
  disabled: boolean;
}


const Home = () => {

    const [produtos, setProdutos] = useState<produtos[]>([]);
    const [nomeProduto, setNomeProduto] = useState('');
    const [porTrecho, setPorTrecho] = useState<porTrecho>({checked:'', color: '#CCC', disabled: false});
    const [check, setCheck] = useState<check>({checked:'nome', color1: '#D61D24', color2: '#CCC', placeholder: 'Digite o Nome do produto', teclado: 'default'});

    const navigation = useNavigation();

    const db = SQLite.openDatabase('data.db');

    function buscaProduto(){

      if(nomeProduto.length > 0){

          const trecho  = check.checked == 'nome' ? '%' : '';
          let produto = nomeProduto;
          if(check.checked == 'codigo' && nomeProduto.length<6){
            setNomeProduto(("000000" + nomeProduto).slice(-6));
            produto = ("000000" + nomeProduto).slice(-6)
          }
          
          db.transaction(
          tx => {
            tx.executeSql("SELECT codigo as cd, nome as nm, grupo as gp, preco as pr FROM produtos WHERE "+ check.checked +" LIKE '"+ porTrecho.checked +""+ produto +""+ trecho +"' ", [], (_, {rows})=>{
              const data = [];
              for(let i=0; i<rows.length; i++){
                data.push(rows.item(i));
              }
              setProdutos(data); 
            });
        });
      }else{
        setProdutos([]);
      }
      Keyboard.dismiss();
    }

    function handleProductDetail(code: string){
      navigation.navigate('Produto', { productCode : code });
    }

    function selectCheck(check:string){
        if(check == 'Nome'){
          setNomeProduto('');
          setCheck({
            checked:'nome',
            color1: '#D61D24', 
            color2: '#CCC',
            placeholder: 'Digite o Nome do produto',
            teclado: 'default',
          })
          setPorTrecho({
            disabled: false,
            checked:'',
            color: '#CCC', 
          })
        }else{
          setNomeProduto('');
          setCheck({
            checked:'codigo',
            color1: '#CCC', 
            color2: '#D61D24',
            placeholder: 'Digite o Código do produto',
            teclado: 'number-pad',
          })
          setPorTrecho({
            disabled: true,
            checked:'',
            color: '#CCC', 
          })
        }
    }

    function selectPorTrecho(){
      if(porTrecho.checked == '%'){
        setPorTrecho({
          disabled: false,
          checked:'',
          color: '#CCC', 
        })
      }else{
        setPorTrecho({
          disabled: false,
          checked:'%',
          color: '#D61D24', 
        })
      }
  }


    return (
      <SafeAreaView style={{flex: 1, paddingTop: Platform.OS === 'ios' ? 0 : 24}}>
        <ImageBackground source={require('../../assets/home-background.png')} imageStyle={{ width: 274, height: 368 }} style={styles.containerBackground}>
        <View style={styles.container}>
          <View style={{flexDirection: 'row', justifyContent:'space-between', paddingBottom: 16,}}>
              <TouchableOpacity onPress={()=>{selectCheck('Nome')}} style={{flexDirection: 'row', justifyContent:'space-between'}}>
                <FontAwesome name="circle" size={20} color={check.color1} />
                <Text style={{marginLeft: 8, color:check.color1}}>Nome</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={()=>{selectCheck('Codigo')}} style={{flexDirection: 'row', justifyContent:'space-between'}}>
                <FontAwesome name="circle" size={20} color={check.color2} />
                <Text style={{marginLeft: 8, color:check.color2}}>Código</Text>
              </TouchableOpacity>
              <TouchableOpacity disabled={porTrecho.disabled} onPress={selectPorTrecho} style={{flexDirection: 'row', justifyContent:'space-between'}}>
                <FontAwesome name="check" size={20} color={porTrecho.color} />
                <Text style={{marginLeft: 8, color:porTrecho.color}}>Por Trecho</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.seachContainer}>
              <TextInput
                    style={styles.input}
                    placeholder={check.placeholder}
                    autoCapitalize="characters"
                    autoCorrect={false}
                    value={nomeProduto}
                    onChangeText={setNomeProduto}
                    returnKeyType='search'
                    onSubmitEditing={buscaProduto}
                    keyboardType={check.teclado}
                />
                <RectButton style={styles.seachButton} onPress={buscaProduto}>
                    <Icon name="search" color="#FFF" size={20}/>
                </RectButton>
            </View>
            {produtos && (
               <View style={styles.listItems}>
               <ScrollView showsVerticalScrollIndicator={false}>
                 {produtos.map(produto => (
                   <TouchableOpacity onPress={()=>{handleProductDetail(produto.cd)}} style={styles.item} key={produto.cd}>
                   <Text style={styles.addressTitle}>{`${produto.cd} - ${produto.nm}`}</Text>
                   <Text style={styles.addressContent}>{`Grupo: ${produto.gp}`}</Text>
                 </TouchableOpacity> 
                 ))}
                               
               </ScrollView>
             </View>
            )}

           
            
        </View>
         </ImageBackground>
        </SafeAreaView>
    );
};

export default Home;



const styles = StyleSheet.create({
  
  containerBackground: {
    flex: 1,
    paddingTop: 8,
  },
  
  container: {
    flex: 1,
    padding: 32,
    paddingTop: 8,
  },

  seachContainer:{
    flexDirection: 'row',
    justifyContent: 'space-around'
  },

  input: {
    width: '80%',
    height: 50,
    backgroundColor: '#FFF',
    borderRadius: 10,
    borderColor: '#CCC',
    borderWidth: 1,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  seachButton: {
    width: '20%',
    marginLeft: 16,
    backgroundColor: '#D61D24',
    borderRadius: 10,
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },

  listItems:{
    marginTop: 16,
  },

  item: {
    borderBottomColor: '#CCC',
    borderBottomWidth: 1,
    padding: 8,
  },

  address: {
    marginTop: 32,
  },
  
  addressTitle: {
    color: '#322153',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  },

  addressContent: {
    fontFamily: 'Roboto_400Regular',
    lineHeight: 24,
    color: '#6C6C80'
  },

  footer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: '#999',
    paddingVertical: 8,
    paddingHorizontal: 32,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    backgroundColor: '#F0F0F5',
  },
  
 
  button: {
    width: '25%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    color: '#999',
    fontSize: 12,
    fontFamily: 'Roboto_500Medium',
    marginTop: 8,
  },

  buttonTextActive: {
    color: '#34CB79',
    fontSize: 12,
    fontFamily: 'Roboto_500Medium',
    marginTop: 8,
  },
  });