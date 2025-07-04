import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ViewStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Text from "@/components/Text"; // your custom text component
import { useNavigation } from "@react-navigation/native";
import { color } from "@/constants/Colors";
import { CustomView, Input, Spinner } from "@/components";
import HomeHeader from "@/components/share/HomeHeader";
import { RFValue } from "react-native-responsive-fontsize";
import { updateField } from "@/redux/slices/formSlice";
import ButtonHome from "@/components/ButtonHome";
import SelectInput from "@/components/SelectInput";
import { WalletStackList } from "@/navigation/navigationType";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { getAllBanks, nameEnquiry } from "../../../../../services/transaction";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
type Props = NativeStackScreenProps<WalletStackList>;
  

const WithdrawToBankScreen = ({ navigation }: Props) => {
  const [bankList, setBankList] = useState<{ name: string; code: string }[]>([]);
    const formData = useSelector((state: RootState) => state.form);
  const dispatch = useDispatch();
  const [accountNumber, setAccountNumber] = useState("");
  const [selectedBank, setSelectedBank] = useState<{
    name: string;
    code: string;
  } | null>(null);
  const [accountName, setAccountName] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [showBankList, setShowBankList] = useState(false);

  const $buttonsContainer: ViewStyle = {
    paddingVertical: RFValue(10),
  };
  const fetchBanks = async () => {
    try {
      const result = await getAllBanks();
      const rows = result?.data?.details || [];
      setBankList(rows);
    } catch (error) {
      console.error('Failed to fetch banks:', error);
    }
  }; 
    useEffect(() => {
      fetchBanks();
    }, []);

  useEffect(() => {
    const fetchAccountName = async () => {
      if (accountNumber.length === 10 && selectedBank) {
        setIsFetching(true);
        try {
          const result = await nameEnquiry({
            bankCode: selectedBank.code,
            accountNumber,
          });
          console.log(result.data.details)
          setAccountName(result?.data?.details || "");
              dispatch(updateField({ key: "account_name", value: result?.data?.details }));
          // setAccountName(result?.data?.message || "");
          setIsFetching(false);
        } catch (error) {
          console.error("Fetch error:", error);
          setIsFetching(false);
        }
      } else {
        setAccountName("");
      }
    };

    fetchAccountName();
  }, [accountNumber, selectedBank]);

  const handleNext = () => {
    navigation.navigate('InputWithdrawAmountScreen', {
      accountNumber,
      bankCode: selectedBank?.code ?? "",
      accountName,
    });
  };

  return (
    <CustomView style={{ flex: 1, backgroundColor: "#fff" }}>
      {isFetching && <Spinner />}
      <View style={{ paddingHorizontal: RFValue(16) }}>
        <HomeHeader type="Stack" title="Withdrawal" />
      </View>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View
          style={{
            padding: 16,
            backgroundColor: "#fff",
            borderRadius: 8,
            marginBottom: 20,
          }}
        >
          <Input
            label="Account Number"
            placeholder="Enter 10-digit account number"
            placeholderTextColor="#B8C2CC"
            value={accountNumber}
            onChangeText={(text) => {
              const numericText = text.replace(/\D/g, ""); // Remove non-numeric characters
              setAccountNumber(numericText);
              dispatch(updateField({ key: "account_number", value: numericText }));
            }}
            keyboardType="number-pad"
            // Remove errorMessage or define a local error state if needed
          />
          <SelectInput
            label="Select Bank"
            data={bankList.map((item) => item.name)} // sends only names to SelectInput
            showSearch={true}
            placeholder="Select a bank"
            onSelect={(bankName) => {
              const selected = bankList.find((item) => item.name === bankName);
              if (selected) {
                setSelectedBank({ name: selected.name, code: selected.code });
                dispatch(updateField({ key: "bank", value: { code: selected.code, name: selected.name } }));

              } else {
                setSelectedBank(null);
              }
            }}
          />

          {accountName && (
            <View style={styles.resultBox}>
              <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
              <View style={{ marginLeft: 10 }}>
                <Text style={styles.resultLabel}>Account Name</Text>
                <Text style={styles.resultValue}>{accountName}</Text>
              </View>
            </View>
          )}

          <View style={$buttonsContainer}>
            <ButtonHome
              onPress={handleNext}
              title={"Next"}
              style={{ height: 45 }}
              disabled={isFetching || !accountNumber || !selectedBank}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </CustomView>
  );
};

export default WithdrawToBankScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F5F5F5",
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 6,
    fontWeight: "500",
    fontSize: 14,
    color: color.gray,
  },
  input: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#F9F9F9",
  },
  outputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: RFValue(8),
    margin: 8,
    backgroundColor: "#f9fff4",
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#ddd",
  },
  checkedContainer: {
    borderColor: "#4CAF50",
  },
  infoContainer: {
    flexDirection: "column",
    marginLeft: 16,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  phone: {
    fontSize: 20,
    color: "#555",
    fontWeight: "500",
    textTransform: "capitalize",
  },

  bankList: {
    maxHeight: 200,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    marginTop: 5,
  },
  bankItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  confirmButton: {
    backgroundColor: color.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  confirmText: {
    color: "#fff",
    fontWeight: "600",
  },
  resultBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e6f9ec",
    padding: RFValue(8),
    borderRadius: 8,
    marginTop: RFValue(8),
  },
  resultLabel: {
    color: "#666",
    fontSize: 10,
  },
  resultValue: {
    color: "#000",
    fontWeight: "500",
    fontSize: 16,
    textTransform: "capitalize",
  },
  nextButton: {
    backgroundColor: "#000",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 30,
  },
  nextText: {
    color: "#fff",
    fontWeight: "600",
  },
});
