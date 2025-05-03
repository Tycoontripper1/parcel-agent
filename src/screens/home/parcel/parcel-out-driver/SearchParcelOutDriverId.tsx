import { CustomView, Input, Spinner, Text } from "@/components";
import ButtonHome from "@/components/ButtonHome";
import KeyBoardView from "@/components/KeyBoardView";
import PhoneNumberInput from "@/components/PhoneNumberInput";
import BackButton from "@/components/share/BackButton";
import ShootButton from "@/components/svg/ShootButton";
import { HomeStackList } from "@/navigation/navigationType";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Alert,
  ViewStyle,
  TouchableOpacity,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import Toast from "react-native-toast-message";
import {
  getParcelDetails,
  getSingleParcel,
  updateParcel,
} from "../../../../../services/parcel";
import { UserDetails } from "@/utils/interface";
import { apiKey, getDriverById, getToken } from "../../../../../services/auth";

type Props = NativeStackScreenProps<HomeStackList>;
const SearchParcelOutDriverId = ({ navigation }: Props) => {
  const [driverId, setDriverId] = useState("");
  const [isRegistered, setIsRegistered] = useState(true);
  const [driverName, setDriverName] = useState("");
  const [driverPhone, setDriverPhone] = useState("");
  const [registeredDriverName, setRegisteredDriverName] = useState("");
  const [registeredDriverPhone, setRegisteredDriverPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [parcelDetail, setParcelDetails] = useState<UserDetails | null>(null);

  useEffect(() => {
    const fetchParcel = async () => {
      const parcelDetails = await getSingleParcel();
      console.log(parcelDetails, "userDetails");
      setParcelDetails(parcelDetails.id);
    };
    fetchParcel();
  }, []);

  // Debounced effect
useEffect(() => {
  if (driverId.length === 8) {
    const timeout = setTimeout(() => {
      fetchDriverById(driverId);
    }, 300); // wait 300ms after last input

    return () => clearTimeout(timeout); // cleanup timeout if user keeps typing
  }
}, [driverId]);

  // Function to handle parcel search
  const handleSubmit = async () => {
    setLoading(true);

    // try {
    //   const payload = {
    //     // parcelId,
    //     firstName: isRegistered ? setRegisteredDriverName : driverName,
    //     phone: isRegistered ? setRegisteredDriverPhone : driverPhone,
    //     status: "In-Transit",
    //   };

    //   const result = await updateParcel(payload, parcelDetail);

    //   setTimeout(() => {
    //     setLoading(false);
    //     Toast.show({
    //       type: "success",
    //       text1: "Success",
    //       text2: result?.data?.message ||"Parcel released!",
    //     });
    //     navigation.navigate("ParcelCongratulation", {
    //       message: "Parcel released successfully",
    //       note: "",
    //     });
    //   }, 3000);

    //   // }
    // } catch (error:any) {
    //   console.error("Failed to submit:", error);
    //   setLoading(false);
    //   Toast.show({
    //     type: "error",
    //     text1: "Error",
    //     text2: error.message ||"Failed to release parcel",
    //   });
    // }
      const payload = {
        // parcelId,
        firstName: isRegistered ? setRegisteredDriverName : driverName,
        phone: isRegistered ? setRegisteredDriverPhone : driverPhone,
        status: "In-Transit",
      };

    try {
      const token = await getToken();
      const response =  await fetch(`${apiKey}/shipment/${parcelDetail}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        throw new Error(result.message || 'Unable to fetch driver information.');
      }
  
      console.log(result, "Fetched Driver Details");
            setTimeout(() => {
        setLoading(false);
        Toast.show({
          type: "success",
          text1: "Success",
          text2: result?.data?.message ||"Parcel released!",
        });
        navigation.navigate("ParcelCongratulation", {
          message: "Parcel released successfully",
          note: "",
        });
      }, 3000);
  
      
    } catch (error: any) {
      console.error("Failed to fetch driver:", error);
      Toast.show({
        type: "error",
        text1: "Fetch Error",
        text2: error.message || "Failed to fetch driver details. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };










  const [fetched, setFetched] = useState(false);
  const fetchDriverById = async (id: string) => {
    setLoading(true);
    try {
      const token = await getToken();
      const response = await fetch(`${apiKey}/users?userType=driver&driverId=${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        throw new Error(result.message || 'Unable to fetch driver information.');
      }
  
      console.log(result, "Fetched Driver Details");
  
      const driver = result?.data?.details?.rows?.[0];
      if (driver) {
        setRegisteredDriverName(`${driver.firstName} ${driver.lastName}` || "");
        setRegisteredDriverPhone(driver.phone || "");
        setFetched(true);
      } else {
        Toast.show({
          type: "info",
          text1: "No Driver Found",
          text2: "The requested driver could not be located.",
        });
      }
  
    } catch (error: any) {
      console.error("Failed to fetch driver:", error);
      Toast.show({
        type: "error",
        text1: "Fetch Error",
        text2: error.message || "Failed to fetch driver details. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };
  

  // Styles
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
      {/* Body */}
      <KeyBoardView padded={true}>
        <View style={$bodyHeader}>
          <Text font="SemiBold" size={18}>
            Parcel Out-Driver
          </Text>
        </View>
        <>
          <View style={{ gap: 12, marginBottom: 20 }}>
            {/* Registered Option */}
            <TouchableOpacity
              onPress={() => setIsRegistered(true)}
              style={[
                styles.radioCard,
                isRegistered && styles.radioCardSelected,
              ]}
            >
              <Ionicons
                name={isRegistered ? "radio-button-on" : "radio-button-off"}
                size={20}
                color={isRegistered ? "#4CAF50" : "#999"}
              />
              <Text
                font="Medium"
                style={{
                  marginLeft: 10,
                  color: isRegistered ? "#4CAF50" : "#333",
                }}
              >
                Registered Driver
              </Text>
            </TouchableOpacity>

            {/* Not Registered Option */}
            <TouchableOpacity
              onPress={() => setIsRegistered(false)}
              style={[
                styles.radioCard,
                !isRegistered && styles.radioCardSelected,
              ]}
            >
              <Ionicons
                name={!isRegistered ? "radio-button-on" : "radio-button-off"}
                size={20}
                color={!isRegistered ? "#4CAF50" : "#999"}
              />
              <Text
                font="Medium"
                style={{
                  marginLeft: 10,
                  color: !isRegistered ? "#4CAF50" : "#333",
                }}
              >
                Not Registered
              </Text>
            </TouchableOpacity>
          </View>

          {isRegistered ? (
            <>
              <View style={styles.inputContainer}>
                <Text style={styles.label} font="Medium" size={16}>
                  Input Driver ID
                </Text>
                <Input
                  label="Driver ID/Phone Number"
                  placeholder="Enter driver ID"
                  placeholderTextColor="#B8C2CC"
                  keyboardType="default"
                  value={driverId}
                  onChangeText={(text) => setDriverId(text)}
                />
              </View>
              {fetched && (
  <View style={[styles.outputContainer, styles.checkedContainer]}>
    <TouchableOpacity>
      <Ionicons
        name="checkmark-circle"
        size={24}
        color="#4CAF50"
      />
    </TouchableOpacity>
    <View style={styles.infoContainer}>
      <Text style={styles.name}>Name</Text>
      <Text style={styles.phone}>{registeredDriverName}</Text> 
    </View>
    <View style={styles.infoContainer}>
      <Text style={styles.name}>Phone Number</Text>
      <Text style={styles.phone}>{registeredDriverPhone}</Text>
    </View>
  </View>
)}

            </>
          ) : (
            <>
              {/* If not registered, ask for Name and Phone */}
              <View style={styles.inputContainer}>
                <Text style={styles.label} font="Medium" size={16}>
                  Driver Name
                </Text>
                <Input
                  label="Driver Name"
                  placeholder="Enter driver name"
                  placeholderTextColor="#B8C2CC"
                  value={driverName}
                  onChangeText={setDriverName}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label} font="Medium" size={16}>
                  Phone Number
                </Text>
                <Input
                  label="Phone Number"
                  placeholder="Enter phone number"
                  placeholderTextColor="#B8C2CC"
                  keyboardType="phone-pad"
                  value={driverPhone}
                  onChangeText={setDriverPhone}
                />
              </View>
            </>
          )}
          <ButtonHome
            onPress={handleSubmit}
            title="Release Parcel"
            style={{ height: 55 }}
            disabled={isRegistered ? !driverId : !(driverName && driverPhone)}
            textColor="#61616B"
          />
        </>
      </KeyBoardView>
    </CustomView>
  );
};
export default SearchParcelOutDriverId;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
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
  radioCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  radioCardSelected: {
    backgroundColor: "#E6FFDB",
    borderColor: "#4CAF50",
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
  outputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    margin: 8,
    backgroundColor: "#f9fff4",
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#ddd",
  },
  checkedContainer: {
    borderColor: "#4CAF50",
  },

  infoContainer: {
    flexDirection: "column",
    marginLeft: 16,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  phone: {
    fontSize: 14,
    color: "#555",
  },
});
