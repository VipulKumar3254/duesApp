import React from "react";
import { Image, StyleSheet, View, Text, ScrollView } from "react-native";

const DueDetail = ({ route }) => {

  const detail = route?.params?.DueDetail;

  console.log("Detail:", route.params.DueDetail.id);

  // Agar detail hi nahi mila
  if (!detail) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>No Detail Found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      
      {detail.photo && (
        <Image
          source={{ uri: detail.photo }}
          style={styles.image}
          resizeMode="cover"
        />
      )}

      <View style={styles.content}>
        <Text style={styles.label}>Amount:</Text>
        <Text style={styles.value}>{detail.amount}</Text>

        <Text style={styles.label}>Description:</Text>
        <Text style={styles.value}>{detail.description}</Text>

        <Text style={styles.label}>Due Date:</Text>
        <Text style={styles.value}>{detail.dueDate}</Text>
      </View>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    color: "gray",
  },
  image: {
    width: "100%",
    height: 250,
  },
  content: {
    padding: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default DueDetail;
