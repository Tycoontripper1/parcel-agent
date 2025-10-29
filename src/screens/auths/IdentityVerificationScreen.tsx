import { Button, CustomView, Input, Spinner, Text } from "@/components";
import SelectInput from "@/components/SelectInput";
import BackButton from "@/components/share/BackButton";
import StepProgress from "@/components/share/StepProgress";
import { AuthStackParamList } from "@/navigation/navigationType";
import { updateField } from "@/redux/slices/formSlice";
import { RootState } from "@/redux/store";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  ViewStyle,
  ActivityIndicator,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { useDispatch, useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import { getUser, identityVerification } from "../../../services/auth";

type Props = NativeStackScreenProps<AuthStackParamList>;
import { UserDetails } from "@/utils/interface";
const IdentityVerificationScreen = ({ navigation }: Props) => {
  const formData = useSelector((state: RootState) => state.form);
  const dispatch = useDispatch();
  const [idNumberError, setIdNumberError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [message, setMessage]=useState('')
  const [verificationError, setVerificationError] = useState("");
  const [user, setUser] = useState<UserDetails | null>(null);

  const { idType, idNumber } = useSelector((state: RootState) => state.form);
  useEffect(() => {
    const fetchUser = async () => {
      const userDetails = await getUser();
      setUser(userDetails);
      const email = userDetails?.email;
    };

    fetchUser();
  }, []);

  const handleValidation = () => {
    let isValid = true;

    if (!formData.idNumber) {
      setIdNumberError("ID Number is required.");
      isValid = false;
    } else if (formData.idType === "NIN" && formData.idNumber.length < 11) {
      setIdNumberError("Please enter valid ID Number.");
      isValid = false;
    } else {
      setIdNumberError("");
    }

    return isValid;
  };

  const verifyIdentification = async () => {
    try {
      setIsVerifying(true);
      setVerificationError("");
      const payload = {
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        dateOfBirth: user?.dateOfBirth || "",
        phone: user?.phone || "",
        identificationType: idType,
        identificationNumber: idNumber,
      };
      console.log(payload,"payload")
       const result = await identityVerification(payload);
      setMessage(result?.data.message)
      setIsVerified(true);
    } catch (error:any) {
      setVerificationError(
        "Verification failed. Please check your details"
      );
      console.log(error)
      setMessage(error?.message)
      setIsVerified(false);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleVerifyPress = () => {
    if (!handleValidation()) {
      return;
    }
    verifyIdentification();
  };

  const handleContinue = () => {
    navigation.navigate("FrontImageScreen");
  };

  // Styles
  const $bodyHeader: ViewStyle = {
    paddingVertical: RFValue(20),
    flexDirection: "column",
    gap: 6,
  };
  const $cardHeader: ViewStyle = {
    paddingVertical: RFValue(10),
  };

  const $verificationStatus: ViewStyle = {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: RFValue(10),
    marginBottom: RFValue(10),
    backgroundColor: "#F8F9FA",
    padding: RFValue(12),
    borderRadius: RFValue(8),
  };

  const $successIcon: ViewStyle = {
    backgroundColor: "#E8F5E9",
    width: RFValue(28),
    height: RFValue(28),
    borderRadius: RFValue(14),
    justifyContent: "center",
    alignItems: "center",
  };

  const $errorIcon: ViewStyle = {
    backgroundColor: "#FFEBEE",
    width: RFValue(28),
    height: RFValue(28),
    borderRadius: RFValue(14),
    justifyContent: "center",
    alignItems: "center",
  };

  return (
    <CustomView style={{ paddingVertical: RFValue(10) }}>
      {isVerifying && <Spinner />}
      <BackButton onClick={() => navigation.goBack()} />
      <StepProgress step={4} totalSteps={5} />
      {/* Body */}
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={$bodyHeader}>
            <Text font="SemiBold" size={18}>
              Identity Verification
            </Text>
            <Text color="#6C757D">
              Verify your identity to continue with the process
            </Text>
          </View>
          <View style={$cardHeader}>
            <SelectInput
              label="ID type"
              data={["bvn"]}
              placeholder="Select ID type"
              onSelect={(value) =>
                dispatch(updateField({ key: "idType", value }))
              }
            />
            <Input
              label="ID Number"
              placeholder="Enter ID number"
              placeholderTextColor="#B8C2CC"
              value={formData.idNumber}
              onChangeText={(value) => {
                dispatch(updateField({ key: "idNumber", value }));
                if (isVerified) {
                  setIsVerified(false);
                }
              }}
              errorMessage={idNumberError}
              keyboardType="number-pad"
              editable={!isVerified}
            />

            {/* Verification Status Display */}
            {(isVerified || verificationError) && (
              <View style={$verificationStatus}>
                {isVerified ? (
                  <>
                    <View style={$successIcon}>
                      <Ionicons
                        name="checkmark-done"
                        size={RFValue(18)}
                        color="#4CAF50"
                      />
                    </View>
                    <View>
                      <Text font="Medium" color="#4CAF50">
                        Verified
                      </Text>
                      <Text size={12} color="#6C757D">
                        {message}
                      </Text>
                    </View>
                  </>
                ) : (
                  <>
                    <View style={$errorIcon}>
                      <Ionicons
                        name="alert-circle-outline"
                        size={RFValue(18)}
                        color="#F44336"
                      />
                    </View>
                    <View>
                      <Text font="Medium" color="#F44336">
                        Verification Failed
                      </Text>
                      <Text size={12} color="#6C757D">
                        {message}
                      </Text>
                    </View>
                  </>
                )}
              </View>
            )}

            <Button
              onPress={isVerified ? handleContinue : handleVerifyPress}
              title={
                isVerifying
                  ? "Verifying..."
                  : isVerified
                  ? "Continue"
                  : "Verify Identification"
              }
              style={{ height: 55, marginVertical: RFValue(16) }}
              disabled={isVerifying}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </CustomView>
  );
};

export default IdentityVerificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: RFValue(16),
  },
});
