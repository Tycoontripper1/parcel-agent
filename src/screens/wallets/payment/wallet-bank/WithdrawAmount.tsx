import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ViewStyle,
  Alert,
} from "react-native";

import { RFValue } from "react-native-responsive-fontsize";
import Text from "@/components/Text";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/native";
import HomeHeader from "@/components/share/HomeHeader";
import { CustomView, Spinner } from "@/components";
import ButtonHome from "@/components/ButtonHome";
import BottomSheetModal from "@/components/BottomSheetModal";
import { set } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { updateField } from "@/redux/slices/formSlice";
import { fundTransfer } from "../../../../../services/transaction";
import Toast from "react-native-toast-message";

const fixedAmounts = [100, 500, 1000, 2000, 5000, 10000];

type WithdrawAmountRouteParams = {
  accountNumber?: string;
  accountName?: string;
  bankCode?: string;
};
const $buttonsContainer: ViewStyle = {
  paddingVertical: RFValue(10),
};

export const formatCurrency = (value: any) => {
  if (!value) return "";
  const amount = parseFloat(value) / 100;
  return amount.toLocaleString("en-NG", {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const InputWithdrawAmountScreen = ({
  route,
}: {
  route: RouteProp<{ params: WithdrawAmountRouteParams }, "params">;
}) => {
  const [amount, setAmount] = useState("");
  const navigation = useNavigation();
  const [formattedAmount, setFormattedAmount] = useState("");
    const formData = useSelector((state: RootState) => state.form);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  // you can get account details from previous screen like this:
  const { accountNumber, accountName, bankCode } = route.params || {};

  // Handle typing input
  const handleAmountChange = (text: string) => {
    const numeric = text.replace(/[^0-9]/g, "");
    console.log(numeric, "numeric value");
    if (numeric === "") {
      setAmount("");
      setFormattedAmount("0");
    } else {
      setAmount(numeric);
console.log(amount)
       dispatch(updateField({ key: "amount", value: Number(numeric) }));
      setFormattedAmount(formatCurrency(numeric));
    }
  };

  // Handle fixed amount click
  const handleSelectAmount = (value: any) => {
    const numeric = String(value * 100);
    setAmount(numeric);
    dispatch(updateField({ key: "amount", value: Number(numeric) }));
    setFormattedAmount(formatCurrency(numeric));
  };
  const handleContinue = () => {
    //   if (!amount || isNaN(Number(amount))) return;
    setShowModal(true);
    // Navigate or send to API
    //   navigation.navigate('WithdrawSummary', {
    //     amount,
    //     accountNumber,
    //     accountName,
    //     bankCode,
    //   });
  };
  const handlePay = async () => {
    // Optional: validate input
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert("Error", "Please enter a valid amount.");
      return;
    }
    if (!accountNumber || !accountName) {
      Alert.alert("Error", "Account number and account name are required.");
      return;
    }

    // Optional: disable the button / show loader here
        setShowModal(false);
    setLoading(true);
    const data = {
      account_number: accountNumber,
      bank_code: bankCode,
      account_name: accountName,
      amount: parseFloat(amount),
      narration: formData.narration || "",
      sender_name: "Oladeji Toheeb",
    };
    try {
      const result = await fundTransfer(data);
      console.log(result.data.details);
      Toast.show({
        type: "success",
        text1: "Payment Successful",
        text2: `₦${formatCurrency(formData.amount)} has been sent to ${accountName}`,
      });
         setShowModal(false);
    } catch (error) {
      console.error("Fetch error:", error);
      setLoading(false);
    }

    // setTimeout(() => {
    //   Alert.alert("Success", "Payment completed successfully!");
    //   setShowModal(false);
    //   // reset form state if needed
    // }, 1000);
  };

  const [showModal, setShowModal] = useState(false);
  return (
    <CustomView style={{ flex: 1, backgroundColor: "#fff" }}>
          {loading && (
        <Spinner
          message={`Processing your Payment Please wait.....`}
          width={'75%'}
          height={200}
        />
      )}
      <BottomSheetModal
        isVisible={showModal}
        onClose={() => setShowModal(false)}
        title="Confirm Payment"
      >
        <View style={{ gap: RFValue(12) }}>
          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <Text style={{ fontWeight: "700", fontSize: RFValue(25) }}>
             ₦{formatCurrency(formData.amount)}
            </Text>
          </View>
          {/* Account Number and Bank */}
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text>Account Number</Text>
            <Text>{formData.account_number}</Text>
          </View>

          {/* Account Name */}
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={{ color: "#888" }}>Name</Text>
            <Text style={{ fontWeight: "600", textTransform: "capitalize" }}>
              {formData.account_name || "N/A"}
            </Text>
          </View>

          {/* Amount */}
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={{ color: "#888" }}>Amount</Text>
            <Text style={{ fontSize: RFValue(16), fontWeight: "bold" }}>
                ₦{formatCurrency(formData.amount)}
            </Text>
          </View>

          {/* Payment Method */}
          <View>
            <Text style={{ color: "#888" }}>Payment Method</Text>
            <TouchableOpacity
              style={{
                backgroundColor: "#f0f0f0",
                paddingVertical: RFValue(10),
                paddingHorizontal: RFValue(12),
                borderRadius: RFValue(8),
                marginTop: RFValue(5),
              }}
            >
              <Text>Wallet</Text>
            </TouchableOpacity>
          </View>

          {/* Available Balance */}
          <View style={{ marginTop: RFValue(10) }}>
            <Text style={{ color: "#888" }}>Available Balance</Text>
            <Text style={{ fontWeight: "bold" }}>₦10,200</Text>
          </View>

          <View style={$buttonsContainer}>
            <ButtonHome
              onPress={handlePay}
              title=  {`Pay ₦${formatCurrency(formData.amount)}`}
              style={{ height: 45 }}
            />
          </View>
        </View>
      </BottomSheetModal>

      <View style={{ paddingHorizontal: RFValue(16) }}>
        <HomeHeader type="Stack" title="Enter Amount" />
      </View>

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Text style={styles.label}>Enter amount in ₦</Text>
        <View style={styles.amountInputWrapper}>
          <Text style={styles.nairaIcon}>₦</Text>
          <TextInput
            value={formattedAmount}
            onChangeText={handleAmountChange}
            placeholder="0"
            placeholderTextColor="#999"
            keyboardType="number-pad"
            style={styles.amountInput}
          />
        </View>

        <View style={styles.fixedRow}>
          {fixedAmounts.map((value) => (
            <TouchableOpacity
              key={value}
              style={styles.fixedButton}
              onPress={() => handleSelectAmount(value)}
            >
              <Text style={styles.fixedText}>
                ₦{value.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.remarkContainer}>
          <Text style={styles.remarkLabel}>Remark</Text>
          <TextInput
            placeholder="Enter your remark..."
            value={formData.narration || ""}
            onChangeText={(text) =>
              dispatch(updateField({ key: "narration", value: text }))
            }
            placeholderTextColor="#999"
            style={styles.remarkInput}
            multiline
          />
        </View>
        <View style={$buttonsContainer}>
          <ButtonHome
            onPress={handleContinue}
            title={"Continue"}
            style={{ height: 45 }}
            disabled={!amount}
          />
        </View>
      </KeyboardAvoidingView>
    </CustomView>
  );
};

export default InputWithdrawAmountScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: RFValue(16),
    marginTop: RFValue(30),
  },
  amountInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ddd",
  },

  nairaIcon: {
    fontSize: 18,
    color: "#000",
    marginRight: 6,
  },

  amountInput: {
    flex: 1,
    fontSize: 24,
    color: "#000",
    paddingVertical: RFValue(8),
  },

  remarkLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginBottom: 6,
  },

  remarkContainer: {
    marginTop: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
  },

  remarkInput: {
    color: "#000",
    backgroundColor: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 0,
    borderRadius: 8,
    fontSize: 16,
    textAlignVertical: "top",
  },

  label: {
    fontSize: 16,
    marginBottom: RFValue(10),
    color: "#555",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: RFValue(12),
    borderRadius: 10,
    fontSize: 24,
    outlineColor: "#E6FFDB",
    fontWeight: "600",
    backgroundColor: "#f9f9f9",
    color: "#000",
    marginBottom: RFValue(20),
  },
  fixedRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: RFValue(12),
    marginBottom: RFValue(20),
  },

  fixedButton: {
    width: "30%", // 3 per row with spacing
    backgroundColor: "#E6FFDB",
    paddingVertical: RFValue(12),
    borderRadius: 8,
    alignItems: "center",
  },

  fixedText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#007aff",
  },
  continueButton: {
    marginTop: "auto",
    backgroundColor: "#AEFF8C",
    paddingVertical: RFValue(14),
    borderRadius: 10,
    alignItems: "center",
  },
  continueText: {
    color: "#213264",
    fontSize: 16,
    fontWeight: "600",
  },
});
