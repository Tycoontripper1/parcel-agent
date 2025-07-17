// import React, { useCallback, useState } from "react";
// import {
//   View,
//   Text,
//   FlatList,
//   TouchableOpacity,
//   ScrollView,
//   StyleSheet,
//   Dimensions,
//   Platform,
//   Alert,
//   TextInput,
//   ViewStyle,
// } from "react-native";
// import * as FileSystem from "expo-file-system";
// import * as Sharing from "expo-sharing";
// import { RFValue } from "react-native-responsive-fontsize";
// import { useFocusEffect, useNavigation } from "@react-navigation/native";
// import { CustomView } from "@/components";
// import CreditIcon from "@/components/svg/CreditIcon";
// import DebitIcon from "@/components/svg/DebitIcon";
// import BackButton from "./share/BackButton";
// import { NativeStackScreenProps } from "@react-navigation/native-stack";
// import { HomeStackList } from "@/navigation/navigationType";
// import { SearchNormal1 } from "iconsax-react-native";
// import { Ionicons, MaterialIcons } from "@expo/vector-icons";
// import { format, parseISO, subDays } from "date-fns";
// import { getAllTransaction } from "../../services/transaction";
// const transactions = [
//   {
//     id: "1",
//     type: "credit",
//     amount: 185000,
//     date: "2025-03-03T09:15:00",
//     title: "Salary Payment",
//     description: "Monthly salary deposit from employer",
//     status: "successful",
//     reference: "SAL-202503-001",
//     from: "TechCorp Ltd",
//     to: "My Account",
//     category: "income",
//   },
//   {
//     id: "2",
//     type: "debit",
//     amount: 75000,
//     date: "2025-03-03T11:30:00",
//     title: "Rent Payment",
//     description: "Monthly apartment rent",
//     status: "successful",
//     reference: "RENT-034567",
//     from: "My Account",
//     to: "Prime Properties",
//     category: "housing",
//   },
//   {
//     id: "3",
//     type: "debit",
//     amount: 4500,
//     date: "2025-03-04T08:45:00",
//     title: "Mobile Recharge",
//     description: "Airtime purchase - MTN",
//     status: "successful",
//     reference: "AIRT-987654",
//     from: "My Account",
//     to: "MTN Nigeria",
//     category: "utilities",
//   },
//   {
//     id: "4",
//     type: "credit",
//     amount: 12500,
//     date: "2025-03-04T14:20:00",
//     title: "Freelance Payment",
//     description: "Website development project",
//     status: "successful",
//     reference: "FL-20250304",
//     from: "Digital Solutions Inc",
//     to: "My Account",
//     category: "income",
//   },
//   {
//     id: "5",
//     type: "debit",
//     amount: 3200,
//     date: "2025-03-05T17:15:00",
//     title: "Supermarket",
//     description: "Grocery shopping at Spar",
//     status: "successful",
//     reference: "POS-567890",
//     from: "My Account",
//     to: "SPAR Nigeria",
//     category: "shopping",
//   },
//   {
//     id: "6",
//     type: "credit",
//     amount: 50000,
//     date: "2025-03-06T10:05:00",
//     title: "Bank Transfer",
//     description: "From brother for car repair",
//     status: "successful",
//     reference: "TRF-345678",
//     from: "John Doe",
//     to: "My Account",
//     category: "transfer",
//   },
//   {
//     id: "7",
//     type: "debit",
//     amount: 15000,
//     date: "2025-03-07T19:30:00",
//     title: "Dinner Out",
//     description: "Restaurant bill - The Place",
//     status: "successful",
//     reference: "POS-890123",
//     from: "My Account",
//     to: "The Place Restaurant",
//     category: "food",
//   },
//   {
//     id: "8",
//     type: "debit",
//     amount: 1200,
//     date: "2025-03-08T07:50:00",
//     title: "Transport",
//     description: "Uber ride to office",
//     status: "pending",
//     reference: "UBER-456789",
//     from: "My Account",
//     to: "Uber Nigeria",
//     category: "transport",
//   },
//   {
//     id: "9",
//     type: "credit",
//     amount: 8750,
//     date: "2025-03-09T13:10:00",
//     title: "Refund",
//     description: "Returned item to Jumia",
//     status: "successful",
//     reference: "RFND-234567",
//     from: "Jumia Nigeria",
//     to: "My Account",
//     category: "shopping",
//   },
//   {
//     id: "10",
//     type: "debit",
//     amount: 6500,
//     date: "2025-03-10T16:25:00",
//     title: "Electricity Bill",
//     description: "IKEDC prepaid meter token",
//     status: "failed",
//     reference: "IKEDC-789012",
//     from: "My Account",
//     to: "IKEDC",
//     category: "utilities",
//     failureReason: "Insufficient balance",
//   },
// ];

// type Props = NativeStackScreenProps<HomeStackList>;
// const { width } = Dimensions.get("window");

// const TransactionHistory = ({ navigation }: Props) => {
//   const [filter, setFilter] = useState("all");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [transaction, setTransaction]= useState()
//   // Filter transactions
//   const filteredTransactions = transactions.filter((tx) => {
//     const matchesType = filter === "all" ? true : tx.type === filter;
//     const matchesSearch = tx.title
//       .toLowerCase()
//       .includes(searchQuery.toLowerCase());
//     return matchesType && matchesSearch;
//   });

//   // Group by date
//   const groupedTransactions = filteredTransactions.reduce((acc, tx) => {
//     const dateKey = tx.date.split("T")[0];
//     if (!acc[dateKey]) acc[dateKey] = [];
//     acc[dateKey].push(tx);
//     return acc;
//   }, {} as Record<string, typeof transactions>);

//   // Function to generate and download CSV report
//   const downloadReport = async () => {
//     const csvHeader = "Date,Type,Title,Amount\n";
//     const csvRows = filteredTransactions
//       .map((tx) => `${tx.date},${tx.type},${tx.title},₦${tx.amount}`)
//       .join("\n");
//     const csvData = csvHeader + csvRows;

//     const fileUri = FileSystem.documentDirectory + "Transaction_Report.csv";
//     await FileSystem.writeAsStringAsync(fileUri, csvData, {
//       encoding: FileSystem.EncodingType.UTF8,
//     });

//     if (await Sharing.isAvailableAsync()) {
//       await Sharing.shareAsync(fileUri);
//     } else {
//       Alert.alert("Download Complete", "The CSV report has been saved.");
//     }
//   };

//   const handleTransactionPress = (transaction: any) => {
//     navigation.navigate("TransactionDetails", { transaction });
//   };
//   const $bodyHeader: ViewStyle = {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingVertical: RFValue(8),
//   };
//     useFocusEffect(
//       useCallback(() => {
//         const fetchTransactions = async () => {
//           // Get current date
//           const currentDate = new Date();
//           const sevenDaysAgo = subDays(currentDate, 7);

//           // Format dates as YYYY-MM-DD strings
//           const endDate = format(currentDate, "yyyy-MM-dd");
//           const startDate = format(sevenDaysAgo, "yyyy-MM-dd")
//           const direction = "credit"

//           const transaction = await getAllTransaction(startDate, endDate,direction);
//           //(transaction,"trans")
//           setTransaction(transaction?.data.details || []);
//         };

//         fetchTransactions();
//       }, [])
//     );

//   return (
//     <CustomView style={styles.container}>
//    <View style={styles.headerContainer}>
//       {/* Back Button */}
//       <TouchableOpacity
//         onPress={() => navigation.goBack()}
//         style={styles.backButton}
//         hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
//       >
//         <Ionicons name="arrow-back" size={24} color="#333" />
//       </TouchableOpacity>

//       {/* Spacer to push download to right */}
//       <View style={styles.spacer} />

//       {/* Download Report Text Button */}
//       <TouchableOpacity
//         onPress={downloadReport}
//         style={styles.downloadButton}
//         activeOpacity={0.7}
//       >
//         <Text style={styles.downloadText}>Download</Text>
//       </TouchableOpacity>
//     </View>
//       <View style={$bodyHeader}>
//         <Text
//           style={{ color: "#414651", fontSize: RFValue(18), fontWeight: "500" }}
//         >
//           Transaction History
//         </Text>
//         <TouchableOpacity
//           onPress={() => ""}
//           style={{
//             flexDirection: "row",
//             alignItems: "center",
//             gap: 4,
//             backgroundColor: "#fff",
//             borderWidth: 1,
//             borderColor: "#E9EAEB",
//             borderRadius: 8,
//             padding: 8,
//           }}
//         >
//           <MaterialIcons name="filter-list" size={16} color="black" />
//           <Text style={{ fontSize: RFValue(12) }}>Filter</Text>
//         </TouchableOpacity>
//       </View>
//       {/* Search Input */}
//       <View style={styles.searchInput}>
//         <SearchNormal1 color="#000" size={18} style={{ flexBasis: "10%" }} />
//         <TextInput
//           style={{
//             flexBasis: "88%",
//             height: "100%",
//             paddingVertical: RFValue(12),
//           }}
//           placeholder="Search transactions..."
//           placeholderTextColor="#888"
//           value={searchQuery}
//           onChangeText={setSearchQuery}
//         />
//       </View>

//       {/* Filter Buttons */}
//       <View style={styles.filterContainer}>
//         {["all", "credit", "debit"].map((type) => (
//           <TouchableOpacity
//             key={type}
//             style={[
//               styles.filterButton,
//               filter === type && styles.activeFilter,
//             ]}
//             onPress={() => setFilter(type)}
//           >
//             <Text
//               style={[styles.filterText, filter === type && styles.activeText]}
//             >
//               {type.charAt(0).toUpperCase() + type.slice(1)}
//             </Text>
//           </TouchableOpacity>
//         ))}
//       </View>

//       {/* Transaction List */}
//       <ScrollView
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={{ paddingBottom: 20 }}
//         keyboardShouldPersistTaps="handled"
//       >
//         {/* <FlatList
//           data={Object.keys(groupedTransactions)}
//           keyExtractor={(date) => date}
//           renderItem={({ item: date }) => (
//             <View style={styles.section}>
//               <Text style={styles.sectionTitle}>{date}</Text>
//               {groupedTransactions[date].map((tx) => (
//                 <View key={tx.id} style={styles.transactionRow}>
//                   <View style={{ flexDirection: "row", alignItems: "center" }}>
//                     <View style={styles.transactionIconContainer}>
//                       {tx.type === "credit" ? <CreditIcon /> : <DebitIcon />}
//                     </View>
//                     <View style={{ flexDirection: "column", gap: 12 }}>
//                       <Text style={styles.transactionTitle}>{tx.title}</Text>
//                       <Text style={styles.transactionDate}>{tx.date}</Text>
//                     </View>
//                   </View>

//                   <View style={{ flexDirection: "column", gap: 8 }}>
//                     <Text style={styles.transactionAmount}>₦{Math.abs(tx.amount)}</Text>
//                     <Text
//                       style={[styles.transactionType, tx.type === "credit" ? styles.credit : styles.debit]}
//                     >
//                       {tx.type === "credit" ? "Credit" : "Debit"}
//                     </Text>
//                   </View>
//                 </View>
//               ))}
//             </View>
//           )}
//         /> */}
//         <View>
//           {Object.keys(groupedTransactions).map((date) => (
//             <View key={date} style={styles.section}>
//               <Text style={styles.sectionTitle}>{date}</Text>
//               {groupedTransactions[date].map((tx) => (
//                 <TouchableOpacity
//                   key={tx.id}
//                   style={styles.transactionRow}
//                   onPress={() => handleTransactionPress(tx)}
//                 >
//                   <View style={{ flexDirection: "row", alignItems: "center" }}>
//                     <View style={styles.transactionIconContainer}>
//                       {tx.type === "credit" ? <CreditIcon /> : <DebitIcon />}
//                     </View>
//                     <View style={{ flexDirection: "column", gap: 12 }}>
//                       <Text style={styles.transactionTitle}>{tx.title}</Text>
//                       <Text style={styles.transactionDate}>
//                         {format(parseISO(tx.date), "MMMM d, yyyy, hh:mm a")}
//                       </Text>
//                     </View>
//                   </View>
//                   <View style={styles.amountContainer}>
//                     <Text
//                       style={[
//                         styles.transactionAmount,
//                         tx.type === "credit"
//                           ? styles.creditAmount
//                           : styles.debitAmount,
//                       ]}
//                     >
//                       {tx.type === "credit" ? "+" : "-"}₦{tx.amount}
//                     </Text>
//                     <View
//                       style={[
//                         styles.statusBadge,
//                         tx.status === "successful"
//                           ? styles.successBadge
//                           : tx.status === "pending"
//                           ? styles.pendingBadge
//                           : styles.failedBadge,
//                       ]}
//                     >
//                       <Text style={styles.statusText}>{tx.status}</Text>
//                     </View>
//                   </View>
//                 </TouchableOpacity>
//               ))}
//             </View>
//           ))}
//         </View>
//       </ScrollView>
//     </CustomView>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: RFValue(16) },
//   amountContainer: {
//     alignItems: "flex-end",
//   },
//   headerContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     backgroundColor: '#fff', // or your preferred background
//   },
//   backButton: {
//     paddingVertical: 8,
//   },
//   spacer: {
//     flex: 1, // Takes up all available space
//   },
//   downloadButton: {
//     paddingVertical: 8,
//     // paddingHorizontal: 12,
//   },
//   downloadText: {
//     color: 'green', // Green color
//     fontSize: 16,
//     fontFamily: 'bold',
//     letterSpacing: 0.5,
//   },
//   transactionAmount: {
//     fontSize: RFValue(14),
//     fontWeight: "600",
//   },
//   creditAmount: { color: "#12B76A" },
//   debitAmount: { color: "#F04438" },
//   statusBadge: {
//     paddingHorizontal: RFValue(8),
//     paddingVertical: RFValue(4),
//     borderRadius: RFValue(12),
//     marginTop: RFValue(4),
//   },
//   successBadge: { backgroundColor: "#D1FADF" },
//   pendingBadge: { backgroundColor: "#FEF0C7" },
//   failedBadge: { backgroundColor: "#FEE4E2" },
//   statusText: {
//     fontSize: RFValue(10),
//     fontWeight: "500",
//   },
//   searchInput: {
//     backgroundColor: "#fff",
//     borderRadius: RFValue(8),
//     paddingHorizontal: RFValue(12),
//     borderWidth: 1,
//     borderColor: "#E9EAEB",
//     flexDirection: "row",
//     alignItems: "center",
//     marginVertical: RFValue(16),
//   },

//   filterContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: RFValue(10),
//     borderWidth: 1,
//     borderColor: "#F5F5F5",
//     borderRadius: 8,
//     padding: RFValue(10),
//   },
//   filterButton: {
//     padding: RFValue(10),
//     width: RFValue(101),
//     borderRadius: RFValue(8),
//     backgroundColor: "#ffff",
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   activeFilter: { backgroundColor: "#E6FFDB" },
//   filterText: { fontSize: RFValue(14), color: "#64748B" },
//   activeText: { color: "#213264" },

//   // downloadButton: {
//   //   backgroundColor: "#E6FFDB",
//   //   padding: RFValue(12),
//   //   borderRadius: RFValue(8),
//   //   alignItems: "center",
//   //   marginBottom: RFValue(16),
//   // },
//   // downloadText: { color: "#213264", fontSize: RFValue(14), fontWeight: "bold" },

//   section: { marginBottom: RFValue(16) },
//   sectionTitle: {
//     fontSize: RFValue(14),
//     fontWeight: "semibold",
//     marginBottom: RFValue(6),
//   },
//   transactionRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     backgroundColor: "#fff",
//     paddingVertical: RFValue(6),
//     marginBottom: RFValue(6),
//     borderBottomWidth: 1,
//     borderColor: "#EFEFF0",
//   },
//   transactionIconContainer: { alignItems: "center", marginRight: RFValue(10) },
//   transactionType: { fontSize: RFValue(8), color: "#64748B" },
//   transactionTitle: { fontSize: RFValue(14), fontWeight: "500" },
//   transactionDate: { fontSize: RFValue(12), color: "#213264" },
//   credit: {
//     color: "#12B76A",
//     backgroundColor: "#DFFCE9",
//     paddingHorizontal: RFValue(8),
//     borderRadius: RFValue(24),
//   },
//   debit: {
//     color: "#F04438",
//     backgroundColor: "#FEDEDC",
//     paddingHorizontal: RFValue(8),
//     borderRadius: RFValue(24),
//   },
// });

import React, { useCallback, useState, useMemo } from "react";
import {
  View,
  Text,
  SectionList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
  TextInput,
  ActivityIndicator,
} from "react-native";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { RFValue } from "react-native-responsive-fontsize";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { format, parseISO, subDays } from "date-fns";
import { SearchNormal1 } from "iconsax-react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import DateRangePicker from "./DaterangePicker";
import { CustomView } from "@/components";
import CreditIcon from "@/components/svg/CreditIcon";
import DebitIcon from "@/components/svg/DebitIcon";
import { HomeStackList } from "@/navigation/navigationType";
import { getAllTransaction } from "../../services/transaction";
import { mockTransactions } from "@/constants/datas";
import BackButton from "./share/BackButton";

type Props = NativeStackScreenProps<HomeStackList>;
const { width } = Dimensions.get("window");

type TransactionDirection = "credit" | "debit" | undefined;
type TransactionType = "inward" | "outward" | "wallet-to-wallet" | "freeBalanceCharges" | undefined;

interface Transaction {
  id: string;
  accountName: string;
  accountNumber: string;
  sender: string;
  narration: string;
  amount: string;
  status: string | null;
  type: TransactionType;
  direction: TransactionDirection;
  reference: string;
  receiver: string | null;
  senderType: string;
  trxId: string;
  createdAt: string;
  updatedAt: string;
}

const TransactionHistory = ({ navigation }: Props) => {
  // State management
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [limit] = useState(10);
  const [hasMore, setHasMore] = useState(true);
  const [activeDirection, setActiveDirection] = useState<TransactionDirection>(undefined);
  const [activeType, setActiveType] = useState<TransactionType>(undefined);
  const [refreshing, setRefreshing] = useState(false);
  const [mock, setMock] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: format(subDays(new Date(), 7), "yyyy-MM-dd"),
    endDate: format(new Date(), "yyyy-MM-dd"),
  });
  const [fetchingMore, setFetchingMore] = useState(false);

  const fetchTransactions = useCallback(
    async (reset = false) => {
      if (isLoading || (!reset && !hasMore)) return;

      setIsLoading(true);
      const newOffset = reset ? 0 : offset;

      try {
        if (mock) {
          await new Promise((resolve) => setTimeout(resolve, 500));
          const startIdx = newOffset;
          const endIdx = newOffset + limit;
          const newTransactions = mockTransactions.slice(startIdx, endIdx);

          setTransactions((prev:any) =>
            reset ? newTransactions : [...prev, ...newTransactions]
          );
          setOffset(newOffset + limit);
          setHasMore(endIdx < mockTransactions.length);
          return;
        }

        const response = await getAllTransaction(
          dateRange.startDate,
          dateRange.endDate,
          activeDirection,
          activeType,
          newOffset,
          limit
        );

        const newTransactions: Transaction[] = response?.data?.details || [];
        setTransactions((prev) =>
          reset ? newTransactions : [...prev, ...newTransactions]
        );
        setOffset(newOffset + limit);
        setHasMore(newTransactions.length === limit);
      } catch (error: any) {
        Alert.alert("Error", error?.message || "Failed to fetch transactions");
      } finally {
        setIsLoading(false);
        setRefreshing(false);
      }
    },
    [offset, limit, activeDirection, activeType, mock, dateRange]
  );

  const handleRefresh = () => {
    setRefreshing(true);
    fetchTransactions(true);
  };
  const handleEndReached = () => {
  if (!isLoading && !fetchingMore && hasMore) {
    setFetchingMore(true);
    fetchTransactions(false).finally(() => {
      setFetchingMore(false);
    });
  }
};

  useFocusEffect(
    useCallback(() => {
      fetchTransactions(true);
    }, [fetchTransactions])
  );

  const filteredTransactions = useMemo(() => {
    if (!searchQuery) return transactions;
    return transactions.filter((tx) =>
      tx?.accountName?.toLowerCase()?.includes(searchQuery.toLowerCase()) ||
      tx?.narration?.toLowerCase()?.includes(searchQuery.toLowerCase()) ||
      tx?.accountNumber?.includes(searchQuery)
    );
  }, [transactions, searchQuery]);

  const groupedTransactions = useMemo(() => {
    return filteredTransactions.reduce((acc, tx) => {
      const dateKey = tx?.createdAt?.split("T")[0] ?? "unknown";
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(tx);
      return acc;
    }, {} as Record<string, Transaction[]>);
  }, [filteredTransactions]);

  const sectionData = useMemo(() => {
    const dates = Object.keys(groupedTransactions);
    if (!dates.length) return [];
    
    return dates
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
      .map((date) => ({
        title: date,
        data: groupedTransactions[date],
      }));
  }, [groupedTransactions]);

  const downloadReport = async () => {
    if (!filteredTransactions.length) {
      Alert.alert("No Data", "There are no transactions to export");
      return;
    }

    try {
      const csvHeader = "Date,Type,Description,Amount,Status\n";
      const csvRows = filteredTransactions
        .map((tx) => {
          const date = tx?.createdAt ? format(parseISO(tx.createdAt), "yyyy-MM-dd") : "";
          const type = tx?.type || "";
          const description = tx.direction === "debit" 
            ? `Transfer to ${tx.accountName}` 
            : `Transfer from ${tx.accountName}`;
          const amount = tx?.amount || "0";
          const status = tx?.status || "unknown";
          return `${date},${type},${description},₦${amount},${status}`;
        })
        .join("\n");
      
      const csvData = csvHeader + csvRows;
      const fileUri = FileSystem.documentDirectory + "Transaction_Report.csv";
      
      await FileSystem.writeAsStringAsync(fileUri, csvData, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri);
      } else {
        Alert.alert("Download Complete", "The CSV report has been saved.");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to generate report");
    }
  };

const getTransactionTitle = (tx: Transaction) => {
  const accountName = tx.accountName || "unknown account";
  const shortenedName = accountName.length > 10 
    ? `${accountName.slice(0, 10)}...` 
    : accountName;

  if (tx.direction === "debit") {
    return `Transfer to ${shortenedName}`;
  } else {
    return `Transfer from ${shortenedName}`;
  }
};
  // Toggle filter visibility
  const toggleFilters = () => setShowFilters(!showFilters);
  const renderItem = ({ item }: { item: Transaction }) => (
    <TouchableOpacity
      style={styles.transactionRow}
      onPress={() => navigation.navigate("TransactionDetails", { transaction: item })}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View style={styles.transactionIcon}>
          {item.direction === "credit" ? <CreditIcon /> : <DebitIcon />}
        </View>
        <View style={styles.transactionInfo}>
          <Text style={styles.transactionTitle}>{getTransactionTitle(item)}</Text>
          <Text style={styles.transactionTime}>
            {item?.createdAt ? format(parseISO(item.createdAt), "hh:mm a") : "N/A"}
          </Text>
        </View>
      </View>
      <View style={styles.transactionAmountContainer}>
        <Text
          style={[
            styles.amountText,
            item.direction === "credit" ? styles.credit : styles.debit,
          ]}
        >
          {item.direction === "credit" ? "+" : "-"}₦{parseFloat(item.amount).toLocaleString()}
        </Text>
        <View
          style={[
            styles.statusBadge,
            item.status === "successful"
              ? styles.successBadge
              : item.status === "pending"
              ? styles.pendingBadge
              : styles.failedBadge,
          ]}
        >
          <Text style={styles.statusText}>
            {item.status ? item.status.charAt(0).toUpperCase() + item.status.slice(1) : "Unknown"}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderSectionHeader = ({ section: { title } }: { section: { title: string } }) => (
    <Text style={styles.sectionHeader}>
      {title ? format(new Date(title), "EEEE, MMMM d, yyyy") : "Unknown Date"}
    </Text>
  );

  const renderFooter = () => {
    if (!isLoading) return null;
    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator size="small" color="#AEFF8C" />
      </View>
    );
  };

  const FilterSection = () => (
    <View style={styles.filterSection}>
      <Text style={styles.filterLabel}>Transaction Direction</Text>
      <View style={styles.filterRow}>
        {[undefined, "credit", "debit"].map((direction) => (
          <TouchableOpacity
            key={direction || "all"}
            style={[
              styles.filterOption,
              activeDirection === direction && styles.activeFilterOption,
            ]}
            onPress={() => {
              setActiveDirection(direction as TransactionDirection);
              fetchTransactions(true);
            }}
          >
            <Text
              style={[
                styles.filterOptionText,
                activeDirection === direction && styles.activeFilterOptionText,
              ]}
            >
              {direction ? direction.charAt(0).toUpperCase() + direction.slice(1) : "All"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.filterLabel}>Transaction Type</Text>
      <View style={styles.filterRow}>
        {[undefined, "inward", "outward", "wallet-to-wallet", "freeBalanceCharges"].map((type) => (
          <TouchableOpacity
            key={type || "all"}
            style={[
              styles.filterOption,
              activeType === type && styles.activeFilterOption,
            ]}
            onPress={() => {
              setActiveType(type as TransactionType);
              fetchTransactions(true);
            }}
          >
            <Text
              style={[
                styles.filterOptionText,
                activeType === type && styles.activeFilterOptionText,
              ]}
            >
              {type
                ? type
                    .split("-")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")
                : "All"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <CustomView style={styles.container}>
      <View style={styles.header}>
        <BackButton onClick={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Transaction History</Text>
        <TouchableOpacity onPress={toggleFilters} style={styles.filterButton}>
          <MaterialIcons
            name="filter-list"
            size={24}
            color={showFilters ? "#213264" : "#414651"}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <SearchNormal1 color="#64748B" size={20} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search transactions..."
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={setSearchQuery}
          clearButtonMode="while-editing"
        />
      </View>
      
      <TouchableOpacity
        style={styles.dateRangeButton}
        onPress={() => setShowDatePicker(true)}
      >
        <MaterialIcons name="date-range" size={20} color="#213264" />
        <Text style={styles.dateRangeText}>
          {dateRange.startDate ? format(new Date(dateRange.startDate), "MMM d") : ""}
          {dateRange.startDate && dateRange.endDate ? " - " : ""}
          {dateRange.endDate ? format(new Date(dateRange.endDate), "MMM d, yyyy") : ""}
        </Text>
        <MaterialIcons name="keyboard-arrow-down" size={20} color="#213264" />
      </TouchableOpacity>

      <DateRangePicker
        visible={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        onConfirm={(start, end) => {
          setDateRange({
            startDate: format(start, "yyyy-MM-dd"),
            endDate: format(end, "yyyy-MM-dd"),
          });
          fetchTransactions(true);
        }}
        initialStartDate={new Date(dateRange.startDate)}
        initialEndDate={new Date(dateRange.endDate)}
      />

      {showFilters && <FilterSection />}

      <View style={styles.listContainer}>
        <SectionList
         sections={sectionData}
  keyExtractor={(item, index) => `${item.id}_${index}`} // Add index to ensure uniqueness
  renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          contentContainerStyle={styles.listContent}
          onEndReached={() => {
            if (!isLoading && hasMore) {
              fetchTransactions(false);
            }
          }}
          onEndReachedThreshold={0.2}
          ListFooterComponent={renderFooter}
          onRefresh={handleRefresh}
          refreshing={refreshing}
          stickySectionHeadersEnabled={false}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={{ textAlign: "center", marginTop: 20 }}>
              {isLoading ? "Loading..." : "No transactions found"}
            </Text>
          }
        />
      </View>

      <TouchableOpacity style={styles.downloadFab} onPress={downloadReport}>
        <MaterialIcons name="file-download" size={24} color="#213264" />
      </TouchableOpacity>
    </CustomView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  dateRangeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    marginHorizontal: 16,
    marginVertical: 8,
    backgroundColor: "#f5f7fa",
    borderRadius: 8,
  },
  listContainer: {
    flex: 1,
    zIndex: -99,
    elevation: 0,
  },
  dateRangeText: {
    marginHorizontal: 8,
    fontSize: 14,
    color: "#213264",
    fontWeight: "500",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: RFValue(16),
    paddingVertical: RFValue(12),
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: RFValue(18),
    fontWeight: "500",
    color: "#414651",
    flex: 1,
    textAlign: "center",
    marginHorizontal: 8,
  },
  filterButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F7FA",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 48,
    margin: 16,
    marginBottom: 8,
  },
  searchInput: {
    flex: 1,
    height: "100%",
    paddingLeft: 8,
    fontSize: RFValue(14),
    color: "#414651",
  },
  filterSection: {
    backgroundColor: "white",
    padding: 16,
    marginHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  filterLabel: {
    fontSize: RFValue(12),
    color: "#64748B",
    marginBottom: 8,
    fontWeight: "500",
  },
  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  filterOption: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#F5F7FA",
  },
  activeFilterOption: {
    backgroundColor: "#E6FFDB",
  },
  filterOptionText: {
    fontSize: RFValue(12),
    color: "#64748B",
  },
  activeFilterOptionText: {
    color: "#213264",
    fontWeight: "500",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  sectionHeader: {
    fontSize: RFValue(14),
    fontWeight: "600",
    color: "#64748B",
    marginTop: 10,
    marginBottom: 8,
    paddingVertical: 4,
  },
  transactionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: RFValue(8),
    paddingVertical: RFValue(6),
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F5F7FA",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  transactionInfo: {},
  transactionTitle: {
    fontSize: RFValue(14),
    fontWeight: "500",
    color: "#414651",
    marginBottom: 4,
  },
  transactionTime: {
    fontSize: RFValue(12),
    color: "#64748B",
  },
  transactionAmountContainer: {
    alignItems: "flex-end",
  },
  amountText: {
    fontSize: RFValue(14),
    fontWeight: "600",
    marginBottom: 4,
  },
  credit: {
    color: "#12B76A",
  },
  debit: {
    color: "#F04438",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  successBadge: {
    backgroundColor: "#D1FADF",
  },
  pendingBadge: {
    backgroundColor: "#FEF0C7",
  },
  failedBadge: {
    backgroundColor: "#FEE4E2",
  },
  statusText: {
    fontSize: RFValue(10),
    fontWeight: "500",
    color: "#414651",
  },
  loadingFooter: {
    paddingVertical: 16,
    alignItems: "center",
  },
  downloadFab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#AEFF8C",
    zIndex: -99,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default TransactionHistory;