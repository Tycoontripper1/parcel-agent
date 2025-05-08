import { View, ViewStyle } from "react-native";
import React, { useState } from "react";
import { RFValue } from "react-native-responsive-fontsize";
import { CustomView, Input, Text } from "@/components";
import StepProgress from "@/components/share/StepProgress";
import KeyBoardView from "@/components/KeyBoardView";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Toast from "react-native-toast-message";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { HomeStackList } from "@/navigation/navigationType";
import { updateField } from "@/redux/slices/parcelSlice";
import ButtonHome from "@/components/ButtonHome";
import BackButton from "@/components/share/BackButton";

type Props = NativeStackScreenProps<HomeStackList>;
const ScreenOne = ({ navigation }: Props) => {
  // const [loading, setLoading] = useState(false);
  const formData = useSelector((state: RootState) => state.parcel);
  const dispatch = useDispatch();
  const [driverPhoneError, setDriverPhoneError] = useState("");
  const [receiverPhoneError, setReceiverPhoneError] = useState("");
  const [senderPhoneError, setSenderPhoneError] = useState("");

  const formatPhoneNumber11 = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    if (digits.length <= 4) return digits;
    if (digits.length <= 7) return `${digits.slice(0, 4)}-${digits.slice(4)}`;
    return `${digits.slice(0, 4)}-${digits.slice(4, 7)}-${digits.slice(7)}`;
  };
  const [formErrors, setFormErrors] = useState({
    senderPhoneNumber: "",
    receiverPhoneNumber: "",
    senderFullName: "",
    senderAddress: "",
    receiverFullName: "",
    receiverAddress: "",
    sendingFrom: "",
    deliveryMotorPark: "",
  });
  

  const handleValidation = () => {
    let isValid = true;
  
    const senderPhone = formData.senderPhoneNumber.replace(/\D/g, "");
    const receiverPhone = formData.receiverPhoneNumber.replace(/\D/g, "");
  
    const newErrors = {
      senderPhoneNumber: "",
      receiverPhoneNumber: "",
      senderFullName: "",
      senderAddress: "",
      receiverFullName: "",
      receiverAddress: "",
      sendingFrom: "",
      deliveryMotorPark: "",
    };
  
    if (!senderPhone) {
      newErrors.senderPhoneNumber = "Phone Number is required.";
      isValid = false;
    } else if (senderPhone.length !== 11) {
      newErrors.senderPhoneNumber = "Please enter a valid 11-digit mobile number.";
      isValid = false;
    }
  
    if (!receiverPhone) {
      newErrors.receiverPhoneNumber = "Phone Number is required.";
      isValid = false;
    } else if (receiverPhone.length !== 11) {
      newErrors.receiverPhoneNumber = "Please enter a valid 11-digit mobile number.";
      isValid = false;
    }
  
    if (!formData.senderFullName.trim()) {
      newErrors.senderFullName = "Sender's full name is required.";
      isValid = false;
    }
  
    if (!formData.senderAddress.trim()) {
      newErrors.senderAddress = "Sender's address is required.";
      isValid = false;
    }
  
    if (!formData.receiverFullName.trim()) {
      newErrors.receiverFullName = "Receiver's full name is required.";
      isValid = false;
    }
  
    if (!formData.receiverAddress.trim()) {
      newErrors.receiverAddress = "Receiver's address is required.";
      isValid = false;
    }
  
    if (!formData.sendingFrom.trim()) {
      newErrors.sendingFrom = "Sending park is required.";
      isValid = false;
    }
  
    if (!formData.deliveryMotorPark.trim()) {
      newErrors.deliveryMotorPark = "Destination park is required.";
      isValid = false;
    }
  
    setFormErrors(newErrors);
    return isValid;
  };
  
  

  const handleNavigate = () => {
    if (!handleValidation()) {
      return;
    }
    navigation.navigate("ScreenOneParcelInSenderTwo");
    console.log({ formData });
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
      {/* {loading && <Spinner />} */}

      <BackButton onClick={() => navigation.goBack()} />
      <StepProgress step={1} totalSteps={3} />
      {/* Body */}
      <KeyBoardView padded={false}>
        <View style={$bodyHeader}>
          <Text font="SemiBold" size={18}>
            Parcel In - Sender
          </Text>
        </View>
        <View style={$cardHeader}>
          <Text size={18} style={{ paddingTop: 15, paddingBottom: 10 }}>
            Sender’s Information
          </Text>
          <Input
            label="Phone Number"
            placeholder="Enter phone number"
            placeholderTextColor="#B8C2CC"
            value={formData.senderPhoneNumber}
            onChangeText={(value) => {
              const cleaned = value.replace(/\D/g, "").slice(0, 11);
              dispatch(
                updateField({
                  key: "senderPhoneNumber",
                  value: formatPhoneNumber11(cleaned),
                })
              );
            }}
            keyboardType="number-pad"
            errorMessage={formErrors.senderPhoneNumber}
          />

          <Input
            label="Full Name"
            placeholder="Enter full name"
            placeholderTextColor="#B8C2CC"
            value={formData.senderFullName}
            onChangeText={(value) =>
              dispatch(updateField({ key: "senderFullName", value }))
            }
            keyboardType="default"
            errorMessage={formErrors.senderFullName}
          />
          <Input
            label="Email Address (Optional)"
            placeholder="Enter email"
            placeholderTextColor="#B8C2CC"
            value={formData.senderEmail}
            onChangeText={(value) =>
              dispatch(updateField({ key: "senderEmail", value }))
            }
            keyboardType="email-address"
          />
          <Input
            label="Address"
            placeholder="Enter address"
            placeholderTextColor="#B8C2CC"
            value={formData.senderAddress}
            onChangeText={(value) =>
              dispatch(updateField({ key: "senderAddress", value }))
            }
            keyboardType="default"
            errorMessage={formErrors.senderAddress}
          />

          <Text size={18} style={{ paddingTop: 15, paddingBottom: 10 }}>
            Receiver’s Information
          </Text>

          <Input
            label="Phone Number"
            placeholder="Enter phone number"
            placeholderTextColor="#B8C2CC"
            value={formData.receiverPhoneNumber}
            onChangeText={(value) => {
              const cleaned = value.replace(/\D/g, "").slice(0, 11);
              dispatch(
                updateField({
                  key: "receiverPhoneNumber",
                  value: formatPhoneNumber11(cleaned),
                })
              );
            }}
            keyboardType="number-pad"
            errorMessage={formErrors.receiverPhoneNumber}
          />

          <Input
            label="Full Name"
            placeholder="Enter full name"
            placeholderTextColor="#B8C2CC"
            value={formData.receiverFullName}
            onChangeText={(value) =>
              dispatch(updateField({ key: "receiverFullName", value }))
            }
            keyboardType="default"
            errorMessage={formErrors.receiverFullName}
          />
          <Input
            label="Email Address (Optional)"
            placeholder="Enter email"
            placeholderTextColor="#B8C2CC"
            value={formData.receiverEmail}
            onChangeText={(value) =>
              dispatch(updateField({ key: "receiverEmail", value }))
            }
            keyboardType="email-address"
          />
          <Input
            label="Address"
            placeholder="Enter address"
            placeholderTextColor="#B8C2CC"
            value={formData.receiverAddress}
            onChangeText={(value) =>
              dispatch(updateField({ key: "receiverAddress", value }))
            }
            keyboardType="default"
            errorMessage={formErrors.receiverAddress}
          />

          <Text size={18} style={{ paddingTop: 15, paddingBottom: 10 }}>
            Park Details
          </Text>
          <Input
            label="Sending from"
            placeholder="Enter dispatch park"
            placeholderTextColor="#B8C2CC"
            value={formData.sendingFrom}
            onChangeText={(value) =>
              dispatch(updateField({ key: "sendingFrom", value }))
            }
            keyboardType="default"
            errorMessage={formErrors.sendingFrom}
          />
          <Input
            label="Destination Motor Park"
            placeholder="Enter delivery park"
            placeholderTextColor="#B8C2CC"
            value={formData.deliveryMotorPark}
            onChangeText={(value) =>
              dispatch(updateField({ key: "deliveryMotorPark", value }))
            }
            keyboardType="default"
            errorMessage={formErrors.deliveryMotorPark}
          />

          <View style={$buttonsContainer}>
            <ButtonHome
              onPress={handleNavigate}
              title="Next"
              style={{ height: 55 }}
              disabled={!formData.deliveryMotorPark}
            />
          </View>
        </View>
      </KeyBoardView>
    </CustomView>
  );
};

export default ScreenOne;
