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
import { updateField } from "@/redux/slices/parcelSlice";
import CloseModal from "@/components/CloseModal";
import SelectInput from "@/components/SelectInput";
import ButtonHome from "@/components/ButtonHome";
import { apiKey, getToken } from "../../../../services/auth";
import TextAreaInput from "@/components/TextAreaInput";
import HomeHeader from "@/components/share/HomeHeader";

type Props = NativeStackScreenProps<AccountStackList>;
const Feedback = ({ navigation }: Props) => {
  const dispatch = useDispatch();
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPaymentAnswer, setSelectedPaymentAnswer] = useState<
    string | null
  >(null);
  const [formDataState, setFormDataState] = useState({
    // category: "",
    // title: "",
    description: "",
  });



  const handleSaveChanges = async () => {
    if (!formDataState.description) {
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
          message="Feedback received, thanks for taking your time to give us feedback."
   
        />
      )}
    <HomeHeader type='Stack' title='Feedback' />

      <KeyBoardView padded={false}>
        <View style={{ paddingVertical: RFValue(20) }}>

          <TextAreaInput
            label="Write your feedback"
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
              disabled={ !formDataState.description  }
            />
          </View>
        </View>
      </KeyBoardView>
    </CustomView>
  );
};

export default Feedback;

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
