import React, { use, useCallback, useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ViewStyle,
  Alert,
  Keyboard,
} from "react-native";

import { RFValue } from "react-native-responsive-fontsize";
import Text from "@/components/Text";
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
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
import TransferErrorModal from "@/components/TransferErrorModal";
import {
  HomeStackList,
  RootStackParamList,
  WalletStackList,
} from "@/navigation/navigationType";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { getUserProfile } from "../../../../../services/auth";
import { MaterialIcons } from "@expo/vector-icons";

const fixedAmounts = [100, 500, 1000, 2000, 5000, 10000];

type WithdrawAmountRouteParams = {
  accountNumber?: string;
  accountName?: string;
  bankCode?: string;
  bankName?: string;
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
type Props = NativeStackScreenProps<WalletStackList>;
const InputWithdrawAmountScreen = ({
  route,
  navigation,
}: NativeStackScreenProps< HomeStackList>) => {
  const [amount, setAmount] = useState("");
  const [formattedAmount, setFormattedAmount] = useState("");
  const formData = useSelector((state: RootState) => state.form);
    const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  // you can get account details from previous screen like this:
  const { accountNumber, accountName, bankCode, bankName } =
    (route.params as WithdrawAmountRouteParams) || {};
  const [rawAmount, setRawAmount] = useState(""); // Stores raw number (e.g., "1", "200")
  const [displayValue, setDisplayValue] = useState(""); // Empty initial value, shows placeholder
const [userProfile, setUserProfile] = useState<any>(null);

    useFocusEffect(
      useCallback(() => {
        const fetchUser = async () => {
          const userDetails = await getUserProfile();
          setUserProfile(userDetails?.data?.details || null);
        };
        fetchUser();
      }, [])
    );

  
const formatForDisplay = (value: string) => {
  if (!value) return ""; // Returns empty string for empty input (shows placeholder)
  
  // Handle cases where value ends with . or .0 (partial decimal entry)
  if (value.endsWith(".")) return `${value}00`;
  if (value.endsWith(".0")) return `${value}0`;
  
  const num = parseFloat(value);
  
  // Return formatted number with commas and 2 decimal places
  return num.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const handleAmountChange = (text: string) => {
  // 1. Clean input - allow only numbers and single decimal point
  let numericValue = text
    .replace(/[^0-9.]/g, "") // Remove non-numeric chars
    .replace(/(\..*)\./g, "$1"); // Allow only one decimal point

  // 2. Update raw value (unformatted)
  setRawAmount(numericValue);
  
  // 3. Update display value (formatted)
  setDisplayValue(numericValue); // Show raw while typing
  
  // 4. Send raw value to backend (without formatting)
  const backendValue = numericValue === "" ? "0" : numericValue.split(".")[0];
  dispatch(updateField({ key: "amount", value: Number(backendValue) }));
};

const handleBlur = () => {
  // Format display when field loses focus
  if (rawAmount) {
    setDisplayValue(formatForDisplay(rawAmount));
  } else {
    setDisplayValue(""); // Shows placeholder when empty
  }
};

  const handleSelectAmount = (value: number) => {
    const numeric = String(value);
    setRawAmount(numeric);
    setDisplayValue(numeric);
    dispatch(updateField({ key: "amount", value: value }));
  };

  const handleContinue = () => {
    //   if (!amount || isNaN(Number(amount))) return;
    setShowModal(true);
  };
const handlePay = async () => {
  Keyboard.dismiss(); // Add this before showing modal
  // Validate input
  if (!rawAmount || parseFloat(rawAmount) <= 0) {
    Alert.alert("Error", "Please enter a valid amount.");
    return;
  }
  if (!accountNumber || !accountName) {
    Alert.alert("Error", "Account number and account name are required.");
    return;
  }

  setShowModal(false);
  setLoading(true);

  const data = {
    account_number: accountNumber,
    bank_code: bankCode,
    account_name: accountName,
    amount: String(rawAmount),
    narration: formData.narration || "",
  };
  //("Transfer Data:", data);

  try {
    Keyboard.dismiss(); // Add this before showing modal
    const result = await fundTransfer(data);
    
    // Success handling
    Toast.show({
      type: "success",
      text1: "Transfer Successful",
      text2: `₦${formatForDisplay(rawAmount)} sent to ${accountName}`,
      position: "top",
      visibilityTime: 4000,
      topOffset: 50,
    });

    navigation.navigate("ReceiptScreen", {
      trxId: result.data.details.trxId,
      sessionId: result.data.details.sessionId,
      amount: String(rawAmount) || "0",
      accountName,
      accountNumber,
      bankName,
      narration: formData.narration,
    });

  } catch (error: any) {
    Keyboard.dismiss(); // Add this before showing modal
    let errorMessage = "Transfer failed. Please try again later.";
    
    // Customize messages based on error type
    if (error.response) {
      switch (error.response.status) {
        case 400:
          errorMessage = error.response.data?.message || "Invalid transaction details";
          break;
        case 401:
          errorMessage = "Session expired. Please login again";
          break;
        case 403:
          errorMessage = "Insufficient balance for this transaction";
          break;
        case 500:
          errorMessage = "Server error. Please try again later";
          break;
      }
    } else if (error.message?.includes("network")) {
      errorMessage = "Network error. Check your connection";
    }

   // Show error modal
   setShowErrorModal(true);

    // Also show toast notification
    Toast.show({
      type: "error",
      text1: "Transfer Failed",
      text2: errorMessage,
      position: "top",
      visibilityTime: 5000,
      topOffset: 50,
    });

  } finally {
    setLoading(false);
  }
};

  const [showModal, setShowModal] = useState(false);
  return (
    <CustomView style={{ flex: 1, backgroundColor: "#fff" }}>
      {loading && (
        <Spinner
          message={`Processing your Payment Please wait.....`}
          width={"75%"}
          height={200}
        />
      )}
        <TransferErrorModal
        visible={showErrorModal}
        errorMessage={errorMessage}
        amount={formatForDisplay(rawAmount)}
        recipient={accountName || ""}
        onRetry={() => {
          setShowErrorModal(false);
          handlePay(); // Retry the payment
        }}
        onCancel={() => {
          setShowErrorModal(false);
          // Additional cleanup if needed
        }}
      />
      <BottomSheetModal
        isVisible={showModal}
        onClose={() => setShowModal(false)}
        title="Confirm Payment"
      >
        <View style={{ gap: RFValue(12) }}>
          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <Text style={{ fontWeight: "700", fontSize: RFValue(25) }}>
              ₦{formatForDisplay(String(formData.amount))}
            </Text>
          </View>
          {/* Account Number and Bank */}
          <View
            style={{ flexDirection: "row", justifyContent: "space-between", }}
          >
            <Text>Account Number</Text>
            <Text>{formData.account_number}</Text>
          </View>

          {/* Account Name */}
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={{ color: "#888" }}>Name</Text>
            <Text style={{ fontWeight: "600", textTransform: "capitalize",fontSize:RFValue(8) }}>
              {formData.account_name || "N/A"}
            </Text>
          </View>

          {/* Amount */}
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={{ color: "#888" }}>Amount</Text>
            <Text style={{ fontSize: RFValue(16), fontWeight: "bold" }}>
              ₦{formatForDisplay(String(formData.amount))}
            </Text>
          </View>

          {/* Payment Method */}
       <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={{ color: "#888" }}>Payment Method</Text>
            <Text style={{ fontSize: RFValue(16), fontWeight: "bold" }}>
              Wallet
            </Text>
          </View>

          {/* Available Balance */}
         <View style={styles.balanceContainer}>
  <View style={styles.balanceRow}>
    <Text style={styles.balanceLabel}>Available Balance</Text>
    <Text style={styles.balanceAmount}>₦{formatForDisplay(String(userProfile?.wallet?.balance))}</Text>
  </View>
  
  {/* Insufficient Funds Warning - Only shows when amount > balance */}
  {parseFloat(rawAmount) > userProfile?.wallet?.balance && (
    <View style={styles.warningContainer}>
      <MaterialIcons name="error-outline" size={16} color="#FF3B30" />
      <Text style={styles.warningText}>Insufficient balance</Text>
    </View>
  )}
</View>

          <View style={$buttonsContainer}>
            <ButtonHome
              onPress={handlePay}
              title={`Pay ₦${formatForDisplay(String(formData.amount))}`}
              style={{ height: 45 }}
                disabled={!rawAmount || parseFloat(rawAmount)> userProfile?.wallet?.balance}
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
            value={displayValue}
            onChangeText={handleAmountChange}
            onBlur={handleBlur}
            placeholder="0.00"
            placeholderTextColor="#999"
            keyboardType="decimal-pad"
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
            disabled={!rawAmount || !formData?.narration}
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
    balanceContainer: {
    marginTop: RFValue(16),
    padding: RFValue(12),
    backgroundColor: '#FAFAFA',
    borderRadius: RFValue(8),
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceLabel: {
    color: '#888',
    fontSize: RFValue(14),
  },
  balanceAmount: {
    fontWeight: 'bold',
    fontSize: RFValue(16),
    color: '#00A300', // Green for positive balance
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: RFValue(8),
    padding: RFValue(8),
    backgroundColor: '#FFF0F0',
    borderRadius: RFValue(4),
  },
  warningText: {
    color: '#FF3B30',
    fontSize: RFValue(12),
    marginLeft: RFValue(4),
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


