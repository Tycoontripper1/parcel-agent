import React, {useState} from 'react';
import {View, Text, StyleSheet, Image, Alert, ScrollView} from 'react-native';
import {useDispatch} from 'react-redux';
import {updateField} from '@/redux/slices/formSlice';
import {RFValue} from 'react-native-responsive-fontsize';
import {Button, CustomView} from '@/components';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import BackButton from '@/components/share/BackButton';
import StepProgress from '@/components/share/StepProgress';
import {openImagePicker} from '@/utils/openImagePicker';
import {AuthStackParamList} from '@/navigation/navigationType';

type Props = NativeStackScreenProps<AuthStackParamList>;
const FrontImageScreen = ({navigation}: Props) => {
  const [frontImage, setFrontImage] = useState<string | null>(null);
  const dispatch = useDispatch();
  // Handle next button
  const handleNext = () => {
    if (!frontImage) {
      Alert.alert(
        'Error',
        'Please capture or upload the front image before proceeding.'
      );
      return;
    }
    dispatch(updateField({key: 'idFrontImage', value: frontImage}));
    console.log(frontImage)
    navigation.navigate('BackImageScreen');
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
          <Text style={styles.title}>Upload or Capture Front of ID</Text>
          {frontImage && (
            <Image source={{uri: frontImage}} style={styles.image} />
          )}
          {frontImage ? (
            <View>
              <Button
                onPress={() => openImagePicker(setFrontImage, true)}
                title='Retake'
                style={{height: 55, marginVertical: RFValue(16)}}
              />
              <Button
                onPress={() => openImagePicker(setFrontImage, false)}
                title='Update from Gallery'
                style={{height: 55, marginVertical: RFValue(16)}}
              />
            </View>
          ) : (
            <View>
              <Button
                onPress={() => openImagePicker(setFrontImage, true)}
                title='Capture Image'
                style={{height: 55, marginVertical: RFValue(16)}}
              />
              <Button
                onPress={() => openImagePicker(setFrontImage, false)}
                title='Upload from Gallery'
                style={{height: 55, marginVertical: RFValue(16)}}
              />
            </View>
          )}

          {frontImage && (
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

export default FrontImageScreen;
