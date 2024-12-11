import React, {useState} from 'react';
import {View, Text, StyleSheet, Image, Alert, ScrollView} from 'react-native';
import {useDispatch} from 'react-redux';
import {updateField} from '@/redux/slices/formSlice';
import {Button, CustomView} from '@/components';
import {RFValue} from 'react-native-responsive-fontsize';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import BackButton from '@/components/share/BackButton';
import StepProgress from '@/components/share/StepProgress';
import {openImagePicker} from '@/utils/openImagePicker';
import {AuthStackParamList} from '@/navigation/navigationType';

type Props = NativeStackScreenProps<AuthStackParamList>;

const BackImageScreen = ({navigation}: Props) => {
  const [backImage, setBackImage] = useState<string | null>(null);
  const dispatch = useDispatch();

  // Handle next button
  const handleNext = () => {
    if (!backImage) {
      Alert.alert(
        'Error',
        'Please capture or upload the back image before proceeding.'
      );
      return;
    }
    dispatch(updateField({key: 'idBackImage', value: backImage}));
    navigation.navigate('PreviewScreen');
  };

  return (
    <CustomView style={{paddingVertical: RFValue(10)}}>
      <BackButton onClick={() => navigation.goBack()} />
      <StepProgress step={4} totalSteps={5} />
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 20}}>
        <View style={styles.container}>
          <Text style={styles.title}>Upload or Capture Back of ID</Text>
          {backImage && (
            <Image source={{uri: backImage}} style={styles.image} />
          )}
          {backImage ? (
            <View>
              <Button
                onPress={() => openImagePicker(setBackImage, true)}
                title='Retake'
                style={{height: 55, marginVertical: RFValue(16)}}
              />
              <Button
                onPress={() => openImagePicker(setBackImage, false)}
                title='Update from Gallery'
                style={{height: 55, marginVertical: RFValue(16)}}
              />
            </View>
          ) : (
            <View>
              <Button
                onPress={() => openImagePicker(setBackImage, true)}
                title='Capture Image'
                style={{height: 55, marginVertical: RFValue(16)}}
              />
              <Button
                onPress={() => openImagePicker(setBackImage, false)}
                title='Upload from Gallery'
                style={{height: 55, marginVertical: RFValue(16)}}
              />
            </View>
          )}

          {backImage && (
            <Button
              onPress={handleNext}
              title='Save and Continue'
              style={{height: 55, marginVertical: RFValue(16)}}
            />
          )}
        </View>
      </ScrollView>
    </CustomView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, padding: 16, justifyContent: 'center'},
  title: {fontSize: 18, textAlign: 'center', marginBottom: 16},
  image: {width: '100%', height: 200, alignSelf: 'center', marginBottom: 24},
  button: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  buttonText: {color: '#fff', textAlign: 'center', fontSize: 16},
  continueButton: {backgroundColor: '#000', padding: 16, borderRadius: 8},
});

export default BackImageScreen;
