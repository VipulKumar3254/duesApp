import { PageBody } from "../source/layout/Layout"
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Dimensions } from 'react-native';
import { Avatar, Button, Card, } from 'react-native-paper';
import LinearGradient from "react-native-linear-gradient";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSelector } from 'react-redux';
import { changeTheme } from '../redux/theme/themeReducer';
import useTheme from "../hooks/useTheme"



const gap = 2;
const padding = 10;

const screenWidth = Dimensions.get("window").width - (gap + padding * 2); // 10 is the gap and padding on both sides

const Home = () => {

  const navigation = useNavigation();

  const color = useTheme();







  const handlePress = () => {
    navigation.navigate("Users")

  }
  return (
    <PageBody>

      <ScrollView style={{ backgroundColor: color.background }}>
        <View style={styles.Buttonscontainer}>

          <Pressable style={styles.button} onPress={handlePress}>
            <Text style={styles.mainButton}>Users</Text>
          </Pressable>
          <Pressable style={styles.button} onPress={() => navigation.navigate("Notices")}>
            <Text style={styles.mainButton}>Notices</Text>
          </Pressable>
          <Pressable style={styles.button} onPress={() => navigation.navigate("AddUser")}>
            <Text style={styles.mainButton}>Add User</Text>
          </Pressable>
        </View>

        <View style={styles.MainContainer}>
          <View style={{ marginTop: 5, padding: 5 }}>
            <View
              style={[{ backgroundColor: color.background, borderColor:color.borderColor, elevation:1 }, styles.fullScreenCard,]}
            >
              <Text variant="titleLarge" style={[{ color: color.text }, styles.title]}>Outstanding Amount</Text>
              <Text variant="bodyMedium" style={[styles.count, { fontSize: 50, lineHeight: 70, color: color.text }]}>20000</Text>
              {/* <View style={styles.searchButton}>

<Icon name="search" size={30} color="black" />;
</View> */}

            </View>
          </View>
          <View style={{ padding: 5 }}>
            <View
              style={[{ backgroundColor: color.background, borderColor:color.borderColor }, styles.fullScreenCard,]}

            >
              <Text variant="titleLarge" style={[{ color: color.text }, styles.title]}>OverDue Amount</Text>
              <Text variant="bodyMedium" style={[styles.count, { fontSize: 50, lineHeight:70, color: color.text }]}>16478</Text>
              {/* <View style={styles.searchButton}>

<Icon name="search" size={30} color="black" />;
</View> */}

            </View>
          </View>

          <View style={styles.GradientCardContainer}>
            <Pressable onPress={() => navigation.navigate("Users")}>

              <View
                style={[{ backgroundColor: color.background , borderColor:color.borderColor}, styles.fullScreenCard,]}

              >
                <Text variant="titleLarge" style={[{ color: color.text }, styles.title]}>Total Users</Text>
                <Text variant="bodyMedium" style={[styles.count, { lineHeight: 70, color: color.text }]}>30</Text>
                <View style={styles.searchButton}>
                  <Pressable onPress={() => navigation.navigate("SearchUser")}>

                    <Icon name="search" size={30} color="black" />
                  </Pressable>
                </View>

              </View>
            </Pressable>

            <View
           
                            style={[{ backgroundColor: color.background , borderColor:color.borderColor}, styles.fullScreenCard,]}

            >
              <Text variant="titleLarge" style={[{ color: color.text }, styles.title]}>Month Collection</Text>
              <Text variant="bodyMedium" style={[styles.count, {  color: color.text }]}>26</Text>
              {/* <View style={styles.searchButton}>

<Icon name="search" size={30} color="black" />;
            </View> */}

            </View>
          </View>





        </View>
      </ScrollView>
    </PageBody>
  );
};

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
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
    borderWidth: 1,
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

  fullScreenCard: {
    width: "100%",
    // height: 100,
    padding: 10,
    elevation: 10,
    borderRadius: 10,
    borderWidth:.3
  },
  gradientCard: {
    width: screenWidth / 2,

    borderRadius: 10,
    padding: 10, // VERY IMPORTANT (internal spacing)
    minHeight: 120, // gives proper height
    elevation: 15,
    shadowColor: "#000",
    shadowOpacity: 1,
    shadowRadius: 5,

  },

  title: {
  },

  count: {
    fontWeight: "400",
    fontSize:50,
    lineHeight:70
  },



});

export default Home;