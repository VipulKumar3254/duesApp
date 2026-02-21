import React from "react";
import { Image, StyleSheet, View, Text, ScrollView } from "react-native";
import { PageBody } from "../../source/layout/Layout";
import useTheme from "../../hooks/useTheme";

const DueDetail = ({ route }) => {
  const color = useTheme();

  const detail = route?.params?.DueDetail;

  console.log("Detail:", route.params.detail);

  // Agar detail hi nahi mila
  if (!detail) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>No Detail Found</Text>
      </View>
    );
  }

  return (
    <PageBody  scrollable style={[styles.container,{}]}>
      
      {detail.photo && (
        <Image
          source={{ uri: detail.photo }}
          style={styles.image}
          resizeMode="cover"
        />
      )}

      <View style={styles.content(color)}>
        <Text style={[styles.label,{color:color.text}]}>Amount:</Text>
        <Text style={[styles.value,{color:color.text}]}>{detail.amount}</Text>

        <Text style={[styles.label,{color:color.text}]}>Description:</Text>
        <Text style={[styles.value,{color:color.text}]}>{detail.description}</Text>

        <Text style={[styles.label,{color:color.text}]}>Due Date:</Text>
        <Text style={[styles.value,{color:color.text}]}>{detail.dueDate}</Text>
      </View>

    </PageBody>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding:10
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
  content: (color)=>[{
    padding: 20,
    margin:10,
    borderWidth:.3,
    borderColor:color.text,
    borderRadius:20
    
  }],
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
