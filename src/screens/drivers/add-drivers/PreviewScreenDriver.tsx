import { Button, CustomView, Spinner, Text } from "@/components";
import CloseModal from "@/components/CloseModal";
import BackButton from "@/components/share/BackButton";
import StepProgress from "@/components/share/StepProgress";
import { color } from "@/constants/Colors";
import { Helper } from "@/helper/helper";
import { DriverStackList } from "@/navigation/navigationType";
import { RootState } from "@/redux/store";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { View, Image, StyleSheet, ScrollView } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import Toast from "react-native-toast-message";
import { useSelector } from "react-redux";

type Props = NativeStackScreenProps<DriverStackList>;
const PreviewScreenDriver = ({ navigation }: Props) => {
  const { idFrontImage, idBackImage } = useSelector(
    (state: RootState) => state.form
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Helper.vibrate();
      setModalVisible(true)
    //   Toast.show({
    //     type: "success",
    //     text1: "Success",
    //     text2: "OTP sent Successfully",
    //   });
    }, 2000);
    console.log("Front Image:", idFrontImage);
    console.log("Back Image:", idBackImage);
  };

  return (
    <CustomView style={{ paddingVertical: RFValue(10) }}>
      {loading && <Spinner />}

      {modalVisible && (
        <CloseModal
          visible={modalVisible}
          onClose={() => {
            setModalVisible(false), navigation.navigate("DriversScreen");
          }}
          message="Driver added successfully!"
        />
      )}
      <BackButton onClick={() => navigation.goBack()} />
      <StepProgress step={3} totalSteps={3} />
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <View style={styles.container}>
          <Text style={{ fontSize: RFValue(16), fontWeight: "600" }}>
            Take photo of the Driver’s ID{" "}
          </Text>
          <Text
            style={{
              fontSize: RFValue(14),
              paddingVertical: RFValue(6),
              color: color.textGray,
            }}
          >
            Ensure your ID fits in the shape before taking the image
          </Text>
          <Text style={styles.title}>Front Image</Text>
          <Image source={{ uri: idFrontImage }} style={styles.image} />
          <Text style={styles.title}>Back Image</Text>
          <Image source={{ uri: idBackImage }} style={styles.image} />

          <Button
            onPress={handleSubmit}
            title="Complete Registration"
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
  button: {
    backgroundColor: "#4CAF50",
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  buttonText: { color: "#fff", textAlign: "center", fontSize: 16 },
});

export default PreviewScreenDriver;
