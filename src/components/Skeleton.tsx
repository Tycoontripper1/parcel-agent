import React from 'react';
import {StyleSheet, Animated} from 'react-native';

interface ISkeleton {
  height?: number;
  width?: any;
  borderRadius?: number;
}

const Skeleton = ({
  height = 20,
  width = '100%',
  borderRadius = 5,
}: ISkeleton) => {
  const opacity = new Animated.Value(0.3);

  Animated.loop(
    Animated.sequence([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0.3,
        duration: 800,
        useNativeDriver: true,
      }),
    ])
  ).start();

  return (
    <Animated.View
      style={[styles.skeleton, {height, borderRadius, opacity, width}]}
    />
  );
};
const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: '#e0e0e0',
    marginBottom: 10,
  },
});

export default Skeleton;
