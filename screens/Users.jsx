import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, Image, Pressable } from 'react-native';
import { Searchbar } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
const duesCollection = firestore().collection('dues');


const data = [{
  id: 1,
  name: "John Doe",
  profile: require("../assets/vipul.jpeg"),
  dues: 200
},
{
  id: 2,
  name: "Jane Doe",
  profile: require("../assets/vipul.jpeg"),
  dues: 300
}, {
  id: 3,
  name: "John Doe",
  profile: require("../assets/vipul.jpeg"),
  dues: 200
},
{
  id: 4,
  name: "Jane Doe",
  profile: require("../assets/vipul.jpeg"),
  dues: 300
}

]
const Users = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [userData, setUserData] = useState([]);
  const navigation = useNavigation()

  const filterUser= ()=>{
    console.log(searchQuery)
    const filteredUser = userData.filter((user)=>user?.name
    ?.toLowerCase()
    .includes(searchQuery.trim().toLowerCase()))
    setUserData(filteredUser)
  }
  
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) {
       filterUser();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchData = async () => {
    const dues = await firestore().collection('duesUsers').get();
    // console.log(dues.docs[0]._data.name)
    const realdata = dues.docs.map((doc) => {
      return (
        {
          id: doc.id,
          ...doc.data()
        }
      )
    })
    setUserData(realdata)

  }
  useEffect(() => {
    fetchData();
  }, [])
  return (
    <View style={styles.container}>

      {/* <View style={styles.searchBar}> */}
      <Searchbar placeholder="Search.."
        onChangeText={setSearchQuery}
        value={searchQuery}
      />

      {/* </View> */}
      <FlatList
        data={userData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.mainContainer}>
            <Pressable onPress={()=>navigation.navigate("Profile",{userId:item.id})}>


              <View style={{ backgroundColor: "white", padding: 10, borderRadius: 10, flexDirection: "row", alignItems: "center", shadowColor: "#000000", }}>

                <Image style={{ height: 80, width: 80, borderRadius: 60 }} source={{ uri: item.profile }} />

                <View style={{ alignSelf: 'center', padding: 6 }}>

                  <Text style={styles.title}>{item.name}</Text>
                  <Text style={styles.dues}>Dues: {item.dues}</Text>
                </View>
              </View>
            </Pressable>
          </View>
        )}
      />

    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    padding: 5,
  },

  container: {
    flex: 1
  },
  title: {
    fontSize: 22,
    fontWeight: "semibold",
    fontVariant: "small-caps"
  },
  dues: {
    fontSize: 18,
    color: "red",
  }
});

export default Users;