import React, {useEffect, useState} from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {View, StyleSheet, TouchableOpacity, Text, SafeAreaView, ImageBackground, ScrollView, Alert, Platform} from 'react-native';
import { Feather as Icon, FontAwesome } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as SQLite from 'expo-sqlite';
import axios from 'axios';

interface Params {
  productCode: string;
}

interface Product{
  codigo: string;
  est1: string;
  est2: string;
  est3: string;
  est5: string;
  grupo: string;
  nome: string;
  preco: string;
  unidade: string;
  aplicacao: string;
}

interface ProductArray{
  cd: string;
  e1: string;
  e2: string;
  e3: string;
  e5: string;
  gp: string;
  nm: string;
  pr: string;
  un: string;
  ap: string;
}

const Detail = () =>{

    const [product, setProduct] = useState<Product>();
    const [servidor, setServidor] = useState<string>('');
    const [chaveAcesso, setChaveAcesso] = useState<string>('');
    const navigation = useNavigation();
    const route = useRoute();

    const db = SQLite.openDatabase('data.db');

    const routeParams = route.params as Params;

    useEffect(() => {
      db.transaction(
        tx => {
            tx.executeSql("SELECT * FROM produtos WHERE codigo = '"+ routeParams.productCode +"' LIMIT 1", [], (_, {rows})=>{
                const data = rows.item(0);
                setProduct(data); 
          });
      });
    },[]);

    useFocusEffect(
      React.useCallback(() => {
        db.transaction(
          tx => {
              tx.executeSql("SELECT servidor, chave FROM configuracoes;", [], (_, {rows})=>{
                  if(rows.length >0){
                      setServidor(String(rows.item(0).servidor));
                      setChaveAcesso(String(rows.item(0).chave)); 
                  }
              });
        });
      }, [])
    );

    async function handleUpdateProduct(){
      try{
        const responseProduct = await axios.get<ProductArray[]>(`${servidor}?chave=${chaveAcesso}&page=detail&cd=${routeParams.productCode}`)
             .then((response => {
                  return(response.data[0]);
               })
             );
         
          var date = new Date();
          var data = date.getUTCFullYear() + '-' +
              ('00' + (date.getUTCMonth()+1)).slice(-2) + '-' +
              ('00' + date.getUTCDate()).slice(-2) + ' ' + 
              ('00' + date.getUTCHours()).slice(-2) + ':' + 
              ('00' + date.getUTCMinutes()).slice(-2) + ':' + 
              ('00' + date.getUTCSeconds()).slice(-2);
          console.log(responseProduct);
          db.transaction(
            tx => {          
                  tx.executeSql("UPDATE produtos SET nome = ?, grupo = ?, unidade = ?, est1 = ?, preco = ?, est2 = ?, est3 = ?, est5 = ?, aplicacao = ?, dtimportacao = ? WHERE codigo = '" + routeParams.productCode + "'", 
                  [responseProduct.nm ,responseProduct.gp, responseProduct.un, responseProduct.e1, responseProduct.pr, responseProduct.e2, responseProduct.e3, responseProduct.e5, responseProduct.ap, data]);
                  Alert.alert(`Atualizado com sucesso.`);
            });

            setProduct({
              codigo: routeParams.productCode,
              nome: responseProduct.nm,
              grupo: responseProduct.gp,
              unidade: responseProduct.un,
              preco: responseProduct.pr,
              est1: responseProduct.e1,
              est2: responseProduct.e2,
              est3: responseProduct.e3,
              est5: responseProduct.e5,
              aplicacao: responseProduct.ap,
            });

        }catch(error){
          Alert.alert(`Erro ao atualizar, Verifique sua conexão com a internet.`);
           return;
         }
    }

    function handleNavigateBack(){
        navigation.goBack();
    }

    if(!product){
      return null;
    }
    return (
      <SafeAreaView style={{flex: 1, paddingTop: Platform.OS === 'ios' ? 0 : 24}}>
          <ImageBackground source={require('../../assets/home-background.png')} imageStyle={{ width: 274, height: 368 }} style={styles.containerBackground}>
          
            <View style={styles.container}>
                <View style={{flexDirection: 'row', justifyContent:'space-between'}}>
                  <TouchableOpacity onPress={handleNavigateBack}>
                      <Icon name="arrow-left" size={20} color="#D61D24" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleUpdateProduct}>
                      <FontAwesome name="refresh" size={20} color="#D61D24" />
                  </TouchableOpacity>
                </View>
                <ScrollView showsVerticalScrollIndicator={false}>
                  <View style={{flexDirection:'row', justifyContent: 'space-between'}}>
                    <View style={styles.address}>
                        <Text style={styles.addressTitle}>Código:</Text>
                        <Text style={styles.addressContent}>{product.codigo}</Text>
                    </View>
                    <View style={styles.address}>
                        <Text style={styles.addressTitle}>Unidade:</Text>
                        <Text style={styles.addressContent}>{product.unidade}</Text>
                    </View>
                  </View>
                  <View style={styles.line}></View>
                  
                  <Text style={styles.pointItems}>Produto</Text>
                  <Text style={styles.pointName}>{product.nome}</Text>
                  <View style={styles.line}></View>
                  
                  <View style={{paddingVertical: 8,}}>
                      <Text style={styles.addressTitle}>Grupo:</Text>
                      <Text style={styles.addressContent}>{product.grupo}</Text>
                  </View>
                  <View style={styles.line}></View>
                  <Text style={styles.pointItems}>Preço</Text>
                  <Text style={styles.pointName}>R$ {product.preco}</Text>
                  <View style={styles.line}></View>

                  <Text style={styles.pointItems}>Estoque</Text>
                  <View style={{paddingHorizontal: 32, paddingBottom: 8,}}>
                    <View style={[styles.address, {paddingVertical: 4,}]}>
                        <Text style={styles.addressTitleEstoque}>Matriz: </Text>
                        <Text style={styles.addressContent}>{product.est1}</Text>
                    </View>
                    <View style={styles.line}></View>
                    <View style={[styles.address, {paddingVertical: 4,}]}>
                        <Text style={styles.addressTitleEstoque}>Rio Pomba: </Text>
                        <Text style={styles.addressContent}>{product.est2}</Text>
                    </View>
                    <View style={styles.line}></View>
                    <View style={[styles.address, {paddingVertical: 4,}]}>
                        <Text style={styles.addressTitleEstoque}>Ag Máquinas: </Text>
                        <Text style={styles.addressContent}>{product.est3}</Text>
                    </View>
                    <View style={styles.line}></View>
                    <View style={[styles.address, {paddingVertical: 4,}]}>
                        <Text style={styles.addressTitleEstoque}>Ruralmaq: </Text>
                        <Text style={styles.addressContent}>{product.est5}</Text>
                    </View>
                  </View>
                  <View style={styles.line}></View>

                  <Text style={styles.pointItems}>Aplicação</Text>
                  <Text style={[styles.addressContent, {fontSize: 14, marginTop: 8,}]}>{product.aplicacao}</Text>
                  </ScrollView>
            </View>
         
        </ImageBackground>
        </SafeAreaView>
    )
}

export default Detail;


const styles = StyleSheet.create({

    containerBackground: {
      flex: 1,
      paddingTop: 8,
    },

    line:{
      borderBottomColor: '#CCC',
      borderBottomWidth: 1,
    },
    container: {
      flex: 1,
      padding: 32,
    },
  
    pointImage: {
      width: '100%',
      height: 120,
      resizeMode: 'cover',
      borderRadius: 10,
      marginTop: 32,
    },
  
    pointName: {
      color: '#322153',
      fontSize: 22,
      fontFamily: 'Ubuntu_700Bold',
      paddingVertical: 8,
    },
  
    pointItems: {
      fontFamily: 'Roboto_400Regular',
      fontSize: 16,
      marginTop: 8,
      color: '#6C6C80'
    },
  
    address: {
      paddingVertical: 16,
      flexDirection: 'row',
      alignItems: 'center',
    },
    
    addressTitle: {
      color: '#322153',
      fontFamily: 'Roboto_500Medium',
      fontSize: 20,
    },

    addressTitleEstoque: {
      color: '#322153',
      fontFamily: 'Roboto_500Medium',
      fontSize: 20,
      width: '50%',
      justifyContent:'flex-end',
    },
  
    addressContent: {
      fontFamily: 'Roboto_400Regular',
      color: '#6C6C80',
      fontSize: 20,
      marginLeft: 8,
    },
  
    footer: {
      borderTopWidth: StyleSheet.hairlineWidth,
      borderColor: '#999',
      paddingVertical: 20,
      paddingHorizontal: 32,
      flexDirection: 'row',
      justifyContent: 'space-between'
    },
    
    button: {
      width: '48%',
      backgroundColor: '#34CB79',
      borderRadius: 10,
      height: 50,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center'
    },
  
    buttonText: {
      marginLeft: 8,
      color: '#FFF',
      fontSize: 16,
      fontFamily: 'Roboto_500Medium',
    },
  });