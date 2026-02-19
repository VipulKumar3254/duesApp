import { PageBody } from '../source/layout/Layout';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, Image, Pressable } from 'react-native';
import { Searchbar } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import useTheme from '../hooks/useTheme';
const duesCollection = firestore().collection('dues');



const Users = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [userData, setUserData] = useState([]);
  const navigation = useNavigation()
  const color = useTheme();

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
    console.log(realdata)

  }
  useEffect(() => {
    fetchData();
  }, [])
  return (
    <PageBody>

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


              <View style={{ backgroundColor:color.background,borderColor:color.borderColor,elevation:1, borderWidth:.3, padding: 10, borderRadius: 20, flexDirection: "row", alignItems: "center",  }}>

                <Image style={{ height: 60, width: 60, borderRadius: 60 }} source={{ uri: item.profile }} />

                <View style={{ alignSelf: 'center', padding: 6 }}>

                  {/* <Text style={[{color:color.text},styles.title]}>name</Text> */}
                  <Text style={[{color:color.text},styles.title]}>{item.name}</Text>
                </View>
              </View>
            </Pressable>
          </View>
        )}
      />

    </View>
</PageBody>
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
    fontSize: 32,
    fontWeight: "semibold",
    fontVariant: "small-caps",
    marginStart:6

  },

});

export default Users;