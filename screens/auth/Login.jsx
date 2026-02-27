import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, Alert, ActivityIndicator } from 'react-native';
import { PageBody } from '../../source/layout/Layout';
import useTheme from '../../hooks/useTheme';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';

const Login = () => {
  const color = useTheme();
  const navigation = useNavigation();
  const [loginForm,setLoginForm]= useState({})
  const [loading,setLoading] = useState(false)
  const handlePress=()=>{
    setLoading(true)
    if(! loginForm.email || ! loginForm.password) {Alert.alert("Please fill all the fields"); return;}

    
signInWithEmailAndPassword(getAuth(), loginForm.email, loginForm.password)
  .then(() => {
    console.log(' signed in!');
    setLoading(false)
    navigation.navigate("Home");
  })
  .catch(error => {
    setLoading(false)

    if (error.code === 'auth/email-already-in-use') {
      console.log('That email address is already in use!');
    }

    if (error.code === 'auth/invalid-email') {
      console.log('That email address is invalid!');
    }

    console.error(error);
  });


  }
  return (
    <PageBody style={styles.container}>
      <View style={styles.formContainer}>

     <TextInput onChangeText={(text)=> setLoginForm({...loginForm,email:text})} value={loginForm.email} style={[{borderColor:color.borderColor, borderRadius:color.borderRadius,  color:color.text}, styles.inputBox]} placeholder="E-Mail" />
     <TextInput onChangeText={(text)=>setLoginForm({...loginForm,password:text})} value={loginForm.password} style={[{borderColor:color.borderColor, borderRadius:color.borderRadius, color:color.text}, styles.inputBox]} placeholder="Password" />
     <Pressable style={[styles.inputBox ,{borderColor:color.borderColor,borderRadius:color.borderRadius, height:40 , justifyContent:"center"}]} onPress={handlePress}>
       <Text style={[{color:color.text , fontSize:23 , textAlign:"center",}]}>Login</Text>
     </Pressable>
      </View>

      {loading? 
      <View style={styles.ActivityIndicator}>
      <ActivityIndicator size={"large"}/>
    </View>
      :
      <Text></Text>
    }
    </PageBody>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // padding:20,
  },
  formContainer:{
    gap:10,
    width:"100%",
    padding:10
  },
  inputBox:{
    borderWidth:.3,
  },
  
  ActivityIndicator:{
    backgroundColor:"rgba(0, 0, 0,.3)",
    ...StyleSheet.absoluteFill,
    justifyContent:"center",
    alignItems:"center",
    width:"100%"
  }
});

export default Login;