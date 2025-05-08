import {View, ViewStyle, ScrollView, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import {RFValue} from 'react-native-responsive-fontsize';
import {Button, CustomView, Spinner, Text} from '@/components';
import BackButton from '@/components/share/BackButton';
import StepProgress from '@/components/share/StepProgress';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {color} from '@/constants/Colors';
import {Helper} from '@/helper/helper';
import Success from '@/components/svg/Success';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '@/redux/store';
import Animated, {FadeInUp} from 'react-native-reanimated';
import {resetForm} from '@/redux/slices/formSlice';
import {HomeStackList, RootStackParamList} from '@/navigation/navigationType';
import {RouteProp} from '@react-navigation/native';

interface Props {
  navigation: NativeStackNavigationProp<RootStackParamList>;
  route: RouteProp<HomeStackList, 'ParcelCongratulation'>;
}

const ParcelCongratulation = ({navigation, route}: Props) => {
  const [loading, setLoading] = useState(false);
  const formData = useSelector((state: RootState) => state.parcel);
  const dispatch = useDispatch();
  const {message, note} = route.params;

  // Styles
  const $bodyHeader: ViewStyle = {
    paddingVertical: RFValue(30),
    flexDirection: 'column',
    alignItems: 'center',
    gap: 20,
  };

  const handleSubmit = () => {
    console.log(formData);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Helper.vibrate();
      navigation.replace('RootTabStack');
      dispatch(resetForm()); // Reset the form data in Redux
    }, 2000);
  };

  return (
    <CustomView style={{paddingVertical: RFValue(10)}}>
      {loading && <Spinner />}

      <BackButton onClick={() => navigation.goBack()} />

      <StepProgress step={3} totalSteps={3} />

      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 20}}>
        <View style={styles.container}>
          <Animated.View
            entering={FadeInUp.duration(500).delay(600)}
            style={{
              paddingVertical: 20,
              flexDirection: 'row',
              justifyContent: 'center',
            }}>
            <Success />
          </Animated.View>

          <View style={$bodyHeader}>
            <Text font='SemiBold' size={18}>
              {message}
            </Text>
            <Text size={14}>
              {note}
            </Text>
          </View>
          <Button
            onPress={handleSubmit}
            title='Continue to Dashboard'
            style={{height: 55}}
          />
        </View>
      </ScrollView>
    </CustomView>
  );
};

export default ParcelCongratulation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    paddingVertical: 60,
  },
});
