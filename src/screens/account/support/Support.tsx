import {
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import React, { useState } from "react";
import { AccountStackList } from "@/navigation/navigationType";
import { Button, CustomView, Input, Spinner, Text } from "@/components";
import { RFValue } from "react-native-responsive-fontsize";
import BackButton from "@/components/share/BackButton";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import KeyBoardView from "@/components/KeyBoardView";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useTheme } from "@/hooks/useTheme";
import { Helper } from "@/helper/helper";
import { color } from "@/constants/Colors";
import { updateField } from "@/redux/slices/parcelSlice";
import CloseModal from "@/components/CloseModal";
import SelectInput from "@/components/SelectInput";
import ButtonHome from "@/components/ButtonHome";
import { apiKey, getToken } from "../../../../services/auth";
import TextAreaInput from "@/components/TextAreaInput";
import { Category, Check } from "iconsax-react-native";
import { Ionicons } from "@expo/vector-icons";
import { set } from "date-fns";
import HomeHeader from "@/components/share/HomeHeader";

type Props = NativeStackScreenProps<AccountStackList>;
const Support = ({ navigation }: Props) => {
  const dispatch = useDispatch();
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPaymentAnswer, setSelectedPaymentAnswer] = useState<
    string | null
  >(null);
  const [formDataState, setFormDataState] = useState({
    category: "",
    title: "",
    description: "",
  });



  const handleSaveChanges = async () => {
    if (!formDataState.category) {
      return;
    }
        console.log({ formDataState });
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setModalVisible(true);
      // navigation.navigate('OTPVerificationScreen');
    }, 2000);
    setFormDataState({
      category: "",
      title: "",
      description: "",
    });
 
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
    <CustomView style={{ paddingVertical: RFValue(10), paddingHorizontal: RFValue(16) }}>
      {loading && <Spinner />}
      {modalVisible && (
        <CloseModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          message="Issue submitted"
          description="Your issue has been submitted successfully with Ticket ID #TC7647. 
Our team will review and address it within 24 hours. Use your ticket ID to track the status of your complaint."
        />
      )}
    <HomeHeader type='Stack' title='Support' />

      <KeyBoardView padded={false}>
        <View style={{ paddingVertical: RFValue(20) }}>
          <SelectInput
            label="Support category"
            data={["sender", "receiver"]}
            placeholder="Select option"
            onSelect={(value) =>
              setFormDataState((prev) => ({
                ...prev,
                category: value,
              }))
            }
            // showSearch={true}
          />
          <Input
            label="Support Title"
            placeholder="Enter Support title"
            placeholderTextColor="#B8C2CC"
            value={formDataState.title}
            onChangeText={(value) =>
              setFormDataState((prev) => ({
                ...prev,
                title: value,
              }))
            }
            keyboardType="default"
          />
          <TextAreaInput
            label="Support Description"
            placeholder="Enter a description..."
            placeholderTextColor="#B8C2CC"
            value={formDataState.description}
            onChangeText={(value) =>
              setFormDataState((prev) => ({
                ...prev,
                description: value,
              }))
            }
            keyboardType="default"
          />
             <View style={$buttonsContainer}>
            <ButtonHome
              onPress={handleSaveChanges}
              title="Submit"
              style={{ height: 45 }}
              disabled={!formDataState.title || !formDataState.description || !formDataState.category }
            />
          </View>
        </View>
      </KeyBoardView>
    </CustomView>
  );
};

export default Support;

const styles = StyleSheet.create({
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
});
