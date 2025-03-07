import {
    StyleSheet,
    TextStyle,
    TouchableOpacity,
    View,
    ViewStyle,
    ScrollView
  } from "react-native";
  import React, { useState } from "react";
  import { AccountStackList } from "@/navigation/navigationType";
  import { Button, CustomView, Input, Text } from "@/components";
  import { RFValue } from "react-native-responsive-fontsize";
  import BackButton from "@/components/share/BackButton";
  import { NativeStackScreenProps } from "@react-navigation/native-stack";
  import { useDispatch, useSelector } from "react-redux";
  import { RootState } from "@/redux/store";
  import { useTheme } from "@/hooks/useTheme";
  import { updateField } from "@/redux/slices/parcelSlice";
  import CloseModal from "@/components/CloseModal";
import { ISupportButton } from "@/components/SupportButton";
import SupportButton from "@/components/SupportButton";
import QuestionIcon from "@/components/svg/QuestionIcon";
import FeedbackIcon from "@/components/svg/FeedbackIcon";
import ContactIcon from "@/components/svg/ContactIcon";
import HomeHeader from "@/components/share/HomeHeader";

  
  type Props = NativeStackScreenProps<AccountStackList>;
  const HomeAndSupport = ({ navigation }: Props) => {
    const formData = useSelector((state: RootState) => state.parcel);
    const dispatch = useDispatch();
    const { theme } = useTheme();
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedPaymentAnswer, setSelectedPaymentAnswer] = useState<
      string | null
    >(null);
  
      const supportButtonData: ISupportButton[] = [
        {
          label: "Frequently Asked Questions",
          desc: "Get a quick answers to all your questions",
          url: "AccountInformation",
          icon: <QuestionIcon />
        },
        {
          label: "Feedback",
          desc: "Share your feedback and help us serve you better",
          url: "ParcelUpdates",
          icon: <FeedbackIcon />
        },
        {
          label: "Contact Us",
          desc: "Get in touch with us",
          url: "OverdueParcel",
          icon: <ContactIcon />
        },
      ];
  
    // Styles
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

          <HomeHeader type='Stack' title='Help and Support' />
  
        <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        keyboardShouldPersistTaps="handled"
      >
         <View style={styles.buttonContainer}>
         <SupportButton buttons={supportButtonData} />
        </View>
        </ScrollView>
      </CustomView>
    );
  };
  
  export default HomeAndSupport;
  
  const styles = StyleSheet.create({
    buttonContainer: {
        paddingVertical: RFValue(24),
        paddingHorizontal: RFValue(12),
        backgroundColor: "#FAFAFA",
        marginTop: RFValue(16),
        borderRadius: RFValue(16),
        width: "100%",
      },
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
  