import { Button, CustomView, Spinner, Text } from "@/components";
import KeyBoardView from "@/components/KeyBoardView";
import OTPInput from "@/components/OTPInput";
import BackButton from "@/components/share/BackButton";
import StepProgress from "@/components/share/StepProgress";
import { color } from "@/constants/Colors";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { HomeStackList } from "@/navigation/navigationType";
import React, { useEffect, useState } from "react";
import { View, ViewStyle, Animated } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import Toast from "react-native-toast-message";
import ResendOTP from "@/screens/auths/ResendOTP";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { updateField } from "@/redux/slices/formSlice";
import { AuthStackParamList } from "@/navigation/navigationType";
import { singleParcelInterface } from "@/utils/interface";
import {
  getSingleParcel,
  updateParcel,
  verifyReceiverOtp,
} from "../../../../../../services/parcel";
import { Helper } from "@/helper/helper";
import { apiKey, getToken } from "../../../../../../services/auth";

// type Props = NativeStackScreenProps<AuthStackParamList>;
type Props = NativeStackScreenProps<HomeStackList>;

const ParcelOtpVerificationReceiver = ({ navigation }: Props) => {
  const otp = useSelector((state: RootState) => state.form.otp);
  const formData = useSelector((state: RootState) => state.parcel);
  const dispatch = useDispatch();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [otpStatus, setOtpStatus] = useState<
    "idle" | "verifying" | "success" | "failed"
  >("idle");
  const [otpMessage, setOtpMessage] = useState<string>("");
const { readOnly } =
    (navigation.getState().routes[
      navigation.getState().index - 1
    ] as { params: { readOnly: boolean } })?.params || {};
  const [singleParcel, setSingleParcel] =
    useState<singleParcelInterface | null>(null);
    const parcelId = singleParcel?.id
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const parcel = await getSingleParcel();
      setSingleParcel(parcel);
    };
    fetchUser();
  }, []);
  useEffect(() => {
    if (otpStatus !== "idle") {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500, // fade in over 500ms
        useNativeDriver: true,
      }).start();
    } else {
      fadeAnim.setValue(0); // reset when idle
    }
  }, [otpStatus]);
  const handleOtpChange = (newOtp: string) => {
    const updatedOtp = newOtp;
    dispatch(updateField({ key: "otp", value: updatedOtp }));
    if (newOtp.length === 4) {
      handleOtpSubmit(newOtp);
    }
  };

  const handleOtpSubmit = async (newOtp: string) => {
    dispatch(updateField({ key: "otp", value: newOtp }));

    if (newOtp.length === 4) {
      setOtpStatus("verifying");
      try {
        const payload = { code: newOtp };
        const result = await verifyReceiverOtp(payload);
        setOtpStatus("success");
        setOtpMessage(result?.data?.message || "OTP confirmed successfully");

        Toast.show({
          type: "success",
          text1: "Verified",
          text2: result?.data?.message || "OTP verified successfully",
        });
      } catch (error: any) {
        setOtpStatus("failed");
        setOtpMessage(
          error?.response?.data?.message ||
            "OTP code has expired or incorrect, kindly re-check and input again or click the button below to resend."
        );

        Toast.show({
          type: "error",
          text1: "Verification Failed",
          text2: error?.response?.data?.message || "Invalid or expired OTP",
        });
      }
    } else {
      setOtpStatus("idle");
      setOtpMessage("");
    }
  };

  const handleSubmit = async () => {
    if (otpStatus !== "success") {
      Toast.show({
        type: "error",
        text1: "Cannot Continue",
        text2: "Please verify the OTP before continuing.",
      });
      return;
    }

    setLoading(true);
    try {
      const payload = {
        status: "received",
          collector:{
                fullName:   singleParcel?.receiver?.fullName
                ? singleParcel.receiver.fullName
                : formData.receiverFullName,
                phone:  singleParcel?.receiver?.phone
                ? singleParcel.receiver.phone
                : formData.receiverPhoneNumber,
                dateCollected: new Date().toISOString(),
              }
      };
       const token = await getToken()
            const response = await fetch(`${apiKey}/shipment/${parcelId}`, {
              method: 'PATCH',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(payload),
            
            });
            const result = await response.json();
      setLoading(false);
      Helper.vibrate();
      Toast.show({
        type: "success",
        text1: "Success",
        text2: result?.message || " Parcel Realesed!",
      });
      navigation.navigate("ParcelCongratulation", {
        message: "Parcel released successfully",
        note: "",
      });
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

  // Function to handle resend OTP
  const handleSentOTP = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "OTP sent successfully",
      });
    }, 2000);
  };

  // Styles
  const $bodyHeader: ViewStyle = {
    paddingVertical: RFValue(20),
    flexDirection: "column",
    gap: 20,
  };
  const $cardHeader: ViewStyle = {
    paddingVertical: RFValue(10),
  };
  const $buttonsContainer: ViewStyle = {
    paddingVertical: RFValue(16),
  };

  return (
    <CustomView style={{ paddingVertical: RFValue(10) }}>
      {loading && <Spinner />}

      <BackButton onClick={() => navigation.goBack()} />
      {/* Body */}
      <KeyBoardView>
        <View style={$bodyHeader}>
          <Text font="SemiBold" color="#414651" size={18}>
            Parcel Out - Receiver
          </Text>
          <Text font="SemiBold" size={18}>
            Verify Parcel
          </Text>
          <Text size={14} color={color.textGray}>
            Enter the 4-digit code sent to the receiver{" "}
            <Text
              style={{ textDecorationLine: "underline", color: color.deepBlue }}
            >
              {singleParcel?.receiver.phone}
            </Text>
          </Text>
        </View>
        <View style={$cardHeader}>
          {/* Reusable OTP Input */}
          <OTPInput value={otp} onChange={handleOtpChange} />
        </View>
        {otpStatus !== "idle" && (
          <Animated.View
            style={{
              opacity: fadeAnim,
              padding: 10,
              borderRadius: 8,
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              marginBottom: 16,
            }}
          >
            <View
              style={{
                width: 24,
                height: 24,
                borderRadius: 12,
                backgroundColor:
                  otpStatus === "success" ? "#12B76A" : "#F04438",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text color="white" size={16}>
                {otpStatus === "success" ? "✓" : "✕"}
              </Text>
            </View>
            <Text
              size={12}
              color={otpStatus === "success" ? "#12B76A" : "#F04438"}
              font="Medium"
            >
              {otpMessage}
            </Text>
          </Animated.View>
        )}

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            paddingBottom: 20,
          }}
        >
          <ResendOTP onResend={handleSentOTP} />
        </View>
        <View style={$buttonsContainer}>
          <Button
            onPress={handleSubmit}
            title="Continue"
            style={{ height: 55 }}
            disabled={otpStatus !== "success"}
          />
        </View>
      </KeyBoardView>
    </CustomView>
  );
};

export default ParcelOtpVerificationReceiver;
