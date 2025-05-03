import { View, ViewStyle } from "react-native";
import React, { useState } from "react";
import { RFValue } from "react-native-responsive-fontsize";
import { CustomView, Input, Spinner, Text } from "@/components";
import StepProgress from "@/components/share/StepProgress";
import KeyBoardView from "@/components/KeyBoardView";
import Toast from "react-native-toast-message";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { DriverStackList } from "@/navigation/navigationType";
import ButtonHome from "@/components/ButtonHome";
import BackButton from "@/components/share/BackButton";
import SelectInput from "@/components/SelectInput";
import { FormatPhoneNumber11 } from "@/components/FormatNumber";
import { onboardingDriver } from "../../../../services/auth";
import { Helper } from "@/helper/helper";
import AsyncStorage from "@react-native-async-storage/async-storage";
type Props = NativeStackScreenProps<DriverStackList>;

const ScreenOne = ({ navigation }: Props) => {
  const [phoneError, setPhoneError] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    senderEmail: "",
    senderPhoneNumber: "",
    senderAddress: "",
    idType: "",
    idNumber: "",
    vehicleType: "",
    vehicleRegistrationNumber: "",
    motorParkLocation: "",
  });

  // Handle input change dynamically
  const handleChange = (label: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [label]: value,
    }));
  };
  const formatPhoneNumber = (value: any) => {
    const digits = value.replace(/\D/g, "").slice(0, 11);

    if (digits.length <= 4) {
      return digits;
    } else if (digits.length <= 7) {
      return `${digits.slice(0, 4)}-${digits.slice(4)}`;
    } else {
      return `${digits.slice(0, 4)}-${digits.slice(4, 7)}-${digits.slice(
        7,
        11
      )}`;
    }
  };
  const formatDateInput = (value: any) => {
    const digits = value.replace(/\D/g, "").slice(0, 8); // Max 8 digits

    if (digits.length <= 4) {
      return digits;
    } else if (digits.length <= 6) {
      return `${digits.slice(0, 4)}-${digits.slice(4)}`;
    } else {
      return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6)}`;
    }
  };

  const handleValidation = () => {
    let isValid = true;
    if (!formData.firstName || !formData.lastName) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Full name is required.",
      });
      isValid = false;
    }

    return isValid;
  };

  const handleNavigate = async () => {
    if (!handleValidation()) {
      return;
    }
    setLoading(true);

    try {
      const DriverOnboardingPayload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        dateOfBirth: formData.dateOfBirth,
        email: formData.senderEmail,
        phone: formData.senderPhoneNumber.replace(/\D/g, ''),
        address: formData.senderAddress,
        // identificationType: formData.idType,
        // identificationNumber: formData.idNumber,
        vehicleType: formData.vehicleType,
        vehicleRegistrationNumber: formData.vehicleRegistrationNumber,
        parkLocation: formData.motorParkLocation,
      };

      console.log(DriverOnboardingPayload, "payload");

      const result = await onboardingDriver(DriverOnboardingPayload);
      console.log(result, "✅ Driver Onooarded");
      await AsyncStorage.setItem("driver", JSON.stringify(result?.data?.details));
      await AsyncStorage.setItem("driverId", result?.data?.id);

      Helper.vibrate(); 
      Toast.show({
        type: "success",
        text1: "Success",
        text2: result?.message || "Driver Onboard successfully",
      });

      navigation.navigate("FacialVerification");
    } catch (error: any) {
      console.log(error, "❌ Driver Onboard error");
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  // Styles
  const $bodyHeader: ViewStyle = {
    padding: RFValue(16),
    flexDirection: "column",
    gap: 6,
  };
  const $cardHeader: ViewStyle = {
    padding: RFValue(16),
    backgroundColor: "#FDFDFD",
  };
  const $buttonsContainer: ViewStyle = {
    paddingVertical: RFValue(16),
  };

  return (
    <CustomView style={{ paddingVertical: RFValue(10) }}>
       {loading && <Spinner />}
      <BackButton onClick={() => navigation.goBack()} />
      <StepProgress step={1} totalSteps={3} />

      {/* Body */}
      <KeyBoardView padded={false}>
        <View style={$cardHeader}>
          <Text size={18} style={{ paddingTop: 15, paddingBottom: 10 }}>
            Register Driver
          </Text>
          <Input
            label="First Name"
            placeholder="Enter first name"
            placeholderTextColor="#B8C2CC"
            value={formData.firstName}
            onChangeText={(value) => handleChange("firstName", value)}
            keyboardType="default"
          />

          <Input
            label="Last Name"
            placeholder="Enter last name"
            placeholderTextColor="#B8C2CC"
            value={formData.lastName}
            onChangeText={(value) => handleChange("lastName", value)}
            keyboardType="default"
          />

          <Input
            label="Date of Birth"
            placeholder="YYYY-MM-DD"
            placeholderTextColor="#B8C2CC"
            value={formData.dateOfBirth}
            onChangeText={(value) => {
              const formatted = formatDateInput(value);
              handleChange("dateOfBirth", formatted);
            }}
            keyboardType="default"
          />
          <Input
            label="Email Address (Optional)"
            placeholder="Enter email"
            placeholderTextColor="#B8C2CC"
            value={formData.senderEmail}
            onChangeText={(value) => handleChange("senderEmail", value)}
            keyboardType="email-address"
          />
          <Input
            label="Phone Number"
            placeholder="Enter phone number"
            placeholderTextColor="#B8C2CC"
            value={formData.senderPhoneNumber}
            onChangeText={(value) => {
              const formatted = formatPhoneNumber(value);
              handleChange("senderPhoneNumber", formatted);
            }}
            keyboardType="number-pad"
            errorMessage={phoneError}
          />
          <Input
            label="Home Address"
            placeholder="Enter address"
            placeholderTextColor="#B8C2CC"
            value={formData.senderAddress}
            onChangeText={(value) => handleChange("senderAddress", value)}
            keyboardType="default"
          />
          <SelectInput
            label="ID type"
            data={["NIN", "Voters Card", "Driver's License", "NURTW ID"]}
            placeholder="Select ID type"
            onSelect={(value) => handleChange("idType", value)}
          />
          <Input
            label="ID Number"
            placeholder="Enter ID number"
            placeholderTextColor="#B8C2CC"
            value={formData.idNumber}
            onChangeText={(value) => handleChange("idNumber", value)}
            keyboardType="default"
          />
          <Input
            label="Vehicle Type"
            placeholder="e.g. Space Bus"
            placeholderTextColor="#B8C2CC"
            value={formData.vehicleType}
            onChangeText={(value) => handleChange("vehicleType", value)}
            keyboardType="default"
          />
          <Input
            label="Vehicle Registration Number"
            placeholder="Enter vehicle number"
            placeholderTextColor="#B8C2CC"
            value={formData.vehicleRegistrationNumber}
            onChangeText={(value) =>
              handleChange("vehicleRegistrationNumber", value)
            }
            keyboardType="number-pad"
          />
          <Input
            label="Motor Park Location"
            placeholder="Enter motor park location"
            placeholderTextColor="#B8C2CC"
            value={formData.motorParkLocation}
            onChangeText={(value) => handleChange("motorParkLocation", value)}
            keyboardType="default"
          />

          <View style={$buttonsContainer}>
            <ButtonHome
              onPress={handleNavigate}
              title="Next"
              style={{ height: 55 }}
              disabled={!formData.idType}
            />
          </View>
        </View>
      </KeyBoardView>
    </CustomView>
  );
};

export default ScreenOne;
