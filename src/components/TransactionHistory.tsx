import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  Platform,
  Alert,
  TextInput,
  ViewStyle,
} from "react-native";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { RFValue } from "react-native-responsive-fontsize";
import { useNavigation } from "@react-navigation/native";
import { CustomView } from "@/components";
import CreditIcon from "@/components/svg/CreditIcon";
import DebitIcon from "@/components/svg/DebitIcon";
import BackButton from "./share/BackButton";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { HomeStackList } from "@/navigation/navigationType";
import { SearchNormal1 } from "iconsax-react-native";
import { MaterialIcons } from "@expo/vector-icons";
const transactions = [
    { id: "1", type: "credit", amount: 1500, date: "2025-03-03", title: "Salary" },
    { id: "2", type: "debit", amount: 500, date: "2025-03-03", title: "Shopping" },
    { id: "3", type: "credit", amount: 2000, date: "2025-03-02", title: "Freelance Payment" },
    { id: "4", type: "debit", amount: 300, date: "2025-03-02", title: "Groceries" },
    { id: "5", type: "debit", amount: 1000, date: "2025-03-01", title: "Electricity Bill" },
    { id: "6", type: "credit", amount: 5000, date: "2025-02-28", title: "Bonus" },
    { id: "7", type: "debit", amount: 800, date: "2025-02-28", title: "Internet Subscription" },
    { id: "8", type: "debit", amount: 200, date: "2025-02-27", title: "Coffee" },
    { id: "9", type: "credit", amount: 3000, date: "2025-02-26", title: "Investment Return" },
    { id: "10", type: "debit", amount: 1500, date: "2025-02-25", title: "Dining Out" },
    { id: "11", type: "credit", amount: 7000, date: "2025-02-24", title: "Loan Received" },
    { id: "12", type: "debit", amount: 1200, date: "2025-02-23", title: "Entertainment" },
    { id: "13", type: "debit", amount: 600, date: "2025-02-22", title: "Gym Membership" },
    { id: "14", type: "debit", amount: 250, date: "2025-02-21", title: "Parking Fee" },
    { id: "15", type: "credit", amount: 4000, date: "2025-02-20", title: "Side Hustle" },
    { id: "16", type: "debit", amount: 1100, date: "2025-02-19", title: "Medical Expenses" },
    { id: "17", type: "debit", amount: 500, date: "2025-02-18", title: "Streaming Subscription" },
    { id: "18", type: "credit", amount: 2200, date: "2025-02-17", title: "Project Payment" },
    { id: "19", type: "debit", amount: 750, date: "2025-02-16", title: "Transport" },
    { id: "20", type: "credit", amount: 3200, date: "2025-02-15", title: "Stock Dividends" },
  ];
  


type Props = NativeStackScreenProps<HomeStackList>;
const { width } = Dimensions.get("window");

const TransactionHistory = ({ navigation }: Props) => {
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter transactions based on type and search query
  const filteredTransactions = transactions.filter((tx) => {
    const matchesType = filter === "all" ? true : tx.type === filter;
    const matchesSearch = tx.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  // Group transactions by date
  const groupedTransactions = filteredTransactions.reduce((acc, tx) => {
    if (!acc[tx.date]) acc[tx.date] = [];
    acc[tx.date].push(tx);
    return acc;
  }, {} as Record<string, typeof transactions>);

  // Function to generate and download CSV report
  const downloadReport = async () => {
    const csvHeader = "Date,Type,Title,Amount\n";
    const csvRows = filteredTransactions
      .map((tx) => `${tx.date},${tx.type},${tx.title},₦${tx.amount}`)
      .join("\n");
    const csvData = csvHeader + csvRows;

    const fileUri = FileSystem.documentDirectory + "Transaction_Report.csv";
    await FileSystem.writeAsStringAsync(fileUri, csvData, { encoding: FileSystem.EncodingType.UTF8 });

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri);
    } else {
      Alert.alert("Download Complete", "The CSV report has been saved.");
    }
  };
   const $bodyHeader: ViewStyle = {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: RFValue(18),
    };

  return (
    <CustomView style={styles.container}>
      <BackButton onClick={() => navigation.goBack()} />
       <View style={$bodyHeader}>
                  <Text style={{color:"#414651", fontSize:RFValue(18), fontWeight:'500'}}>
                  Transaction History
                  </Text>
                  <TouchableOpacity
              onPress={() => ''}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 4,
                backgroundColor: '#fff',
                borderWidth: 1,
                borderColor: '#E9EAEB',
                borderRadius: 8,
                padding: 8,
              }}>
              <MaterialIcons name='filter-list' size={16} color='black' />
              <Text style={{fontSize:RFValue(12)}}>
                Filter
              </Text>
            </TouchableOpacity>
              </View>
      {/* Search Input */}
              <View style={styles.searchInput}>
                    <SearchNormal1
                      color='#000'
                      size={18}
                      style={{flexBasis: '10%'}}
                    />
                    <TextInput
                      style={{flexBasis: '88%', height: '100%',paddingVertical: RFValue(12)}}
                      placeholder="Search transactions..."
                      placeholderTextColor="#888"
                      value={searchQuery}
                      onChangeText={setSearchQuery}
                    />
                  </View>

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        {["all", "credit", "debit"].map((type) => (
          <TouchableOpacity
            key={type}
            style={[styles.filterButton, filter === type && styles.activeFilter]}
            onPress={() => setFilter(type)}
          >
            <Text style={[styles.filterText, filter === type && styles.activeText]}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Download Report Button */}
      <TouchableOpacity style={styles.downloadButton} onPress={downloadReport}>
        <Text style={styles.downloadText}>Download Report</Text>
      </TouchableOpacity>

      {/* Transaction List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* <FlatList
          data={Object.keys(groupedTransactions)}
          keyExtractor={(date) => date}
          renderItem={({ item: date }) => (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{date}</Text>
              {groupedTransactions[date].map((tx) => (
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
                      style={[styles.transactionType, tx.type === "credit" ? styles.credit : styles.debit]}
                    >
                      {tx.type === "credit" ? "Credit" : "Debit"}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        /> */}
        <View>
  {Object.keys(groupedTransactions).map((date) => (
    <View key={date} style={styles.section}>
      <Text style={styles.sectionTitle}>{date}</Text>
      {groupedTransactions[date].map((tx) => (
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
            <Text style={[styles.transactionType, tx.type === "credit" ? styles.credit : styles.debit]}>
              {tx.type === "credit" ? "Credit" : "Debit"}
            </Text>
          </View>
        </View>
      ))}
    </View>
  ))}
</View>

      </ScrollView>
    </CustomView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: RFValue(16) },

  searchInput: {
    backgroundColor: '#fff',
    borderRadius: RFValue(8),
    paddingHorizontal:RFValue(12),
    borderWidth: 1,
    borderColor: '#E9EAEB',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: RFValue(16)
  },

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

  downloadButton: {
    backgroundColor: "#E6FFDB",
    padding: RFValue(12),
    borderRadius: RFValue(8),
    alignItems: "center",
    marginBottom: RFValue(16),
  },
  downloadText: { color: "#213264", fontSize: RFValue(14), fontWeight: "bold" },

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
  transactionIconContainer: { alignItems: "center", marginRight: RFValue(10) },
  transactionType: { fontSize: RFValue(8), color: "#64748B" },
  transactionTitle: { fontSize: RFValue(14), fontWeight: "500" },
  transactionDate: { fontSize: RFValue(12), color: "#213264" },
  transactionAmount: { fontSize: RFValue(10), fontWeight: "bold" },
  credit: { color: "#12B76A", backgroundColor: "#DFFCE9", paddingHorizontal: RFValue(8), borderRadius: RFValue(24) },
  debit: { color: "#F04438", backgroundColor: "#FEDEDC", paddingHorizontal: RFValue(8), borderRadius: RFValue(24) },
});

export default TransactionHistory;
