import { CustomView, Input, Spinner, Text } from "@/components";
import ButtonHome from "@/components/ButtonHome";
import KeyBoardView from "@/components/KeyBoardView";
import BackButton from "@/components/share/BackButton";
import ShootButton from "@/components/svg/ShootButton";
import { HomeStackList } from "@/navigation/navigationType";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ViewStyle,
  Image,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import Toast from "react-native-toast-message";
import {
  getAllParcel,
  getSingleParcelData,
} from "../../../../../services/parcel";
import { singleParcelInterface } from "@/utils/interface";
import { formatDate } from "@/utils/formartDates";

type Props = NativeStackScreenProps<HomeStackList>;
const SearchParcelOut = ({ navigation }: Props) => {
  const [parcelId, setParcelId] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<singleParcelInterface[]>(
    []
  ); // ⬅ Store multiple parcels
  const [isPhoneSearch, setIsPhoneSearch] = useState(false);
  // Function to simulate barcode scanning
  const handleScanBarcode = () => {
    navigation.navigate("BarcodeScannerScreen");
  };
  const getStatusStyles = (status: string) => {
    switch (status.toLowerCase()) {
      case "unassigned":
        return { backgroundColor: "#FFEAD5", textColor: "#FB6514" };
      case "assigned":
        return { backgroundColor: "#E0F2FE", textColor: "#0284C7" };
      case "arrived":
        return { backgroundColor: "#EBE9FE", textColor: "#7A5AF8" };
      case "overdue":
        return { backgroundColor: "#FEE2E2", textColor: "#DC2626" };
      case "received":
        return { backgroundColor: "#DFFCE9", textColor: "#12B76A" };
      default:
        return { backgroundColor: "#E5E7EB", textColor: "#374151" };
    }
  };

  // Function to handle parcel search
  // const handleSearchParcel = async() => {
  //   if (!parcelId) {
  //     Alert.alert('Please enter a parcel ID!');
  //     return;
  //   }
  //   setLoading(true);

  //   try {
  //     const result = await getSingleParcelData(parcelId);

  //     // ✅ Save to local storage
  //     await AsyncStorage.setItem('singleParcelData', JSON.stringify(result?.data?.details?.rows[0]));

  //     Toast.show({
  //       type: "success",
  //       text1: "Success",
  //       text2: result?.data?.message || "Parcel loaded!",
  //     });

  //     navigation.navigate('ParcelDriverOutPreviewScreen');
  //   } catch (error: any) {
  //     console.error("Parcel submission error:", error);

  //     Toast.show({
  //       type: "error",
  //       text1: "Submission Failed",
  //       text2: error.message || "Something went wrong",
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const handleSearchParcel = async () => {
    if (!parcelId) {
      Alert.alert("Please enter a parcel ID or phone number!");
      return;
    }

    setLoading(true);
    setSearchResults([]); // Clear previous results

    try {
      if (parcelId.length === 11) {
        // Likely a phone number
        setIsPhoneSearch(true);
        const result = await getAllParcel(parcelId); // ✅ Replace with real service
        const arrivedParcels = (result?.data?.details?.rows || []).filter(
          (parcel: any) => parcel.status?.toLowerCase() === "arrived"
        );

        setSearchResults(arrivedParcels);
      } else {
        setIsPhoneSearch(false);
        const result = await getSingleParcelData(parcelId);
        await AsyncStorage.setItem(
          "singleParcelData",
          JSON.stringify(result?.data?.details?.rows[0])
        );
        Toast.show({
          type: "success",
          text1: "Success",
          text2: result?.data?.message || "Parcel loaded!",
        });
        navigation.navigate("ParcelDriverOutPreviewScreen");
      }
    } catch (error: any) {
      console.error("Parcel submission error:", error);
      Toast.show({
        type: "error",
        text1: "Failed",
        text2: error.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  // Helper to generate random 10-digit number
  const generateRandomNumbers = (length: number) => {
    let result = "";
    for (let i = 0; i < length; i++) {
      result += Math.floor(Math.random() * 10);
    }
    return result;
  };

  // Styles
  const $bodyHeader: ViewStyle = {
    flexDirection: "column",
    gap: 6,
    paddingVertical: RFValue(16),
  };
  const $buttonsContainer: ViewStyle = {
    paddingVertical: RFValue(16),
  };

  return (
    <CustomView style={{ paddingVertical: RFValue(10) }}>
      {loading && (
        <Spinner
          message={`Processing your Parcel Please wait.....`}
          width={"65%"}
          height={200}
        />
      )}
      <BackButton onClick={() => navigation.goBack()} />
      {/* Body */}
      <KeyBoardView padded={true}>
        <View style={$bodyHeader}>
          <Text font="SemiBold" size={18}>
            Parcel Out-Driver
          </Text>
        </View>
        <>
          {/* Barcode Scanner */}
          <TouchableOpacity
            style={styles.scanButton}
            onPress={handleScanBarcode}
          >
            <ShootButton />
            <Text style={styles.scanButtonText}>Scan Barcode</Text>
          </TouchableOpacity>

          {/* OR Divider */}
          <View style={styles.orContainer}>
            <View style={styles.divider} />
            <Text style={styles.orText}>OR</Text>
            <View style={styles.divider} />
          </View>

          {/* Parcel Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Input Parcel ID</Text>

            <Input
              label="Parcel ID"
              placeholder="Enter parcel ID/phone no"
              placeholderTextColor="#B8C2CC"
              keyboardType="number-pad"
              value={parcelId}
              onChangeText={(text) => setParcelId(text)}
            />
          </View>

          {/* Search Button */}
          <View style={$buttonsContainer}>
            <ButtonHome
              onPress={handleSearchParcel}
              title="Search Parcel"
              style={{ height: 55 }}
              disabled={!parcelId}
              textColor="#61616B"
            />
          </View>
          {isPhoneSearch && searchResults.length > 0 && (
            <View style={{ paddingTop: 10 }}>
              <Text font="SemiBold" size={16} style={{ marginBottom: 8 }}>
                Matching Parcels:
              </Text>
              {searchResults.map((parcel, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={async () => {
                    await AsyncStorage.setItem(
                      "singleParcelData",
                      JSON.stringify(parcel)
                    );
                    navigation.navigate("ParcelReceiverOutPreviewScreen");
                  }}
                  style={styles.shipmentRow}
                >
                  <Image
                    source={{ uri: parcel?.parcel?.thumbnails[0] }}
                    style={styles.shipmentImage}
                  />

                  <View style={styles.shipmentDetails}>
                    <View style={{ flexDirection: "column", gap: 4 }}>
                      <Text size={RFValue(11)} color="#717680">
                        Sender
                      </Text>
                      <Text size={RFValue(10)}>
                        {parcel.sender.fullName
                          ? parcel.sender.fullName
                          : parcel.sender.phone}
                      </Text>
                      <Text size={10} color="#717680">
                        {formatDate(parcel.createdAt)}
                      </Text>
                    </View>
                    <View style={{ flexDirection: "column", gap: 4 }}>
                      <Text size={10} color="#717680">
                        Receiver
                      </Text>
                      <Text size={RFValue(10)}>
                        {parcel?.receiver.fullName
                          ? parcel?.receiver.fullName
                          : parcel?.receiver.phone}
                      </Text>
                    </View>
                    <View style={{ flexDirection: "column", gap: 4 }}>
                      <Text size={10} color="#717680">
                        Charges
                      </Text>
                      <Text size={RFValue(10)}>₦{parcel?.parcel.totalFee}</Text>

                      <View
                        style={{
                          backgroundColor:
                            parcel.status === "unassigned"
                              ? "#FFEAD5"
                              : parcel.status === "assigned"
                              ? "#E0F2FE"
                              : parcel.status === "arrived"
                              ? "#EBE9FE"
                              : parcel.status === "overdue"
                              ? "#FEE2E2"
                              : parcel.status === "received"
                              ? "#DFFCE9"
                              : "#E5E7EB", // default fallback
                          padding: 4,
                          borderRadius: 8,
                        }}
                      >
                        <Text
                          style={{
                            color:
                              parcel.status === "unassigned"
                                ? "#FB6514"
                                : parcel.status === "assigned"
                                ? "#0284C7"
                                : parcel.status === "arrived"
                                ? "#7A5AF8"
                                : parcel.status === "overdue"
                                ? "#DC2626"
                                : parcel.status === "received"
                                ? "#12B76A"
                                : "#374151", // default fallback
                            fontSize: RFValue(10),
                          }}
                        >
                          {parcel.status}
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
              {searchResults.length === 0 && (
                <View style={{ alignItems: "center", marginTop: 20 }}>
                  <Text font="Regular" size={10} color="#717680">
                    No parcels found for this phone number.
                  </Text>
                </View>
              )}
            </View>
          )}
        </>
      </KeyBoardView>
    </CustomView>
  );
};
export default SearchParcelOut;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  shipmentImage: {
    width: RFValue(40),
    height: RFValue(40),
    borderRadius: RFValue(20),
    marginRight: RFValue(10),
  },
  shipmentRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: RFValue(10),
    borderRadius: RFValue(10),
    marginBottom: RFValue(8),
    borderBottomWidth: 1,
    borderBottomColor: "#EFEFF0",
  },
  shipmentDetails: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  scanButton: {
    backgroundColor: "#E6FFDB",
    padding: 15,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },
  scanButtonText: {
    color: "#1b4e73",
    fontSize: 18,
    fontWeight: "600",
  },
  orContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#ddd",
  },
  orText: {
    marginHorizontal: 10,
    color: "#aaa",
    fontSize: 14,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#555",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    width: "100%",
    backgroundColor: "#f9f9f9",
  },
  searchButton: {
    backgroundColor: "#eee",
    padding: 15,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  searchButtonText: {
    color: "#555",
    fontSize: 18,
    fontWeight: "600",
  },
});
