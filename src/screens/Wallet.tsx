import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Dimensions,
  Platform,
  ImageBackground,
  ViewStyle,
} from "react-native";
import { color } from "@/constants/Colors";

import { RFValue } from "react-native-responsive-fontsize";
import { useNavigation } from "@react-navigation/native";
import { CustomView } from "@/components";
import ScreenHeader from "@/components/share/ScreenHeader";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { HomeStackList } from "@/navigation/navigationType";
import { WalletStackList } from "@/navigation/navigationType";
import { Ionicons } from "@expo/vector-icons";
import CreditIcon from "@/components/svg/CreditIcon";
import DebitIcon from "@/components/svg/DebitIcon";
import WalletIconBlue from "@/components/svg/WalletIconBlue";
import EarningIcon from "@/components/svg/EarningIcon";
import FundWallet from "@/components/FundWallet";
import WalletIcon from "@/components/svg/WalletIcon";
import TransferIcon from "@/components/svg/TransferIcon";
import USSDIcon from "@/components/svg/USSDIcon";
import EmptyWallet from "@/components/svg/EmptyEarning";

const transactions:any = [
  // {
  //   id: "1",
  //   type: "credit",
  //   amount: 1500,
  //   date: "2025-03-03",
  //   title: "Salary",
  // },
  // {
  //   id: "2",
  //   type: "debit",
  //   amount: 500,
  //   date: "2025-03-03",
  //   title: "Shopping",
  // },
  // {
  //   id: "3",
  //   type: "credit",
  //   amount: 2000,
  //   date: "2025-03-02",
  //   title: "Freelance",
  // },
  // {
  //   id: "4",
  //   type: "debit",
  //   amount: 300,
  //   date: "2025-03-02",
  //   title: "Groceries",
  // },
];
const { width } = Dimensions.get("window");
type Props = NativeStackScreenProps< WalletStackList>;

export interface Wallet {
  title: string;
  icon: React.ReactNode;
}

const WalletScreen = ({ navigation }: Props) => {
  const [isWallet, setIsWallet] = useState(false);
  const [filter, setFilter] = useState("all");
  const filteredTransactions = transactions?.filter((tx:any) =>
    filter === "all" ? true : tx.type === filter
  );
  const groupedTransactions = filteredTransactions.reduce((acc:any, tx:any) => {
    if (!acc[tx.date]) acc[tx.date] = [];
    acc[tx.date].push(tx);
    return acc;
  }, {} as Record<string, typeof transactions>);

  const $bodyHeader: ViewStyle = {
    paddingTop: RFValue(18),
    paddingBottom:RFValue(12)
  };
  const WalletData: Wallet[] = [
    {
      title: 'Bank Name',
      icon: "Providus Virtual Account",
      // title: 'Fund with Card',
      // icon: <WalletIcon />,
    },
    {
      title: 'Account Number',
      icon: "1234567890",
      // title: 'Fund with Bank Transfer',
      // icon: <TransferIcon />,
    },
    {title: 'Fund with USSD', icon: <USSDIcon />},
  ];
  return (
    <CustomView style={styles.container}>
      <ScreenHeader
        title="Wallet"
        onNotificationShow={false}
        type="Home"
      />
      {/* <KeyboardAvoidingView
        style={{ paddingTop: 10 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      > */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          keyboardShouldPersistTaps="handled"
        >
          <View
            style={{
              flexDirection: "row",
              width:"100%",
              gap: RFValue(6),
            }}
          >
            {/* Balance Card */}
            <View
              style={styles.balanceCard}
            >
              <View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <View>
                    <WalletIconBlue />
                    <Text style={styles.balanceLabel}>Wallet Balance</Text>
                    <Text style={styles.balance}>₦0.00</Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => setIsWallet(true)}
                style={styles.fundButton}
              >
                <Text style={styles.fundButtonText}>Fund Wallet</Text>
              </TouchableOpacity>
            </View>
            <FundWallet
            isModalVisible={isWallet}
            setIsModalVisible={setIsWallet}
            data={WalletData}
            placeholder='Fund Wallet'
            onSelect={() => ''}
          />
            {/* Balance Card */}
            <View
              style={styles.balanceCard}
            >
              <View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <View>
                    <EarningIcon />
                    <Text style={styles.balanceLabel}>Earnings</Text>
                    <Text style={styles.balance}>₦0.00</Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => navigation.navigate('WalletEarnings')}
                style={styles.fundButton}
              >
                <Text style={styles.fundButtonText}>View</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={$bodyHeader}>
            <Text style={{color:"#414651", fontSize:RFValue(18), fontWeight:'500'}}>
            Transaction History
            </Text>
        </View>
          <View style={styles.filterContainer}>
            {["all", "credit", "debit"].map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.filterButton,
                  filter === type && styles.activeFilter,
                ]}
                onPress={() => setFilter(type)}
              >
                <Text
                  style={[
                    styles.filterText,
                    filter === type && styles.activeText,
                  ]}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {/* <FlatList
            data={Object.keys(groupedTransactions)}
            keyExtractor={(date) => date}
            renderItem={({ item: date }) => (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>{date}</Text>
                {groupedTransactions[date].map((tx) => (
                  <View key={tx.id} style={styles.transactionRow}>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <View style={styles.transactionIconContainer}>
                        {tx.type === "credit" ? <CreditIcon /> : <DebitIcon />}
                      </View>
                      <View style={{ flexDirection: "column", gap: 12 }}>
                        <Text style={styles.transactionTitle}>{tx.title}</Text>
                        <Text style={styles.transactionDate}>{tx.date}</Text>
                      </View>
                    </View>

                    <View style={{ flexDirection: "column", gap: 8 }}>
                      <Text style={[styles.transactionAmount]}>
                        ₦{Math.abs(tx.amount)}
                      </Text>
                      <Text
                        style={[
                          styles.transactionType,
                          tx.type === "credit" ? styles.credit : styles.debit,
                        ]}
                      >
                        {tx.type === "credit" ? "Credit" : "Debit"}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
              
          /> */}
<View style={''}>
  {Object.keys(groupedTransactions).length === 0 ? (
    <View style={styles.emptyContainer}>
      <EmptyWallet />
      <Text style={styles.emptyText}>No transactions yet</Text>
    </View>
  ) : (
    <>
      {Object.keys(groupedTransactions).map((date) => (
        <View key={date} style={styles.section}>
          <Text style={styles.sectionTitle}>{date}</Text>
          {groupedTransactions[date].map((tx:any) => (
            <View key={tx.id} style={styles.transactionRow}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View style={styles.transactionIconContainer}>
                  {tx.type === "credit" ? <CreditIcon /> : <DebitIcon />}
                </View>
                <View style={{ flexDirection: "column", gap: 12 }}>
                  <Text style={styles.transactionTitle}>{tx.title}</Text>
                  <Text style={styles.transactionDate}>{tx.date}</Text>
                </View>
              </View>
              <View style={{ flexDirection: "column", gap: 8 }}>
                <Text style={styles.transactionAmount}>₦{Math.abs(tx.amount)}</Text>
                <Text
                  style={[
                    styles.transactionType,
                    tx.type === "credit" ? styles.credit : styles.debit,
                  ]}
                >
                  {tx.type === "credit" ? "Credit" : "Debit"}
                </Text>
              </View>
            </View>
          ))}
        </View>
      ))}

    </>
  )}
</View>

{Object.keys(groupedTransactions).length > 0 && (
  <TouchableOpacity 
    style={{ display: 'flex', justifyContent: "center", alignItems: "center" }} 
    onPress={() => navigation.navigate('TransactionHistory')}
  >
    <Text style={styles.viewAllText}>View All</Text>
  </TouchableOpacity>
)}

        </ScrollView>
      {/* </KeyboardAvoidingView> */}
    </CustomView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: RFValue(16) },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: RFValue(10),
    borderWidth: 1,
    borderColor: "#F5F5F5",
    borderRadius: 8,
    padding: RFValue(10),
  },
  filterButton: {
    padding: RFValue(10),
    width: RFValue(101),
    borderRadius: RFValue(8),
    backgroundColor: "#ffff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  activeFilter: { backgroundColor: "#E6FFDB" },
  filterText: { fontSize: RFValue(14), color: "#64748B" },
  activeText: { color: "#213264" },
  section: { marginBottom: RFValue(16) },
  sectionTitle: {
    fontSize: RFValue(14),
    fontWeight: "semibold",
    marginBottom: RFValue(8),
  },
  transactionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    paddingVertical: RFValue(12),
    marginBottom: RFValue(6),
    borderBottomWidth: 1,
    borderColor: "#EFEFF0",
  },

  transactionIconContainer: {
    alignItems: "center",
    marginRight: RFValue(10),
  },
  transactionType: {
    fontSize: RFValue(8),
    color: "#64748B",
    marginTop: RFValue(4),
  },
  transactionTitle: { fontSize: RFValue(14), fontWeight: "500" },
  transactionDate: { fontSize: RFValue(12), color: "#213264" },
  transactionAmount: { fontSize: RFValue(10), fontWeight: "bold" },
  credit: {
    color: "#12B76A",
    backgroundColor: "#DFFCE9",
    paddingHorizontal: RFValue(8),
    paddingVertical: RFValue(1),
    borderRadius: RFValue(24),
  },
  debit: {
    color: "#F04438",
    backgroundColor: "#FEDEDC",
    paddingHorizontal: RFValue(8),
    paddingVertical: RFValue(1),
    borderRadius: RFValue(24),
  },

  viewAllText: { color: "#213264", fontSize: RFValue(14), fontWeight: "bold" },
  balanceCard: {
    marginVertical: RFValue(16),
    width: "48%",
    padding: RFValue(8),
    backgroundColor: color.secondaryColor,
    borderRadius: RFValue(16),
  },
  balanceLabel: {
    marginTop: RFValue(6),
    color: "#fff",
    fontSize: RFValue(12),
  },
  balance: {
    color: "#fff",
    fontSize: RFValue(16),
    fontWeight: "bold",
    marginVertical: RFValue(8),
  },
  quickSearchContainer: {
    marginVertical: RFValue(16),
    paddingHorizontal: RFValue(16),
    paddingTop: RFValue(16),
    paddingBottom: RFValue(5),
    backgroundColor: "#FAFAFA",
    borderRadius: RFValue(10),
  },
  quickSearchLabel: {
    fontSize: RFValue(14),
    marginBottom: RFValue(8),
    alignSelf: "center",
  },
  searchInput: {
    backgroundColor: "#fff",
    borderRadius: RFValue(8),
    padding: RFValue(12),
    borderWidth: 1,
    borderColor: "#E9EAEB",
    flexDirection: "row",
    alignItems: "center",
  },
  transactionButton: {
    backgroundColor: "#e0e0e0",
    paddingVertical: RFValue(4),
    paddingHorizontal: RFValue(4),
    borderRadius: RFValue(16),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  transactionButtonText: {
    fontSize: RFValue(12),
  },
  fundButton: {
    marginTop: RFValue(8),
    backgroundColor: "#aaffaa",
    paddingVertical: RFValue(12),
    borderRadius: RFValue(16),
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 6,
  },
  fundButtonText: {
    color: "#003399",
    fontWeight: "bold",
  },
  parcelButtonsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginHorizontal: RFValue(16),
  },
  parcelButton: {
    width: width / 2 - RFValue(24),
    backgroundColor: "#f0f0f0",
    padding: RFValue(16),
    borderRadius: RFValue(10),
    marginVertical: RFValue(8),
    alignItems: "center",
  },
  emptyContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    marginTop: 10,
    fontSize: 16,
    color: "gray",
  },
  viewAllButton: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#007BFF",
    borderRadius: 8,
  },

});

export default WalletScreen;
