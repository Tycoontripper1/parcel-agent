import {CustomView, Button} from '@/components';
import {RootStackParamList} from '@/navigation/navigationType';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React from 'react';
import {StyleSheet} from 'react-native';

type Props = NativeStackScreenProps<RootStackParamList>;

const SettingsPage = ({navigation}: Props) => {
  return (
    <CustomView style={styles.container} padded>
      <Button
        onPress={() => navigation.replace('AuthStacks', {screen: 'Login'})}
        title='Logout'
      />
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
