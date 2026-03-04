import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { PageBody } from '../../layout/Layout';
import useTheme from '../../../hooks/useTheme';
import Icon from 'react-native-vector-icons/dist/EvilIcons';

export default function Card({
  title,
  subTitle,
  count,
  iconSource,
  iconName,
  iconColor,
  syncTime,
  subTitleColor,
  subCount,
}) {
  const color = useTheme();

  return (
    <PageBody style={styles.container}>
      <Text style={[{ color: color.text.light }, styles.title]}>
        {title} <Icon size={16} color={iconColor} name={'chevron-right'} />{' '}
      </Text>
      <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6 }}>
        <Text style={[{ color: color.text.light }, styles.count]}>{count}</Text>
        <Text style={{ letterSpacing: -1, color: color.text.light }}>
          {subCount && subCount}
        </Text>
      </View>
      <View style={{ flexDirection: 'row' }}>
        {iconName && <Icon size={10} color={iconColor} name={iconName} />}
        {
          syncTime ? (
            <Text style={[{ color: color.text.light }, styles.subTitle]}>
              {' '}
              `Sync ${syncTime}h ago`{' '}
            </Text>
          ) : (
            <Text style={[{ color: subTitleColor }, styles.subTitle]}>
              {subTitle}
            </Text>
          ) //sub title and color and icons and icon color
        }
      </View>
    </PageBody>
  );
}

const styles = StyleSheet.create({
  mainContainer: {},
  container: {
    padding: 16,
    gap: 4,
    borderRadius: 12,
    // borderWidth:1,
    justifyContent: 'center',
    paddingStart: 20,
    borderWidth:1,
  },
  title: {
    fontSize: 12,
  },
  count: {
    fontSize: 28,
    fontWeight: '300',
    letterSpacing: -3,
    lineHeight: 32,
  },
  subTitle: {
    fontSize: 10,
  },
});
