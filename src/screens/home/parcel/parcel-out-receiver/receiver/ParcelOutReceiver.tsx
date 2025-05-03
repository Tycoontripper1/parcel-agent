import { CustomView, Input, Spinner, Text } from "@/components";
import ButtonHome from "@/components/ButtonHome";
import KeyBoardView from "@/components/KeyBoardView";
import BackButton from "@/components/share/BackButton";
import { HomeStackList } from "@/navigation/navigationType";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import React, { useEffect, useState } from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { updateField } from "@/redux/slices/parcelSlice";
import { RFValue } from "react-native-responsive-fontsize";
import Toast from "react-native-toast-message";
import { getSingleParcel } from "../../../../../../services/parcel";
import { singleParcelInterface } from "@/utils/interface";
import { Helper } from "@/helper/helper";
import { apiKey, getToken } from "../../../../../../services/auth";

type Props = NativeStackScreenProps<HomeStackList>;

const ParcelOutReceiver = ({ navigation, route }: Props) => {
  const { readOnly } = (route.params as { readOnly: boolean }) || {};
  const dispatch = useDispatch();
  const formData = useSelector((state: RootState) => state.parcel);
  const [loading, setLoading] = useState(false);
  const [singleParcel, setSingleParcel] =
    useState<singleParcelInterface | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const parcel = await getSingleParcel();
      setSingleParcel(parcel);
    };
    fetchUser();
  }, []);
  const parcelId = singleParcel?.id

    const handleSubmit = async () => {
      setLoading(true);
      try {
            const payload = {
              collector:{
                fullName:   singleParcel && readOnly
                ? singleParcel.receiver.fullName
                : formData.receiverFullName,
                phone:  singleParcel && readOnly
                ? singleParcel.receiver.phone
                : formData.receiverPhoneNumber,
              }
            };
             const token = await getToken()
                  const response = await fetch(`${apiKey}/shipment/${parcelId}`, {
                    method: 'PATCH',
                      headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(payload),
                  
                  });
              
                  const result = await response.json();
            setLoading(false)
            Helper.vibrate();
            Toast.show({
              type: "success",
              text1: "Success",
              text2: result?.message || " Parcel Updated!",
            });
            navigation.navigate("ParcelOtpVerificationReceiver");
        }catch (error: any) {
            console.error("Save Error:", error);
            Toast.show({
              type: "error",
              text1: "Error",
              text2: error?.message || "Something went wrong!",
            });
          } finally {
            setLoading(false);
          }
  
    };

  const $bodyHeader: ViewStyle = {
    flexDirection: "column",
    gap: 6,
    paddingVertical: RFValue(30),
  };
  const $buttonsContainer: ViewStyle = {
    paddingVertical: RFValue(16),
  };

  return (
    <CustomView style={{ paddingVertical: RFValue(10) }}>
      {loading && <Spinner />}
      <BackButton onClick={() => navigation.goBack()} />

      <KeyBoardView padded={true}>
        <View style={$bodyHeader}>
          <Text font="SemiBold" size={18}>
            Parcel Out - Receiver
          </Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label} font="Medium" size={16}>
            Enter receiver’s information
          </Text>

          <Input
            label="Full Name"
            placeholder="Enter Name"
            placeholderTextColor="#B8C2CC"
            value={
              singleParcel && readOnly
                ? singleParcel.receiver.fullName
                : formData.receiverFullName
            }
            onChangeText={(value) =>
              !readOnly &&
              dispatch(updateField({ key: "receiverFullName", value }))
            }
            editable={!readOnly}
            keyboardType="default"
          />

          <Input
            label="Receiver Phone Number"
            placeholder="Enter phone number"
            placeholderTextColor="#B8C2CC"
            value={
              singleParcel && readOnly
                ? singleParcel.receiver.phone
                : formData.receiverPhoneNumber
            }
            onChangeText={(value) =>
              !readOnly &&
              dispatch(updateField({ key: "receiverPhoneNumber", value }))
            }
            editable={!readOnly}
            keyboardType="number-pad"
          />
        </View>

        <View style={$buttonsContainer}>
          <ButtonHome
            onPress={handleSubmit}
            title="Continue"
            style={{ height: 55 }}
            // disabled={
            //   !formData.receiverPhoneNumber || !formData.receiverFullName
            // }
            textColor="#61616B"
          />
        </View>
      </KeyBoardView>
    </CustomView>
  );
};

export default ParcelOutReceiver;

const styles = StyleSheet.create({
  inputContainer: {
    width: "100%",
    marginBottom: 20,
  },
  label: {
    color: "#555",
    marginBottom: 5,
  },
});
