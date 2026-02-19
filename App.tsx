import { PaperProvider } from 'react-native-paper';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { Component } from 'react'
import { Text, useColorScheme, View } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import profile from "./screens/Profile";
import Dues from "./screens/Dues";
import Home from "./screens/Home";
import Users from "./screens/Users";
import Notices from "./screens/Notices";
import SearchUser from "./screens/SearchUser";
import AddUser from "./screens/AddUser";
import { NavigationContainer } from '@react-navigation/native';
import AddDue from './screens/ProfileScreen/AddDue';
import DueDetail from './screens/ProfileScreen/DueDetail';
import AddCredit from './screens/ProfileScreen/AddCredit';
import { Provider, useDispatch } from 'react-redux';
import { changeTheme } from './redux/theme/themeReducer';
import {lightTheme, darkTheme} from "./theme/color"
import store from "./redux/store"

// import { MaterialIcons} from '@react-native-vector-icons/material-design-icons';

  const Stack = createNativeStackNavigator();

  function RootStack() {
    let color ;
    const colorScheme = useColorScheme();
    const dispath = useDispatch();
  const isDark= colorScheme ==="dark"
      if(isDark) 
    {
      color = darkTheme
      console.log("object")
      dispath(changeTheme(true))
    }
    else{
      color = lightTheme;
    }

  return (
    
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={Home} options={{
        title:"Dashboard",
          headerTintColor:color.text,
         headerStyle: {
      
      backgroundColor: color.background, // white background
    },
      }} />
      <Stack.Screen name="Profile" 
      options={{headerShown:false 
        
      }} component={profile} />
      <Stack.Screen name="Dues"  options={{
        title:"Dues",
          headerTintColor:color.text,
         headerStyle: {
      
      backgroundColor: color.background, // white background
    },
      }}
      component={Dues} />
      <Stack.Screen name="Users"  options={{
        title:"Users",
          headerTintColor:color.text,
         headerStyle: {
      
      backgroundColor: color.background, // white background
    },
      }}component={Users} />
      <Stack.Screen name="Notices"
       options={{
        title:"Notices",
          headerTintColor:color.text,
         headerStyle: {
      
      backgroundColor: color.background, // white background
    },
      }} component={Notices} />
      <Stack.Screen name="SearchUser"
       options={{
        title:"Search User",
          headerTintColor:color.text,
         headerStyle: {
      
      backgroundColor: color.background, // white background
    },
      }} component={SearchUser} />
      <Stack.Screen name="AddUser"
       options={{
        title:"Add User",
          headerTintColor:color.text,
         headerStyle: {
      
      backgroundColor: color.background, // white background
    },
      }} component={AddUser} />
      <Stack.Screen name="AddDue" options={{
        title:"Add Due",
          headerTintColor:color.text,
         headerStyle: {
      
      backgroundColor: color.background, // white background
    },
      }} component={AddDue} />
      <Stack.Screen name="DueDetail"  options={{
        title:"Due Detail",
          headerTintColor:color.text,
         headerStyle: {
      
      backgroundColor: color.background, // white background
    },
      }} component={DueDetail} />
      <Stack.Screen name="AddCredit"  options={{
        title:"Add Credit",
          headerTintColor:color.text,
         headerStyle: {
      
      backgroundColor: color.background, // white background
    },
      }} component={AddCredit} />
      
    </Stack.Navigator>
  );
}
export class App extends Component {



  render() {
    return (
    <SafeAreaProvider>

      <NavigationContainer>
      <Provider store={store}>
      <PaperProvider>
        
        <RootStack/>
      </PaperProvider>
      </Provider>
      </NavigationContainer>

    </SafeAreaProvider>
    )
  }
}

export default App
