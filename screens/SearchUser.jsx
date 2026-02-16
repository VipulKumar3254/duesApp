import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SearchUser = () => {
  return (
    <View style={styles.container}>
      <Text>Search User component.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SearchUser;