import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Image,Pressable } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { PageBody } from '../../source/layout/Layout';
import useTheme from '../../hooks/useTheme';
import { useNavigation } from '@react-navigation/native';
import { grey800 } from 'react-native-paper/lib/typescript/styles/themes/v2/colors';

const TotalOutStandingAmount = () => {
  const [dues, setDues] = useState([]);
  const [loading, setLoading] = useState(true);
  const color = useTheme();
  const navigation = useNavigation();

  const fetchGlobalDues = async () => {
    try {
      const snapshot = await firestore()
        .collection('globalDues')
        .get();

      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log(data)

      setDues(data);
    } catch (error) {
      console.log("Error fetching global dues:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGlobalDues();
  }, []);

  const renderItem = ({ item }) => (
    <Pressable onPress={()=>navigation.navigate("DueDetail",{DueDetail:{
      photo:item.photo,
      id:item.id,
      amount:item.amount,
      description:item.description,
      dueDate:item.dueDate
    }})}
      style={{
        padding: 15,
        borderWidth: 1,
        borderColor:color.text,
        marginTop:10,
        borderRadius:20,

        flexDirection: "row"
      }}
    >
      <View style={styles.images}>
        <Image source={{ uri: item.userProfile }} style={{ height: 70, width: 70, borderRadius: 60 }} />

      </View>

      <View style={{marginStart:10}}>

        <View style={{ }}>
         <Text style={{fontWeight:"600",fontSize:20,color:color.text}}>Amount:<Text style={{fontSize:17, color:color.text}}>  {item.amount}</Text></Text>
         
        </View>
        {/* <Text style={[{ color: color.text }]}>{item.description}</Text> */}
        <Text style={[{ color: color.text }]}>{item.createdAt?.toDate?.().toDateString?.()}</Text>
      </View>
    </Pressable>
  )



  return (
    <PageBody>

      <View style={styles.container}>


        <FlatList
           ItemSeparatorComponent={() => <View style={{ height: 0 }} />}
          data={dues}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />
      </View>
      
      {loading &&
      <View style={[{backgroundColor:"rgba(0, 0, 0,.1)"},styles.activityOverlay]}>
          <ActivityIndicator color={"grey800"} size="large"  />

          </View>
      }
  
    </PageBody>
  );
};

const styles = StyleSheet.create({
  container: {

    flex: 1,

  },

}
)
export default TotalOutStandingAmount;