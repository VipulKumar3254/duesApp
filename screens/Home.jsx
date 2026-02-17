import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Dimensions } from 'react-native';
import { Avatar, Button, Card, } from 'react-native-paper';
import LinearGradient from "react-native-linear-gradient";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { changeTheme } from '../redux/theme/themeReducer';

import { useColorScheme } from 'react-native';


const gap = 2;
const padding = 10;

const screenWidth = Dimensions.get("window").width-(gap + padding*2); // 10 is the gap and padding on both sides

const Home = () => {
  const dispath= useDispatch();
  const navigation = useNavigation();
  const colorSchme = useColorScheme();
  const isDark= colorSchme ==="dark"
  if(isDark) dispath(changeTheme("dark"))
  console.log("color shcme is ",colorSchme);

  

  const colors = {
  background: isDark ? "#121212" : "#ffffff",
  card: isDark ? "#1e1e1e" : "#ffffff",
  text: isDark ? "#ffffff" : "#000000",
  buttonBorder: isDark ? "#4caf50" : "green"
};


  const handlePress = () => {
    navigation.navigate("Users")
    
  }
  return (
    <ScrollView style={{backgroundColor:colors.background}}>
       <View style={styles.Buttonscontainer}>

          <Pressable style={styles.button} onPress={handlePress}>
            <Text style={styles.mainButton}>Users</Text>
          </Pressable>
          <Pressable style={styles.button} onPress={() => navigation.navigate("Notices")}>
            <Text style={styles.mainButton}>Notices</Text>
          </Pressable>
          <Pressable style={styles.button} onPress={()=> navigation.navigate("AddUser")}>
        <Text style={styles.mainButton}>Add User</Text>
        </Pressable>
        </View>

      <View style={styles.MainContainer}>
        <View style={{marginTop:5,padding:5}}>
            <LinearGradient
            colors={["#102f04", "#098a1d"]}
            style={[styles.fullScreenCard,]}
          >
            <Text variant="titleLarge" style={styles.title}>Total Outstanding Amount</Text>
            <Text variant="bodyMedium" style={[styles.count ,{fontSize:90,lineHeight:100}]}>20000</Text>
            {/* <View style={styles.searchButton}>

              <Icon name="search" size={30} color="black" />;
            </View> */}

          </LinearGradient>
        </View>
        <View style={{padding:5}}>
            <LinearGradient
            colors={["#102f04", "#098a1d"]}
            style={styles.fullScreenCard}
          >
            <Text variant="titleLarge" style={styles.title}>OverDue Amount</Text>
            <Text variant="bodyMedium" style={[styles.count ,{fontSize:90,lineHeight:100}]}>16478</Text>
            {/* <View style={styles.searchButton}>

              <Icon name="search" size={30} color="black" />;
            </View> */}

          </LinearGradient>
        </View>
     
        <View  style={styles.GradientCardContainer}>
              <Pressable onPress={()=>navigation.navigate("Users")}>

          <LinearGradient
            colors={["#102f04", "#098a1d"]}
            style={[styles.gradientCard, {marginRight: 5}]}
            >
            <Text variant="titleLarge" style={ styles.title}>Total Users</Text>
            <Text variant="bodyMedium" style={styles.count}>30</Text>
            <View style={styles.searchButton}>
              <Pressable onPress={()=>navigation.navigate("SearchUser")}>

              <Icon name="search" size={30} color="black" />;
              </Pressable>
            </View>

          </LinearGradient>
            </Pressable>

          <LinearGradient
            colors={["#102f04", "#098a1d"]}
            style={styles.gradientCard}
          >
            <Text variant="titleLarge" style={styles.title}>Month Collection</Text>
            <Text variant="bodyMedium" style={styles.count}>26</Text>
            {/* <View style={styles.searchButton}>

              <Icon name="search" size={30} color="black" />;
            </View> */}

          </LinearGradient>
        </View>




       
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  MainContainer: {
    flex:1,
    // width: "100%",
    // borderWidth:1,
  

  },
  Buttonscontainer: {
    flex: 1,
    flexDirection: "row",
    gap: 10,

  },
  button: {
    width: 80,
    height: 40,
    marginStart: 10,
    marginTop: 10,

    borderColor: "green",
    borderWidth:1,
    borderRadius: 15,
    // backgroundColor: "green",

  },
  mainButton: {
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    color: 'green',
    // fontSize:17,
    // backgroundColor:"black",

  },
  searchButton: {
    position: "absolute",
    top: 7,
    right: 8,
    height: 35,
    width: 35,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  // GradientCardContainer: {
  // flex: 1,
  // flexDirection: "row", 
  // gap: 6,
  //   padding: 10,
  // },
  // gradientCard: {
  //   flex:1,
  //   borderRadius: 10,
  //   // width: screenWidth/2,
  //   // borderRadius: 10,
  // },
  GradientCardContainer: {
  flexDirection: "row",
  padding: padding,
  gap: gap,

},

fullScreenCard:{
  width:"100%",
  height:150,
  padding:10,
  elevation:10,
  shadowColor:"#000",
  shadowOpacity:1,
  shadowRadius:2,
  borderRadius:10
},
gradientCard: {
   width: screenWidth/2,

  borderRadius: 10,
  padding: 10, // VERY IMPORTANT (internal spacing)
  minHeight: 120, // gives proper height
  elevation: 15,
shadowColor: "#000",
shadowOpacity: 1,
shadowRadius: 5,

},

title: {

  fontSize: 16,
  color: "white",
},

count: {
  fontSize: 60,
  color: "white",
  fontWeight: "bold",
},



});

export default Home;