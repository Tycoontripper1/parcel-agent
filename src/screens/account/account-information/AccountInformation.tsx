import {
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import React, { useState } from "react";
import { AccountStackList } from "@/navigation/navigationType";
import { Button, CustomView, Input, Text } from "@/components";
import { RFValue } from "react-native-responsive-fontsize";
import BackButton from "@/components/share/BackButton";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { launchImageLibrary } from "react-native-image-picker";
import KeyBoardView from "@/components/KeyBoardView";
import { Image } from "react-native";
import { Avatar } from "../../../../assets/images";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";
import { Feather, MaterialIcons, SimpleLineIcons } from "@expo/vector-icons";
import { RootState } from "@/redux/store";
import { useTheme } from "@/hooks/useTheme";
import { Helper } from "@/helper/helper";
import { color } from "@/constants/Colors";
import { updateField } from "@/redux/slices/formSlice";
import HomeHeader from "@/components/share/HomeHeader";

type Props = NativeStackScreenProps<AccountStackList>;
const AccountInformation = ({ navigation }: Props) => {
  const formData = useSelector((state: RootState) => state.form);
  const dispatch = useDispatch();
  const { theme } = useTheme();
  const [editInfo, setEditInfo] = useState(false);
  const [editPassword, setEditPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [fullNameError, setFullNameError] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

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

  const handleSaveChanges = () => {
    if (!handleValidation()) {
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Helper.vibrate();
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Changes Saved Successfully",
      });
      // navigation.navigate('OTPVerificationScreen');
    }, 2000);
    console.log({ formData });
    setLoading(false);
  };

  const handleEditProfile = () => {
      navigation.navigate('AccountEditProfile');
    console.log({ formData });
  };
  const handleChangePassword = () => {
      navigation.navigate('AccountChangePassword');
    console.log({ formData });
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
       <HomeHeader type='Stack' title='Account Information' />

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
            source={selectedImage ? { uri: selectedImage } : Avatar}
            style={{
              width: 84,
              height: 84,
              borderRadius: 42,
              backgroundColor: "#E0E0E0",
            }}
            resizeMode="cover"
          />
          <TouchableOpacity onPress={handleImagePick}>
            <Text font="Regular" size={14} color="#213264">
              Change Image
            </Text>
          </TouchableOpacity>
          <View style={$bodyHeader}>
            <Text font="SemiBold" size={16}>
              Chinedu Marcus
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
                Agent ID: PP64763
              </Text>
            </View>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: RFValue(12),
          }}
        >
          <Text font="SemiBold" size={16}>
            Personal Information{" "}
          </Text>
          {!editInfo && (
            <TouchableOpacity onPress={handleEditProfile}>
              <Text font="Regular" size={14} color="#213264">
                Edit Profile
              </Text>
            </TouchableOpacity>
          )}
        </View>
        {/* forms */}
        <View style={$cardHeader}>
          <Input
            label="Full Name"
            placeholder="Enter full name"
            placeholderTextColor="#B8C2CC"
            value={formData.fullName}
            onChangeText={(value) =>
              dispatch(updateField({ key: "fullName", value }))
            }
            LeftIcon={<Feather name="user" size={18} color={color.gray} />}
            errorMessage={fullNameError}
            keyboardType="default"
          />
          <Input
            label="Phone Number"
            placeholder="Enter phone number"
            placeholderTextColor="#B8C2CC"
            value={formData.phoneNumber}
            onChangeText={(value) =>
              dispatch(updateField({ key: "phoneNumber", value }))
            }
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
            value={formData.email}
            onChangeText={(value) =>
              dispatch(updateField({ key: "email", value }))
            }
            LeftIcon={
              <MaterialIcons name="mail-outline" size={18} color={color.gray} />
            }
            errorMessage={passwordError}
            keyboardType="email-address"
          />
          <View style={$buttonsContainer}>
            <Button
              onPress={() => ""}
              title="Save Changes"
              loading={editInfo}
              style={{ height: 55 }}
            />
          </View>
        </View>

        <View
          style={{
            flexDirection: "column",
            gap: 6,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingHorizontal: RFValue(12),
            }}
          >
            <Text font="SemiBold" size={16}>
              Password
            </Text>
            {!editPassword && (
              <TouchableOpacity onPress={handleChangePassword}>
                <Text font="Regular" size={14} color="#213264">
                  Edit Password
                </Text>
              </TouchableOpacity>
            )}
          </View>
          <View
            style={{
              paddingHorizontal: RFValue(12),
            }}
          >
            <Input
              label="Password"
              placeholder="Enter password"
              placeholderTextColor="#B8C2CC"
              value={formData.password}
              onChangeText={(value) =>
                dispatch(updateField({ key: "password", value }))
              }
              LeftIcon={
                <MaterialIcons
                  name="lock-outline"
                  size={18}
                  color={color.gray}
                />
              }
              errorMessage={passwordError}
              keyboardType="default"
              type="password"
            />
            <View style={$buttonsContainer}>
              <Button
                onPress={()=> ''}
                title="Save Changes"
                loading={editPassword}
                textColor='#61616B'
                style={{ height: 55 }}
              />
            </View>
          </View>
        </View>
      </KeyBoardView>
    </CustomView>
  );
};

export default AccountInformation;

const styles = StyleSheet.create({});
