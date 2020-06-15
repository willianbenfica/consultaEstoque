import React from 'react';
import { NavigationContainer} from '@react-navigation/native';
import { Feather as Icon, FontAwesome} from '@expo/vector-icons'
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Home from './pages/Home';
import Grupos from './pages/Grupos';
import Atualizar from './pages/Atualizar';
import Configucaoes from './pages/Configucaoes';
import Detail from './pages/Detail';
import GroupDetail from './pages/GroupDetail';

const AppStack = createStackNavigator();
const AppTap = createBottomTabNavigator();

const Routes = () => {
    function HomeStackScreen(){
        return (
        <AppStack.Navigator 
            headerMode="none" 
            screenOptions={{
                cardStyle: {
                    backgroundColor: '#F0F0F5',
                }
            }}>
            <AppStack.Screen name="Pesquisar" component={Home}/>
            <AppStack.Screen name="Produto" component={Detail}/>
          </AppStack.Navigator>
        );
      }

      function GroupStackScreen(){
        return (
        <AppStack.Navigator 
            headerMode="none" 
            screenOptions={{
                cardStyle: {
                    backgroundColor: '#F0F0F5',
                }
            }}>
            <AppStack.Screen name="Grupos" component={Grupos}/>
            <AppStack.Screen name="GroupDetail" component={GroupDetail}/>
            <AppStack.Screen name="ProductGroupDetail" component={Detail}/>
          </AppStack.Navigator>
        );
      }
      



    return (
        <NavigationContainer>
            <AppTap.Navigator 
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    if (route.name === 'Pesquisar') {
                        iconName = 'search';
                    } else if (route.name === 'Grupos') {
                        iconName = 'sitemap';
                    } else if (route.name === 'Atualizar') {
                        iconName = 'refresh';
                    } else if (route.name === 'Cofigurações') {
                        iconName = 'cogs';
                    }
                    return <FontAwesome name={iconName} size={size} color={color} />;
                    },
                })}
                tabBarOptions={{
                    activeTintColor: '#D61D24',
                    inactiveTintColor: 'gray',
                }}
                    >
                <AppTap.Screen name="Pesquisar" component={HomeStackScreen} />
                <AppTap.Screen name="Grupos" component={GroupStackScreen} />
                <AppTap.Screen name="Atualizar" component={Atualizar} />
                <AppTap.Screen name="Cofigurações" component={Configucaoes}  />
            </AppTap.Navigator>
        </NavigationContainer>
    );
}

export default Routes;