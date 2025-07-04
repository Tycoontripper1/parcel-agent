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

type Props = NativeStackScreenProps<AccountStackList>;
const RaiseDispute = ({ navigation }: Props) => {
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
   const [selectedPriority, setSelectedPriority] = useState<'high' | 'medium' | 'low' | null>(null);


  const priorities = [
    {
      label: 'High',
      value: 'high',
      bgColor: '#FEDEDC',
      textColor: '#F04438',
    },
    {
      label: 'Medium',
      value: 'medium',
      bgColor: '#FEF6E7',
      textColor: '#F79009',
    },
    {
      label: 'Low',
      value: 'low',
      bgColor: '#DFFCE9',
      textColor: '#12B76A',
    },
  ];


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
    setSelectedPriority(null);
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
      {modalVisible && (
        <CloseModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          message="Complaints submitted"
          description="Your complaint has been submitted successfully with Ticket ID #TC7647. 
Our team will review and address it within 24 hours. Use your ticket ID to track the status of your complaint."
        />
      )}
      <View
        style={{
          flexDirection: "row",
          gap: RFValue(80),
          alignItems: "center",
        }}
      >
        <BackButton onClick={() => navigation.goBack()} />
        <Text font="SemiBold" size={18}>
          Raise Dispute
        </Text>
        <View></View>
      </View>

      <KeyBoardView padded>
        <View>
          <SelectInput
            label="Dispute category"
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
            label="Dispute Title"
            placeholder="Enter dispute title"
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
            label="Dispute Description"
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
           <View style={{ marginTop: 20 }}>
      <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 10 }}>Priority</Text>
      <View style={{ flexDirection: 'row', gap:RFValue(8) }}>
        {priorities.map((item) => {
          const isSelected = selectedPriority === item.value;
          return (
            <TouchableOpacity
              key={item.value}
              onPress={() => setSelectedPriority(item.value as 'high' | 'medium' | 'low')}
              style={{
               
                padding: 10,

                paddingHorizontal: RFValue(12),
                marginHorizontal: 4,
                borderRadius: 20,
                backgroundColor: item.bgColor,
                // borderWidth: isSelected ? 2 : 1,
                borderColor: isSelected ? item.textColor : '#E5E7EB',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ color: item.textColor, fontWeight: '600', marginRight: isSelected ? 6 : 0 }}>
                {item.label}
              </Text>
              {isSelected && <Ionicons name="checkmark" size={16} color={item.textColor} />}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
             <View style={$buttonsContainer}>
            <ButtonHome
              onPress={handleSaveChanges}
              title="Submit Dispute"
              style={{ height: 45 }}
              disabled={!formDataState.title || !formDataState.description || !formDataState.category || !selectedPriority}
            />
          </View>
        </View>
      </KeyBoardView>
    </CustomView>
  );
};

export default RaiseDispute;

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
