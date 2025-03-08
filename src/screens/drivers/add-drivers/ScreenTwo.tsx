// import {Button, CustomView, Spinner, Text} from '@/components';
// import BackButton from '@/components/share/BackButton';
// import StepProgress from '@/components/share/StepProgress';
// import {color} from '@/constants/Colors';
// import {Helper} from '@/helper/helper';
// import {AuthStackParamList, DriverStackList} from '@/navigation/navigationType';
// import {updateField} from '@/redux/slices/formSlice';
// import {RootState} from '@/redux/store';
// import {NativeStackScreenProps} from '@react-navigation/native-stack';
// import {CameraType, CameraView, useCameraPermissions} from 'expo-camera';
// import {useRef, useState} from 'react';
// import {
//   Dimensions,
//   Image,
//   ScrollView,
//   StyleSheet,
//   TouchableOpacity,
//   View,
//   ViewStyle,
// } from 'react-native';
// import {RFValue} from 'react-native-responsive-fontsize';
// import Toast from 'react-native-toast-message';
// import {useDispatch} from 'react-redux';

// const {width, height} = Dimensions.get('window');

// type Props = NativeStackScreenProps<DriverStackList>;

// const FacialVerification = ({navigation}: Props) => {
//   const [loading, setLoading] = useState(false);
//   const [permission, requestPermission] = useCameraPermissions();
//   const [capturedImage, setCapturedImage] = useState<string | null>(null); // State for storing the captured image
//   const cameraRef = useRef<CameraView | null>(null); // Reference to the camera
//   const dispatch = useDispatch();

//   const [facing] = useState<CameraType>('front'); // Set to use the front camera

//   if (!permission) {
//     // Camera permissions are still loading.
//     return <View />;
//   }

//   if (!permission.granted) {
//     // Camera permissions are not granted yet.
//     return (
//       <View style={styles.container}>
//         <Text style={styles.message}>
//           We need your permission to use the camera
//         </Text>
//         <Button onPress={requestPermission} title='Grant Permission' />
//       </View>
//     );
//   }

//   const capturePhoto = async () => {
//     if (cameraRef.current) {
//       try {
//         const photo = await cameraRef.current.takePictureAsync({
//           quality: 0.5, // Adjust the quality (0.0 to 1.0)
//           base64: false,
//         });
//         if (photo) {
//           setCapturedImage(photo.uri); // Save the image URI to state
//           dispatch(
//             updateField({key: 'facialVerificationImage', value: photo.uri})
//           );
//         } else {
//           console.error('Failed to capture photo');
//         }
//       } catch (error) {
//         console.error('Error capturing photo:', error);
//       }
//     }
//   };
//   const handleSubmit = () => {
//     setLoading(true);
//     setTimeout(() => {
//       setLoading(false);
//       Helper.vibrate();
//       Toast.show({
//         type: 'success',
//         text1: 'Success',
//         text2: 'Image Saved Successfully',
//       });
//       navigation.navigate('FrontImageScreenDriver');
//     }, 2000);
//   };

//   // Styles
//   const $bodyHeader: ViewStyle = {
//     paddingVertical: RFValue(20),
//     flexDirection: 'column',
//     gap: 20,
//   };

//   return (
//     <CustomView style={{paddingVertical: RFValue(10)}}>
//       {loading && <Spinner />}

//       <BackButton onClick={() => navigation.goBack()} />
//       <StepProgress step={2} totalSteps={3} />

//       <ScrollView
//         showsHorizontalScrollIndicator={false}
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={{paddingBottom: 20}}>
//         <View style={styles.container}>
//           <View style={$bodyHeader}>
//             <Text font='SemiBold' size={18}>
//               Facial Verification
//             </Text>
//             <Text size={14} color={color.textGray}>
//               Ensure your face fits in the circle shape before taking the image
//             </Text>
//           </View>
//           <View style={{paddingVertical: 10}}></View>
//           {capturedImage ? (
//             <View style={styles.imagePreviewContainer}>
//               <Image
//                 source={{uri: capturedImage}}
//                 style={styles.capturedImage}
//               />
//               <Button
//                 onPress={handleSubmit}
//                 title='Save and Continue'
//                 style={{marginTop: 10, width: '100%', height: 55}}
//               />
//                  <Button
//                 title='Retake'
//                 onPress={() => setCapturedImage(null)}
//                 style={{width: '100%', height: 55}}
//               />
//             </View>
//           ) : (
//             <View>
//               <View style={styles.cameraContainer}>
//                 <CameraView
//                   ref={cameraRef}
//                   style={styles.camera}
//                   facing={facing}
//                   ratio='1:1' // Ensures a square aspect ratio for the circular mask
//                   flash={'auto'}
//                   mirror={true}
//                 />
//                 <View style={styles.circleMask} />
//               </View>
//               <Text style={styles.instructionText}>
//                 Position your face inside the circle
//               </Text>
//               <TouchableOpacity
//                 style={styles.shootButton}
//                 onPress={capturePhoto}></TouchableOpacity>
//             </View>
//           )}
//         </View>
//       </ScrollView>
//     </CustomView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },

//   captureButton: {
//     position: 'absolute',
//     bottom: 40,
//     alignSelf: 'center',
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     backgroundColor: '#fff',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   innerButton: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     backgroundColor: '#d1d1d1',
//   },
//   capturedContainer: {
//     flex: 1,
//     backgroundColor: '#000',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   capturedImage: {
//     width: width * 0.8, // 60% of the screen width
//     height: width * 0.8, // Make it a circle, so use the same width and height
//     borderRadius: (width * 0.8) / 2,
//     marginBottom: 10,
//   },
//   message: {
//     color: '#fff',
//     textAlign: 'center',
//     paddingBottom: 10,
//   },
//   cameraContainer: {
//     position: 'relative',
//     width: width * 0.8, // 60% of the screen width
//     height: width * 0.8, // Make it a circle, so use the same width and height
//     borderRadius: (width * 0.8) / 2,
//     overflow: 'hidden', // Ensures the camera view stays within the circle
//   },
//   camera: {
//     width: '100%',
//     height: '100%',
//   },
//   circleMask: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     width: width * 0.8, // 60% of the screen width
//     height: width * 0.8, // Make it a circle, so use the same width and height
//     borderRadius: (width * 0.8) / 2,
//     borderWidth: 5,
//     borderColor: color.primary, // Circle outline
//   },
//   instructionText: {
//     color: '#000',
//     marginTop: 20,
//     fontSize: 16,
//     textAlign: 'center',
//   },
//   shootButton: {
//     backgroundColor: color.allWhite,
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     marginTop: 40,
//     alignSelf: 'center',
//   },
//   shootButtonText: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   imagePreviewContainer: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     width: '100%',
//   },
// });

// export default FacialVerification;
import { Button, CustomView, Spinner, Text } from "@/components";
import BackButton from "@/components/share/BackButton";
import StepProgress from "@/components/share/StepProgress";
import ShootButton from "@/components/svg/ShootButton";
import { color } from "@/constants/Colors";
import { Helper } from "@/helper/helper";
import {
  AuthStackParamList,
  DriverStackList,
} from "@/navigation/navigationType";
import { updateField } from "@/redux/slices/formSlice";
import { RootState } from "@/redux/store";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { useRef, useState } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import Toast from "react-native-toast-message";
import { useDispatch } from "react-redux";

const { width } = Dimensions.get("window");

type Props = NativeStackScreenProps<DriverStackList>;

const FacialVerification = ({ navigation }: Props) => {
  const [loading, setLoading] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const cameraRef = useRef<CameraView | null>(null);
  const dispatch = useDispatch();
  const [facing, setFacing] = useState<CameraType>("front");

  if (!permission) return <View />;

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to use the camera
        </Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  const capturePhoto = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.5,
          base64: false,
        });
        if (photo) {
          setCapturedImage(photo.uri);
          dispatch(
            updateField({ key: "facialVerificationImage", value: photo.uri })
          );
        }
      } catch (error) {
        console.error("Error capturing photo:", error);
      }
    }
  };

  const pickImageFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("We need access to your gallery to proceed.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.5,
    });

    if (!result.canceled) {
      setCapturedImage(result.assets[0].uri);
      dispatch(
        updateField({
          key: "facialVerificationImage",
          value: result.assets[0].uri,
        })
      );
    }
  };

  const toggleCameraType = () => {
    setFacing((prevFacing) => (prevFacing === "front" ? "back" : "front"));
  };

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Helper.vibrate();
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Image Saved Successfully",
      });
      navigation.navigate("FrontImageScreenDriver");
    }, 2000);
  };

  return (
    <CustomView style={{ paddingVertical: RFValue(10) }}>
      {loading && <Spinner />}

      <BackButton onClick={() => navigation.goBack()} />
      <StepProgress step={2} totalSteps={3} />

      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        <View style={styles.container}>
          <Text font="SemiBold" size={18}>
            Facial Verification
          </Text>
          <Text size={14} color={color.textGray}>
            Ensure your face fits in the circle before taking the image
          </Text>

          {capturedImage ? (
            <View style={styles.imagePreviewContainer}>
              <Image
                source={{ uri: capturedImage }}
                style={styles.capturedImage}
              />
              <Button
                onPress={handleSubmit}
                title="Save and Continue"
                style={styles.button}
              />
              <TouchableOpacity
                style={styles.scanButton}
                onPress={() => setCapturedImage(null)}
              >
                <ShootButton />
                <Text style={styles.scanButtonText}>Retake</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View>
              <View style={styles.cameraContainer}>
                <CameraView
                  ref={cameraRef}
                  style={styles.camera}
                  facing={facing}
                  ratio="1:1"
                  mirror={facing === "front"}
                />
                <View style={styles.circleMask} />
              </View>
              <Text style={styles.instructionText}>
                Position your face inside the circle
              </Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.shootButton}
                  onPress={pickImageFromGallery}
                />
                <TouchableOpacity
                  style={styles.shootButton}
                  onPress={capturePhoto}
                />
                <TouchableOpacity
                  style={styles.shootButton}
                  onPress={toggleCameraType}
                />
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </CustomView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  cameraContainer: {
    position: "relative",
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: (width * 0.8) / 2,
    overflow: "hidden",
  },
  camera: { width: "100%", height: "100%" },
  circleMask: {
    position: "absolute",
    top: 0,
    left: 0,
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: (width * 0.8) / 2,
    borderWidth: 5,
    borderColor: color.primary,
  },
  instructionText: {
    color: "#000",
    marginTop: 20,
    fontSize: 16,
    textAlign: "center",
  },
  capturedImage: {
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: (width * 0.8) / 2,
    marginBottom: 10,
  },
  imagePreviewContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  button: { width: "100%", height: 55, marginTop: 10 },
  message: {
    color: "#fff",
    textAlign: "center",
    paddingBottom: 10,
  },
  shootButton: {
    backgroundColor: color.allWhite,
    width: 60,
    height: 60,
    borderRadius: 30,
    marginTop: 40,
    alignSelf: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  scanButton: {
    backgroundColor: "#E6FFDB",
    padding: 12,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    marginVertical: RFValue(6),
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },
  scanButtonText: {
    color: "#1b4e73",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default FacialVerification;
