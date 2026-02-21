import React, { Component } from 'react'
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
export class Dues extends Component {
  render() {
    return (
      <ScrollView>
        <View>
          {/* <Image style={styles.userImg} source={require("../assets/vipul.jpeg")}/> */}
        </View>
        <View style={styles.actionCard}>

          <MaterialIcons style={{ height: 50, width: 50 }} name="call" size={50} color="#000" />
          <MaterialIcons style={{ height: 50, width: 50 }} name="message" size={50} color="#000" />

        </View>
        <ScrollView>
          <Text style={styles.dueslist}>No Dues </Text>

        </ScrollView>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  userImg: {
    width: "100%",
    height: 300,
  },
  actionCard: {
    width: "100%",
    borderWidth: 1,
    borderRadius: 30,
    borderColor: "#dadada",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    margin: 10,
    padding: 10,
    height: 50,


  },
  dueslist: {
    fontSize: 19,
    fontWeight: "bold",

  }

})

export default Dues
