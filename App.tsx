import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { Component } from 'react'
import { Text, View } from 'react-native'
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
// import { MaterialIcons} from '@react-native-vector-icons/material-design-icons';

  const Stack = createNativeStackNavigator();

  function RootStack() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={Home} options={{
        title:"Dashboard",
      }} />
      <Stack.Screen name="Profile" 
      options={{headerShown:false}} component={profile} />
      <Stack.Screen name="Dues" component={Dues} />
      <Stack.Screen name="Users" component={Users} />
      <Stack.Screen name="Notices" component={Notices} />
      <Stack.Screen name="SearchUser" component={SearchUser} />
      <Stack.Screen name="AddUser" component={AddUser} />
      <Stack.Screen name="AddDue" component={AddDue} />
      <Stack.Screen name="DueDetail" component={DueDetail} />
      
    </Stack.Navigator>
  );
}
export class App extends Component {



  render() {
    return (
    <SafeAreaProvider>
      <NavigationContainer>
        <RootStack/>
      </NavigationContainer>

    </SafeAreaProvider>
    )
  }
}

export default App
