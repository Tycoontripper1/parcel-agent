import {
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import React, { useEffect, useState } from "react";
import { AccountStackList } from "@/navigation/navigationType";
import { Button, CustomView, Input, Spinner, Text } from "@/components";
import { RFValue } from "react-native-responsive-fontsize";
import BackButton from "@/components/share/BackButton";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { launchImageLibrary } from "react-native-image-picker";
import KeyBoardView from "@/components/KeyBoardView";
import { Image } from "react-native";
import { Avatar } from "../../../../../assets/images";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";
import { Feather, MaterialIcons, SimpleLineIcons } from "@expo/vector-icons";
import { RootState } from "@/redux/store";
import { useTheme } from "@/hooks/useTheme";
import { Helper } from "@/helper/helper";
import { color } from "@/constants/Colors";
import { updateField } from "@/redux/slices/formSlice";
import EditIcon from "@/components/svg/EditIcon";
import HomeHeader from "@/components/share/HomeHeader";
import {
  getUser,
  updateUserKyc,
  updateUserProfile,
} from "../../../../../services/auth";
import { UserDetails } from "@/utils/interface";

type Props = NativeStackScreenProps<AccountStackList>;
const AccountEditProfile = ({ navigation }: Props) => {
  const formData = useSelector((state: RootState) => state.form);
  const dispatch = useDispatch();
  const { theme } = useTheme();
  const [editInfo, setEditInfo] = useState(false);
  const [editPassword, setEditPassword] = useState(false);
  // Remove: useDispatch, useSelector, and updateField
  // Add local state for form fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");

  const [passwordError, setPasswordError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [fullNameError, setFullNameError] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [userDetail, setUserDetails] = useState<UserDetails | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const userDetails = await getUser();
      console.log(userDetails, "userDetails");
      setUserDetails(userDetails);
    };
    fetchUser();
  }, []);
  const handleImagePick = () => {
    launchImageLibrary({ mediaType: "photo", quality: 0.8 }, (response) => {
      if (response.didCancel) return;
      if (response.assets && response.assets.length > 0) {
        setSelectedImage(response?.assets[0].uri ?? null);
      }
    });
  };

  const handlePhoneNumberChange = (newNumber: string) => {
    const updatedNumber = newNumber;
    dispatch(updateField({ key: "phoneNumber", value: updatedNumber }));
  };
  const handleValidation = () => {
    let isValid = true;

    if (!formData.fullName) {
      setFullNameError("Name is required.");
      isValid = false;
    } else if (formData.fullName.length < 2) {
      setFullNameError("Please enter full name.");
      isValid = false;
    } else {
      setFullNameError("");
    }
    if (!formData.phoneNumber) {
      setPhoneError("Phone Number is required.");
      isValid = false;
    } else if (formData.phoneNumber.length < 11) {
      setPhoneError("Please enter a valid mobile number.");
      isValid = false;
    } else {
      setPhoneError("");
    }

    if (!formData.password) {
      setPasswordError("Password is required.");
      isValid = false;
    } else if (formData.password.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
      isValid = false;
    } else {
      setPasswordError("");
    }
    return isValid;
  };

  const handleSaveChanges = async () => {
    // if (!handleValidation()) return;

    setLoading(true);
    try {
      const payload = {
        firstName: firstName || userDetail?.firstName || "",
        lastName: lastName || userDetail?.lastName || "",
        phone: formData.phoneNumber || userDetail?.phone || "",
        email: email || userDetail?.email || "",
        userImage: selectedImage || userDetail?.userImage || "",
      };

      const result = await updateUserProfile(payload);

      Helper.vibrate();
      Toast.show({
        type: "success",
        text1: "Success",
        text2: result?.message || " Changes saved successfully",
      });
      setEditInfo(false);
    } catch (error: any) {
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

  // Styles
  const $bodyHeader: ViewStyle = {
    flexDirection: "row",
    gap: RFValue(24),
    alignItems: "center",
    paddingVertical: RFValue(18),
  };
  const $cardHeader: ViewStyle = {
    padding: RFValue(16),
    backgroundColor: "#FDFDFD",
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
      <View style={{ paddingHorizontal: RFValue(12) }}>
        <HomeHeader type="Stack" title="Edit Profile" />
      </View>

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
            source={
              selectedImage
                ? { uri: selectedImage }
                : userDetail?.userImage
                ? { uri: userDetail.userImage }
                : undefined
            }
            style={{
              width: 84,
              height: 84,
              borderRadius: 42,
              backgroundColor: "#E0E0E0",
            }}
            resizeMode="cover"
          />
          <TouchableOpacity style={styles.edit} onPress={handleImagePick}>
            <Text font="Regular" size={14} color="#213264">
              Change Image
            </Text>
            <EditIcon />
          </TouchableOpacity>
          <View style={$bodyHeader}>
            <Text font="SemiBold" size={16}>
              {userDetail?.firstName} {userDetail?.lastName}
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
                Agent ID: {userDetail?.agentId}
              </Text>
            </View>
          </View>
        </View>

        {/* edit profile */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: RFValue(12),
          }}
        >
          <Text font="SemiBold" size={16}>
            Personal Information
          </Text>
        </View>
        {/* forms */}
        <View style={$cardHeader}>
          <Input
            label="First Name"
            placeholder="Enter first name"
            placeholderTextColor="#B8C2CC"
            value={firstName}
            onChangeText={setFirstName}
            LeftIcon={<Feather name="user" size={18} color={color.gray} />}
            errorMessage={fullNameError}
            keyboardType="default"
          />

          <Input
            label="Last Name"
            placeholder="Enter last name"
            placeholderTextColor="#B8C2CC"
            value={lastName}
            onChangeText={setLastName}
            LeftIcon={<Feather name="user" size={18} color={color.gray} />}
            errorMessage={fullNameError}
            keyboardType="default"
          />

          <Input
            label="Phone Number"
            placeholder="Enter phone number"
            placeholderTextColor="#B8C2CC"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            LeftIcon={
              <SimpleLineIcons name="phone" size={18} color={color.gray} />
            }
            errorMessage={phoneError}
            keyboardType="number-pad"
          />

          <Input
            label="Email Address (Optional)"
            placeholder="Enter email"
            placeholderTextColor="#B8C2CC"
            value={email}
            onChangeText={setEmail}
            LeftIcon={
              <MaterialIcons name="mail-outline" size={18} color={color.gray} />
            }
            errorMessage={passwordError}
            keyboardType="email-address"
          />

          <View style={$buttonsContainer}>
            <Button
              onPress={handleSaveChanges}
              title="Save Changes"
              loading={editInfo}
              style={{ height: 55 }}
            />
          </View>
        </View>
      </KeyBoardView>
    </CustomView>
  );
};

export default AccountEditProfile;

const styles = StyleSheet.create({
  edit: {
    flexDirection: "row",
    gap: RFValue(6),
    alignItems: "center",
  },
});
