import React, { useState, useCallback } from "react";
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

type Driver = {
    id: string;
    name: string;
    phone: string;
    driverId: string;
    email: string;
    homeAddress: string;
    idType: string;
    idNumber: string;
    vehicleType: string;
    vehicle: string;
    regNumber: string;
    motorPark: string;
    date: string;
    parcelAssigned: string;
  };
  

  

type Props = NativeStackScreenProps<DriverStackList>;

const drivers: Driver[] = [
    {
      id: "1",
      name: "John Doe",
      phone: "+234 812 345 6789",
      driverId: "DR-1001",
      email: "johndoe@email.com",
      homeAddress: "123 Main St, Lagos",
      idType: "National ID",
      idNumber: "NID-123456",
      vehicleType: "Sedan",
      vehicle: "Toyota Camry",
      regNumber: "ABC-123XY",
      motorPark: "Ojota Motor Park",
      date: "2025-03-03",
      parcelAssigned: "Yes",
    },
    {
      id: "2",
      name: "Jane Smith",
      phone: "+234 902 876 5432",
      driverId: "DR-1002",
      email: "janesmith@email.com",
      homeAddress: "456 Broad St, Abuja",
      idType: "Driver's License",
      idNumber: "DL-987654",
      vehicleType: "SUV",
      vehicle: "Honda CR-V",
      regNumber: "XYZ-567AB",
      motorPark: "Gudu Park",
      date: "2025-03-03",
      parcelAssigned: "No",
    },
    {
      id: "3",
      name: "Michael Johnson",
      phone: "+234 701 234 5678",
      driverId: "DR-1003",
      email: "michaelj@email.com",
      homeAddress: "789 Victoria Island, Lagos",
      idType: "Voter's Card",
      idNumber: "VC-112233",
      vehicleType: "Minivan",
      vehicle: "Kia Carnival",
      regNumber: "DEF-456YZ",
      motorPark: "Mile 2 Motor Park",
      date: "2025-03-02",
      parcelAssigned: "Yes",
    },
    {
      id: "4",
      name: "Emily Davis",
      phone: "+234 815 987 6543",
      driverId: "DR-1004",
      email: "emilyd@email.com",
      homeAddress: "22 Lekki Phase 1, Lagos",
      idType: "International Passport",
      idNumber: "P-445566",
      vehicleType: "Truck",
      vehicle: "Mercedes Actros",
      regNumber: "GHI-789WX",
      motorPark: "Ojuelegba Park",
      date: "2025-03-02",
      parcelAssigned: "No",
    },
    {
      id: "5",
      name: "James Brown",
      phone: "+234 808 654 3210",
      driverId: "DR-1005",
      email: "jamesb@email.com",
      homeAddress: "Ikeja, Lagos",
      idType: "National ID",
      idNumber: "NID-789101",
      vehicleType: "Bus",
      vehicle: "Toyota HiAce",
      regNumber: "JKL-012MN",
      motorPark: "Ikeja Park",
      date: "2025-03-01",
      parcelAssigned: "Yes",
    },
    {
      id: "6",
      name: "Grace Wilson",
      phone: "+234 806 213 5478",
      driverId: "DR-1006",
      email: "gracew@email.com",
      homeAddress: "Surulere, Lagos",
      idType: "Driver's License",
      idNumber: "DL-345678",
      vehicleType: "Pickup",
      vehicle: "Ford Ranger",
      regNumber: "MNO-345PQ",
      motorPark: "Surulere Terminal",
      date: "2025-03-01",
      parcelAssigned: "No",
    },
    {
      id: "7",
      name: "Samuel Green",
      phone: "+234 705 987 6321",
      driverId: "DR-1007",
      email: "samuelg@email.com",
      homeAddress: "Yaba, Lagos",
      idType: "Voter's Card",
      idNumber: "VC-667788",
      vehicleType: "SUV",
      vehicle: "Lexus RX",
      regNumber: "PQR-678ST",
      motorPark: "Yaba Motor Park",
      date: "2025-02-28",
      parcelAssigned: "Yes",
    },
    {
      id: "8",
      name: "Olivia Adams",
      phone: "+234 813 678 5432",
      driverId: "DR-1008",
      email: "oliviaa@email.com",
      homeAddress: "Victoria Island, Lagos",
      idType: "International Passport",
      idNumber: "P-778899",
      vehicleType: "Hatchback",
      vehicle: "Volkswagen Golf",
      regNumber: "STU-901VW",
      motorPark: "VI Bus Stop",
      date: "2025-02-28",
      parcelAssigned: "No",
    },
    {
      id: "9",
      name: "William Clark",
      phone: "+234 814 567 2345",
      driverId: "DR-1009",
      email: "williamc@email.com",
      homeAddress: "Ogudu, Lagos",
      idType: "National ID",
      idNumber: "NID-112233",
      vehicleType: "Truck",
      vehicle: "MAN TGS",
      regNumber: "VWX-234YZ",
      motorPark: "Ogudu Terminal",
      date: "2025-02-27",
      parcelAssigned: "Yes",
    },
    {
      id: "10",
      name: "Sophia Martinez",
      phone: "+234 810 345 6789",
      driverId: "DR-1010",
      email: "sophiam@email.com",
      homeAddress: "Iyana Ipaja, Lagos",
      idType: "Driver's License",
      idNumber: "DL-889900",
      vehicleType: "Minivan",
      vehicle: "Nissan Quest",
      regNumber: "YZA-567BC",
      motorPark: "Iyana Ipaja Park",
      date: "2025-02-27",
      parcelAssigned: "No",
    },
    {
      id: "11",
      name: "Benjamin White",
      phone: "+234 907 112 2334",
      driverId: "DR-1011",
      email: "benjaminw@email.com",
      homeAddress: "Festac, Lagos",
      idType: "National ID",
      idNumber: "NID-334455",
      vehicleType: "Bus",
      vehicle: "Mercedes Sprinter",
      regNumber: "BCD-678EF",
      motorPark: "Festac Motor Park",
      date: "2025-02-26",
      parcelAssigned: "Yes",
    },
    {
      id: "12",
      name: "Emma Rodriguez",
      phone: "+234 909 334 5567",
      driverId: "DR-1012",
      email: "emmar@email.com",
      homeAddress: "Ajah, Lagos",
      idType: "Voter's Card",
      idNumber: "VC-556677",
      vehicleType: "Pickup",
      vehicle: "Isuzu D-Max",
      regNumber: "EFG-901HI",
      motorPark: "Ajah Terminal",
      date: "2025-02-26",
      parcelAssigned: "No",
    },
    {
      id: "13",
      name: "Daniel Scott",
      phone: "+234 912 778 8899",
      driverId: "DR-1013",
      email: "daniels@email.com",
      homeAddress: "Ikeja, Lagos",
      idType: "International Passport",
      idNumber: "P-990011",
      vehicleType: "SUV",
      vehicle: "Range Rover Evoque",
      regNumber: "HIJ-234KL",
      motorPark: "Ikeja Bus Stop",
      date: "2025-02-25",
      parcelAssigned: "Yes",
    },
    // Add more as needed...
  ];
  

const DriversHistory = ({ navigation }: Props) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulate a network request
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);

  // Filter drivers based on search query
  const filteredDrivers = drivers.filter((driver) =>
    driver.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderDriver = ({ item }: { item: Driver }) => (
    <TouchableOpacity style={styles.driverCard} onPress={() => navigation.navigate('DriversDetails', { id: item.id })}
>
      <View style={{ display:"flex", flexDirection: "row", alignItems: "center", gap:RFValue(4)}}>
                  
                        <View style={{width:RFValue(24), height:RFValue(24),borderRadius:RFValue(48), display:"flex", justifyContent:"center",alignItems:'center',backgroundColor:"#E6FFDB"}}><Feather name='user' size={18} color={color.successColor} /></View>
          
                        
                        <View style={{ flexDirection: "column", gap: 12 }}>
                          <Text style={styles.label}>Name</Text>
                          <Text style={styles.value}>{item.name}</Text>
                        </View>
      </View>

      <View style={{ flexDirection: "column", gap: 12 }}>
        <Text style={styles.label}>Phone No.</Text>
        <Text style={styles.value}>{item.phone}</Text>
      </View>

      <View style={{ flexDirection: "column", gap: 12 }}>
        <Text style={styles.label}>Driver ID</Text>
        <Text style={styles.value}>{item.driverId}</Text>
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
        ListEmptyComponent={<Text style={styles.emptyText}>No drivers found</Text>}
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

  searchInput: { flexBasis: "88%", height: "100%", paddingVertical: RFValue(12) },

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

  emptyText: { textAlign: "center", fontSize: RFValue(14), color: "#717680", marginTop: RFValue(20) },
});

export default DriversHistory;
