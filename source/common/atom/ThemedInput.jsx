import React from 'react';
import { View, StyleSheet, TextInput  } from 'react-native';
import { Text } from 'react-native-paper';

const ThemedInput = ({
  theme,
  style,
  ...props
}) => {


  console.log(theme)
  return (
    <View style={[styles.container]}>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme?.background,
            color: theme?.card,
            borderColor: theme?.card || '#ccc',
          },
          style,
        ]}
        placeholderTextColor={theme?.placeholder || '#999'}
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  input: {
    height: 50,
    borderRadius: 12,
    paddingHorizontal: 15,
    borderWidth: 1,
    fontSize: 16,
  },
});


export default ThemedInput;