import React from 'react';
import {View, ActivityIndicator} from 'react-native';
import {useSelector} from 'react-redux';

export default () => {
  const {appColor} = useSelector(state => state.app);
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <ActivityIndicator size="large" color={appColor.primaryColor.fill} />
    </View>
  );
};