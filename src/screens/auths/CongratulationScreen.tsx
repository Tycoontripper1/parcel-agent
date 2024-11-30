import {View, ViewStyle, ScrollView, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import {RFValue} from 'react-native-responsive-fontsize';
import {Button, CustomView, Spinner, Text} from '@/components';
import BackButton from '@/components/share/BackButton';
import StepProgress from '@/components/share/StepProgress';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '@/navigation/Navigation';
import {color} from '@/constants/Colors';
import {Helper} from '@/helper/helper';
import Success from '@/components/svg/Success';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '@/redux/store';
import Animated, {FadeInUp} from 'react-native-reanimated';
import {resetForm} from '@/redux/slices/formSlice';

type Props = NativeStackScreenProps<RootStackParamList>;

const CongratulationScreen = ({navigation}: Props) => {
  const [loading, setLoading] = useState(false);
  const formData = useSelector((state: RootState) => state.form);
  const dispatch = useDispatch();

  // Styles
  const $bodyHeader: ViewStyle = {
    paddingVertical: RFValue(20),
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
      navigation.replace('Settings');
      dispatch(resetForm()); // Reset the form data in Redux
    }, 2000);
  };

  return (
    <CustomView style={{paddingVertical: RFValue(10)}}>
      {loading && <Spinner />}

      <BackButton onClick={() => navigation.goBack()} />
      <StepProgress step={5} totalSteps={5} />

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
              Profile Set up completed
            </Text>
            <Text
              size={14}
              color={color.textGray}
              style={{textAlign: 'center'}}>
              You're all set! Your profile is ready to go—let's make the most of
              it.
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

export default CongratulationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    paddingVertical: 60,
  },
});
