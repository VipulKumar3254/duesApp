import React from 'react';
import {ScrollView, View} from 'react-native';
import {useSelector} from 'react-redux';
import useTheme from '../../hooks/useTheme';

export const PageBody = ({
  children,
  scrollable = false,
  style,
  refreshControl,
  ...props
}) => {
  const colors = useTheme();
  const Container = scrollable ? ScrollView : View;

  return (
    <Container
      style={[{flex: 1, backgroundColor:colors.background, paddingHorizontal: 4}, style]}
      {...(scrollable ? {refreshControl} : {})}
      {...props}>
      {children}
    </Container>
  );
};

export const Center = ({children, style}) => (
  <View style={[{alignItems: 'center', justifyContent: 'center'}, style]}>
    {children}
  </View>
);