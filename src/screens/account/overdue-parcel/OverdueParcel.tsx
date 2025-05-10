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
import { overdueParcelRemindersUpdate } from "../../../../services/parcel";
import { apiKey, getToken } from "../../../../services/auth";

type Props = NativeStackScreenProps<AccountStackList>;
const OverdueParcel = ({ navigation }: Props) => {
 
  const dispatch = useDispatch();
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPaymentAnswer, setSelectedPaymentAnswer] = useState<
    string | null
  >(null);
  const [formDataState, setFormDataState] = useState({
    overdueDays: "",
    reminder:"",
  });


  const handleSaveChanges = async() => {
    if (!formDataState.reminder) {
      return;
    }

    setLoading(true);
  try {
    const payload = {
      reminders: {
        overdue_parcel_frequency: parseInt(
          formDataState.reminder.replace(" Hours", ""),
          10
        ),
      },
      overdueDays: parseInt(formDataState.overdueDays.replace(" Days", ""), 10),
    };
    

  // const result = await overdueParcelRemindersUpdate(payload);
   const token = await getToken()
                  const response = await fetch(`${apiKey}/users/reminders`, {
                    method: 'PATCH',
                      headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(payload),
                  
                  });
              
                  const result = await response.json();
  console.log(result, "result");
  if (result) {
    setLoading(false);
    setModalVisible(true);
    Toast.show({
      type: "success",
      text1: "Success",
      text2: result?.message || "Changes saved successfully",
    });
    
    setModalVisible(true);

  }
} catch (error:any) {
    console.log(error);
    Toast.show({
      type: "error",
      text1: "Error",
      text2: error?.message || "Something went wrong",
    }); 
  } finally {
    setLoading(false);
    
  }

    // setTimeout(() => {
    //   setLoading(false);
    //   setModalVisible(true);
    //   // navigation.navigate('OTPVerificationScreen');
    // }, 2000);

    console.log({ formDataState });
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
      { loading  && ( <Spinner />)}
      {modalVisible && (
        <CloseModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          message="Changes saved successfully"
        />
      )}
      <View
        style={{
          flexDirection: "row",
          gap: RFValue(32),
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <BackButton onClick={() => navigation.goBack()} />
        <Text font="SemiBold" size={18}>
        Overdue Parcel
        </Text>
        <View></View>
      </View>

      <KeyBoardView padded={false}>
        <View style={{display:"flex", flexDirection:"column", gap: RFValue(24)}}>
        <View
          style={{
            flexDirection: "column",
            backgroundColor: "#FAFAFA",
            marginTop: RFValue(48),
            padding: RFValue(12),
            gap: 16,
          }}
        >
          <Text size={16} font="SemiBold">
          Set overdue start days
          </Text>
          <Text size={12} color="#717680" font="Regular">
          Choose the number of days before overdue fees begin for uncollected parcels
          </Text>
          <SelectInput
            label="Customize Days"
            data={["24 Hour", "2 Days", "3 Days", "4 Days", "5 Days"]}
            placeholder="Set overdue start days"
           onSelect={(value) => setFormDataState ((prev) => ({
              ...prev,
              overdueDays: value,
            }))}
          
          />
          {/* Confirm Button */}
        </View>
        <View
          style={{
            flexDirection: "column",
            backgroundColor: "#FAFAFA",
            marginTop: RFValue(48),
            padding: RFValue(12),
            gap: 16,
          }}
        >
          <Text size={16} font="SemiBold">
          Customize Reminder Frequency
          </Text>
          <Text size={12} color="#717680" font="Regular">
          Set how often you want to send reminders for overdue parcels to ensure timely collections
          </Text>
          <SelectInput
            label='Set Frequency'
            data={['1 Hour', '2 Hours', "3 Hours", "6 Hours", "12 Hours"]}
            placeholder='Set frequency'
           onSelect={(value) => setFormDataState ((prev) => ({
              ...prev,
              reminder: value,
            }))}
          />
          {/* Confirm Button */}
          <View style={$buttonsContainer}>
            <ButtonHome
              onPress={handleSaveChanges}
              title='Save Changes'
              style={{height: 40}}
              disabled={!formDataState.reminder && !formDataState.overdueDays} 
            />
          </View>
        </View>
        </View>
      </KeyBoardView>
    </CustomView>
  );
};

export default OverdueParcel;

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
