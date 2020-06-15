import React,  {useState, useEffect} from 'react';
import { Feather as Icon, FontAwesome} from '@expo/vector-icons'
import { View, ImageBackground, TextInput, StyleSheet, Text, SafeAreaView, Platform, Alert, Keyboard } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import * as SQLite from 'expo-sqlite';

const Configuracoes = () => {

    const [servidor, setServidor] = useState<string>('');
    const [representante, setRepresentante] = useState<string>('');
    const [chaveAcesso, setChaveAcesso] = useState<string>('');
    const navigation = useNavigation();

    const db = SQLite.openDatabase('data.db');
   
    useEffect(() => {
        db.transaction(
            tx => {
                tx.executeSql("CREATE TABLE IF NOT EXISTS configuracoes (id int PRIMARY KEY NOT NULL, servidor VARCHAR, representante VARCHAR, chave VARCHAR);");
                tx.executeSql("SELECT servidor, representante, chave FROM configuracoes;", [], (_, {rows})=>{
                    if(rows.length >0){
                        setServidor(String(rows.item(0).servidor));
                        setRepresentante(String(rows.item(0).representante));
                        setChaveAcesso(String(rows.item(0).chave)); 
                    }

                });
          });
    },[]);

    function gravaConfiguracao(){
        db.transaction(tx => {
                    tx.executeSql("INSERT INTO configuracoes(id, servidor, representante, chave) VALUES(1, ?, ?, ?)", [servidor, representante, chaveAcesso]);
            });
        db.transaction(tx => {
                    tx.executeSql("UPDATE configuracoes SET servidor = ?, representante = ?, chave = ? WHERE id = 1", [servidor, representante, chaveAcesso]);
            });

        Alert.alert(`Atualizado com sucesso.`); 
        Keyboard.dismiss();
    }

    return (
      <SafeAreaView style={{flex: 1, paddingTop: Platform.OS === 'ios' ? 0 : 24}}>
        <ImageBackground source={require('../../assets/home-background.png')} imageStyle={{ width: 274, height: 368 }} style={styles.containerBackground}>
        <Text style={styles.containerTitle}>Configurações</Text>
        <View style={styles.container}>
              <Text style={styles.title}>Servidor</Text>
              <TextInput
                    style={styles.input}
                    placeholder="Digite a URL do servidor"
                    autoCorrect={false}
                    value={servidor}
                    onChangeText={setServidor}
                />
                <Text style={styles.title}>Nome do Representante</Text>
              <TextInput
                    style={styles.input}
                    placeholder="Digite o nome do Representante"
                    autoCorrect={false}
                    value={representante}
                    onChangeText={setRepresentante}
                />
                <Text style={styles.title}>Chave de Acesso</Text>
              <TextInput
                    style={styles.input}
                    placeholder="Digite a chave de acesso"
                    autoCorrect={false}
                    value={chaveAcesso}
                    onChangeText={setChaveAcesso}
                    secureTextEntry={true}
                />
                <RectButton style={styles.seachButton} onPress={gravaConfiguracao}>
                    <Icon name="search" color="#FFF" size={20}/>
                    <Text style={{color: '#FFF', marginLeft:8,}}>Atualizar</Text>
                </RectButton>

        </View>
        </ImageBackground>
        </SafeAreaView>
    );
};

export default Configuracoes;



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

  title: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 16,
    marginTop: 8,
    color: '#6C6C80'
  },

  input: {
    marginVertical: 8,
    height: 50,
    backgroundColor: '#FFF',
    borderRadius: 10,
    borderColor: '#CCC',
    borderWidth: 1,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  seachButton: {
    marginVertical: 8,
    backgroundColor: '#D61D24',
    borderRadius: 10,
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  });