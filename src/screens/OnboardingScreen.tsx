import React, {useRef, useState} from 'react';
import {
  StyleSheet,
  FlatList,
  Animated,
  Image,
  Dimensions,
  View as OnboardView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Onboarding} from '../../assets/images';
import {Button, CustomView, Text} from '@/components';
import {color} from '@/constants/Colors';
import {RootStackParamList} from '@/navigation/navigationType';

const {width} = Dimensions.get('window');

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

interface Slide {
  id: string;
  title: string;
  description: string;
  image: any;
}

const OnboardingScreen = ({navigation}: Props) => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const slides: Slide[] = [
    {
      id: '1',
      title: 'Your Hub for Smarter Deliveries',
      description:
        'Easily manage parcel drop-offs, assign drivers, and monitor progress—all in one place. ParcelPoint streamlines your tasks, so you can focus on delivering exceptional service.',
      image: Onboarding, // Replace with your image path
    },
    {
      id: '2',
      title: 'Your Hub for Smarter Deliveries',
      description:
        'Easily manage parcel drop-offs, assign drivers, and monitor progress—all in one place. ParcelPoint streamlines your tasks, so you can focus on delivering exceptional service.',
      image: Onboarding,
    },
    {
      id: '3',
      title: 'Your Hub for Smarter Deliveries',
      description:
        'Easily manage parcel drop-offs, assign drivers, and monitor progress—all in one place. ParcelPoint streamlines your tasks, so you can focus on delivering exceptional service.',
      image: Onboarding,
    },
  ];

  const handleScroll = (event: any) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  };

  const handleFinish = async () => {
    // Save onboarding completion to AsyncStorage
    await AsyncStorage.setItem('hasSeenOnboarding', 'true');
    navigation.navigate('AuthStacks', {screen: 'Login'});
  };
  const handleGotoLogin = async () => {
    // Save onboarding completion to AsyncStorage
    await AsyncStorage.setItem('hasSeenOnboarding', 'true');
    navigation.navigate('AuthStacks', {screen: 'Login'});
  };

  return (
    <CustomView style={styles.container}>
      <FlatList
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {x: scrollX}}}],
          {useNativeDriver: false}
        )}
        onMomentumScrollEnd={handleScroll}
        renderItem={({item}) => (
          <OnboardView style={styles.slide}>
            <Image source={item.image} style={styles.image} />
            <Text
              style={styles.title}
              bold
              color={color.secondary}
              font='SemiBold'>
              {item.title}
            </Text>
            <Text style={styles.description}>{item.description}</Text>
          </OnboardView>
        )}
      />

      {/* Dots Pagination */}
      <OnboardView style={styles.pagination}>
        {slides.map((_, index) => (
          <OnboardView
            key={index}
            style={[styles.dot, currentIndex === index && styles.activeDot]}
          />
        ))}
      </OnboardView>

      {/* Buttons */}
      <OnboardView style={styles.buttonContainer}>
        <Button
          onPress={handleFinish}
          title='Create Account '
          style={{width: '80%', height: 50}}
        />
        <Button
          onPress={handleGotoLogin}
          title='Sign in '
          backgroundColor='#E6FFDB'
          style={{width: '80%', height: 50}}
        />
      </OnboardView>
    </CustomView>
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  slide: {
    width,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  image: {
    width: 350,
    height: 350,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#6b6b6b',
    marginHorizontal: 16,
  },
  pagination: {
    flexDirection: 'row',
    alignSelf: 'center',
  },
  dot: {
    height: 5,
    width: 18,
    borderRadius: 4,
    backgroundColor: '#D5D7DA',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#000',
    width: 36,
    height: 5,
  },
  buttonContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 20,
    width: '100%',
    marginTop: 40,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
