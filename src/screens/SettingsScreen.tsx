import {Text, CustomView, Button} from '@/components';
import {useTheme} from '@/hooks/useTheme';
import {RootStackParamList} from '@/navigation/Navigation';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React from 'react';
import {Switch, StyleSheet, View} from 'react-native';

type Props = NativeStackScreenProps<RootStackParamList>;

const SettingsPage = ({navigation}: Props) => {
  const {mode, toggleTheme} = useTheme(); // Get the theme colors

  return (
    <CustomView style={styles.container} padded>
      <Text style={styles.title}>Theme Settings</Text>
      <View style={styles.toggleContainer}>
        <Text style={styles.label}>Dark Mode</Text>
        <Switch value={mode === 'dark'} onValueChange={toggleTheme} />
      </View>
      <Button onPress={() => navigation.replace('Login')} title='Logout' />
    </CustomView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '80%',
  },
  label: {
    fontSize: 18,
  },
});

export default SettingsPage;
