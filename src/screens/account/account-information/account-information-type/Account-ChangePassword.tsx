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
import { Avatar } from "../../../../../assets/images";
  import Toast from "react-native-toast-message";
  import { useDispatch, useSelector } from "react-redux";
  import { Feather, MaterialIcons, SimpleLineIcons, Ionicons } from "@expo/vector-icons";
  import { RootState } from "@/redux/store";
  import { useTheme } from "@/hooks/useTheme";
  import { Helper } from "@/helper/helper";
  import { color } from "@/constants/Colors";
  import { updateField } from "@/redux/slices/formSlice";
  import CloseModal from "@/components/CloseModal";
import HomeHeader from "@/components/share/HomeHeader";
  
  type Props = NativeStackScreenProps<AccountStackList>;
  const AccountChangePassword = ({ navigation }: Props) => {
    const formData = useSelector((state: RootState) => state.form);
    const dispatch = useDispatch();
    const { theme } = useTheme()
    const [editPassword, setEditPassword] = useState(false);
    const [passwordError, setPasswordError] = useState("");
    const [loading, setLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
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
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const handleValidation = () => {
    let isValid = true;

    // Password validation
    if (!password) {
      setPasswordError('Password is required.');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters.');
      isValid = false;
    } else {
      setPasswordError('');
    }

    // ConfirmPassword validation
    if (!confirmPassword) {
      setConfirmPasswordError('Password is required.');
      isValid = false;
    } else if (confirmPassword.length < 6) {
      setConfirmPasswordError('Password must be at least 6 characters.');
      isValid = false;
    } else if (confirmPassword !== password) {
      setConfirmPasswordError('Password not matched.');
      isValid = false;
    } else {
      setConfirmPasswordError('');
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
      setModalVisible(true);
      // navigation.navigate('OTPVerificationScreen');
    }, 2000); 
  
    console.log({ formData });
  };
  
  
    const handleEditProfile = () => {
        navigation.navigate('AccountEditProfile');
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

{modalVisible && (
        <CloseModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        // icon={<Ionicons name="checkmark-circle" size={50} color="green" />}
        message="Password changed successfully"
      />
      )}
       
       <View style={{paddingHorizontal:RFValue(12)}}>
       <HomeHeader type='Stack' title='Change Password' />
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
              Current Password
              </Text>
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

              {/* new password */}

              <Text font="SemiBold" size={16}>
              Change Password
              </Text>
                     {/* Password Input */}
                        <Input
                          label='Password'
                          placeholder='Enter password'
                          placeholderTextColor='#B8C2CC'
                          value={password}
                          onChangeText={(text) => {
                            setPassword(text);
                          }}
                          LeftIcon={
                            <MaterialIcons name='lock-outline' size={18} color={color.gray} />
                          }
                          type='password'
                          errorMessage={passwordError}
                          keyboardType='default'
                        />
              
                        {/* Confirm Password Input */}
                        <Input
                          label='Confirm Password'
                          placeholder='Enter password'
                          placeholderTextColor='#B8C2CC'
                          value={confirmPassword}
                          onChangeText={(text) => {
                            setConfirmPassword(text);
                          }}
                          LeftIcon={
                            <MaterialIcons name='lock-outline' size={18} color={color.gray} />
                          }
                          type='password'
                          errorMessage={confirmPasswordError}
                          keyboardType='default'
                        />
              <View style={$buttonsContainer}>
                <Button
                  onPress={handleSaveChanges}
                  title="Save Changes"
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
  
  export default AccountChangePassword;
  
  const styles = StyleSheet.create({});
  