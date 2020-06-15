import React,  {useState, useEffect} from 'react';
import { Feather as Icon, FontAwesome} from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { View, ImageBackground, TextInput, StyleSheet, Text, SafeAreaView, TouchableOpacity, ScrollView, Platform} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as SQLite from 'expo-sqlite';

interface grupos { 
  gp: string;
  cont: string;
}

const Grupos = () => {

    const [grupos, setGrupos] = useState<grupos[]>([]);
    const navigation = useNavigation();

    const db = SQLite.openDatabase('data.db');

    useFocusEffect(
        React.useCallback(() => {
            db.transaction(
                tx => {
                    tx.executeSql("SELECT grupo as gp, count(*) as cont FROM produtos GROUP BY grupo ORDER BY grupo", [], (_, {rows})=>{
                        const data = [];
                        for(let i=0; i<rows.length; i++){
                            data.push(rows.item(i));
                        }
                        setGrupos(data); 
                  });
              });
        }, [])
      );

    function handleGroupDetail(code: string){
        navigation.navigate('GroupDetail', { grupo : code });
      }

    return (
      <SafeAreaView style={{flex: 1, paddingTop: Platform.OS === 'ios' ? 0 : 24}}>
        <ImageBackground source={require('../../assets/home-background.png')} imageStyle={{ width: 274, height: 368 }} style={styles.containerBackground}>
        <Text style={styles.containerTitle}>Grupos</Text>
        <View style={styles.container}>
               <View style={styles.listItems}>
               <ScrollView showsVerticalScrollIndicator={false}>
                 {grupos.map(grupo => (
                   <TouchableOpacity onPress={()=>{handleGroupDetail(grupo.gp)}} style={styles.item} key={grupo.gp}>
                   <Text style={styles.addressTitle}>{grupo.gp}</Text>
                   <Text style={styles.addressContent}>{`Qt produtos: ${grupo.cont}`}</Text>
                 </TouchableOpacity> 
                 ))}      
               </ScrollView>
             </View>
        </View>
        </ImageBackground>
        </SafeAreaView>
    );
};

export default Grupos;



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
  });