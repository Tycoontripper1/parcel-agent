import { CustomView, Spinner, Text } from "@/components";
import ButtonHome from "@/components/ButtonHome";
import KeyBoardView from "@/components/KeyBoardView";
import BackButton from "@/components/share/BackButton";
import StepProgress from "@/components/share/StepProgress";
import { HomeStackList } from "@/navigation/navigationType";
import { RootState } from "@/redux/store";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";
import { ParcelInDriver } from "../../../../../../services/parcel";
import { resetForm } from "@/redux/slices/parcelSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Props = NativeStackScreenProps<HomeStackList>;
const ParcelInDriverUnRegisteredPreviewScreen = ({ navigation }: Props) => {
  const formData = useSelector((state: RootState) => state.parcel);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const HandleContinue = async () => {
    setLoading(true);
    try {
      const payload = {
        sender: {
          phone: formData.senderPhoneNumber?.replace(/-/g, ""),
        },
        receiver: {
          phone: formData.receiverPhoneNumber?.replace(/-/g, ""),
        },
        park: {
          source: formData.departureState,
          destination: formData.deliveryMotorPark,
        },
        parcel: {
          type: formData.parcelType,
          value: formData.parcelValue
            ? String(Number(formData.parcelValue))
            : "",
          chargesPayable: formData.chargesPayable
            ? String(Number(formData.chargesPayable))
            : "",
          chargesPaidBy: formData.chargesPayBy,
          handlingFee: String(
            formData.handlingFee ? Number(formData.handlingFee) : ""
          ),
          totalFee:
            formData.parcelValue && formData.chargesPayable
              ? String(
                  Number(formData.parcelValue) + Number(formData.chargesPayable)
                )
              : "",
          description: formData.parcelDescription,
          thumbnails: formData.parcelImages || [],
        },
        driver: {
          phone: formData.driverNumber?.replace(/-/g, ""),
          name: formData.driverName,
        },
        paymentOption: "bank",
        status: "arrived" 
      };

      const result = await ParcelInDriver(payload);
      console.log(result, "result");
      // ✅ Save to local storage
      await AsyncStorage.setItem(
        "parcelDetails",
        JSON.stringify(result?.data?.details)
      );
      Toast.show({
        type: "success",
        text1: "Success",
        text2: result?.data?.message || "Parcel Received!",
      });

      dispatch(resetForm()); // 🧼 clear form
      navigation.navigate("PrintParcel");
    } catch (error: any) {
      console.error("Parcel submission error:", error);
      Toast.show({
        type: "error",
        text1: "Submission Failed",
        text2: error.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
    console.log({ formData });
  };

  // Styles
  const $bodyHeader: ViewStyle = {
    padding: RFValue(16),
    flexDirection: "column",
    gap: 6,
  };
  const $buttonsContainer: ViewStyle = {
    padding: RFValue(16),
  };

  return (
    <CustomView style={{ paddingVertical: RFValue(10) }}>
      {loading && <Spinner />}
      <BackButton onClick={() => navigation.goBack()} />
      <StepProgress step={2} totalSteps={2} />
      {/* Body */}
      <KeyBoardView padded={false}>
        <View style={$bodyHeader}>
          <Text font="SemiBold" size={18}>
            Confirm Parcel Details
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingVertical: 6,
            padding: RFValue(16),
          }}
        >
          <Text size={14}>Status</Text>
          <View
            style={{ backgroundColor: "#FFF8E6", padding: 4, borderRadius: 8 }}
          >
            <Text color="#F79009"> In Transit</Text>
          </View>
        </View>
        {/* Sender's Information */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeader} font="SemiBold" size={14}>
            Sender's Information
          </Text>
          <View
            style={{
              backgroundColor: "white",
              padding: RFValue(6),
              borderRadius: 8,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text style={styles.infoText}>Phone Number:</Text>
              <Text style={styles.infoText}>
                {formData.senderPhoneNumber.replace(/-/g, "")}
              </Text>
            </View>
          </View>
        </View>

        {/* Receiver's Information */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeader} font="SemiBold" size={14}>
            Receiver's Information
          </Text>
          <View
            style={{
              backgroundColor: "white",
              padding: RFValue(6),
              borderRadius: 8,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text style={styles.infoText}>Phone Number:</Text>
              <Text style={styles.infoText}>
                {formData.receiverPhoneNumber.replace(/-/g, "")}
              </Text>
            </View>
          </View>
        </View>

        {/* Driver's Detail */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeader} font="SemiBold" size={14}>
            Driver's Information
          </Text>
          <View
            style={{
              backgroundColor: "white",
              padding: RFValue(6),
              borderRadius: 8,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text style={styles.infoText}>Phone Number:</Text>
              <Text style={styles.infoText}>{formData.driverNumber.replace(/-/g, "")}</Text>
            </View>
          </View>
        </View>
        {/* Park Detail */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeader} font="SemiBold" size={14}>
            Park Detail
          </Text>
          <View
            style={{
              backgroundColor: "white",
              padding: RFValue(6),
              borderRadius: 8,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text style={styles.infoText}>Departure State:</Text>
              <Text style={styles.infoText}> {formData.departureState}</Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text style={styles.infoText}>Destination Motor Park:</Text>
              <Text style={styles.infoText}>{formData.deliveryMotorPark}</Text>
            </View>
          </View>
        </View>

        {/* Parcel Information */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeader} font="SemiBold" size={14}>
            Parcel Information
          </Text>
          <View
            style={{
              backgroundColor: "white",
              padding: RFValue(6),
              borderRadius: 8,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text style={styles.infoText}>Charges Paid By:</Text>
              <Text style={styles.infoText}>{formData.chargesPayBy}</Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text style={styles.infoText}>Parcel Type:</Text>
              <Text style={styles.infoText}>{formData.parcelType}</Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text style={styles.infoText}>Parcel Worth:</Text>
              <Text style={styles.infoText}>{formData.parcelValue}</Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                borderBottomWidth: 1,
                borderBottomColor: "#E9EAEB",
              }}
            >
              <Text style={styles.infoText}>Charges Payable:</Text>
              <Text style={styles.infoText}>{formData.chargesPayable}</Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text style={styles.infoText}>Handling Fee:</Text>
              <Text style={styles.infoText}>
                {formData.handlingFee}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text style={styles.infoText}>Total Paid:</Text>
              <Text style={styles.infoText}>
              {formData.handlingFee && formData.chargesPayable
              ? String(
                  Number(formData.handlingFee) + Number(formData.chargesPayable)
                )
              : ""}
              </Text>
            </View>
          </View>
        </View>

        {/* Parcel Description */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeader} font="SemiBold" size={14}>
            Parcel Description
          </Text>
          <View
            style={{
              backgroundColor: "white",
              padding: RFValue(6),
              borderRadius: 8,
            }}
          >
            <Text style={styles.descriptionText}>
              {formData.parcelDescription}
            </Text>
          </View>
        </View>

        {formData.parcelImages &&
        formData.parcelImages.filter((photo) => photo).length > 0 ? (
          <View style={{ paddingVertical: RFValue(10), padding: RFValue(16) }}>
            <Text style={styles.counter}>
              {formData.parcelImages.filter((photo) => photo !== null).length}
              /2 photos
            </Text>
            <View style={styles.photoGrid}>
              {formData.parcelImages.map((photo, index) => (
                <TouchableOpacity key={index} style={styles.photoBox}>
                  {photo ? (
                    <Image
                      source={{ uri: photo }}
                      style={styles.photoPreview}
                    />
                  ) : (
                    <View></View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ) : (
          <View></View>
        )}
        <View style={$buttonsContainer}>
          <ButtonHome
            onPress={HandleContinue}
            title="Receive Parcel"
            style={{ height: 55 }}
            disabled={!formData.parcelDescription}
          />
        </View>
      </KeyBoardView>
    </CustomView>
  );
};

const styles = StyleSheet.create({
  header: {
    fontSize: RFValue(18),
    fontWeight: "bold",
    marginBottom: RFValue(16),
    textAlign: "center",
  },
  sectionContainer: {
    marginBottom: RFValue(10),
    // paddingVertical: RFValue(12),
    backgroundColor: "#FDFDFD",
    borderRadius: RFValue(8),
    padding: RFValue(16),
  },
  sectionHeader: {
    paddingVertical: RFValue(8),
    borderBottomWidth: 1,
    borderBottomColor: "#E9EAEB",
    marginBottom: RFValue(6),
    color: "#414651",
  },
  infoText: {
    fontSize: RFValue(13),
    marginBottom: RFValue(4),
    color: "#717680",
  },
  descriptionText: {
    fontSize: RFValue(14),
    color: "#717680",
  },
  imageContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: RFValue(16),
  },
  image: {
    width: RFValue(70),
    height: RFValue(70),
    borderRadius: RFValue(8),
  },
  button: {
    backgroundColor: "#4CAF50",
    paddingVertical: RFValue(12),
    borderRadius: RFValue(8),
    alignItems: "center",
  },
  buttonText: {
    fontSize: RFValue(16),
    color: "#fff",
    fontWeight: "bold",
  },
  photoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  photoBox: {
    width: "47%",
    aspectRatio: 1,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
    borderRadius: 10,
    borderColor: "#ddd",
  },
  photoPreview: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  counter: {
    fontSize: 14,
    color: "gray",
    marginBottom: 20,
  },
});

export default ParcelInDriverUnRegisteredPreviewScreen;
