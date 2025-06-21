import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ViewStyle,
  StyleSheet,
  Dimensions,
} from "react-native";
import { color } from "@/constants/Colors";
import { RFValue } from "react-native-responsive-fontsize";
import { useNavigation } from "@react-navigation/native";
import { CustomView } from "@/components";
import ScreenHeader from "@/components/share/ScreenHeader";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { DriverStackList } from "@/navigation/navigationType";
import { Feather } from "@expo/vector-icons";
import EmptyWallet from "@/components/svg/EmptyEarning";
import UserIcon from "@/components/svg/userIcon";
import { apiKey, getToken } from "../../services/auth";

const { width } = Dimensions.get("window");
type Props = NativeStackScreenProps<DriverStackList, "DriversScreen">;

export interface Driver {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  createdAt: string;
  driverId: string;
  name?: string;
  date?: string;
}

const DriversScreen = ({ navigation }: Props) => {
  const [allDrivers, setAllDrivers] = useState<Driver[]>([]);

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const token = await getToken();
        const response = await fetch(`${apiKey}/users?userType=driver`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await response.json();
        if (!response.ok) throw new Error(result.message || 'Failed to fetch drivers');
        
        setAllDrivers(result?.data?.details?.rows || []);
      } catch (error) {
        console.error('Driver fetch error:', error);
      }
    };
    
    fetchDrivers();
  }, []);

  // Memoize expensive calculations
  const registeredDriversCount = allDrivers.length;
  
  const groupedDrivers = useMemo(() => {
    return allDrivers.reduce<Record<string, Driver[]>>((acc, driver) => {
      const date = typeof driver.createdAt === "string" 
        ? driver.createdAt.split('T')[0] 
        : 'Unknown';
      
      if (!acc[date]) acc[date] = [];
      
      acc[date].push({
        ...driver,
        name: `${driver.firstName} ${driver.lastName}`,
        date,
      });
      
      return acc;
    }, {});
  }, [allDrivers]);

  const sections = useMemo(() => {
    return Object.entries(groupedDrivers).map(([date, drivers]) => ({
      date,
      drivers,
    }));
  }, [groupedDrivers]);

  const $bodyHeader: ViewStyle = {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: RFValue(18),
  };

  // Render item optimized with memoization
  const renderDriverItem = ({ item }: { item: Driver }) => (
    <View style={styles.transactionRow}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View style={styles.transactionIconContainer}>
          <View style={styles.userIcon}>
            <Feather name='user' size={18} color={color.successColor} />
          </View>
        </View>
        <View style={{ flexDirection: "column", gap: 12 }}>
          <Text style={styles.transactionTitle}>Name</Text>
          <Text style={styles.transaction}>{item.name}</Text>
        </View>
      </View>

      <View style={{ flexDirection: "column", gap: 12 }}>
        <Text style={styles.transactionTitle}>Phone No.</Text>
        <Text style={styles.transaction}>{item.phone}</Text>
      </View>

      <View style={{ flexDirection: "column", gap: 12 }}>
        <Text style={styles.transactionTitle}>Driver ID</Text>
        <Text style={styles.transaction}>{item.driverId}</Text>
      </View>
    </View>
  );

  return (
    <CustomView style={styles.container}>
      <ScreenHeader
        title="Drivers"
        OnNotificationClick={() => navigation.navigate("NotificationsScreen")}
        type="Home"
      />

      <View style={{ flex: 1 , paddingVertical: RFValue(16) }}>
        {/* Balance Cards */}
        <View style={{ flexDirection: "row", width: "100%", gap: RFValue(6) }}>
          <View style={styles.balanceCard}>
            <View style={{ flexDirection: "column", alignItems: "flex-start" }}>
              <Text style={styles.balanceLabel}>{registeredDriversCount}</Text>
              <Text style={styles.balance}>Registered Drivers</Text>
            </View>
          </View>
          <View style={styles.balanceCard}>
            <View style={{ flexDirection: "column", alignItems: "flex-start" }}>
              <Text style={styles.balanceLabel}>0</Text>
              <Text style={styles.balance}>Parcels Assigned</Text>
            </View>
          </View>
        </View>

        {/* Register Button */}
        <TouchableOpacity 
          style={styles.downloadButton} 
          onPress={() => navigation.navigate('ScreenOne')}
        >
          <Text style={styles.downloadText}>Register Driver</Text>
          <UserIcon />
        </TouchableOpacity>

        {/* Drivers Header */}
        <View style={$bodyHeader}>
          <Text style={styles.driversHeader}>Drivers</Text>
        </View>

        {/* Drivers List */}
        {sections.length === 0 ? (
          <View style={styles.emptyContainer}>
            <EmptyWallet />
            <Text style={styles.emptyText}>No driver yet</Text>
          </View>
        ) : (
          <FlatList
            data={sections}
            keyExtractor={(item) => item.date}
            renderItem={({ item }) => (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>{item.date}</Text>
                <FlatList
                  data={item.drivers}
                  keyExtractor={(driver) => driver.id}
                  renderItem={renderDriverItem}
                  scrollEnabled={false}
                />
              </View>
            )}
            ListFooterComponent={
              <TouchableOpacity
                style={styles.viewAllButton}
                onPress={() => navigation.navigate("DriversHistory")}
              >
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            }
          />
        )}
      </View>
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
    gap: RFValue(6), 
    justifyContent: "center",
    marginTop: RFValue(16),
  },
  downloadText: { 
    color: "#213264", 
    fontSize: RFValue(14), 
    fontWeight: "bold",
  },
  section: { marginBottom: RFValue(16) },
  sectionTitle: {
    fontSize: RFValue(14),
    fontWeight: '500',
    marginBottom: RFValue(8),
    color: '#414651',
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
  userIcon: {
    width: RFValue(24), 
    height: RFValue(24),
    borderRadius: RFValue(48),
    justifyContent: "center",
    alignItems: 'center',
    backgroundColor: "#E6FFDB"
  },
  transactionTitle: {
    fontSize: RFValue(10),
    fontWeight: "400",
    color: "#717680",
  },
  transaction: { 
    fontSize: RFValue(10), 
    color: "#252B37", 
    fontWeight: "500" 
  },
  viewAllText: { 
    color: "#213264", 
    fontSize: RFValue(14), 
    fontWeight: "bold" 
  },
  viewAllButton: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: RFValue(10),
  },
  balanceCard: {
    flex: 1,
    padding: RFValue(16),
    backgroundColor: "#fff",
    borderRadius: RFValue(8),
    borderWidth: 1,
    borderColor: "#ccc"
  },
  balanceLabel: {
    color: "#252B37",
    fontSize: RFValue(24),
    fontWeight: '600',
  },
  balance: {
    color: "#A4A7AE",
    fontSize: RFValue(10),
    fontWeight: "400",
    marginTop: RFValue(4),
  },
  emptyContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    marginTop: 10,
    fontSize: RFValue(14),
    color: "gray",
  },
  driversHeader: {
    color: "#414651",
    fontSize: RFValue(18),
    fontWeight: "500",
  },
});

export default DriversScreen;