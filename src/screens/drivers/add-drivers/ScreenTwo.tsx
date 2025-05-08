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
import { useEffect, useRef, useState } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import SwapCameraIcon from "@/components/svg/SwapCameraIcon";
import GalleryIcon from "@/components/svg/Gallery";
import { uploadSingleImage } from "../../../../services/upload";
import { getUser } from "../../../../services/auth";

const { width } = Dimensions.get("window");

type Props = NativeStackScreenProps<DriverStackList>;

const FacialVerification = ({ navigation }: Props) => {
  const [loading, setLoading] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const { facialVerificationImage } = useSelector(
    (state: RootState) => state.form
  );
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
  // useEffect(() => {
  //   (async () => {
  //     if (!permission?.granted) {
  //       const newPermission = await requestPermission();
  //       if (!newPermission.granted) {
  //         alert("Camera access is required for facial verification.");
  //       }
  //     }
  //   })();
  // }, [permission, requestPermission]);

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
      mediaTypes: "images",
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
  

  const handleSubmit = async () => {
    setLoading(true);
    const userDetails = await getUser();
    // console.log(userDetails, "userDetails");
    const username = userDetails?.firstName;

    try {
      const userImageUrl = await uploadSingleImage(
        facialVerificationImage,
        username
      );
      console.log(userImageUrl, "userImageUrl");
      if (userImageUrl?.data.url) {
        // Update Redux with the URLs
        dispatch(
          updateField({
            key: "facialVerificationImage",
            value: userImageUrl?.data.url,
          })
        );
      }
      console.log(facialVerificationImage, "facialVerificationImage");

      Helper.vibrate();
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "facial Images uploaded successfully",
      });

      navigation.navigate("FrontImageScreenDriver");
    } catch (error: any) {
      console.log(error, "❌Driver KYC submission error");
      Toast.show({
        type: "error",
        text1: "uoad Failed",
        text2: error.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
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
                >
                  <GalleryIcon />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.shootButtonBorder}
                  onPress={capturePhoto}
                />
                <TouchableOpacity
                  style={[styles.shootButton]}
                  onPress={toggleCameraType}
                >
                  <SwapCameraIcon />
                </TouchableOpacity>
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
    width: width * 0.9,
    height: width * 0.9,
    borderRadius: (width * 0.9) / 2,
    overflow: "hidden",
  },
  camera: { width: "100%", height: "100%" },
  circleMask: {
    position: "absolute",
    top: 0,
    left: 0,
    width: width * 0.9,
    height: width * 0.9,
    borderRadius: (width * 0.9) / 2,
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
  shootButtonBorder: {
    backgroundColor: color.allWhite,
    width: 72,
    height: 72,
    borderRadius: 50,
    borderWidth: RFValue(10),
    borderColor: "#17171714",
    marginTop: 40,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  shootButton: {
    backgroundColor: color.allWhite,
    width: 60,
    height: 60,
    borderRadius: 30,
    marginTop: 40,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
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
