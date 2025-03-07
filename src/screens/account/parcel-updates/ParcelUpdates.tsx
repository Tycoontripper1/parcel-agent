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
  import KeyBoardView from "@/components/KeyBoardView";
  import { Image } from "react-native";
  import Toast from "react-native-toast-message";
  import { useDispatch, useSelector } from "react-redux";
  import { RootState } from "@/redux/store";
  import { useTheme } from "@/hooks/useTheme";
  import { Helper } from "@/helper/helper";
  import { color } from "@/constants/Colors";
import { updateField } from "@/redux/slices/parcelSlice";
  import CloseModal from "@/components/CloseModal";
import SelectInput from "@/components/SelectInput";
  
  type Props = NativeStackScreenProps<AccountStackList>;
  const ParcelUpdates = ({ navigation }: Props) => {
    const formData = useSelector((state: RootState) => state.parcel);
    const dispatch = useDispatch();
    const { theme } = useTheme()
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
      const [selectedPaymentAnswer, setSelectedPaymentAnswer] = useState<
        string | null
      >(null);

  
  const handleSaveChanges = () => {
    if (!formData.frequency) {
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
        message="Changes saved successfully"
      />
      )}
        <View
          style={{ flexDirection: "row", gap: RFValue(32),justifyContent:"space-between", alignItems: "center" }}
        >
          <BackButton onClick={() => navigation.goBack()} />
          <Text font="SemiBold" size={18}>
          Parcel Updates
          </Text>
          <View>

          </View>
          
        </View>
  
        <KeyBoardView padded={false}>
          <View
            style={{
              flexDirection: "column",
              backgroundColor:"#FAFAFA",
              marginTop: RFValue(48),
              padding: RFValue(12),
              gap: 12,
            }}
          >
           <Text size={16} font="SemiBold">Unassigned Parcel</Text>
           <Text color="#717680" size={12} font="Regular">Set how often you want to receive reminders for unassigned parcels to ensure timely dispatch,</Text>
           <SelectInput
            label='Set Frequency'
            data={['1 Hour', '2 Hours', "3 Hours", "6 Hours", "12 Hours"]}
            placeholder='Set frequency'
            onSelect={(value) =>
              dispatch(updateField({key: 'frequency', value}))
            }
            // showSearch={true}
          />
        {/* Confirm Button */}
        <TouchableOpacity onPress={handleSaveChanges} disabled={!formData.frequency}  style={styles.confirmButton}>
          <Text style={styles.confirmButtonText}>Save changes</Text>
        </TouchableOpacity>
          </View>
        </KeyBoardView>
      </CustomView>
    );
  };
  
  export default ParcelUpdates;
  
  const styles = StyleSheet.create({
    confirmButton: {
        backgroundColor: '#FAFAFA',
        borderRadius: RFValue(8),
        paddingVertical: RFValue(12),
        alignItems: 'center',
      },
      confirmButtonText: {
        fontSize: RFValue(14),
        fontWeight: '400',
        color: '#000',
      },
  });
  