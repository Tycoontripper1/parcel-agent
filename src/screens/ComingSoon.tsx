import {StyleSheet} from 'react-native';
import React from 'react';
import {CustomView, Text} from '@/components';

const ComingSoon = () => {
  return (
    <CustomView style={styles.container} padded>
      <Text size={20}> Coming soon</Text>
    </CustomView>
  );
};

export default ComingSoon;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
