import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  RefreshControl,
  Text as TextFilter,
} from 'react-native';
import { CustomView, Text } from '@/components';
import { RFValue } from 'react-native-responsive-fontsize';
import { color } from '@/constants/Colors';
import HomeHeader from '@/components/share/HomeHeader';
import {  SearchNormal1 } from 'iconsax-react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { getShipmentsHistory } from '../../../services/parcel';
import { formatDate } from '@/utils/formartDates';
import EmptyWallet from '@/components/svg/EmptyEarning';

interface ParcelDetails {
  id: string;
  sender: { fullName: string };
  receiver: { fullName: string };
  parcel: { thumbnails: string[]; totalFee: string };
  status: string;
  createdAt: string;
}

interface FilteredShipment {
  image: string;
  sender: string;
  receiver: string;
  time: string;
  charges: string;
  status: string;
}

const ShipmentHistory = () => {
  const [shipments, setShipments] = useState<ParcelDetails[]>([]);
  const [filteredShipments, setFilteredShipments] = useState<FilteredShipment[]>([]);
  const [activeTab, setActiveTab] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const tabs = ['All', 'Arrived', 'In-Transit', 'Delivered'];

  useEffect(() => {
    fetchShipments();
  }, []);

  const fetchShipments = async () => {
    try {
      const result = await getShipmentsHistory();
      const rows = result?.data?.details?.rows || [];
      setShipments(rows);
      setFilteredShipments(mapShipments(rows));
    
    } catch (error) {
      console.error('Failed to fetch shipments:', error);
    }
  };  
  console.log(shipments.length, 'rows');

  const mapShipments = (data: ParcelDetails[]) => {
    return data.map((shipment) => ({
      image: shipment.parcel?.thumbnails[0] || '',
      sender: shipment.sender.fullName,
      receiver: shipment.receiver.fullName,
      time: formatDate(shipment.createdAt),
      charges: `₦${shipment.parcel.totalFee}`,
      status: shipment.status,
    }));
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
  
    const lowerText = text.toLowerCase();
    const filtered = shipments.filter((shipment) => {
      const senderName = shipment.sender?.fullName?.toLowerCase() || '';
      const receiverName = shipment.receiver?.fullName?.toLowerCase() || '';
      const status = shipment.status?.toLowerCase() || '';
  
      return (
        senderName.includes(lowerText) ||
        receiverName.includes(lowerText) ||
        status.includes(lowerText)
      );
    });
  
    setFilteredShipments(mapShipments(filtered));
  };
  

  const filteredByTab = activeTab === 'All'
    ? filteredShipments
    : filteredShipments.filter((shipment) => shipment.status === activeTab);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchShipments().finally(() => setRefreshing(false));
  }, []);

  return (
    <CustomView style={styles.container} padded>
      <HomeHeader type="Stack" title="Shipments" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ paddingTop: 20 }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={Platform.OS === 'android' ? [color.primary, color.inputColor, 'blue'] : undefined}
              tintColor={Platform.OS === 'ios' ? color.primary : undefined}
            />
          }
        >
          {/* Search Input */}
          <View style={styles.searchInput}>
            <SearchNormal1 color="#000" size={18} style={{ flexBasis: '10%' }} />
            <TextInput
              placeholder="Search Parcel"
              placeholderTextColor="#aaa"
              style={{ flex: 1, height: '100%' }}
              value={searchQuery}
              onChangeText={handleSearch}
            />
          </View>

          {/* Filter Button */}
          <View style={styles.filterHeader}>
            <Text size={16} font="Medium">Parcels</Text>
            <TouchableOpacity onPress={() => setIsOpen(!isOpen)} style={styles.filterButton}>
              <MaterialIcons name="filter-list" size={24} color="black" />
              <Text size={16} font="Medium">Filter</Text>
            </TouchableOpacity>
          </View>

          {/* Tabs */}
          {isOpen && (
            <View style={styles.tabContainer}>
              {tabs.map((tab) => (
                <TouchableOpacity
                  key={tab}
                  style={[styles.tab, activeTab === tab && styles.activeTab]}
                  onPress={() => setActiveTab(tab)}
                >
                  <TextFilter
                 style={[
                  styles.tabText,
                  activeTab === tab && styles.activeTabText, // Apply active text style
                ]}>
                    {tab}
                    
                  </TextFilter>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Shipment List */}
          <View style={styles.shipmentContainer}>
            <Text style={styles.shipmentLabel} font="SemiBold">Shipment History</Text>

            {filteredByTab.length === 0 ? (
              <View style={styles.emptyState}>
                 <EmptyWallet />
                <Text font="Medium">No Shipment found!</Text>
              </View>
            ) : (
              filteredByTab.map((item, index) => (
                <View key={index} style={styles.shipmentRow}>
                  <Image source={{ uri: item.image }} style={styles.shipmentImage} />
                  <View style={styles.shipmentDetails}>
                    <View style={styles.detailColumn}>
                      <Text size={11} color="#717680">Sender</Text>
                      <Text size={12}>{item.sender}</Text>
                      <Text size={10}>{item.time}</Text>
                    </View>
                    <View style={styles.detailColumn}>
                      <Text size={10} color="#717680">Receiver</Text>
                      <Text size={12}>{item.receiver}</Text>
                    </View>
                    <View style={styles.detailColumn}>
                      <Text size={10} color="#717680">Charges</Text>
                      <Text size={12}>{item.charges}</Text>
                      <View style={[
                        styles.statusBadge,
                        {
                          backgroundColor:
                            item.status === 'Arrived'
                              ? '#F7F9FC'
                              : item.status === 'Delivered'
                                ? '#ECFDF3'
                                : '#FFF6ED',
                        }
                      ]}>
                        <Text
                          size={10}
                          color={
                            item.status === 'Arrived'
                              ? '#213264'
                              : item.status === 'Delivered'
                                ? '#12B76A'
                                : '#FB6514'
                          }
                        >
                         {item.status === "received"
                    ? "Collected"
                    : item.status.charAt(0).toUpperCase() +
                      item.status.slice(1)}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              ))
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </CustomView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: RFValue(8),
    padding: RFValue(12),
    borderWidth: 1,
    borderColor: '#E9EAEB',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: RFValue(10),
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: RFValue(16),
    alignItems: 'center',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E9EAEB',
    borderRadius: 10,
    padding: 6,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: RFValue(16),
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#E9FBE7',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#717680',
  },
  activeTabText: {
    color: '#173A56',
    fontWeight: 'bold',
  },
  shipmentContainer: {
    backgroundColor: color.offWhite,
    paddingVertical: RFValue(16),
    paddingHorizontal: RFValue(10),
    borderRadius: 10,
  },
  shipmentLabel: {
    fontSize: RFValue(18),
    marginBottom: RFValue(8),
    alignSelf: 'center',
  },
  emptyState: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  shipmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: RFValue(10),
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFF0',
    paddingBottom: RFValue(10),
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
  },
  detailColumn: {
    flexDirection: 'column',
    gap: 4,
  },
  statusBadge: {
    marginTop: 4,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignSelf: 'flex-start',
  },
});

export default ShipmentHistory;
