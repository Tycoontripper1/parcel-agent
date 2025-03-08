// import React, {useState} from 'react';
// import {View, Text, StyleSheet, Image, Alert, ScrollView} from 'react-native';
// import {useDispatch} from 'react-redux';
// import {updateField} from '@/redux/slices/formSlice';
// import {RFValue} from 'react-native-responsive-fontsize';
// import {Button, CustomView} from '@/components';
// import {NativeStackScreenProps} from '@react-navigation/native-stack';
// import {openImagePicker} from '@/utils/openImagePicker';
// import {AuthStackParamList} from '@/navigation/navigationType';
// import HomeHeader from '@/components/share/HomeHeader';
// import ButtonHome from '@/components/ButtonHome';

// type Props = NativeStackScreenProps<AuthStackParamList>;
// const FrontImageScreenDriver = ({navigation}: Props) => {
//   const [frontImage, setFrontImage] = useState<string | null>(null);
//   const dispatch = useDispatch();
//   // Handle next button
//   const handleNext = () => {
//     if (!frontImage) {
//       Alert.alert(
//         'Error',
//         'Please capture or upload the front image before proceeding.'
//       );
//       return;
//     }
//     dispatch(updateField({key: 'idFrontImage', value: frontImage}));
//     navigation.navigate('BackImageScreen');
//   };

//   return (
//     <CustomView style={{paddingVertical: RFValue(10)}}>
//        {/* Header */}
//        <HomeHeader type="Stack" title="Camera" />
//       <ScrollView
//         showsHorizontalScrollIndicator={false}
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={{paddingBottom: 20}}>
//         <View style={styles.container}>
//           <Text style={styles.title}>Upload or Capture Front of ID</Text>
//           {frontImage && (
//             <Image source={{uri: frontImage}} style={styles.image} />
//           )}
//           {frontImage ? (
//             <View>
//               <Button
//                 onPress={() => openImagePicker(setFrontImage, true)}
//                 title='Retake'
//                 style={{height: 55, marginVertical: RFValue(16)}}
//               />
//               <Button
//                 onPress={() => openImagePicker(setFrontImage, false)}
//                 title='Update from Gallery'
//                 style={{height: 55, marginVertical: RFValue(16)}}
//               />
//             </View>
//           ) : (
//             <View>
//               <Button
//                 onPress={() => openImagePicker(setFrontImage, true)}
//                 title='Capture Image'
//                 style={{height: 55, marginVertical: RFValue(16)}}
//               />
//               <Button
//                 onPress={() => openImagePicker(setFrontImage, false)}
//                 title='Upload from Gallery'
//                 style={{height: 55, marginVertical: RFValue(16)}}
//               />
//             </View>
//           )}

//           {frontImage && (
//            <ButtonHome
//            onPress={handleNext}
//            title='Next'
//            style={{ height: 55 , marginVertical:RFValue(6)}}
//         //    disabled={!formData.idType}
//          />
//           )}
//         </View>
//       </ScrollView>
//     </CustomView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {flex: 1, padding: 16, justifyContent: 'center'},
//   title: {fontSize: 18, textAlign: 'center', marginBottom: 16},
//   image: {width: '100%', height: 200, alignSelf: 'center', marginBottom: 24},
//   button: {
//     backgroundColor: '#4CAF50',
//     padding: 16,
//     borderRadius: 8,
//     marginBottom: 8,
//   },
//   buttonText: {color: '#fff', textAlign: 'center', fontSize: 16},
//   continueButton: {backgroundColor: '#000', padding: 16, borderRadius: 8},
// });

// export default FrontImageScreenDriver;
import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Alert, ScrollView } from 'react-native';
import { useDispatch } from 'react-redux';
import { updateField } from '@/redux/slices/formSlice';
import { RFValue } from 'react-native-responsive-fontsize';
import { Button, CustomView } from '@/components';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { openImagePicker } from '@/utils/openImagePicker';
import { DriverStackList } from '@/navigation/navigationType';
import HomeHeader from '@/components/share/HomeHeader';
import ButtonHome from '@/components/ButtonHome';
import { color } from '@/constants/Colors';

type Props = NativeStackScreenProps<DriverStackList>;

const FrontImageScreenDriver = ({ navigation }: Props) => {
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
    dispatch(updateField({ key: 'idFrontImage', value: frontImage }));
    navigation.navigate('BackImageScreenDriver');
  };

  return (
    <CustomView style={{ paddingVertical: RFValue(10) }}>
      {/* Header */}
      <View style={{padding: RFValue(16)}}>
      <HomeHeader type="Stack" title="Camera" />
      </View>
  
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <View style={styles.container}>
        <Text style={{fontSize:RFValue(16), fontWeight:"600"}}   >Take photo of the Driver’s ID </Text>
        <Text style={{fontSize:RFValue(14), color:color.textGray}} >Ensure your ID fits in the shape before taking the image</Text>
 <Text style={styles.title}>Upload or Capture Front of ID</Text>
          
          {/* Image Frame */}
          <View style={styles.imageFrame}>
            {frontImage ? (
              <Image source={{ uri: frontImage }} style={styles.capturedImage} />
            ) : (
              <Text style={styles.placeholderText}>ID Image Here</Text>
            )}
          </View>

          {/* Buttons */}
          {frontImage ? (
            <View>
              <Button
                onPress={() => openImagePicker(setFrontImage, true)}
                title="Retake"
                style={styles.button}
              />
              <Button
                onPress={() => openImagePicker(setFrontImage, false)}
                title="Update from Gallery"
                style={styles.button}
              />
            </View>
          ) : (
            <View>
              <Button
                onPress={() => openImagePicker(setFrontImage, true)}
                title="Capture Image"
                style={styles.button}
              />
              <Button
                onPress={() => openImagePicker(setFrontImage, false)}
                title="Upload from Gallery"
                style={styles.button}
              />
            </View>
          )}

          {/* Next Button */}
          {frontImage && (
            <ButtonHome
              onPress={handleNext}
              title="Save and Continue"
              style={styles.button}
            />
          )}
        </View>
      </ScrollView>
    </CustomView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, justifyContent: 'center' },
  title: { fontSize: 18, textAlign: 'center', marginBottom: 16 },
  
  // Image Frame
  imageFrame: {
    width: '100%',
    height: 200,
    borderWidth: 2,
    borderColor: '#aaa',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#f8f8f8',
  },
  capturedImage: { width: '100%', height: '100%', resizeMode: 'contain' },
  placeholderText: { color: '#aaa', fontSize: 16 },
  
  // Buttons
  button: {
    height: 55,
    marginVertical: RFValue(8),
  },
});

export default FrontImageScreenDriver;

