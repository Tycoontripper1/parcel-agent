import React, { useState } from "react";
import { View, Image, StyleSheet, ScrollView } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { useDispatch, useSelector } from "react-redux";
import Toast from "react-native-toast-message";

import { Button, CustomView, Spinner, Text } from "@/components";
import CloseModal from "@/components/CloseModal";
import BackButton from "@/components/share/BackButton";
import StepProgress from "@/components/share/StepProgress";
import { color } from "@/constants/Colors";
import { Helper } from "@/helper/helper";
import { DriverStackList } from "@/navigation/navigationType";
import { RootState } from "@/redux/store";
import { updateField } from "@/redux/slices/formSlice";
import * as FileSystem from 'expo-file-system';
import { getDriver, getToken, getUser, updateDriverKyc } from "../../../../services/auth";
import { uploadBulkImages } from "../../../../services/upload";
import axios, { Axios, AxiosError } from "axios";

import { NativeStackScreenProps } from "@react-navigation/native-stack";

type Props = NativeStackScreenProps<DriverStackList>;
type UploadResponse = {
  status: string;
  urls: string[];
};
const PreviewScreenDriver = ({ navigation }: Props) => {
  const { idFrontImage, idBackImage, facialVerificationImage } = useSelector(
    (state: RootState) => state.form
  );
  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imagesUploaded, setImagesUploaded] = useState(false);
 
  const handleImageUpload = async () => {
    setLoading(true);
    console.log(idFrontImage, "idFrontImage")
    console.log(idBackImage, "idBackImage")

    const photos = [idFrontImage, idBackImage];
    try {
          const validPhotos = photos.filter(p => p !== null);
      
          if (validPhotos.length < 2) {
            Toast.show({
              type: 'error',
              text1: 'Upload Failed',
              text2: 'Please select at least two images before uploading.',
            });
            return;
          }
          
      
          const userDetails = await getUser();
          const username = userDetails?.firstName || 'unknown_user';
          const token = await getToken();
          const formData = new FormData();
      
          for (let index = 0; index < validPhotos.length; index++) {
            const image = validPhotos[index];
      
            formData.append('files', {
              uri: image,
              name: `image_${index}.jpg`,
              type: 'image/jpeg',
            } as any);

          }
      
          const response = await fetch(
            `http://45.9.191.184:8001/parcel/v1.0/api/upload/bulk?folder=${username}`,
            {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
              },
              body: formData,
            }
          );
      
          const result = await response.json();
          
     
      
          if (!response.ok) {
            throw new Error( 'Upload failed');
          }else {
            if (result?.data.urls.length === 2) {
              dispatch(updateField({ key: "idFrontImage", value: result?.data.urls[0] }));
              dispatch(updateField({ key: "idBackImage", value: result.data.urls[1] }));
              setImagesUploaded(true);
            }
            console.log(result, "result")
          }

          // onSave(result.data.urls);
          // onClose();
      
          Helper.vibrate();
          Toast.show({
            type: 'success',
            text1: 'Success',
            text2: 'Parcel images uploaded successfully.',
          });
        } catch (error: any) {
          console.error('Upload error:',error);
          Toast.show({
            type: 'error',
            text1: 'Upload Failed',
            text2: error.message || 'Something went wrong during image upload.',
          });
        } finally {
          setLoading(false);
        }
  };
  // const handleImageUpload = async (
  // ) => {
  //   const photos = [idFrontImage, idBackImage];
  //   const formData = new FormData();
  
  //   for (let i = 0; i < photos.length; i++) {
  //     const uri = photos[i];
  //     const fileInfo = await FileSystem.getInfoAsync(uri);
  //     if (!fileInfo.exists) continue;
  
  //     const fileName = uri.split('/').pop() || `image_${i}.jpg`;
  //     const fileType = fileName.split('.').pop();
  
  //     formData.append('files', {
  //       uri,
  //       name: fileName,
  //       type: `image/${fileType}`,
  //     } as any);
  //   }
  //   const token = await getToken();
  //   try {
  //     const response = await axios.post(
  //       `http://45.9.191.184:8001/parcel/v1.0/api/upload/bulk?folder=oladeji`,
  //       formData,
  //       {
  //         headers: {
  //           'Content-Type': 'multipart/form-data',
  //           Authorization: `Bearer ${token}`,

  //         },
  //       }
  //     );
  
  //     return response.data;
  //   } catch (error) {
  //     console.error('Upload failed:', error);
  //     return null;
  //   }
  // };
  const handleCompleteRegistration = async () => {
    setLoading(true);
    const driver = await getDriver();
    const driverId = driver.id
    try {
      const payload = {
        identificationImages: [idFrontImage, idBackImage],
        userImage: facialVerificationImage,
      };
      console.log(idFrontImage, "idFrontImage")
      console.log(idBackImage, "idBackImage")

      const result = await updateDriverKyc(payload, driverId);

      Helper.vibrate();
      setModalVisible(true);
      Toast.show({
        type: "success",
        text1: "Success",
        text2: result?.message || "KYC submitted successfully",
      });
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleButtonClick = () => {
    if (imagesUploaded) {
      handleCompleteRegistration();
    } else {
      handleImageUpload();
    }
  };

  return (
    <CustomView style={{ paddingVertical: RFValue(10) }}>
      {loading && <Spinner />}
      {modalVisible && (
        <CloseModal
          visible={modalVisible}
          onClose={() => {
            setModalVisible(false);
            navigation.navigate("DriversScreen");
          }}
          message="Driver added successfully!"
        />
      )}

      <BackButton onClick={() => navigation.goBack()} />
      <StepProgress step={3} totalSteps={3} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
        <View style={styles.container}>
          <Text style={styles.headerText}>Take photo of the Driver’s ID</Text>
          <Text style={styles.instructions}>
            Ensure your ID fits in the shape before taking the image
          </Text>

          <Text style={styles.title}>Front Image</Text>
          <Image source={{ uri: idFrontImage }} style={styles.image} />
          <Text style={styles.title}>Back Image</Text>
          <Image source={{ uri: idBackImage }} style={styles.image} />

          <Button
            onPress={handleButtonClick}
            title={imagesUploaded ? "Complete Registration" : "Upload Images"}
            style={{ height: 55, marginVertical: RFValue(16) }}
          />
        </View>
      </ScrollView>
    </CustomView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, justifyContent: "center" },
  headerText: { fontSize: RFValue(16), fontWeight: "600" },
  title: { textAlign: "center", marginBottom: 16 },
  image: { width: "100%", height: 200, alignSelf: "center", marginBottom: 16 },
  instructions: {
    fontSize: RFValue(14),
    paddingVertical: RFValue(6),
    color: color.textGray,
    textAlign: "center",
  },
});

export default PreviewScreenDriver;
