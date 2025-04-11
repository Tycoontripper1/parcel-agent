import { Button, CustomView, Input, Spinner, Text } from "@/components";
import KeyBoardView from "@/components/KeyBoardView";
import PhoneNumberInput from "@/components/PhoneNumberInput";
import BackButton from "@/components/share/BackButton";
import StepProgress from "@/components/share/StepProgress";
import { color } from "@/constants/Colors";
import { Helper } from "@/helper/helper";
import { useTheme } from "@/hooks/useTheme";
import { AuthStackParamList } from "@/navigation/navigationType";
import { updateField } from "@/redux/slices/formSlice";
import { RootState } from "@/redux/store";
import {
  Feather,
  Fontisto,
  MaterialIcons,
  SimpleLineIcons,
} from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Platform } from "react-native";
import {
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../../services/auth";
type Props = NativeStackScreenProps<AuthStackParamList>;

const CreateAccountScreen = ({ navigation }: Props) => {
  // const formData = useSelector((state: RootState) => state.form);
  const dispatch = useDispatch();
  const { theme } = useTheme();
  const [passwordError, setPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [dobError, setDobError] = useState("");
  const [confirmError, setConfirmError] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    phone: "",
    email: "",
    password: "",
    confirm: "",
  });
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

  const updateFormField = (key: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handlePhoneNumberChange = (newNumber: string) => {
    const updatedNumber = newNumber;
    dispatch(updateField({ key: "phoneNumber", value: updatedNumber }));
  };
  const handleValidation = () => {
    let isValid = true;

    // First Name
    if (!formData.firstName) {
      setFirstNameError("First name is required.");
      isValid = false;
    } else {
      setFirstNameError("");
    }

    // Last Name
    if (!formData.lastName) {
      setLastNameError("Last name is required.");
      isValid = false;
    } else {
      setLastNameError("");
    }

    // Date of Birth
    if (!formData.dateOfBirth) {
      setDobError("Date of birth is required.");
      isValid = false;
    } else {
      setDobError("");
    }

    // Phone Number
    const plainPhone = formData.phone.replace(/\D/g, "");
    if (!plainPhone) {
      setPhoneError("Phone number is required.");
      isValid = false;
    } else if (plainPhone.length !== 11) {
      setPhoneError("Please enter a valid 11-digit phone number.");
      isValid = false;
    } else {
      setPhoneError("");
    }

    // Email (Optional)
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      setEmailError("Please enter a valid email address.");
      isValid = false;
    } else {
      setEmailError("");
    }

    // Password Strength
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&._#^])[A-Za-z\d@$!%*?&._#^]{8,}$/;

    if (!formData.password) {
      setPasswordError("Password is required.");
      isValid = false;
    } else if (!passwordRegex.test(formData.password)) {
      setPasswordError(
        "A valid password is required with minimum length of 8 characters, at least one uppercase, one lowercase, an integer and a special character"
      );
      isValid = false;
    } else {
      setPasswordError("");
    }

    // Confirm Password
    if (!formData.confirm) {
      setConfirmError("Confirm password is required.");
      isValid = false;
    } else if (formData.confirm !== formData.password) {
      setConfirmError("Passwords do not match.");
      isValid = false;
    } else {
      setConfirmError("");
    }

    return isValid;
  };

  // Styles
  const handleCreateAccount = async () => {
    if (!handleValidation()) return;

    setLoading(true);
    console.log(formData.phone, "formData");

    try {
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        dateOfBirth: formData.dateOfBirth,
        phone: formData.phone,
        email: formData.email,
        password: formData.password,
        confirm: formData.confirm,
      };

      const result = await registerUser(payload);
      console.log(result, "result");

      setLoading(false);
      Helper.vibrate();

      Toast.show({
        type: "success",
        text1: "Success",
        text2: result?.message || "OTP sent successfully",
      });

      navigation.navigate("OTPVerificationScreen", { phone: formData.phone });
    } catch (error: any) {
      console.log(error, "error");
      setLoading(false);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.message || "Something went wrong",
      });
    }
  };

  const $bodyHeader: ViewStyle = {
    paddingVertical: RFValue(20),
    flexDirection: "column",
    gap: 6,
  };
  const $cardHeader: ViewStyle = {
    paddingVertical: RFValue(10),
  };
  const $buttonsContainer: ViewStyle = {
    paddingVertical: RFValue(16),
  };
  const $signUpText: TextStyle = {
    fontSize: 16,
    marginLeft: 5,
    color: theme.secondary,
  };

  return (
    <CustomView style={{ paddingVertical: RFValue(10) }}>
      {loading && <Spinner />}

      {/* <BackButton onClick={() => navigation.goBack()} /> */}
      <StepProgress step={1} totalSteps={5} />
      {/* Body */}
      <KeyBoardView>
        <View style={$bodyHeader}>
          <Text font="SemiBold" size={18}>
            Create Account
          </Text>
        </View>
        <View style={$cardHeader}>
          <Input
            label="First Name"
            placeholder="Enter first name"
            value={formData.firstName}
            onChangeText={(value) => updateFormField("firstName", value)}
            LeftIcon={<Feather name="user" size={18} color={color.gray} />}
            errorMessage={firstNameError}
          />

          <Input
            label="Last Name"
            placeholder="Enter last name"
            value={formData.lastName}
            onChangeText={(value) => updateFormField("lastName", value)}
            LeftIcon={<Feather name="user" size={18} color={color.gray} />}
            errorMessage={lastNameError}
          />

          <Input
            label="Date of Birth"
            placeholder="YYYY-MM-DD"
            value={formData.dateOfBirth}
            onChangeText={(value) => {
              const formatted = formatDateInput(value);
              updateFormField("dateOfBirth", formatted);
            }}
            LeftIcon={<Fontisto name="date" size={18} color={color.gray} />}
            errorMessage={dobError}
          />
          {/* <TouchableOpacity onPress={() => setShowDatePicker(true)}>
  <Input
    label="Date of Birth"
    placeholder="YYYY-MM-DD"
    value={formData.dateOfBirth}
    editable={false} // prevent keyboard
    LeftIcon={<Fontisto name="date" size={18} color={color.gray} />}
    errorMessage={dobError}
  />
</TouchableOpacity>

{showDatePicker && (
  <DateTimePicker
    value={formData.dateOfBirth ? new Date(formData.dateOfBirth) : new Date()}
    mode="date"
    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
    maximumDate={new Date()}
    onChange={(event, selectedDate) => {
      setShowDatePicker(false);
      if (selectedDate) {
        const formatted = selectedDate.toISOString().split('T')[0]; // YYYY-MM-DD
        updateFormField('dateOfBirth', formatted);
      }
    }}
  />
)} */}

          <Input
            label="Phone Number"
            placeholder="Enter phone number"
            placeholderTextColor="#B8C2CC"
            value={formData.phone}
            onChangeText={(value) => {
              // const formatted = formatPhoneNumber(value);
              updateFormField("phone", value);
            }}
            LeftIcon={
              <SimpleLineIcons name="phone" size={18} color={color.gray} />
            }
            errorMessage={phoneError}
            keyboardType="number-pad"
          />
          {/* <Text
            style={{
              fontSize: RFValue(14),
              marginBottom: 5,
              color: '#7B8794',
            }}>
            Phone Number
          </Text>

          <PhoneNumberInput
            value={formData.phoneNumber}
            onChange={handlePhoneNumberChange}
          /> */}

          <Input
            label="Email Address (Optional)"
            placeholder="Enter email"
            placeholderTextColor="#B8C2CC"
            value={formData.email}
            onChangeText={(value) => updateFormField("email", value)}
            LeftIcon={
              <MaterialIcons name="mail-outline" size={18} color={color.gray} />
            }
            errorMessage={emailError}
            keyboardType="email-address"
          />
          <Input
            label="Password"
            placeholder="Enter password"
            placeholderTextColor="#B8C2CC"
            value={formData.password}
            onChangeText={(value) => updateFormField("password", value)}
            LeftIcon={
              <MaterialIcons name="lock-outline" size={18} color={color.gray} />
            }
            errorMessage={passwordError}
            keyboardType="default"
            type="password"
          />
          <Input
            label="Confirm Password"
            placeholder="Enter confirm password"
            placeholderTextColor="#B8C2CC"
            value={formData.confirm}
            onChangeText={(value) => updateFormField("confirm", value)}
            LeftIcon={
              <MaterialIcons name="lock-outline" size={18} color={color.gray} />
            }
            errorMessage={confirmError}
            keyboardType="default"
            type="password"
          />

          <View style={$buttonsContainer}>
            <Button
              onPress={handleCreateAccount}
              title="Create Account"
              style={{ height: 55 }}
            />
          </View>
          {/* Sign Up */}
          <View style={styles.signUpContainer}>
            <Text style={styles.subText}>Already have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={$signUpText}>Sign in</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyBoardView>
    </CustomView>
  );
};

export default CreateAccountScreen;

const styles = StyleSheet.create({
  signUpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  subText: {
    fontSize: 16,
    color: color.textGray,
    marginBottom: 30,
  },
});
