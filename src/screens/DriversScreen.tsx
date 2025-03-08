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
import { Feather, Ionicons } from "@expo/vector-icons";
import EmptyWallet from "@/components/svg/EmptyEarning";
import UserIcon from "@/components/svg/userIcon";
import { DriverStackList } from "@/navigation/navigationType";

const drivers = [
  {
    id: "1",
    name: "John Doe",
    phone: "+234 812 345 6789",
    driverId: "DR-1001",
    date: "2025-03-03",
  },
  {
    id: "2",
    name: "Jane Smith",
    phone: "+234 902 876 5432",
    driverId: "DR-1002",
    date: "2025-03-03",
  },
  {
    id: "3",
    name: "Michael Johnson",
    phone: "+234 701 234 5678",
    driverId: "DR-1003",
    date: "2025-03-02",
  },
  {
    id: "4",
    name: "Emily Davis",
    phone: "+234 815 987 6543",
    driverId: "DR-1004",
    date: "2025-03-02",
  },
];

const { width } = Dimensions.get("window");
type Props = NativeStackScreenProps<DriverStackList, "DriversScreen">;


export interface Wallet {
  title: string;
  icon: React.ReactNode;
}

const DriversScreen = ({ navigation }: Props) => {
  const [isWallet, setIsWallet] = useState(false);
  const groupedDrivers = drivers.reduce<
    Record<string, (typeof drivers)[number][]>
  >((acc, driver) => {
    if (!acc[driver.date]) acc[driver.date] = [];
    acc[driver.date].push(driver);
    return acc;
  }, {});

  const $bodyHeader: ViewStyle = {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: RFValue(18),
  };
  return (
    <CustomView style={styles.container}>
      <ScreenHeader
        title="Drivers"
        OnNotificationClick={() => navigation.navigate("NotificationsScreen")}
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
            width: "100%",
            gap: RFValue(6),
          }}
        >
          {/* Balance Card */}
          <View style={styles.balanceCard}>
            <View>
              <View
                style={{
                  flexDirection: "column",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <Text style={styles.balanceLabel}>10</Text>
                <Text style={styles.balance}>Registered Drivers</Text>
              </View>
            </View>
          </View>
          {/* Balance Card */}
          <View style={styles.balanceCard}>
            <View>
              <View
                style={{
                  flexDirection: "column",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <Text style={styles.balanceLabel}>25</Text>
                <Text style={styles.balance}>Parcels Assigned</Text>
              </View>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.downloadButton} onPress={() => navigation.navigate('ScreenOne')}>
          <Text style={styles.downloadText}>
            Register Driver 
          </Text>
          <UserIcon />
        </TouchableOpacity>
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

        <View style={$bodyHeader}>
          <Text
            style={{
              color: "#414651",
              fontSize: RFValue(18),
              fontWeight: "500",
            }}
          >
            Drivers
          </Text>
        </View>
        <View style={styles.container}>
          {Object.keys(groupedDrivers).length === 0 ? (
            <View style={styles.emptyContainer}>
              <EmptyWallet />
              <Text style={styles.emptyText}>No driver yet</Text>
            </View>
          ) : (
            <>
              {Object.keys(groupedDrivers).map((date) => (
                <View key={date} style={styles.section}>
                  <Text style={styles.sectionTitle}>{date}</Text>
                  {groupedDrivers[date].map((driver) => (
                    <View key={driver.id} style={styles.transactionRow}>
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <View style={styles.transactionIconContainer}>
                        <View style={{width:RFValue(24), height:RFValue(24),borderRadius:RFValue(48), display:"flex", justifyContent:"center",alignItems:'center',backgroundColor:"#E6FFDB"}}><Feather name='user' size={18} color={color.successColor} /></View>
                        </View>
                        <View style={{ flexDirection: "column", gap: 12 }}>
                          <Text style={styles.transactionTitle}>Name</Text>
                          <Text style={styles.transaction}>{driver.name}</Text>
                        </View>
                      </View>

                      <View style={{ flexDirection: "column", gap: 12 }}>
                        <Text style={styles.transactionTitle}>Phone No.</Text>
                        <Text style={styles.transaction}>{driver.phone}</Text>
                      </View>

                      <View style={{ flexDirection: "column", gap: 12 }}>
                        <Text style={styles.transactionTitle}>Driver ID</Text>
                        <Text style={styles.transaction}>
                          {driver.driverId}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              ))}
            </>
          )}
        </View>

        {Object.keys(groupedDrivers).length > 0 && (
          <TouchableOpacity
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => navigation.navigate("DriversHistory")}
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
  downloadButton: {
    backgroundColor: "#E6FFDB",
    padding: RFValue(12),
    borderRadius: RFValue(8),
    alignItems: "center",
    marginBottom: RFValue(16),
    flexDirection: "row",
    gap:RFValue(6), 
    justifyContent:"center" ,
     display:"flex"
  },
  downloadText: { color: "#213264", fontSize: RFValue(14), fontWeight: "bold",  },
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
    fontSize: RFValue(16),
    fontWeight: "bold",
    marginBottom: RFValue(8),
  },
  transactionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: RFValue(12),
    marginBottom: RFValue(6),
    elevation: 2,
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
  transactionTitle: {
    fontSize: RFValue(10),
    fontWeight: "400",
    color: "#717680",
  },
  transaction: { fontSize: RFValue(10), color: "#252B37", fontWeight: "500" },
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
    padding: RFValue(16),
    backgroundColor: "#fff",
    borderRadius: RFValue(8),
    borderWidth: RFValue(1),
    borderColor:"#ccc"
  },
  balanceLabel: {
    marginTop: RFValue(6),
    color: "#252B37",
    fontSize: RFValue(24),
  },
  balance: {
    color: "#A4A7AE",
    fontSize: RFValue(10),
    fontWeight: "400",
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
    marginTop: RFValue(16),
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

export default DriversScreen;
