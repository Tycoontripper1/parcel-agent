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
import { apiKey, getToken } from "../../../../services/auth";
  
  type Props = NativeStackScreenProps<AccountStackList>;
  const ParcelUpdates = ({ navigation }: Props) => {
    const dispatch = useDispatch();
    const { theme } = useTheme()
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
          unassigned_parcel_frequency: parseInt(
            formDataState.reminder.replace(" Hours", ""),
            10
          ),
        },
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
      
    }}
  

  
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
              setFormDataState((prev) => ({
                ...prev,
                reminder: value,
              }))
            }
            // showSearch={true}
          />
        {/* Confirm Button */}
        <TouchableOpacity onPress={handleSaveChanges} disabled={!formDataState.reminder}  style={styles.confirmButton}>
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
  