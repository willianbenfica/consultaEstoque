import React,  {useState, useEffect} from 'react';
import { Feather as Icon, FontAwesome} from '@expo/vector-icons'
import { View, ImageBackground, StyleSheet, Text, SafeAreaView, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as SQLite from 'expo-sqlite';

interface produtos { 
  cd: string;
  nm: string;
  gp: string;
  pr: string;
}

interface Params {
    grupo: string;
  }

const GroupDetail = () => {

    const [produtos, setProdutos] = useState<produtos[]>([]);
    const navigation = useNavigation();

    const route = useRoute();

    const db = SQLite.openDatabase('data.db');

    const routeParams = route.params as Params;

    useEffect(() => {
        db.transaction(
          tx => {
            tx.executeSql("SELECT codigo as cd, nome as nm, grupo as gp, preco as pr FROM produtos WHERE grupo = '"+ routeParams.grupo +"'", [], (_, {rows})=>{
              const data = [];
              for(let i=0; i<rows.length; i++){
                data.push(rows.item(i));
              }
              setProdutos(data); 
            });
        });
    },[]);
    

    function handleProductDetail(code: string){
      navigation.navigate('ProductGroupDetail', { productCode : code });
    }

    function handleNavigateBack(){
        navigation.goBack();
    }


    return (
      <SafeAreaView style={{flex: 1, paddingTop: Platform.OS === 'ios' ? 0 : 24}}>
        <ImageBackground source={require('../../assets/home-background.png')} imageStyle={{ width: 274, height: 368 }} style={styles.containerBackground}>
        <TouchableOpacity onPress={handleNavigateBack} style={styles.containerTitle}>
            <Icon name="arrow-left" size={20} color="#D61D24" />
            <Text style={styles.containerTitle}>{routeParams.grupo}</Text>
        </TouchableOpacity>
        
        
        <View style={styles.container}>
            {produtos && (
               <View>
               <ScrollView showsVerticalScrollIndicator={false}>
                 {produtos.map(produto => (
                   <TouchableOpacity onPress={()=>{handleProductDetail(produto.cd)}} style={styles.item} key={produto.cd}>
                   <Text style={styles.addressTitle}>{`${produto.cd} - ${produto.nm}`}</Text>
                   <Text style={styles.addressContent}>{`Preço: ${produto.pr}`}</Text>
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

export default GroupDetail;



const styles = StyleSheet.create({
  
  containerBackground: {
    flex: 1,
    paddingTop: 8,
  },

  containerTitle: {
    color: '#D61D24',
    fontFamily: 'Roboto_500Medium',
    fontSize: 20,
    marginLeft: 8,
    paddingHorizontal: 32,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  container: {
    flex: 1,
    paddingHorizontal: 32,
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
    backgroundColor: '#34CB79',
    borderRadius: 10,
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
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