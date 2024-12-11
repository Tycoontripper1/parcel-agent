import {Button, CustomView, Spinner, Text} from '@/components';
import BackButton from '@/components/share/BackButton';
import StepProgress from '@/components/share/StepProgress';
import {Helper} from '@/helper/helper';
import {AuthStackParamList} from '@/navigation/navigationType';
import {RootState} from '@/redux/store';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useState} from 'react';
import {View, Image, StyleSheet, ScrollView} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import Toast from 'react-native-toast-message';
import {useSelector} from 'react-redux';

type Props = NativeStackScreenProps<AuthStackParamList>;
const PreviewScreen = ({navigation}: Props) => {
  const {idFrontImage, idBackImage} = useSelector(
    (state: RootState) => state.form
  );
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Helper.vibrate();
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'OTP sent Successfully',
      });
      navigation.navigate('FacialVerification');
    }, 2000);
    console.log('Front Image:', idFrontImage);
    console.log('Back Image:', idBackImage);
  };

  return (
    <CustomView style={{paddingVertical: RFValue(10)}}>
      {loading && <Spinner />}
      <BackButton onClick={() => navigation.goBack()} />
      <StepProgress step={4} totalSteps={5} />
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 20}}>
        <View style={styles.container}>
          <Image source={{uri: idFrontImage}} style={styles.image} />
          <Text style={styles.title}>Front Image</Text>
          <Image source={{uri: idBackImage}} style={styles.image} />
          <Text style={styles.title}>Back Image</Text>

          <Button
            onPress={handleSubmit}
            title='Save and Continue'
            style={{height: 55, marginVertical: RFValue(16)}}
          />
        </View>
      </ScrollView>
    </CustomView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, padding: 16, justifyContent: 'center'},
  title: {textAlign: 'center', marginBottom: 16},
  image: {width: '100%', height: 200, alignSelf: 'center', marginBottom: 16},
  button: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  buttonText: {color: '#fff', textAlign: 'center', fontSize: 16},
});

export default PreviewScreen;
