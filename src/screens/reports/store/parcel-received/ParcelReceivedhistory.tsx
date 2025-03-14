import React, { useCallback, useState } from "react";
import {
    View,
    
    FlatList,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    Dimensions,
    Platform,
    Alert,
    TextInput,
    ViewStyle,
    RefreshControl,
    Text as TextFilter,
} from "react-native";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { RFValue } from "react-native-responsive-fontsize";
import { useNavigation } from "@react-navigation/native";
import { CustomView, Text } from "@/components";
import CreditIcon from "@/components/svg/CreditIcon";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { HomeStackList, ReportStackList } from "@/navigation/navigationType";
import { SearchNormal1 } from "iconsax-react-native";
import ButtonHome from "@/components/ButtonHome";
import { color } from "@/constants/Colors";
import HomeHeader from "@/components/share/HomeHeader";
import ParcelIcon from "@/components/svg/ParcelIcon";
import DownloadIcon from "@/components/svg/DownloadIcon";
import DownloadReportIcon from "@/components/svg/DownloadReporticon";
import { MaterialIcons } from "@expo/vector-icons";

type Props = NativeStackScreenProps<HomeStackList & ReportStackList>;
const { width } = Dimensions.get("window");

const ReceivedParcelHistory = ({ navigation }: Props) => {
     const [isWallet, setIsWallet] = useState(false);
    const [filter, setFilter] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");

    type TransactionType = "Handling fee" | "Overdue fee" | "Upfront fee";

interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  date: string;
  receiver:string
  sender: string
  title: string;
  properDate:string
  status:string
}

const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();

  const options: Intl.DateTimeFormatOptions = { hour: "2-digit", minute: "2-digit", hour12: true };
  const timeString = date.toLocaleTimeString("en-US", options);

  const diff = (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);

  if (diff < 1 && now.getDate() === date.getDate()) {
    return `Today • ${timeString}`;
  } else if (diff < 2) {
    return `Yesterday • ${timeString}`;
  } else if (diff < 7) {
    return `Last Week • ${timeString}`;
  } else {
    return date.toLocaleDateString("en-US", { month: "short", day: "2-digit" }) + ` • ${timeString}`;
  }
};
const getProperDate = (isoString: string) => {
    const dateObj = new Date(isoString);
    if (isNaN(dateObj.getTime())) {
      console.error("Invalid Date:", isoString);
      return "Invalid Date";
    }
  
    return dateObj.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });
  };
  

const getRandomType = (): TransactionType => {
  const types: TransactionType[] = ["Handling fee", "Overdue fee", "Upfront fee"];
  return types[Math.floor(Math.random() * types.length)];
};

const transactions: Transaction[] = [
    {
      id: "1",
      type: getRandomType(),
      amount: 1500,
      properDate: formatTime("2025-03-03T13:30:00"),
      date: getProperDate("2025-03-03T13:30:00"),
      title: "Salary",
      sender: 'Adewale Jinad',
      receiver: 'Mary Kolade',
      status: "Arrived",
    },
    {
      id: "2",
      type: getRandomType(),
      amount: 500,
      properDate: formatTime("2025-03-03T16:20:00"),
      date: getProperDate("2025-03-03T16:20:00"),
      title: "Shopping",
      sender: 'John Doe',
      receiver: 'Jane Smith',
      status: "Delivered",
    },
    {
      id: "3",
      type: getRandomType(),
      amount: 2000,
      properDate: formatTime("2025-03-02T10:15:00"),
      date: getProperDate("2025-03-02T10:15:00"),
      title: "Freelance Payment",
      sender: 'Peter Obi',
      receiver: 'Ngozi Okonjo',
      status: "Arrived",
    },
    {
      id: "4",
      type: getRandomType(),
      amount: 300,
      properDate: formatTime("2025-03-02T09:45:00"),
      date: getProperDate("2025-03-02T09:45:00"),
      title: "Groceries",
      
      sender: 'Adewale Jinad',
      receiver: 'Mary Kolade',
      status: "Delivered",
    },
    {
      id: "5",
      type: getRandomType(),
      amount: 1000,
      properDate: formatTime("2025-03-01T14:00:00"),
      date: getProperDate("2025-03-01T14:00:00"),
      title: "Electricity Bill",
      sender: 'John Doe',
      receiver: 'Jane Smith',
      status: "Pending",
    },
    {
      id: "6",
      type: getRandomType(),
      amount: 5000,
      properDate: formatTime("2025-02-28T11:10:00"),
      date: getProperDate("2025-02-28T11:10:00"),
      title: "Bonus",
      sender: 'Peter Obi',
      receiver: 'Ngozi Okonjo',
      status: "Arrived",
    },
    {
      id: "7",
      type: getRandomType(),
      amount: 800,
      properDate: formatTime("2025-02-28T18:30:00"),
      date: getProperDate("2025-02-28T18:30:00"),
      title: "Internet Subscription",
      sender: 'Peter Obi',
      receiver: 'Ngozi Okonjo',
      status: "Delivered",
    },
    {
      id: "8",
      type: getRandomType(),
      amount: 200,
      properDate: formatTime("2025-02-27T08:15:00"),
      date: getProperDate("2025-02-27T08:15:00"),
      title: "Coffee",
      sender: 'Peter Obi',
      receiver: 'Ngozi Okonjo',
      status: "Pending",
    },
  ];
  
  

    // Filter transactions based on type and search query
    const filteredTransactions = transactions.filter((tx) => {
        const matchesType = filter === "all" ? true : tx.type === filter;
        const matchesSearch = tx.title
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
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
        const csvHeader = "Date,Title,Sender,Receiver,Amount\n";
        const csvRows = filteredTransactions
            .map((tx) => `${tx.date},${tx.title},${tx.sender},${tx.receiver},₦${tx.amount}`)
            .join("\n");
        const csvData = csvHeader + csvRows;

        const fileUri = FileSystem.documentDirectory + "Parcel-Received_Report.csv";
        await FileSystem.writeAsStringAsync(fileUri, csvData, {
            encoding: FileSystem.EncodingType.UTF8,
        });

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
     const [refreshing, setRefreshing] = useState(false);
     const onRefresh = useCallback(() => {
        setRefreshing(true);
    
        // Simulate a network request
        setTimeout(() => {
          setRefreshing(false); // End the refreshing state
        }, 1500);
      }, []);

    return (
        <CustomView style={styles.container}>
      <HomeHeader type='Stack' title='Parcel Received' />
      
        {/* ScrollView Wrapper */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          keyboardShouldPersistTaps="handled"
                  refreshControl={
                      <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={
                          Platform.OS === 'android'
                            ? [color.primary, color.inputColor, 'blue']
                            : undefined
                        } // Android spinner colors
                        tintColor={Platform.OS === 'ios' ? color.primary : undefined} // iOS spinner color
                      />
                    }
        >
      
          {/* Section Header */}
          <View style={$bodyHeader}>
            <Text style={{ color: "#414651", fontSize: RFValue(18), fontWeight: "500" }}>Parcels</Text>
            <View>
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
              <Text size={12} font='Medium'>
                Filter
              </Text>
            </TouchableOpacity>
            </View>
          </View>
      
          {/* Filter Buttons */}
          {/* <View style={styles.filterContainer}>
            {["all", "Handling fee", "Overdue fee", "Upfront fee"].map((type) => (
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
          </View> */}
           {/* Search Input */}
                <View style={styles.searchContainer}>
                  <SearchNormal1 color="#000" size={18} style={{ flexBasis: "10%" }} />
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Search Parcel..."
                    placeholderTextColor="#888"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                  />
                </View>
      
          {/* Download Report Button */}
          <TouchableOpacity style={styles.downloadButton} onPress={downloadReport}>
          <DownloadReportIcon color="" />
            <Text style={styles.downloadText}> Download Report</Text>
          </TouchableOpacity>
      
          {/* FlatList Fix */}
          <FlatList
            data={Object.keys(groupedTransactions)}
            keyExtractor={(date) => date.toString()} // Ensure unique key
            renderItem={({ item: properDate }) => (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>{properDate}</Text>
                {groupedTransactions[properDate]?.map((item, index) => (
                  <TouchableOpacity key={index} style={styles.shipmentRow} onPress={()=> navigation.navigate('AssignParcelDetails',{id: item.id} )}>
                   <View style={styles.transactionIconContainer}>
                        <ParcelIcon color="#F5F5F5" />
                      </View>
                  <View style={styles.shipmentDetails}>
                    <View style={{flexDirection: 'column', gap: 4}}>
                      <Text size={11} color='#717680'>
                        Sender
                      </Text>
                      <Text size={12}>{item.sender}</Text>
                      <Text size={10}>{item.properDate}</Text>
                    </View>
                    <View style={{flexDirection: 'column', gap: 4}}>
                      <Text size={10} color='#717680'>
                        Receiver
                      </Text>
                      <Text size={12}>{item.receiver}</Text>
                    </View>
                    <View style={{flexDirection: 'column', gap: 4}}>
                      <Text size={10} color='#717680'>
                        Charges
                      </Text>
                      <Text size={12}>₦{item.amount}</Text>
                      <View
                        style={{
                          backgroundColor:
                            item.status === 'Arrived'
                              ? '#F7F9FC'
                              : item.status === 'Delivered'
                              ? '#ECFDF3'
                              : '#FFF6ED',
                          justifyContent: 'center',
                          flexDirection: 'row',
                          borderRadius: 8,
                        }}>
                        <Text
                          size={10}
                          color={
                            item.status === 'Arrived'
                              ? '#213264'
                              : item.status === 'Delivered'
                              ? '#12B76A'
                              : '#FB6514'
                          }>
                          {item.status}{' '}
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
                ))}
              </View>
            )}
            scrollEnabled={false} // Prevents conflict with ScrollView
            nestedScrollEnabled={true} // Allows proper scrolling inside ScrollView
          />
        </ScrollView>
      </CustomView>
      
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: RFValue(16) },
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
    transactionIconContainer: { alignItems: "center", marginRight: RFValue(10) },

    filterContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: RFValue(10),
        borderWidth: 1,
        borderColor: "#F5F5F5",
        borderRadius: 8,
        paddingVertical: RFValue(10),
    },
    filterButton: {
        padding: RFValue(8),
        width: RFValue(72.75),
        borderRadius: RFValue(8),
        backgroundColor: "#ffff",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    activeFilter: { backgroundColor: "#E6FFDB" },
    filterText: { fontSize: RFValue(10), color: "#64748B" },
    activeText: { color: "#213264" },

    downloadButton: {
        backgroundColor: "#E6FFDB",
        padding: RFValue(12),
        borderRadius: RFValue(8),
        alignItems: "center",
        marginBottom: RFValue(16),
        flexDirection:"row",
        justifyContent:"center",
        gap:RFValue(6)
    },
    downloadText: { color: "#213264", fontSize: RFValue(14), fontWeight: "bold" },

    section: { marginBottom: RFValue(16) },
    sectionTitle: {
        fontSize: RFValue(12),
        lineHeight: RFValue(16),
        fontWeight: "medium",
        marginBottom: RFValue(8),
    },
    
    handling: {
        color: "#213264",
        backgroundColor: "#E8ECF7",
        paddingHorizontal: RFValue(8),
        borderRadius: RFValue(24),
    },
    overdue: {
        color: "#F04438",
        backgroundColor: "#FEF3F2",
        paddingHorizontal: RFValue(8),
        borderRadius: RFValue(24),
    },
    UpFront: {
        color: "#F79009",
        backgroundColor: "#FFFAEB",
        paddingHorizontal: RFValue(8),
        borderRadius: RFValue(24),
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
        balanceCard: {
          marginVertical: RFValue(16),
          width: "100%",
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
        fontSize: RFValue(22),
        fontWeight: "bold",
        marginVertical: RFValue(8),
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
    //   fff
    shipmentRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical:RFValue(10),
        borderRadius: RFValue(10),
        marginBottom: RFValue(8),
        borderBottomWidth: 1,
        gap:5,
        borderBottomColor: '#EFEFF0',
      },
      shipmentImage: {
        width: RFValue(40),
        height: RFValue(40),
        borderRadius: RFValue(20),
        marginRight: RFValue(10),
      },
      shipmentDetails: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
      },
      viewAll: {
        textAlign: 'center',
        color: '#003399',
        marginTop: RFValue(10),
      },

      tab: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 8,
        backgroundColor: 'transparent',
      },
      activeTab: {
        backgroundColor: '#E9FBE7', // Light green for the active tab
      },
      tabText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#717680', // Default gray text color
      },
      activeTabText: {
        color: '#173A56', // Darker text color for the active tab
        fontWeight: 'bold',
      },
});

export default ReceivedParcelHistory;
