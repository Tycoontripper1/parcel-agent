// import React, { useCallback, useState } from "react";
// import {
//   View,
//   Text,
//   FlatList,
//   TouchableOpacity,
//   KeyboardAvoidingView,
//   ScrollView,
//   StyleSheet,
//   Dimensions,
//   Platform,
//   ImageBackground,
//   ViewStyle,
//   Alert,
//   RefreshControl,
// } from "react-native";
// import * as Clipboard from "expo-clipboard";
// import { color } from "@/constants/Colors";

// import { RFValue } from "react-native-responsive-fontsize";
// import { useFocusEffect, useNavigation } from "@react-navigation/native";
// import { CustomView } from "@/components";
// import ScreenHeader from "@/components/share/ScreenHeader";
// import { NativeStackScreenProps } from "@react-navigation/native-stack";
// import { HomeStackList } from "@/navigation/navigationType";
// import { WalletStackList } from "@/navigation/navigationType";
// import { Feather, Ionicons } from "@expo/vector-icons";
// import CreditIcon from "@/components/svg/CreditIcon";
// import DebitIcon from "@/components/svg/DebitIcon";
// import WalletIconBlue from "@/components/svg/WalletIconBlue";
// import EarningIcon from "@/components/svg/EarningIcon";
// import FundWallet from "@/components/FundWallet";
// import WalletIcon from "@/components/svg/WalletIcon";
// import TransferIcon from "@/components/svg/TransferIcon";
// import USSDIcon from "@/components/svg/USSDIcon";
// import EmptyWallet from "@/components/svg/EmptyEarning";
// import BottomSheetModal from "@/components/BottomSheetModal";
// import { getUserProfile } from "../../services/auth";

// const transactions: any = [
//   // {
//   //   id: "1",
//   //   type: "credit",
//   //   amount: 1500,
//   //   date: "2025-03-03",
//   //   title: "Salary",
//   // },
//   // {
//   //   id: "2",
//   //   type: "debit",
//   //   amount: 500,
//   //   date: "2025-03-03",
//   //   title: "Shopping",
//   // },
//   // {
//   //   id: "3",
//   //   type: "credit",
//   //   amount: 2000,
//   //   date: "2025-03-02",
//   //   title: "Freelance",
//   // },
//   // {
//   //   id: "4",
//   //   type: "debit",
//   //   amount: 300,
//   //   date: "2025-03-02",
//   //   title: "Groceries",
//   // },
// ];
// const { width } = Dimensions.get("window");
// type Props = NativeStackScreenProps<WalletStackList>;

// export interface Wallet {
//   title: string;
//   icon: React.ReactNode;
// }

// const WalletScreen = ({ navigation }: Props) => {
//   const [isWallet, setIsWallet] = useState(false);
//   const [userProfile, setUserProfile] = useState<any>(null);
//   const [filter, setFilter] = useState("all");
//   const filteredTransactions = transactions?.filter((tx: any) =>
//     filter === "all" ? true : tx.type === filter
//   );
//   const [showModal, setShowModal] = useState(false);
//   const groupedTransactions = filteredTransactions.reduce(
//     (acc: any, tx: any) => {
//       if (!acc[tx.date]) acc[tx.date] = [];
//       acc[tx.date].push(tx);
//       return acc;
//     },
//     {} as Record<string, typeof transactions>
//   );

//   const $bodyHeader: ViewStyle = {
//     paddingTop: RFValue(18),
//     paddingBottom: RFValue(12),
//   };

//   const copyToClipboard = async (text: string) => {
//     await Clipboard.setStringAsync(text);
//     Alert.alert("Copied", "Account number copied to clipboard");
//   };

//     useFocusEffect(
//       useCallback(() => {
//         const fetchUser = async () => {
//           const userDetails = await getUserProfile();
//           //(userDetails?.data?.details.wallet, "User Profile Data");
//           setUserProfile(userDetails?.data?.details.wallet || null);
//         };
//         fetchUser();
//       }, [])
//     );
//     const [refreshing, setRefreshing] = useState(false);

// const onRefresh = async () => {
//   setRefreshing(true);
//   await getUserProfile();
//   setRefreshing(false);
// };

  
//   return (
//     <CustomView style={styles.container}>
//       <ScreenHeader title="Wallet" onNotificationShow={false} type="Home" />
//       {/* <KeyboardAvoidingView
//         style={{ paddingTop: 10 }}
//         behavior={Platform.OS === "ios" ? "padding" : "height"}
//       > */}
//       <ScrollView
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={{ paddingBottom: 20 }}
//         keyboardShouldPersistTaps="handled"
//         refreshControl={
//           <RefreshControl
//             refreshing={refreshing}
//             onRefresh={onRefresh}
//               colors={["#00A300"]} // Your brand color
//             tintColor="#00A300" // For iOS
//           />
//         }
//       >
//         <View
//           style={{
//             flexDirection: "row",
//             width: "100%",
//             gap: RFValue(6),
//           }}
//         >
//           {/* Balance Card */}
//           <View style={styles.balanceCard}>
//             <View>
//               <View
//                 style={{
//                   flexDirection: "row",
//                   justifyContent: "space-between",
//                   alignItems: "flex-start",
//                 }}
//               >
//                 <View>
//                   <WalletIconBlue />
//                   <Text style={styles.balanceLabel}>Wallet Balance</Text>
//                   <Text style={styles.balance}>₦{userProfile?.balance}</Text>
//                 </View>
//               </View>
//             </View>
//             <TouchableOpacity
//               onPress={() => setShowModal(true)}
//               style={styles.fundButton}
//             >
//               <Text style={styles.fundButtonText}>Fund Wallet</Text>
//             </TouchableOpacity>
//           </View>
//           {/* Balance Card */}
//           <View style={styles.balanceCard}>
//             <View>
//               <View
//                 style={{
//                   flexDirection: "row",
//                   justifyContent: "space-between",
//                   alignItems: "flex-start",
//                 }}
//               >
//                 <View>
//                   <EarningIcon />
//                   <Text style={styles.balanceLabel}>Earnings</Text>
//                   <Text style={styles.balance}>₦0.00</Text>
//                 </View>
//               </View>
//             </View>
//             <TouchableOpacity
//               onPress={() => navigation.navigate("WalletEarnings")}
//               style={styles.fundButton}
//             >
//               <Text style={styles.fundButtonText}>View</Text>
//             </TouchableOpacity>
//           </View>
//         </View>

//         <View style={$bodyHeader}>
//           <Text
//             style={{
//               color: "#414651",
//               fontSize: RFValue(18),
//               fontWeight: "500",
//             }}
//           >
//             Transaction History
//           </Text>
//         </View>
//         <View style={styles.filterContainer}>
//           {["all", "credit", "debit"].map((type) => (
//             <TouchableOpacity
//               key={type}
//               style={[
//                 styles.filterButton,
//                 filter === type && styles.activeFilter,
//               ]}
//               onPress={() => setFilter(type)}
//             >
//               <Text
//                 style={[
//                   styles.filterText,
//                   filter === type && styles.activeText,
//                 ]}
//               >
//                 {type.charAt(0).toUpperCase() + type.slice(1)}
//               </Text>
//             </TouchableOpacity>
//           ))}
//         </View>
//         <View style={""}>
//           {Object.keys(groupedTransactions).length === 0 ? (
//             <View style={styles.emptyContainer}>
//               <EmptyWallet />
//               <Text style={styles.emptyText}>No transactions yet</Text>
//             </View>
//           ) : (
//             <>
//               {Object.keys(groupedTransactions).map((date) => (
//                 <View key={date} style={styles.section}>
//                   <Text style={styles.sectionTitle}>{date}</Text>
//                   {groupedTransactions[date].map((tx: any) => (
//                     <View key={tx.id} style={styles.transactionRow}>
//                       <View
//                         style={{ flexDirection: "row", alignItems: "center" }}
//                       >
//                         <View style={styles.transactionIconContainer}>
//                           {tx.type === "credit" ? (
//                             <CreditIcon />
//                           ) : (
//                             <DebitIcon />
//                           )}
//                         </View>
//                         <View style={{ flexDirection: "column", gap: 12 }}>
//                           <Text style={styles.transactionTitle}>
//                             {tx.title}
//                           </Text>
//                           <Text style={styles.transactionDate}>{tx.date}</Text>
//                         </View>
//                       </View>
//                       <View style={{ flexDirection: "column", gap: 8 }}>
//                         <Text style={styles.transactionAmount}>
//                           ₦{Math.abs(tx.amount)}
//                         </Text>
//                         <Text
//                           style={[
//                             styles.transactionType,
//                             tx.type === "credit" ? styles.credit : styles.debit,
//                           ]}
//                         >
//                           {tx.type === "credit" ? "Credit" : "Debit"}
//                         </Text>
//                       </View>
//                     </View>
//                   ))}
//                 </View>
//               ))}
//             </>
//           )}
//         </View>

//         {Object.keys(groupedTransactions).length > 0 && (
//           <TouchableOpacity
//             style={{
//               display: "flex",
//               justifyContent: "center",
//               alignItems: "center",
//             }}
//             onPress={() => navigation.navigate("TransactionHistory")}
//           >
//             <Text style={styles.viewAllText}>View All</Text>
//           </TouchableOpacity>
//         )}
//         <BottomSheetModal
//           isVisible={showModal}
//           onClose={() => setShowModal(false)}
//           title="Fund Wallet"
//         >
//           <View style={{ gap: 12, paddingVertical: RFValue(20) }}>
//             {/* Bank Name */}
//             <View
//               style={{ flexDirection: "row", justifyContent: "space-between" }}
//             >
//               <Text style={{ color: "#888", fontSize: RFValue(16) }}>Bank</Text>
//               <Text>{userProfile?.bankName}</Text>
//             </View>

//                         <View
//               style={{
//                 flexDirection: "row",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//               }}
//             >
//               <Text style={{ color: "#888", fontSize: RFValue(16) }}>
//                 Account Name
//               </Text>
//               <View style={{ flexDirection: "row", alignItems: "center" }}>
//                 <Text style={{ marginRight: 8 }}>{userProfile?.accountName}</Text>
//               </View>
//             </View>

//             {/* Account Number with Copy Icon */}
//             <View
//               style={{
//                 flexDirection: "row",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//               }}
//             >
//               <Text style={{ color: "#888", fontSize: RFValue(16) }}>
//                 Account Number
//               </Text>
//               <View style={{ flexDirection: "row", alignItems: "center" }}>
//                 <Text style={{ marginRight: 8 }}>{userProfile?.accountNumber}</Text>
//                 <TouchableOpacity
//                   onPress={() => Clipboard.setString(userProfile?.accountNumber || "")}
//                 >
//                   <Feather name="copy" size={16} color="#47104C" />
//                 </TouchableOpacity>
//               </View>
//             </View>
//  {/* Account Balance with auto-refresh */}
//   <View style={styles.accountDetailRow}>
//     <Text style={styles.detailLabel}>Available Balance</Text>
//     <Text style={styles.balanceText}>
//       ₦{(userProfile?.balance || 0).toLocaleString("en-NG", {
//         minimumFractionDigits: 2,
//       })}
//     </Text>
//   </View>
//           </View>
//         </BottomSheetModal>
//       </ScrollView>
//       {/* </KeyboardAvoidingView> */}
//     </CustomView>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: RFValue(16) },
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
//   section: { marginBottom: RFValue(16) },
//   sectionTitle: {
//     fontSize: RFValue(14),
//     fontWeight: "semibold",
//     marginBottom: RFValue(8),
//   },
//   transactionRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     backgroundColor: "#fff",
//     paddingVertical: RFValue(12),
//     marginBottom: RFValue(6),
//     borderBottomWidth: 1,
//     borderColor: "#EFEFF0",
//   },

//   transactionIconContainer: {
//     alignItems: "center",
//     marginRight: RFValue(10),
//   },
//   transactionType: {
//     fontSize: RFValue(8),
//     color: "#64748B",
//     marginTop: RFValue(4),
//   },
//   transactionTitle: { fontSize: RFValue(14), fontWeight: "500" },
//   transactionDate: { fontSize: RFValue(12), color: "#213264" },
//   transactionAmount: { fontSize: RFValue(10), fontWeight: "bold" },
//   credit: {
//     color: "#12B76A",
//     backgroundColor: "#DFFCE9",
//     paddingHorizontal: RFValue(8),
//     paddingVertical: RFValue(1),
//     borderRadius: RFValue(24),
//   },
//   debit: {
//     color: "#F04438",
//     backgroundColor: "#FEDEDC",
//     paddingHorizontal: RFValue(8),
//     paddingVertical: RFValue(1),
//     borderRadius: RFValue(24),
//   },

//   viewAllText: { color: "#213264", fontSize: RFValue(14), fontWeight: "bold" },
//   balanceCard: {
//     marginVertical: RFValue(16),
//     width: "48%",
//     padding: RFValue(8),
//     backgroundColor: color.secondaryColor,
//     borderRadius: RFValue(16),
//   },
//   balanceLabel: {
//     marginTop: RFValue(6),
//     color: "#fff",
//     fontSize: RFValue(12),
//   },
//   balance: {
//     color: "#fff",
//     fontSize: RFValue(16),
//     fontWeight: "bold",
//     marginVertical: RFValue(8),
//   },
//   quickSearchContainer: {
//     marginVertical: RFValue(16),
//     paddingHorizontal: RFValue(16),
//     paddingTop: RFValue(16),
//     paddingBottom: RFValue(5),
//     backgroundColor: "#FAFAFA",
//     borderRadius: RFValue(10),
//   },
//   quickSearchLabel: {
//     fontSize: RFValue(14),
//     marginBottom: RFValue(8),
//     alignSelf: "center",
//   },
//   searchInput: {
//     backgroundColor: "#fff",
//     borderRadius: RFValue(8),
//     padding: RFValue(12),
//     borderWidth: 1,
//     borderColor: "#E9EAEB",
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   transactionButton: {
//     backgroundColor: "#e0e0e0",
//     paddingVertical: RFValue(4),
//     paddingHorizontal: RFValue(4),
//     borderRadius: RFValue(16),
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     gap: 6,
//   },
//   transactionButtonText: {
//     fontSize: RFValue(12),
//   },
//   fundButton: {
//     marginTop: RFValue(8),
//     backgroundColor: "#aaffaa",
//     paddingVertical: RFValue(12),
//     borderRadius: RFValue(16),
//     justifyContent: "center",
//     alignItems: "center",
//     flexDirection: "row",
//     gap: 6,
//   },
//   fundButtonText: {
//     color: "#003399",
//     fontWeight: "bold",
//   },
//   parcelButtonsContainer: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     justifyContent: "space-between",
//     marginHorizontal: RFValue(16),
//   },
//   parcelButton: {
//     width: width / 2 - RFValue(24),
//     backgroundColor: "#f0f0f0",
//     padding: RFValue(16),
//     borderRadius: RFValue(10),
//     marginVertical: RFValue(8),
//     alignItems: "center",
//   },
//   emptyContainer: {
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 20,
//   },
//   emptyText: {
//     marginTop: 10,
//     fontSize: 16,
//     color: "gray",
//   },
//   viewAllButton: {
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     marginTop: 20,
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     backgroundColor: "#007BFF",
//     borderRadius: 8,
//   },
//     accountDetailRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: "#F0F0F0",
//   },
//     detailLabel: {
//     color: "#888",
//     fontSize: RFValue(14),
//   },
//   balanceText: {
//     fontWeight: "bold",
//     fontSize: RFValue(16),
//     color: "#00A300",
//   },

// });

// export default WalletScreen;
import React, { useCallback, useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  Dimensions,
  RefreshControl,
  Alert,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { color } from "@/constants/Colors";
import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { format, subDays } from "date-fns";
import { getAllTransaction } from "../../services/transaction";
import CreditIcon from "@/components/svg/CreditIcon";
import DebitIcon from "@/components/svg/DebitIcon";
import BottomSheetModal from "@/components/BottomSheetModal";
import ScreenHeader from "@/components/share/ScreenHeader";
import { CustomView } from "@/components";
import EarningIcon from "@/components/svg/EarningIcon";
import WalletIconBlue from "@/components/svg/WalletIconBlue";
import EmptyWallet from "@/components/svg/EmptyEarning";
import { WalletStackList } from "@/navigation/navigationType";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { getUserProfile } from "../../services/auth";

const { width } = Dimensions.get("window");

type TransactionDirection = "credit" | "debit" | "all";
type TransactionType = "inward" | "outward" | "wallet-to-wallet" | "freeBalanceCharges" | "all";

interface Transaction {
  id: string;
  type: TransactionDirection;
  amount: number;
  date: string;
  title: string;
  category: TransactionType;
}

interface FilterOption {
  id: string;
  label: string;
}

const FilterButton = ({ 
  label, 
  active, 
  onPress 
}: { 
  label: string; 
  active: boolean; 
  onPress: () => void 
}) => (
  <TouchableOpacity
    style={[
      styles.filterButton,
      active && styles.activeFilterButton,
    ]}
    onPress={onPress}
  >
    <Text style={[
      styles.filterButtonText,
      active && styles.activeFilterButtonText
    ]}>
      {label}
    </Text>
    <MaterialIcons 
      name="keyboard-arrow-down" 
      size={20} 
      color={active ? "#213264" : "#64748B"} 
    />
  </TouchableOpacity>
);

const FilterSheet = ({ 
  visible, 
  title, 
  options, 
  selected, 
  onSelect, 
  onClose 
}: {
  visible: boolean;
  title: string;
  options: FilterOption[];
  selected: string;
  onSelect: (id: string) => void;
  onClose: () => void;
}) => (
  <Modal
    visible={visible}
    transparent={true}
    animationType="slide"
    onRequestClose={onClose}
  >
    <View style={styles.sheetOverlay}>
      <View style={styles.sheetContainer}>
        <View style={styles.sheetHeader}>
          <Text style={styles.sheetTitle}>{title}</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color="#213264" />
          </TouchableOpacity>
        </View>
        <ScrollView>
          {options.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.sheetItem,
                selected === option.id && styles.activeSheetItem,
              ]}
              onPress={() => {
                onSelect(option.id);
                onClose();
              }}
            >
              <Text
                style={[
                  styles.sheetItemText,
                  selected === option.id && styles.activeSheetItemText,
                ]}
              >
                {option.label}
              </Text>
              {selected === option.id && (
                <Feather name="check" size={20} color="#213264" />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  </Modal>
);

type Props = NativeStackScreenProps<WalletStackList>;

const WalletScreen = ({ navigation }: Props) => {
  // User data state
  const [userProfile, setUserProfile] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Transaction states
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [limit] = useState(10);
  const [hasMore, setHasMore] = useState(true);

  // Filter states
  const [activeDirection, setActiveDirection] = useState<TransactionDirection>("all");
  const [activeCategory, setActiveCategory] = useState<TransactionType>("all");
  const [showDirectionSheet, setShowDirectionSheet] = useState(false);
  const [showCategorySheet, setShowCategorySheet] = useState(false);

  // Date range state
  const [dateRange, setDateRange] = useState({
    startDate: format(subDays(new Date(), 7), "yyyy-MM-dd"),
    endDate: format(new Date(), "yyyy-MM-dd"),
  });

  // Filter options
  const directionOptions: FilterOption[] = [
    { id: "all", label: "All Directions" },
    { id: "credit", label: "Credit" },
    { id: "debit", label: "Debit" },
  ];

const categoryOptions: FilterOption[] = [
  { id: "all", label: "All Categories" },
  { id: "inward", label: "Inward Transfer" },
  { id: "outward", label: "Outward Transfer" },
  { id: "wallet-to-wallet", label: "Wallet Transfer" },
  { id: "freeBalanceCharges", label: "Charges" },
];

  // Fetch transactions
  const fetchTransactions = useCallback(
    async (reset = false) => {
      if (isLoading || (!reset && !hasMore)) return;

      setIsLoading(true);
      const newOffset = reset ? 0 : offset;

      try {
        const response = await getAllTransaction(
          dateRange.startDate,
          dateRange.endDate,
          activeDirection === "all" ? undefined : activeDirection,
          activeCategory === "all" ? undefined : activeCategory,
          newOffset,
          limit
        );

        const newTransactions = response?.details || [];
        const receivedFullPage = newTransactions.length === limit;

        setTransactions(prev => 
          reset ? newTransactions : [...prev, ...newTransactions]
        );
        setOffset(newOffset + limit);
        setHasMore(receivedFullPage);
      } catch (error: any) {
        Alert.alert("Error", error.message || "Failed to fetch transactions");
      } finally {
        setIsLoading(false);
        setRefreshing(false);
      }
    },
    [offset, limit, isLoading, hasMore, activeDirection, activeCategory, dateRange]
  );

  // Fetch user profile
  const fetchUserProfile = useCallback(async () => {
    try {
      const userDetails = await getUserProfile();
      setUserProfile(userDetails?.data?.details.wallet || null);
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
    }
  }, []);

  // Refresh data
  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchUserProfile(), fetchTransactions(true)]);
    setRefreshing(false);
  };

  // Focus effect
  useFocusEffect(
    useCallback(() => {
      fetchUserProfile();
      fetchTransactions(true);
    }, [fetchUserProfile, fetchTransactions])
  );

  // Filter transactions
  const filteredTransactions = transactions.filter((tx) => {
    const matchesDirection = activeDirection === "all" || tx.type === activeDirection;
    const matchesCategory = activeCategory === "all" || tx.category === activeCategory;
    return matchesDirection && matchesCategory;
  });

  // Group transactions by date
  const groupedTransactions = filteredTransactions.reduce((acc, tx) => {
    const dateKey = tx.date.split("T")[0];
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(tx);
    return acc;
  }, {} as Record<string, Transaction[]>);

  return (
    <CustomView style={styles.container}>
      <ScreenHeader title="Wallet" onNotificationShow={false} type="Home" />
      
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#00A300"]}
            tintColor="#00A300"
          />
        }
      >
        {/* Balance Cards */}
          <View
          style={{
            flexDirection: "row",
            width: "100%",
            gap: RFValue(6),
          }}
        >
          {/* Balance Card */}
          <View style={styles.balanceCard}>
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
                  <Text style={styles.balance}>₦{userProfile?.balance}</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => setShowModal(true)}
              style={styles.fundButton}
            >
              <Text style={styles.fundButtonText}>Fund Wallet</Text>
            </TouchableOpacity>
          </View>
          {/* Balance Card */}
          <View style={styles.balanceCard}>
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
              onPress={() => navigation.navigate("WalletEarnings")}
              style={styles.fundButton}
            >
              <Text style={styles.fundButtonText}>View</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Transaction History Header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Transaction History</Text>
        </View>

        {/* Filter Buttons */}
        <View style={styles.filterRow}>
          <FilterButton
            label={directionOptions.find(d => d.id === activeDirection)?.label || "Direction"}
            active={activeDirection !== "all"}
            onPress={() => setShowDirectionSheet(true)}
          />
          <FilterButton
            label={categoryOptions.find(c => c.id === activeCategory)?.label || "Category"}
            active={activeCategory !== "all"}
            onPress={() => setShowCategorySheet(true)}
          />
        </View>

        {/* Transactions List */}
        {Object.keys(groupedTransactions).length === 0 ? (
          <View style={styles.emptyContainer}>
            <EmptyWallet />
            <Text style={styles.emptyText}>No transactions yet</Text>
          </View>
        ) : (
          <>
            {Object.keys(groupedTransactions).map((date) => (
              <View key={date} style={styles.dateSection}>
                <Text style={styles.dateHeader}>{date}</Text>
                {groupedTransactions[date].map((tx) => (
                  <TouchableOpacity 
                    key={tx.id} 
                    style={styles.transactionItem}
                    // onPress={() => navigation.navigate("TransactionDetails", { transaction: tx })}
                  >
                    <View style={styles.transactionIcon}>
                      {tx.type === "credit" ? <CreditIcon /> : <DebitIcon />}
                    </View>
                    <View style={styles.transactionInfo}>
                      <Text style={styles.transactionTitle}>{tx.title}</Text>
                      <Text style={styles.transactionCategory}>{tx.category}</Text>
                    </View>
                    <View style={styles.transactionAmountContainer}>
                      <Text style={[
                        styles.amount,
                        tx.type === "credit" ? styles.credit : styles.debit
                      ]}>
                        {tx.type === "credit" ? "+" : "-"}₦{tx.amount.toLocaleString()}
                      </Text>
                      <Text style={styles.transactionTime}>
                        {new Date(tx.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </>
        )}

        {/* View All Button */}
        {Object.keys(groupedTransactions).length > 0 && (
          <TouchableOpacity
            style={styles.viewAllButton}
            onPress={() => navigation.navigate("TransactionHistory")}
          >
            <Text style={styles.viewAllText}>View All Transactions</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Filter Sheets */}
      <FilterSheet
        visible={showDirectionSheet}
        title="Select Direction"
        options={directionOptions}
        selected={activeDirection}
        onSelect={(id) => setActiveDirection(id as TransactionDirection)}
        onClose={() => setShowDirectionSheet(false)}
      />

      <FilterSheet
        visible={showCategorySheet}
        title="Select Category"
        options={categoryOptions}
        selected={activeCategory}
        onSelect={(id) => setActiveCategory(id as TransactionType)}
        onClose={() => setShowCategorySheet(false)}
      />

      {/* Fund Wallet Modal */}
        <BottomSheetModal
          isVisible={showModal}
          onClose={() => setShowModal(false)}
          title="Fund Wallet"
        >
          <View style={{ gap: 12, paddingVertical: RFValue(20) }}>
            {/* Bank Name */}
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={{ color: "#888", fontSize: RFValue(16) }}>Bank</Text>
              <Text>{userProfile?.bankName}</Text>
            </View>

                        <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#888", fontSize: RFValue(16) }}>
                Account Name
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={{ marginRight: 8 }}>{userProfile?.accountName}</Text>
              </View>
            </View>

            {/* Account Number with Copy Icon */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#888", fontSize: RFValue(16) }}>
                Account Number
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={{ marginRight: 8 }}>{userProfile?.accountNumber}</Text>
                <TouchableOpacity
                 
                >
                  <Feather name="copy" size={16} color="#47104C" />
                </TouchableOpacity>
              </View>
            </View>
 {/* Account Balance with auto-refresh */}
  <View style={styles.accountDetailRow}>
    <Text style={styles.detailLabel}>Available Balance</Text>
    <Text style={styles.balanceText}>
      ₦{(userProfile?.balance || 0).toLocaleString("en-NG", {
        minimumFractionDigits: 2,
      })}
    </Text>
  </View>
          </View>
        </BottomSheetModal>
    </CustomView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: RFValue(16),
  },
  balanceCardsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: RFValue(16),
  },
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
      accountDetailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
    detailLabel: {
    color: "#888",
    fontSize: RFValue(14),
  },
  balanceText: {
    fontWeight: "bold",
    fontSize: RFValue(16),
    color: "#00A300",
  },
  quickSearchContainer: {
    marginVertical: RFValue(16),
    paddingHorizontal: RFValue(16),
    paddingTop: RFValue(16),
    paddingBottom: RFValue(5),
    backgroundColor: "#FAFAFA",
    borderRadius: RFValue(10),
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
  sectionHeader: {
    paddingVertical: RFValue(16),
  },
  sectionTitle: {
    fontSize: RFValue(18),
    fontWeight: "500",
    color: "#414651",
  },
  filterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: RFValue(16),
  },
  filterButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F5F7FA",
    borderRadius: RFValue(8),
    padding: RFValue(12),
    marginHorizontal: RFValue(4),
  },
  activeFilterButton: {
    backgroundColor: "#E6FFDB",
  },
  filterButtonText: {
    fontSize: RFValue(14),
    color: "#64748B",
  },
  activeFilterButtonText: {
    color: "#213264",
    fontWeight: "500",
  },
  sheetOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  sheetContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: RFValue(16),
    borderTopRightRadius: RFValue(16),
    padding: RFValue(16),
    maxHeight: "50%",
  },
  sheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: RFValue(16),
  },
  sheetTitle: {
    fontSize: RFValue(18),
    fontWeight: "bold",
    color: "#213264",
  },
  sheetItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: RFValue(12),
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  activeSheetItem: {
    backgroundColor: "#F5F7FA",
  },
  sheetItemText: {
    fontSize: RFValue(16),
    color: "#414651",
  },
  activeSheetItemText: {
    color: "#213264",
    fontWeight: "500",
  },
  dateSection: {
    marginBottom: RFValue(16),
  },
  dateHeader: {
    fontSize: RFValue(14),
    fontWeight: "600",
    color: "#64748B",
    marginBottom: RFValue(8),
  },
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: RFValue(8),
    padding: RFValue(12),
    marginBottom: RFValue(8),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  transactionIcon: {
    width: RFValue(40),
    height: RFValue(40),
    borderRadius: RFValue(20),
    backgroundColor: "#F5F7FA",
    justifyContent: "center",
    alignItems: "center",
    marginRight: RFValue(12),
  },
  transactionInfo: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: RFValue(14),
    fontWeight: "500",
    color: "#414651",
  },
  transactionCategory: {
    fontSize: RFValue(12),
    color: "#64748B",
    marginTop: RFValue(4),
  },
  transactionAmountContainer: {
    alignItems: "flex-end",
  },
  amount: {
    fontSize: RFValue(14),
    fontWeight: "600",
  },
  credit: {
    color: "#12B76A",
  },
  debit: {
    color: "#F04438",
  },
  transactionTime: {
    fontSize: RFValue(12),
    color: "#64748B",
    marginTop: RFValue(4),
  },
  emptyContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: RFValue(40),
  },
  emptyText: {
    fontSize: RFValue(16),
    color: "#64748B",
    marginTop: RFValue(16),
  },
  viewAllButton: {
    alignItems: "center",
    padding: RFValue(12),
  },
  viewAllText: {
    color: "#213264",
    fontSize: RFValue(14),
    fontWeight: "bold",
  },
});

export default WalletScreen;