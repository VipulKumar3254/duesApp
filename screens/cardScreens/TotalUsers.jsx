import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Image, Pressable } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { PageBody } from '../../source/layout/Layout';
import useTheme from '../../hooks/useTheme';
import { useNavigation } from '@react-navigation/native';

const TotalUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const color = useTheme();
  const navigation = useNavigation();

  const fetchUsers = async () => {
    try {
      const snapshot = await firestore()
        .collection('dueUsers')
        .get();

      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setUsers(data);
    } catch (error) {
      console.log("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const renderItem = ({ item }) => (
    <Pressable
      onPress={() =>
        navigation.navigate("UserDetail", {
          user: item,
        })
      }
      style={{
        padding: 15,
        borderWidth: 1,
        borderColor: color.borderColor,
        borderRadius: 20,
        flexDirection: "row",
      }}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: item.userProfile }}
          style={{ height: 70, width: 70, borderRadius: 60 }}
        />
      </View>

      <View style={{ marginStart: 10, justifyContent: "center" }}>
        <Text style={{ fontWeight: "600", fontSize: 18, color: color.text }}>
          {item.name}
        </Text>

        <Text style={{ color: color.text }}>
          {item.phone}
        </Text>
      </View>
    </Pressable>
  );

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <PageBody>
      <View style={styles.container}>

        {/* 🔥 Total Count on Top */}
        <Text style={{ 
          fontSize: 20, 
          fontWeight: "bold", 
          marginBottom: 15, 
          color: color.text 
        }}>
          Total Users: {users.length}
        </Text>

        <FlatList
          ItemSeparatorComponent={() => <View style={{ height: 15 }} />}
          data={users}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />
      </View>
    </PageBody>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default TotalUsers;