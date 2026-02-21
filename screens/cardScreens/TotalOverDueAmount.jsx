import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Image, Pressable } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { PageBody } from '../../source/layout/Layout';
import useTheme from '../../hooks/useTheme';
import { useNavigation } from '@react-navigation/native';

const TotalOverDueAmount = () => {
  const [dues, setDues] = useState([]);
  const [loading, setLoading] = useState(true);
  const color = useTheme();
  const navigation = useNavigation();

  const fetchOverDueDues = async () => {
    try {
      const snapshot = await firestore()
        .collection('globalDues')
        .get();

      const today = new Date();

      const data = snapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data(),
        })).filter(item => {
            const dueDate = new Date(item.dueDate);
          console.log(dueDate)
          return dueDate && dueDate < today; // ✅ only overdue
        });

      setDues(data);
      console.log("due datais",data)
    } catch (error) {
      console.log("Error fetching overdue dues:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverDueDues();
  }, []);

//   const renderItem = ({ item }) => (
  
//   );

  
  return (
    <PageBody>
      <View style={styles.container}>
        <FlatList
          ItemSeparatorComponent={() => <View style={{ height: 15 }} />}
          data={dues}
          keyExtractor={(item) => item.id}
          renderItem={(item)=>{
            return(
              <Pressable
      onPress={() =>
        navigation.navigate("DueDetail", {
          DueDetail: {
            photo: item.photo,
            id: item.id,
            amount: item.amount,
            description: item.description,
            dueDate: item.dueDate,
          },
        })
      }
      style={{
        padding: 15,
        marginTop:10,
        borderColor: "black",
        borderColor: color.text,
        borderRadius: 20,
        flexDirection: "row",
        borderWidth:1
      }}
    >
      <View style={styles.images}>
        <Image
          source={{ uri: item.userProfile }}
          style={{ height: 70, width: 70, borderRadius: 60 }}
        />
      </View>

      <View style={{ marginStart: 10 }}>
        <Text style={{ fontWeight: "600", fontSize: 20, color: color.text }}>
          Amount:
          <Text style={{ fontSize: 17, color: color.text }}>
            {" "}{item.amount}
          </Text>
        </Text>

        <Text style={{ color: "red", marginTop: 5 }}>
          Overdue: {item.dueDate}
        </Text>
      </View>
    </Pressable>

  )}}
        />
      </View>

          {loading &&
            <View style={[{backgroundColor:"rgba(0, 0, 0,.1)"},styles.activityOverlay]}>
                <ActivityIndicator color={"grey800"} size="large"  />;
      
                </View>
            }
    </PageBody>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

  },
  images: {
    justifyContent: "center",
    alignItems: "center",
  },
  
  activityOverlay:{
    ...StyleSheet.absoluteFill,
    height:"100%",
    width:"100%",
    justifyContent:"center",
    alignItems:"center"
  }
});

export default TotalOverDueAmount;