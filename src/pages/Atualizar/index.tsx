import React,  {useState, useEffect} from 'react';
import { Feather as Icon, FontAwesome} from '@expo/vector-icons'
import { useFocusEffect } from '@react-navigation/native';
import { View, ImageBackground, StyleSheet, Text, SafeAreaView, Platform } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import axios from 'axios';
import * as SQLite from 'expo-sqlite';


interface produtos { 
  cd: string;
  nm: string;
  gp: string;
  un: string;
  e1: string;
  pr: string;
  e2: string;
  e3: string;
  e5: string;
  ap: string;
  
}


const Atualizar = () => {

      const [msgConexao, setMsgConexao] = useState<string>('');
      const [msgDatabase, setMsgDatabase] = useState<string>('');
      const [msgSave, setMsgSave] = useState<string>('');
      const [msgSucesso, setMsgSucesso] = useState<string>('');
      const [servidor, setServidor] = useState<string>('');
      const [chaveAcesso, setChaveAcesso] = useState<string>('');

      const db = SQLite.openDatabase('data.db');

      useEffect(() => {
          setMsgConexao('');
          setMsgDatabase('');
          setMsgSave('');
          setMsgSucesso('');
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
      
      async function getProdutosAxios(){

        setMsgConexao('');
        setMsgDatabase('');
        setMsgSave('');
        setMsgSucesso('');

        try{
         const response = await axios.get<produtos[]>(`${servidor}?chave=${chaveAcesso}&page=home`)
              .then((response => {
                      return (response.data);
                })
              );
              setMsgConexao(`Conexão efetuada com sucesso, aguarde...`);
          let contprodutos = 0;
          
          setMsgDatabase(`Abrindo conexão com a base de dados, aguarde...`);

          var date = new Date();
          var data = date.getUTCFullYear() + '-' +
              ('00' + (date.getUTCMonth()+1)).slice(-2) + '-' +
              ('00' + date.getUTCDate()).slice(-2) + ' ' + 
              ('00' + date.getUTCHours()).slice(-2) + ':' + 
              ('00' + date.getUTCMinutes()).slice(-2) + ':' + 
              ('00' + date.getUTCSeconds()).slice(-2);

          db.transaction(
            tx => {
              tx.executeSql("CREATE TABLE IF NOT EXISTS produtos (codigo VACHAR PRIMARY KEY NOT NULL, nome VARCHAR, grupo VARCHAR, unidade VARCHAR, est1 DECIMAL (12, 2), preco DECIMAL (12, 2), est2 DECIMAL (12, 2), est3 DECIMAL (12, 2), est5 DECIMAL (12, 2), aplicacao TEXT, dtimportacao DATETIME);");
              tx.executeSql("DELETE FROM produtos;");
              
             try{
              response.map( async produto => {
                    tx.executeSql("INSERT INTO produtos(codigo, nome, grupo, unidade, est1, preco, est2, est3, est5, aplicacao, dtimportacao ) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", 
                    [produto.cd, produto.nm , produto.gp, produto.un, produto.e1, produto.pr, produto.e2, produto.e3, produto.e5, produto.ap, data]);
                  contprodutos ++;
                  setMsgSave(`Salvando ${contprodutos} de ${response.length} produtos, aguarde...`);
                })
           
                tx.executeSql('select count(*) from produtos', [], (_, {rows})=>{
                  setMsgSucesso(`Dados gravados com Sucesso.`);
                })
              }catch(err){
                setMsgSucesso(`Erro ao gravar os dados Verifique o endereço do servidor e a chave de segurança.`);
              }
              });
              
              
          

          }catch(error){
            setMsgConexao(`Erro ao acessar o WebService, Verifique sua conexão com a internet.`);
            return;
          }
       }
       


    return (
      <SafeAreaView style={{flex: 1, paddingTop: Platform.OS === 'ios' ? 0 : 24}}>
        <ImageBackground source={require('../../assets/home-background.png')} imageStyle={{ width: 274, height: 368 }} style={styles.containerBackground}>
        <Text style={styles.containerTitle}>Atualizar Dados</Text>
        <View style={styles.container}>
              <RectButton style={styles.button} onPress={() => getProdutosAxios()}>
                    <Text>
                        <FontAwesome name="refresh" color="#FFF" size={20}/>
                    </Text>
                    <Text style={styles.buttonText}>
                        Atualizar Dados
                    </Text>
                </RectButton>
                <Text style={styles.addressContent}>{msgConexao}</Text>
                <Text style={styles.addressContent}>{msgDatabase}</Text>
                <Text style={styles.addressContent}>{msgSave}</Text>
                <Text style={styles.addressContent}>{msgSucesso}</Text>
        </View>
        
        </ImageBackground>
        </SafeAreaView>
    );
};

export default Atualizar;



const styles = StyleSheet.create({
  
  containerBackground: {
    flex: 1,
    paddingTop: 8,
  },
  
  container: {
    flex: 1,
    paddingHorizontal: 32,
  },

  containerTitle: {
    color: '#D61D24',
    fontFamily: 'Roboto_500Medium',
    fontSize: 32,
    marginLeft: 8,
    paddingHorizontal: 32,
    marginTop: 8,
  },

  listItems:{
    marginTop: 16,
  },

  item: {
    backgroundColor: '#F0F0F5',
    borderBottomColor: '#CCC',
    borderBottomWidth: 1,
    padding: 8,
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
  button: {
    marginVertical: 32,
    width: '100%',
    backgroundColor: '#D61D24',
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