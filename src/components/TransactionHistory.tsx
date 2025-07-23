import React, { useCallback, useState, useMemo, useEffect } from "react";
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
import EmptyWallet from "./svg/EmptyEarning";

type Props = NativeStackScreenProps<HomeStackList>;
const { width } = Dimensions.get("window");

type TransactionDirection = "credit" | "debit" | undefined;
type TransactionType =
  | "inward"
  | "outward"
  | "wallet-to-wallet"
  | "freeBalanceCharges"
  | undefined;

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



const TransactionItem = React.memo(
  ({ item, onPress }: { item: Transaction; onPress: () => void }) => {
    const title = useMemo(() => {
      const accountName = item.accountName || "unknown account";
      const shortenedName = accountName.length > 10 
        ? `${accountName.slice(0, 10)}...` 
        : accountName;
      
      return item.direction === "debit"
        ? `Transfer to ${shortenedName}`
        : `Transfer from ${shortenedName}`;
    }, [item]);

    return (
      <TouchableOpacity style={styles.transactionRow} onPress={onPress}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View style={styles.transactionIcon}>
            {item.direction === "credit" ? <CreditIcon /> : <DebitIcon />}
          </View>
          <View style={styles.transactionInfo}>
            <Text style={styles.transactionTitle}>{title}</Text>
            <Text style={styles.transactionTime}>
              {item?.createdAt
                ? format(parseISO(item.createdAt), "hh:mm a")
                : "N/A"}
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
            {item.direction === "credit" ? "+" : "-"}₦
            {parseFloat(item.amount).toLocaleString()}
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
                : "Succesfull"}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
);

const SectionHeader = ({ title }: { title: string }) => (
  <Text style={styles.sectionHeader}>
    {title ? format(new Date(title), "EEEE, MMMM d, yyyy") : "Unknown Date"}
  </Text>
);

const FilterSection = ({
  activeDirection,
  activeType,
  onDirectionChange,
  onTypeChange,
}: {
  activeDirection: TransactionDirection;
  activeType: TransactionType;
  onDirectionChange: (direction: TransactionDirection) => void;
  onTypeChange: (type: TransactionType) => void;
}) => (
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
          onPress={() => onDirectionChange(direction as TransactionDirection)}
        >
          <Text
            style={[
              styles.filterOptionText,
              activeDirection === direction && styles.activeFilterOptionText,
            ]}
          >
            {direction
              ? direction.charAt(0).toUpperCase() + direction.slice(1)
              : "All"}
          </Text>
        </TouchableOpacity>
      ))}
    </View>

    <Text style={styles.filterLabel}>Transaction Type</Text>
    <View style={styles.filterRow}>
      {[
        undefined,
        "inward",
        "outward",
        "wallet-to-wallet",
        "freeBalanceCharges",
      ].map((type) => (
        <TouchableOpacity
          key={type || "all"}
          style={[
            styles.filterOption,
            activeType === type && styles.activeFilterOption,
          ]}
          onPress={() => onTypeChange(type as TransactionType)}
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

const ListFooter = ({
  isLoading,
  hasMore,
}: {
  isLoading: boolean;
  hasMore: boolean;
}) => {
  if (!isLoading || !hasMore) return null;
  
  return (
    <View style={styles.loadingFooter}>
      <ActivityIndicator size="small" color="#AEFF8C" />
    </View>
  );
};

const EmptyList = () => (
  <View style={styles.emptyContainer}>
    <EmptyWallet />
    <Text style={styles.emptyText}>No transactions yet</Text>
  </View>
);

const DownloadFAB = ({ onPress }: { onPress: () => void }) => (
  <TouchableOpacity style={styles.downloadFab} onPress={onPress}>
    <MaterialIcons name="file-download" size={24} color="#213264" />
  </TouchableOpacity>
);

































const TransactionHistory = ({ navigation }: Props) => {
  // State management
const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [limit] = useState(10);
  const [hasMore, setHasMore] = useState(true);
  const [activeDirection, setActiveDirection] =
    useState<TransactionDirection>(undefined);
  const [activeType, setActiveType] = useState<TransactionType>(undefined);
  const [refreshing, setRefreshing] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: format(subDays(new Date(), 7), "yyyy-MM-dd"),
    endDate: format(new Date(), "yyyy-MM-dd"),
  });
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Fetch transactions with proper cleanup
  const fetchTransactions = useCallback(
    async (reset = false) => {
      if (isLoading) return;
      
      setIsLoading(true);
      setFetchError(null);
      const newOffset = reset ? 0 : offset;

      try {
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
        setOffset(reset ? limit : newOffset + limit);
        setHasMore(newTransactions.length === limit);
      } catch (error: any) {
        setFetchError("Failed to fetch transactions. Please try again.");
        console.error("Transaction fetch error:", error);
      } finally {
        setIsLoading(false);
        setRefreshing(false);
      }
    },
    [offset, limit, activeDirection, activeType, dateRange]
  );

  // Fetch initial data and on filter changes
  useEffect(() => {
    fetchTransactions(true);
  }, [activeDirection, activeType, dateRange]);

  // Handle pull-to-refresh
  const handleRefresh = () => {
    if (refreshing) return;
    setRefreshing(true);
    fetchTransactions(true);
  };

  // Handle pagination
  const handleEndReached = useCallback(() => {
    if (!isLoading && hasMore && !refreshing) {
      fetchTransactions(false);
    }
  }, [isLoading, hasMore, refreshing]);

  // Filter transactions based on search
  const filteredTransactions = useMemo(() => {
    if (!searchQuery) return transactions;
    
    const query = searchQuery.toLowerCase();
    return transactions.filter(
      (tx) =>
        tx?.accountName?.toLowerCase()?.includes(query) ||
        tx?.narration?.toLowerCase()?.includes(query) ||
        tx?.accountNumber?.includes(query)
    );
  }, [transactions, searchQuery]);

  // Group transactions by date
  const sectionData = useMemo(() => {
    const grouped = filteredTransactions.reduce((acc, tx) => {
      const dateKey = tx?.createdAt?.split("T")[0] ?? "unknown";
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(tx);
      return acc;
    }, {} as Record<string, Transaction[]>);

    return Object.keys(grouped)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
      .map((date) => ({
        title: date,
        data: grouped[date],
      }));
  }, [filteredTransactions]);



  const downloadReport = async () => {
    if (!filteredTransactions.length) {
      Alert.alert("No Data", "There are no transactions to export");
      return;
    }
    try {
      const csvHeader = "Date,Type,Description,Amount,Status\n";
      const csvRows = filteredTransactions
        .map((tx) => {
          const date = tx?.createdAt
            ? format(parseISO(tx.createdAt), "yyyy-MM-dd")
            : "";
          const type = tx?.type || "";
          const description =
            tx.direction === "debit"
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

    // Navigate to transaction details
  const handleItemPress = useCallback(
    (item: Transaction) => {
      navigation.navigate("TransactionDetails", { transaction: item });
    },
    [navigation]
  );

  return (
  <CustomView style={styles.container}>
      <View style={styles.header}>
        <BackButton onClick={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Transaction History</Text>
        <TouchableOpacity onPress={() => setShowFilters(!showFilters)} style={styles.filterButton}>
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
          {dateRange.startDate
            ? format(new Date(dateRange.startDate), "MMM d")
            : ""}
          {dateRange.startDate && dateRange.endDate ? " - " : ""}
          {dateRange.endDate
            ? format(new Date(dateRange.endDate), "MMM d, yyyy")
            : ""}
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
        }}
        initialStartDate={new Date(dateRange.startDate)}
        initialEndDate={new Date(dateRange.endDate)}
      />

      {showFilters && (
        <FilterSection
          activeDirection={activeDirection}
          activeType={activeType}
          onDirectionChange={setActiveDirection}
          onTypeChange={setActiveType}
        />
      )}

      <View style={styles.listContainer}>
        <SectionList
          sections={sectionData}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TransactionItem item={item} onPress={() => handleItemPress(item)} />
          )}
          renderSectionHeader={({ section }) => (
            <SectionHeader title={section.title} />
          )}
          contentContainerStyle={styles.listContent}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.5}
          ListFooterComponent={<ListFooter isLoading={isLoading} hasMore={hasMore} />}
          onRefresh={handleRefresh}
          refreshing={refreshing}
          stickySectionHeadersEnabled={false}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            fetchError ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.errorText}>{fetchError}</Text>
                <TouchableOpacity
                  style={styles.retryButton}
                  onPress={() => fetchTransactions(true)}
                >
                  <Text style={styles.retryText}>Retry</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <EmptyList />
            )
          }
        />
      </View>

      <DownloadFAB onPress={downloadReport} />
    </CustomView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
   errorText: {
    color: "#F04438",
    fontSize: RFValue(14),
    marginBottom: RFValue(10),
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: "#213264",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  retryText: {
    color: "white",
    fontWeight: "500",
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
    backgroundColor: "#D1FADF",
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
