import { CustomView, Spinner, Text } from "@/components";
import ButtonHome from "@/components/ButtonHome";
import ConfirmPaymentModal from "@/components/ComfirmPaymentModal";
import KeyBoardView from "@/components/KeyBoardView";
import { RootState } from "@/redux/store";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Ionicons } from '@expo/vector-icons';

import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import { DriverStackList } from "@/navigation/navigationType";
import { RouteProp } from "@react-navigation/native";
import { RFValue } from "react-native-responsive-fontsize";
import { useSelector } from "react-redux";
import HomeHeader from "@/components/share/HomeHeader";
import { Avatar } from "../../../assets/images";
import { apiKey, getAllDrivers, getToken } from "../../../services/auth";
import { resetForm } from "@/redux/slices/formSlice";
import { useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
type Driver = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  identificationType: string | null;
  identificationNumber: string | null;
  identificationImages: string[] | null; // assuming it's an array of image URLs
  vehicleType: string;
  vehicleRegistrationNumber: string;
  userImage: string | null;
  isActive: boolean;
  isKycComplete: boolean;
  driverId: string;
  parcelAssigned: number;
  parkLocation: string;
  addedBy: string;
  createdAt: string; // ISO format like "2025-04-23T16:04:39.645Z"
};
// Define the props correctly
type Props = NativeStackScreenProps<DriverStackList, "DriversDetails">;

// OR if you only need the `route` prop:
interface RouteProps {
  route: RouteProp<DriverStackList, "DriversDetails">;
}
const DriversDetails = ({ navigation,route }: Props) => {
  const [allDrivers, setAllDrivers] = useState<Driver[]>([]);
  const { idFrontImage, idBackImage } = useSelector(
    (state: RootState) => state.form
  );
  const dispatch = useDispatch();
  const { id } = route.params;

    useEffect(() => {
      const fetchDrivers = async () => {
        try {
          const token = await getToken();
          const response = await fetch(`${apiKey}/users?userType=driver`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });
    
          const result = await response.json();
    
          if (!response.ok) {
            throw new Error(result.message || 'Failed to fetch drivers');
          }
    
          console.log(result, 'result');
          setAllDrivers(result?.data?.details?.rows);
        } catch (error) {
          console.error('Failed to fetch drivers:', error);
        }
      };
    
      fetchDrivers();
    }, []);
    

  const driver = allDrivers.find((x) => x.id === id) ?? {
    id: "Nill",
    firstName: "Nill",
    lastName: "Nill",
    email: "Nill",
    phone: "Nill",
    address: "Nill",
    dateOfBirth: "Nill",
    identificationType: "Nill",
    identificationNumber: "Nill",
    identificationImages: null,
    vehicleType: "Nill",
    vehicleRegistrationNumber: "Nill",
    userImage: null,
    isActive: false,
    isKycComplete: false,
    driverId: "Nill",
    parcelAssigned: 0,
    parkLocation: "Nill",
    addedBy: "Nill",
    createdAt: "Nill",
  };
  const saveDriverDetails = async () => {
    await AsyncStorage.setItem('driver', JSON.stringify(driver));
    await AsyncStorage.setItem('driverId', driver?.id);
  };

  useEffect(() => {
    saveDriverDetails();
  }, [driver]);

  // Styles
  const $bodyHeader: ViewStyle = {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: RFValue(20),
    paddingHorizontal: RFValue(12),
  };
  const $buttonsContainer: ViewStyle = {
    padding: RFValue(16),
  };
  const InfoRow = ({ label, value }: { label: string; value: string }) => (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Text style={styles.descriptionText}>{label}</Text>
      <Text style={styles.infoText}>{value}</Text>
    </View>
  );

  return (
    <CustomView style={{ paddingVertical: RFValue(10) }}>
      <View style={{ paddingHorizontal: RFValue(10) }}>
        <HomeHeader type="Stack" title="Driver’s Profile" />
      </View>

      {/* Body */}
      <KeyBoardView padded={false}>
        <View
          style={{
            flexDirection: "column",
            alignItems: "center",
            marginTop: RFValue(16),
            gap: RFValue(12),
          }}
        >
     {driver.userImage ? (
  <Image
    source={{ uri: driver.userImage }}
    style={{
      width: 84,
      height: 84,
      borderRadius: 42,
      backgroundColor: "#E0E0E0",
    }}
    resizeMode="cover"
  />
) : (
  <View
    style={{
      width: 84,
      height: 84,
      borderRadius: 42,
      backgroundColor: "#E0E0E0",
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#555' }}>
      {driver.firstName?.[0]?.toUpperCase() || ''}
      {driver.lastName?.[0]?.toUpperCase() || ''}
    </Text>
  </View>
)}

      <TouchableOpacity
      style={{
        backgroundColor:  driver.isActive ? "#ECFDF3" : "#FEF3F2",
        padding: RFValue(4),
        borderRadius: RFValue(6),
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      {/* Conditional Icon and Text */}
      <Ionicons
        name={driver.isActive ? "checkmark-circle" : "close-circle"}
        size={RFValue(16)}
        color={driver.isActive ? "#12B76A" : "#F04438"}
      />
      <Text
        font="Regular"
        size={12}
        color={driver.isActive ? "#12B76A" : "#F04438"}
        style={{ marginLeft: RFValue(4) }}
      >
        {driver.isActive ? "Active" : "Inactive"}
      </Text>

    </TouchableOpacity>
        </View>

        <View style={$bodyHeader}>
          <Text font="SemiBold" size={16}>
            {driver.firstName} {driver.lastName}
          </Text>
          <View
      style={{
        borderWidth: 1,
        padding: RFValue(6),
        borderRadius: RFValue(8),
        borderColor: "#E9EAEB",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {/* Delete Profile Section */}
      <Ionicons
        name="trash-bin"
        size={RFValue(14)}
        color="#000"
      />
      <Text size={12} font="Medium" color="#717680">
        Delete Profile
      </Text>
    </View>

        </View>

        {/* Sender's Information */}
        <View style={styles.sectionContainer}>
          <View
            style={{
              backgroundColor: "white",
              padding: RFValue(6),
              borderRadius: 8,
            }}
          >
            <InfoRow label="Phone Number" value={driver.phone} />
            <InfoRow label="Driver ID" value={driver.driverId} />
            <InfoRow label="Email" value={driver.email} />
          </View>
        </View>

        {/* Receiver's Information */}
        <View style={styles.sectionContainer}>
          <View
            style={{
              backgroundColor: "white",
              padding: RFValue(6),
              borderRadius: 8,
            }}
          >
            <InfoRow label="Home address" value={driver.address} />
            <InfoRow
              label="ID type"
              value={driver.identificationType ?? "N/A"}
            />
            <InfoRow
              label="ID number"
              value={driver.identificationNumber ?? "N/A"}
            />
            <InfoRow label="Vehicle type" value={driver.vehicleType} />
            <InfoRow
              label="Vehicle reg. number"
              value={driver.vehicleRegistrationNumber}
            />
            <InfoRow label="Motor park location" value={driver.parkLocation} />
          </View>
        </View>

        {/* Park Detail */}
        <View style={styles.sectionContainer}>
          <View
            style={{
              backgroundColor: "white",
              padding: RFValue(6),
              borderRadius: 8,
            }}
          >
            <InfoRow
              label="Registered Date"
              value={driver.createdAt?.split("T")[0] ?? "N/A"}
            />
          </View>
        </View>

        {/* Parcel Information */}
        <View style={styles.sectionContainer}>
          <View
            style={{
              backgroundColor: "white",
              padding: RFValue(6),
              borderRadius: 8,
            }}
          >
            <InfoRow
              label="Parcel Assigned"
              value={driver.parcelAssigned.toString()}
            />
          </View>
        </View>

        {/* image id Information */}
        {Array.isArray(driver.identificationImages) && driver.identificationImages.length >= 2 ? (
  <View style={styles.sectionContainer}>
    <Text style={styles.title}>Front Image</Text>
    <Image
      source={{ uri: driver.identificationImages[0] }}
      style={styles.image}
    />
    <Text style={styles.title}>Back Image</Text>
    <Image
      source={{ uri: driver.identificationImages[1] }}
      style={styles.image}
    />
  </View>
) : (
  <View style={styles.sectionContainer}>
    <Text style={styles.title}>Identification Images Not Available</Text>
    <TouchableOpacity 
      style={styles.button} 
      onPress={() => {
        // 👉 navigate or open KYC completion screen
        dispatch(resetForm());
        navigation.navigate('FacialVerification'); // change to your screen name
      }}
    >
      <Text style={styles.buttonText}>Complete Driver Registration / KYC</Text>
    </TouchableOpacity>
  </View>
)}

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
  confirmButton: {
    backgroundColor: "#FAFAFA",
    borderRadius: RFValue(8),
    paddingVertical: RFValue(12),
    alignItems: "center",
  },
  confirmButtonText: {
    fontSize: RFValue(14),
    fontWeight: "400",
    color: "#000",
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
  },
  infoText: {
    fontSize: RFValue(10),
    marginBottom: RFValue(4),
    color: "#252B37",
  },
  descriptionText: {
    fontSize: RFValue(10),
    marginBottom: RFValue(4),
    color: "#717680",
  },
  imageContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: RFValue(16),
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
  title: { textAlign: "center", marginBottom: 16 },
  image: { width: "100%", height: 200, alignSelf: "center", marginBottom: 16 },
});

export default DriversDetails;
