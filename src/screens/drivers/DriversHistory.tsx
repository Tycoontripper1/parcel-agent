import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  TextInput,
  RefreshControl,
  Platform,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { CustomView, Text } from "@/components";
import HomeHeader from "@/components/share/HomeHeader";
import { RFValue } from "react-native-responsive-fontsize";
import { SearchNormal1 } from "iconsax-react-native";
import { color } from "@/constants/Colors";
import { Feather } from "@expo/vector-icons";
import { DriverStackList } from "@/navigation/navigationType";
import { getAllDrivers } from "../../../services/auth";
type Driver = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  identificationType: string | null;
  identificationNumber: string | null;
  identificationImages: string[] | null; // assuming it's an array of image URLs
  vehicleType: string;
  vehicleRegistrationNumber: string;
  userImage: string | null;
  isActive: boolean;
  isKycComplete: boolean;
  driverId: string;
  parcelAssigned: number;
  parkLocation: string;
  addedBy: string;
  createdAt: string; // ISO format like "2025-04-23T16:04:39.645Z"
};

type Props = NativeStackScreenProps<DriverStackList>;

const DriversHistory = ({ navigation }: Props) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [allDrivers, setAllDrivers] = useState<Driver[]>([]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulate a network request
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);

  useEffect(() => {
    const fetchDriver = async () => {
      try {
        const result = await getAllDrivers();
        console.log(result, "result");
        setAllDrivers(result?.data?.details?.rows);
      } catch (error) {
        console.error("Failed to fetch drivers:", error);
      }
    };
    fetchDriver();
  }, []);

  // Filter drivers based on search query
  const filteredDrivers = allDrivers.filter((driver) =>
    `${driver.firstName} ${driver.lastName}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const renderDriver = ({ item }: { item: Driver }) => (
    <TouchableOpacity
      style={styles.driverCard}
      onPress={() => navigation.navigate("DriversDetails", { id: item.id })}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: RFValue(4),
        }}
      >
        <View
          style={{
            width: RFValue(24),
            height: RFValue(24),
            borderRadius: RFValue(48),
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#E6FFDB",
          }}
        >
          <Feather name="user" size={18} color={color.successColor} />
        </View>

        <View style={{ flexDirection: "column", gap: 12 }}>
          <Text style={styles.label}>Name</Text>
          <Text style={styles.value}>
            {[item.firstName, item.lastName].filter(Boolean).join(" ")}
          </Text>
        </View>
      </View>

      <View style={{ flexDirection: "column", gap: 12 }}>
        <Text style={styles.label}>Phone No.</Text>
        <Text style={styles.value}>{item.phone}</Text>
      </View>

      <View style={{ flexDirection: "column", gap: 12 }}>
        <Text style={styles.label}>Driver ID</Text>
        <Text style={styles.value}>{item.driverId}ss</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <CustomView style={styles.container}>
      {/* Header */}
      <HomeHeader type="Stack" title="Drivers" />

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <SearchNormal1 color="#000" size={18} style={{ flexBasis: "10%" }} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search drivers..."
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Driver List */}
      <FlatList
        data={filteredDrivers}
        keyExtractor={(item) => item.id}
        renderItem={renderDriver}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={Platform.OS === "android" ? [color.primary] : undefined}
          />
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>No drivers found</Text>
        }
      />
    </CustomView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: RFValue(16) },

  searchContainer: {
    backgroundColor: "#fff",
    borderRadius: RFValue(8),
    paddingHorizontal: RFValue(12),
    borderWidth: 1,
    borderColor: "#E9EAEB",
    flexDirection: "row",
    alignItems: "center",
    marginVertical: RFValue(16),
  },

  searchInput: {
    flexBasis: "88%",
    height: "100%",
    paddingVertical: RFValue(12),
  },

  list: { paddingBottom: RFValue(20) },

  driverCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: RFValue(12),
    marginBottom: RFValue(6),
    borderBottomWidth: 1,
    borderColor: "#EFEFF0",
  },

  label: { fontSize: RFValue(10), fontWeight: "400", color: "#717680" },
  value: { fontSize: RFValue(10), color: "#252B37", fontWeight: "500" },

  emptyText: {
    textAlign: "center",
    fontSize: RFValue(14),
    color: "#717680",
    marginTop: RFValue(20),
  },
});

export default DriversHistory;
