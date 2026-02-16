import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Notices = () => {
  return (
    <View style={styles.container}>
      <Text>Notices will come here.</Text>
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

export default Notices;