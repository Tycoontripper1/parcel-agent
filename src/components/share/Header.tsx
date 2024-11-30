import {View, StyleSheet, TextStyle} from 'react-native';
import React from 'react';
import {useTheme} from '@/hooks/useTheme';
import Text from '../Text';

interface IHeader {
  title: string;
}
const Header = (pros: IHeader) => {
  const {theme} = useTheme();
  return (
    <View style={styles.header}>
      <View style={[styles.child, {backgroundColor: theme.primary}]}>
        <Text style={styles.welcomeText}>{pros.title}</Text>
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  header: {
    height: '20%',
    transform: [{scaleX: 2}],
    borderBottomStartRadius: 200,
    borderBottomEndRadius: 200,
    overflow: 'hidden',
  },
  child: {
    flex: 1,
    transform: [{scaleX: 0.5}],
    flexDirection: 'column',
    justifyContent: 'center',
    padding: 16,
  },
  welcomeText: {
    fontSize: 26,
    paddingTop: 40,
    fontFamily: 'OutfitMedium',
  },
});
