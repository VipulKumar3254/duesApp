import { PageBody } from '../source/layout/Layout';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Notices = () => {
  return (
  
  <PageBody>
    <Text style={styles.container}>hii this is me.</Text>
  </PageBody>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    color:"red"
  },
  text:{
    color:"red",
  
  }
});

export default Notices;