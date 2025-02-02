import React, {useCallback, useState} from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  Text as TextFilter,
  RefreshControl,
} from 'react-native';
import {CustomView, Text} from '@/components';
import {RFValue} from 'react-native-responsive-fontsize';
import {color} from '@/constants/Colors';
import {Package} from '../../../assets/images';
import HomeHeader from '@/components/share/HomeHeader';
import {Filter, SearchNormal1} from 'iconsax-react-native';
import {MaterialIcons} from '@expo/vector-icons';

interface ShipmentItem {
  image: string;
  sender: string;
  receiver: string;
  time: string;
  charges: string;
  status: string;
}

const ShipmentHistory = () => {
  const data = [
    {
      image: Package,
      sender: 'Adewale Jinad',
      receiver: 'Mary Kolade',
      time: 'Today • 01:30 PM',
      charges: '₦5,000.00',
      status: 'Arrived',
    },
    {
      image: Package,
      sender: 'John Doe',
      receiver: 'Jane Smith',
      time: 'Yesterday • 04:20 PM',
      charges: '₦3,500.00',
      status: 'Delivered',
    },
    {
      image: Package,
      sender: 'Peter Obi',
      receiver: 'Ngozi Okonjo',
      time: 'Last Week • 10:15 AM',
      charges: '₦10,000.00',
      status: 'In-Transit',
    },
    {
      image: Package,
      sender: 'Adewale Jinad',
      receiver: 'Mary Kolade',
      time: 'Today • 01:30 PM',
      charges: '₦5,000.00',
      status: 'Arrived',
    },
    {
      image: Package,
      sender: 'John Doe',
      receiver: 'Jane Smith',
      time: 'Yesterday • 04:20 PM',
      charges: '₦3,500.00',
      status: 'Delivered',
    },
    {
      image: Package,
      sender: 'Peter Obi',
      receiver: 'Ngozi Okonjo',
      time: 'Last Week • 10:15 AM',
      charges: '₦10,000.00',
      status: 'In-Transit',
    },
  ];

  const [activeTab, setActiveTab] = useState<string>('All');

  const tabs = ['All', 'Arrived', 'In-Transit', 'Delivered'];
  const [isOpen, setIsOpen] = useState(false);

  const [filteredData, setFilteredData] = useState(data);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter the employees based on the search query
  const handleSearch = (text: string) => {
    setSearchQuery(text);

    if (text.trim() === '') {
      // If the search input is empty, show all employees
      setFilteredData(data);
    } else {
      // Filter employees by name or job
      const filtered = data.filter(
        (item) =>
          item.sender.toLowerCase().includes(text.toLowerCase()) ||
          item.receiver.toLowerCase().includes(text.toLowerCase()) ||
          item.status.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredData(filtered);
    }
  };

  //  filter logic
  const isFiltered =
    activeTab === 'All'
      ? filteredData
      : filteredData.filter((x) => x.status === activeTab);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);

    // Simulate a network request
    setTimeout(() => {
      setRefreshing(false); // End the refreshing state
    }, 1500);
  }, []);
  return (
    <CustomView style={styles.container} padded>
      {/* Header */}
      <HomeHeader type='Stack' title='Shipments' />
      <KeyboardAvoidingView
        style={{paddingTop: 20}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: 20}}
          keyboardShouldPersistTaps='handled'
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
          }>
          <View style={styles.searchInput}>
            <SearchNormal1 color='#000' size={18} style={{flexBasis: '10%'}} />
            <TextInput
              onChangeText={handleSearch}
              style={{flexBasis: '88%', height: '100%'}}
              placeholder='Search Parcel'
              placeholderTextColor='#aaa'
              value={searchQuery}
            />
          </View>
          {/* Filter */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginVertical: 20,
            }}>
            <Text size={16} font='Medium'>
              Parcels
            </Text>
            <TouchableOpacity
              onPress={() => setIsOpen(!isOpen)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 4,
                backgroundColor: '#fff',
                borderWidth: 1,
                borderColor: '#E9EAEB',
                borderRadius: 10,
                padding: 6,
              }}>
              <MaterialIcons name='filter-list' size={24} color='black' />
              <Text size={16} font='Medium'>
                Filter
              </Text>
            </TouchableOpacity>
          </View>
          {/* Filters */}
          {isOpen && (
            <View style={styles.filterContainer}>
              {tabs.map((tab) => (
                <TouchableOpacity
                  key={tab}
                  style={[
                    styles.tab,
                    activeTab === tab && styles.activeTab, // Apply active style
                  ]}
                  onPress={() => setActiveTab(tab)}>
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
          <View style={styles.shipmentContainer}>
            <Text style={styles.shipmentLabel} font='SemiBold'>
              Shipment History
            </Text>
            {isFiltered.length === 0 ? (
              <View
                style={{
                  alignSelf: 'center',
                  paddingVertical: 20,
                  height: 100,
                }}>
                <Text font='Medium'>No Shipment found!</Text>
              </View>
            ) : (
              <>
                {isFiltered.map((item, index) => (
                  <View key={index} style={styles.shipmentRow}>
                    <Image source={item.image} style={styles.shipmentImage} />
                    <View style={styles.shipmentDetails}>
                      <View style={{flexDirection: 'column', gap: 4}}>
                        <Text size={11} color='#717680'>
                          Sender
                        </Text>
                        <Text size={12}>{item.sender}</Text>
                        <Text size={10}>{item.time}</Text>
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
                        <Text size={12}>{item.charges}</Text>
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
                  </View>
                ))}
              </>
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
  shipmentContainer: {
    marginVertical: RFValue(16),
    backgroundColor: color.offWhite,
    paddingVertical: RFValue(16),
    borderRadius: 10,
  },
  shipmentLabel: {
    fontSize: RFValue(18),
    marginBottom: RFValue(8),
    alignSelf: 'center',
  },
  shipmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: RFValue(10),
    borderRadius: RFValue(10),
    marginBottom: RFValue(8),
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFF0',
  },
  shipmentImage: {
    width: RFValue(40),
    height: RFValue(40),
    borderRadius: RFValue(20),
    marginRight: RFValue(10),
  },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: RFValue(8),
    padding: RFValue(12),
    borderWidth: 1,
    borderColor: '#E9EAEB',
    flexDirection: 'row',
    alignItems: 'center',
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
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: color.offWhite,
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 4,
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
export default ShipmentHistory;
