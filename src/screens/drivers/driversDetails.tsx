import { CustomView, Spinner, Text } from "@/components";
import ButtonHome from "@/components/ButtonHome";
import ConfirmPaymentModal from "@/components/ComfirmPaymentModal";
import KeyBoardView from "@/components/KeyBoardView";
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
import { DriverStackList } from "@/navigation/navigationType";
import { RouteProp } from "@react-navigation/native";
import { RFValue } from "react-native-responsive-fontsize";
import { useSelector } from "react-redux";
import HomeHeader from "@/components/share/HomeHeader";
import { Avatar } from "../../../assets/images";

const drivers = [
  {
    id: "1",
    name: "John Doe",
    phone: "+234 812 345 6789",
    driverId: "DR-1001",
    email: "johndoe@email.com",
    homeAddress: "123 Main St, Lagos",
    idType: "National ID",
    idNumber: "NID-123456",
    vehicleType: "Sedan",
    vehicle: "Toyota Camry",
    regNumber: "ABC-123XY",
    motorPark: "Ojota Motor Park",
    date: "2025-03-03",
    parcelAssigned: "",
  },
  {
    id: "2",
    name: "Jane Smith",
    phone: "+234 902 876 5432",
    driverId: "DR-1002",
    email: "janesmith@email.com",
    homeAddress: "456 Broad St, Abuja",
    idType: "Driver's License",
    idNumber: "DL-987654",
    vehicleType: "SUV",
    vehicle: "Honda CR-V",
    regNumber: "XYZ-567AB",
    motorPark: "Gudu Park",
    date: "2025-03-03",
    parcelAssigned: "No",
  },
  {
    id: "3",
    name: "Michael Johnson",
    phone: "+234 701 234 5678",
    driverId: "DR-1003",
    email: "michaelj@email.com",
    homeAddress: "789 Victoria Island, Lagos",
    idType: "Voter's Card",
    idNumber: "VC-112233",
    vehicleType: "Minivan",
    vehicle: "Kia Carnival",
    regNumber: "DEF-456YZ",
    motorPark: "Mile 2 Motor Park",
    date: "2025-03-02",
    parcelAssigned: "Yes",
  },
  {
    id: "4",
    name: "Emily Davis",
    phone: "+234 815 987 6543",
    driverId: "DR-1004",
    email: "emilyd@email.com",
    homeAddress: "22 Lekki Phase 1, Lagos",
    idType: "International Passport",
    idNumber: "P-445566",
    vehicleType: "Truck",
    vehicle: "Mercedes Actros",
    regNumber: "GHI-789WX",
    motorPark: "Ojuelegba Park",
    date: "2025-03-02",
    parcelAssigned: "No",
  },
  {
    id: "5",
    name: "James Brown",
    phone: "+234 808 654 3210",
    driverId: "DR-1005",
    email: "jamesb@email.com",
    homeAddress: "Ikeja, Lagos",
    idType: "National ID",
    idNumber: "NID-789101",
    vehicleType: "Bus",
    vehicle: "Toyota HiAce",
    regNumber: "JKL-012MN",
    motorPark: "Ikeja Park",
    date: "2025-03-01",
    parcelAssigned: "Yes",
  },
  {
    id: "6",
    name: "Grace Wilson",
    phone: "+234 806 213 5478",
    driverId: "DR-1006",
    email: "gracew@email.com",
    homeAddress: "Surulere, Lagos",
    idType: "Driver's License",
    idNumber: "DL-345678",
    vehicleType: "Pickup",
    vehicle: "Ford Ranger",
    regNumber: "MNO-345PQ",
    motorPark: "Surulere Terminal",
    date: "2025-03-01",
    parcelAssigned: "No",
  },
  {
    id: "7",
    name: "Samuel Green",
    phone: "+234 705 987 6321",
    driverId: "DR-1007",
    email: "samuelg@email.com",
    homeAddress: "Yaba, Lagos",
    idType: "Voter's Card",
    idNumber: "VC-667788",
    vehicleType: "SUV",
    vehicle: "Lexus RX",
    regNumber: "PQR-678ST",
    motorPark: "Yaba Motor Park",
    date: "2025-02-28",
    parcelAssigned: "Yes",
  },
  {
    id: "8",
    name: "Olivia Adams",
    phone: "+234 813 678 5432",
    driverId: "DR-1008",
    email: "oliviaa@email.com",
    homeAddress: "Victoria Island, Lagos",
    idType: "International Passport",
    idNumber: "P-778899",
    vehicleType: "Hatchback",
    vehicle: "Volkswagen Golf",
    regNumber: "STU-901VW",
    motorPark: "VI Bus Stop",
    date: "2025-02-28",
    parcelAssigned: "No",
  },
  {
    id: "9",
    name: "William Clark",
    phone: "+234 814 567 2345",
    driverId: "DR-1009",
    email: "williamc@email.com",
    homeAddress: "Ogudu, Lagos",
    idType: "National ID",
    idNumber: "NID-112233",
    vehicleType: "Truck",
    vehicle: "MAN TGS",
    regNumber: "VWX-234YZ",
    motorPark: "Ogudu Terminal",
    date: "2025-02-27",
    parcelAssigned: "Yes",
  },
  {
    id: "10",
    name: "Sophia Martinez",
    phone: "+234 810 345 6789",
    driverId: "DR-1010",
    email: "sophiam@email.com",
    homeAddress: "Iyana Ipaja, Lagos",
    idType: "Driver's License",
    idNumber: "DL-889900",
    vehicleType: "Minivan",
    vehicle: "Nissan Quest",
    regNumber: "YZA-567BC",
    motorPark: "Iyana Ipaja Park",
    date: "2025-02-27",
    parcelAssigned: "No",
  },
  {
    id: "11",
    name: "Benjamin White",
    phone: "+234 907 112 2334",
    driverId: "DR-1011",
    email: "benjaminw@email.com",
    homeAddress: "Festac, Lagos",
    idType: "National ID",
    idNumber: "NID-334455",
    vehicleType: "Bus",
    vehicle: "Mercedes Sprinter",
    regNumber: "BCD-678EF",
    motorPark: "Festac Motor Park",
    date: "2025-02-26",
    parcelAssigned: "Yes",
  },
  {
    id: "12",
    name: "Emma Rodriguez",
    phone: "+234 909 334 5567",
    driverId: "DR-1012",
    email: "emmar@email.com",
    homeAddress: "Ajah, Lagos",
    idType: "Voter's Card",
    idNumber: "VC-556677",
    vehicleType: "Pickup",
    vehicle: "Isuzu D-Max",
    regNumber: "EFG-901HI",
    motorPark: "Ajah Terminal",
    date: "2025-02-26",
    parcelAssigned: "No",
  },
  {
    id: "13",
    name: "Daniel Scott",
    phone: "+234 912 778 8899",
    driverId: "DR-1013",
    email: "daniels@email.com",
    homeAddress: "Ikeja, Lagos",
    idType: "International Passport",
    idNumber: "P-990011",
    vehicleType: "SUV",
    vehicle: "Range Rover Evoque",
    regNumber: "HIJ-234KL",
    motorPark: "Ikeja Bus Stop",
    date: "2025-02-25",
    parcelAssigned: "Yes",
  },
  // Add more as needed...
];
// Define the props correctly
type Props = NativeStackScreenProps<DriverStackList, "DriversDetails">;

// OR if you only need the `route` prop:
interface RouteProps {
  route: RouteProp<DriverStackList, "DriversDetails">;
}
const DriversDetails = ({ route }: Props) => {
    const { idFrontImage, idBackImage } = useSelector(
      (state: RootState) => state.form
    );
  const { id } = route.params;
  const driver = drivers.find((x) => x.id === id) ?? {
    id: "Nill",
    name: "Nill",
    phone: "Nill",
    driverId: "Nill",
    email: "Nill",
    homeAddress: "Nill",
    idType: "Nill",
    idNumber: "Nill",
    vehicleType: "Nill",
    vehicle: "Nill",
    regNumber: "Nill",
    motorPark: "Nill",
    date: "Nill",
    parcelAssigned: "Nill",
  };

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
          {/* Profile Image */}
          <Image
            source={Avatar}
            style={{
              width: 84,
              height: 84,
              borderRadius: 42,
              backgroundColor: "#E0E0E0",
            }}
            resizeMode="cover"
          />
          <TouchableOpacity
            style={{
              backgroundColor: "",
              padding: RFValue(4),
              borderRadius: RFValue(6),
            }}
          >
            <Text font="Regular" size={12} color="#F04438">
              Inactive
            </Text>
          </TouchableOpacity>
        </View>
        <View style={$bodyHeader}>
          <Text font="SemiBold" size={16}>
            {driver.name}
          </Text>
          <View
            style={{
              borderWidth: 1,
              padding: RFValue(6),
              borderRadius: RFValue(8),
              borderColor: "#E9EAEB",
            }}
          >
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
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text style={styles.infoText}>Phone Number </Text>
              <Text style={styles.infoText}>{driver?.phone} </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text style={styles.infoText}>Driver ID </Text>
              <Text style={styles.infoText}>{driver?.driverId} </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text style={styles.infoText}>Email</Text>
              <Text style={styles.infoText}>{driver?.email} </Text>
            </View>
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
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text style={styles.infoText}>Home address</Text>
              <Text style={styles.infoText}>{driver.homeAddress} </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text style={styles.infoText}>ID type </Text>
              <Text style={styles.infoText}>{driver.idType} </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text style={styles.infoText}>ID number</Text>
              <Text style={styles.infoText}>{driver.idNumber}</Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text style={styles.infoText}>Vehicle type</Text>
              <Text style={styles.infoText}>{driver.vehicleType}</Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text style={styles.infoText}>Vehicle reg. number</Text>
              <Text style={styles.infoText}>{driver.vehicle}</Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text style={styles.infoText}>Vehicle type</Text>
              <Text style={styles.infoText}>{driver.vehicleType}</Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text style={styles.infoText}>Motor park location</Text>
              <Text style={styles.infoText}>{driver.motorPark}</Text>
            </View>
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
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text style={styles.infoText}>Registered Date</Text>
              <Text style={styles.infoText}>{driver.date}</Text>
            </View>
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
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text style={styles.infoText}>Parcel Assigned</Text>
              <Text style={styles.infoText}>{driver.parcelAssigned}</Text>
            </View>
          </View>
        </View>
        {/* image id Information */}
        <View style={styles.sectionContainer}>
          <Text style={styles.title}>Front Image</Text>
          <Image source={{ uri: idFrontImage }} style={styles.image} />
          <Text style={styles.title}>Back Image</Text>
          <Image source={{ uri: idBackImage }} style={styles.image} />
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
    fontSize: RFValue(14),
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
