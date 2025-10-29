
// export default WalletScreen;
import React, { useCallback, useState, useMemo, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Dimensions,
  RefreshControl,
  Alert,
  SectionList,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { color } from "@/constants/Colors";
import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { format, parseISO, subDays } from "date-fns";
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
import * as Clipboard from 'expo-clipboard';

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

interface FilterOption {
  id: string | undefined;
  label: string;
}

interface SectionData {
  title: string;
  data: Transaction[];
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
  selected: undefined| string ;
  onSelect: (id: string | undefined) => void;
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
              key={option.id || option.label} // Fixed key prop issue
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
  const [activeDirection, setActiveDirection] = useState<TransactionDirection>(undefined);
  const [activeCategory, setActiveCategory] = useState<TransactionType>(undefined);
  const [showDirectionSheet, setShowDirectionSheet] = useState(false);
  const [showCategorySheet, setShowCategorySheet] = useState(false);
  
  // Date range state
  const [dateRange, setDateRange] = useState({
    startDate: format(subDays(new Date(), 7), "yyyy-MM-dd"),
    endDate: format(new Date(), "yyyy-MM-dd"),
  });

  // Filter options
  const directionOptions: FilterOption[] = useMemo(() => [
    { id: undefined, label: "All Directions" },
    { id: "credit", label: "Credit" },
    { id: "debit", label: "Debit" },
  ], []);

  const categoryOptions: FilterOption[] = useMemo(() => [
    { id: undefined, label: "All Categories" },
    { id: "inward", label: "Inward Transfer" },
    { id: "outward", label: "Outward Transfer" },
    { id: "wallet-to-wallet", label: "Wallet Transfer" },
    { id: "freeBalanceCharges", label: "Charges" },
  ], []);

  // Get transaction title
  const getTransactionTitle = useCallback((tx: Transaction) => {
    const accountName = tx.accountName || "Unknown";
    const shortenedName = accountName.length > 10 
      ? `${accountName.substring(0, 10)}...` 
      : accountName;

    if (tx.direction === "debit") {
      return `To ${shortenedName}`;
    } else {
      return `From ${shortenedName}`;
    }
  }, []);

  // Format date for display
  const formatDate = useCallback((dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch {
      return "Unknown Date";
    }
  }, []);

  // Copy to clipboard
  const copyToClipboard = async (text: string) => {
    await Clipboard.setStringAsync(text);
    Alert.alert("Copied!", "Account number copied to clipboard");
  };

  // Fetch transactions
  const fetchTransactions = useCallback(
    async (reset = false) => {
      if ((isLoading && !reset) || (!reset && !hasMore)) return;
      
      setIsLoading(true);
      const newOffset = reset ? 0 : offset;
      
      try {
        const response = await getAllTransaction(
          dateRange.startDate,
          dateRange.endDate,
          activeDirection,
          activeCategory,
          newOffset,
          limit
        );

        const newTransactions = response?.data?.details || [];
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
      setUserProfile(userDetails?.data?.details?.wallet || null);
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
    }
  }, []);

  // Refresh data
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([fetchUserProfile(), fetchTransactions(true)]);
    setRefreshing(false);
  }, [fetchUserProfile, fetchTransactions]);

  // Filter effect - fetch when filters change
  useEffect(() => {
    fetchTransactions(true);
  }, [activeDirection, activeCategory]);

  // Initial data load
  useEffect(() => {
    fetchUserProfile();
    fetchTransactions(true);
  }, []);

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const matchesDirection = activeDirection === undefined || tx.direction === activeDirection;
      const matchesCategory = activeCategory === undefined || tx.type === activeCategory;
      return matchesDirection && matchesCategory;
    });
  }, [transactions, activeDirection, activeCategory]);

  // Group transactions by date
  const groupedTransactions = useMemo(() => {
    const groups = filteredTransactions.reduce((acc, tx) => {
      const dateKey = tx?.createdAt?.split("T")[0] ?? "unknown";
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(tx);
      return acc;
    }, {} as Record<string, Transaction[]>);

    return Object.entries(groups).map(([date, data]) => ({
      title: date,
      data,
    }));
  }, [filteredTransactions]);

  // Format transaction amount
  const formatAmount = (amountStr: string) => {
    const amount = parseFloat(amountStr);
    return isNaN(amount) 
      ? "0.00" 
      : amount.toLocaleString("en-NG", { minimumFractionDigits: 2 });
  };

  // Render transaction item
  const renderTransactionItem = useCallback(({ item }: { item: Transaction }) => (
    <TouchableOpacity 
      style={styles.transactionItem}
      key={item.id}
    >
      <View style={styles.transactionIcon}>
        {item.direction === "credit" ? <CreditIcon /> : <DebitIcon />}
      </View>
      <View style={styles.transactionInfo}>
        <Text style={styles.transactionTitle}>{getTransactionTitle(item)}</Text>
        <Text style={styles.transactionCategory}> {item?.createdAt
                        ? format(parseISO(item.createdAt), "hh:mm a")
                        : "N/A"}</Text>
      </View>
      <View style={styles.transactionAmountContainer}>
        <Text style={[
          styles.amount,
          item.direction === "credit" ? styles.credit : styles.debit
        ]}>
          {item.direction === "credit" ? "+" : "-"}₦{formatAmount(item.amount)}
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
                      {item.status
                        ? item.status.charAt(0).toUpperCase() + item.status.slice(1)
                        : "Succesful"}
                    </Text>
                  </View>
      </View>
    </TouchableOpacity>
  ), [getTransactionTitle]);

  // Render section header
  const renderSectionHeader = useCallback(({ section }: { section: SectionData }) => (
    <Text style={styles.dateHeader}>{formatDate(section.title)}</Text>
  ), [formatDate]);

  // Render empty state
  const renderEmptyComponent = useCallback(() => (
    <View style={styles.emptyContainer}>
      <EmptyWallet />
      <Text style={styles.emptyText}>No transactions yet</Text>
    </View>
  ), []);

  // Render footer
  const renderFooter = useCallback(() => {
    if (isLoading && offset > 0) {
      return <ActivityIndicator size="small" color={color.primaryColor} style={styles.loader} />;
    }
    
    // if (transactions.length > 0) {
    //   return (
    //     <TouchableOpacity
    //       style={styles.viewAllButton}
    //       onPress={() => navigation.navigate("TransactionHistory")}
    //     >
    //       <Text style={styles.viewAllText}>View All Transactions</Text>
    //     </TouchableOpacity>
    //   );
    // }
    
    return null;
  }, [isLoading, offset, transactions.length]);

  return (
    <CustomView style={styles.container}>
      <ScreenHeader title="Wallet" onNotificationShow={false} type="Home" />
      <>
            {/* Balance Cards */}
            <View style={styles.balanceCardsContainer}>
              {/* Wallet Balance Card */}
              <View style={styles.balanceCard}>
                <View>
                  <WalletIconBlue />
                  <Text style={styles.balanceLabel}>Wallet Balance</Text>
                  <Text style={styles.balance}>
                    ₦{(userProfile?.balance || 0).toLocaleString("en-NG", {
                      minimumFractionDigits: 2,
                    })}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => setShowModal(true)}
                  style={styles.fundButton}
                >
                  <Text style={styles.fundButtonText}>Fund Wallet</Text>
                </TouchableOpacity>
              </View>
              
              {/* Earnings Card */}
              <View style={styles.balanceCard}>
                <View>
                  <EarningIcon />
                  <Text style={styles.balanceLabel}>Earnings</Text>
                  <Text style={styles.balance}>₦0.00</Text>
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
                active={activeDirection !== undefined}
                onPress={() => setShowDirectionSheet(true)}
              />
              <FilterButton
                label={categoryOptions.find(c => c.id === activeCategory)?.label || "Category"}
                active={activeCategory !== undefined}
                onPress={() => setShowCategorySheet(true)}
              />
            </View>
          </>
      <SectionList
        sections={groupedTransactions}
        keyExtractor={(item) => item.id}
        renderItem={renderTransactionItem}
        renderSectionHeader={renderSectionHeader}
        ListHeaderComponent={
          <>

          </>
        }
        ListEmptyComponent={renderEmptyComponent}
        ListFooterComponent={renderFooter}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#00A300"]}
            tintColor="#00A300"
          />
        }
        onEndReached={() => {
          if (hasMore && !isLoading && !refreshing) {
            fetchTransactions(false);
          }
        }}
        onEndReachedThreshold={0.5}
        stickySectionHeadersEnabled={false}
        contentContainerStyle={styles.contentContainer}
      />

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
        <View style={styles.modalContent}>
          {/* Bank Name */}
          <View style={styles.accountDetailRow}>
            <Text style={styles.detailLabel}>Bank</Text>
            <Text>{userProfile?.bankName || "Unknown Bank"}</Text>
          </View>

          {/* Account Name */}
          <View style={styles.accountDetailRow}>
            <Text style={styles.detailLabel}>Name</Text>
            <Text>{userProfile?.accountName || "Unknown"}</Text>
          </View>

          {/* Account Number */}
          <View style={styles.accountDetailRow}>
            <Text style={styles.detailLabel}>Account Number</Text>
            <View style={styles.copyContainer}>
              <Text>{userProfile?.accountNumber || "N/A"}</Text>
              <TouchableOpacity
                onPress={() => copyToClipboard(userProfile?.accountNumber || "")}
              >
                <Feather name="copy" size={16} color="#47104C" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Available Balance */}
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
    // padding: RFValue(16),
    paddingHorizontal:RFValue(10),
    paddingTop:RFValue(16)
  },
  contentContainer: {
    paddingBottom: 20,
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
    backgroundColor: "#D1FADF",
  },
  statusText: {
    fontSize: RFValue(10),
    fontWeight: "500",
    color: "#414651",
  },
  balanceCardsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: RFValue(16),
    gap: RFValue(6),
  },
  balanceCard: {
    flex: 1,
    padding: RFValue(16),
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
  },
  detailLabel: {
    color: "#888",
    fontSize: RFValue(14),
  },
  copyContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  balanceText: {
    fontWeight: "bold",
    fontSize: RFValue(16),
    color: "#00A300",
  },
  fundButton: {
    marginTop: RFValue(8),
    backgroundColor: "#aaffaa",
    paddingVertical: RFValue(12),
    borderRadius: RFValue(16),
    justifyContent: "center",
    alignItems: "center",
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
    gap: RFValue(8),
  },
  filterButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F5F7FA",
    borderRadius: RFValue(8),
    padding: RFValue(12),
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
  dateHeader: {
    fontSize: RFValue(14),
    fontWeight: "600",
    color: "#64748B",
    marginBottom: RFValue(8),
    marginTop: RFValue(16),
  },
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: RFValue(8),
    paddingVertical: RFValue(8),
    // marginBottom: RFValue(8),
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
    padding: RFValue(16),
  },
  viewAllText: {
    color: "#213264",
    fontSize: RFValue(14),
    fontWeight: "bold",
  },
  loader: {
    paddingVertical: RFValue(20),
  },
  modalContent: {
    gap: 12,
    paddingVertical: RFValue(20),
  },
});

export default WalletScreen;