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
import { getUser, updateDriverKyc } from "../../../../services/auth";
import { uploadBulkImages } from "../../../../services/upload";

import { NativeStackScreenProps } from "@react-navigation/native-stack";

type Props = NativeStackScreenProps<DriverStackList>;

const PreviewScreenDriver = ({ navigation }: Props) => {
  const { idFrontImage, idBackImage, facialVerificationImage } = useSelector(
    (state: RootState) => state.form
  );
  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imagesUploaded, setImagesUploaded] = useState(false); // Track upload status

  const handleImageUpload = async () => {
    setLoading(true);
    try {
      const userDetails = await getUser();
      const username = userDetails?.firstName;

      const idImageUrls = await uploadBulkImages([idFrontImage, idBackImage], username);

      if (idImageUrls?.data.urls.length === 2) {
        dispatch(updateField({ key: "idFrontImage", value: idImageUrls.data.urls[0] }));
        dispatch(updateField({ key: "idBackImage", value: idImageUrls.data.urls[1] }));
        setImagesUploaded(true); // Images successfully uploaded
      }

      Helper.vibrate();
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "ID Images uploaded successfully",
      });
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Upload Failed",
        text2: error.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteRegistration = async () => {
   setLoading(true);

     
       try {
        
         const payload = {
           identificationImages: [idFrontImage, idBackImage],
           userImage: facialVerificationImage
         };
         console.log(payload, 'payload');
     
         const result = await updateDriverKyc(payload);
         console.log(result, '✅ KYC submitted');
     
         Helper.vibrate();
         setModalVisible(true);
         Toast.show({
           type: 'success',
           text1: 'Success',
           text2: result?.message || 'KYC submitted successfully',
         });
     
       } catch (error: any) {
         console.log(error, '❌ KYC submission error');
         Toast.show({
           type: 'error',
           text1: 'Error',
           text2: error.message || 'Something went wrong',
         });
       } finally {
         setLoading(false);
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
          <Text style={{ fontSize: RFValue(16), fontWeight: "600" }}>
            Take photo of the Driver’s ID
          </Text>
          <Text style={styles.instructions}>
            Ensure your ID fits in the shape before taking the image
          </Text>

          <Text style={styles.title}>Front Image</Text>
          <Image source={{ uri: idFrontImage }} style={styles.image} />
          <Text style={styles.title}>Back Image</Text>
          <Image source={{ uri: idBackImage }} style={styles.image} />

          <Button
            onPress={imagesUploaded ? handleCompleteRegistration : handleImageUpload}
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
  title: { textAlign: "center", marginBottom: 16 },
  image: { width: "100%", height: 200, alignSelf: "center", marginBottom: 16 },
  instructions: {
    fontSize: RFValue(14),
    paddingVertical: RFValue(6),
    color: color.textGray,
  },
});

export default PreviewScreenDriver;
