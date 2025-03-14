import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  ImageBackground,
} from 'react-native';
import React, {useState} from 'react';
import {CustomView, Text} from '@/components';
import HomeHeader from '@/components/share/HomeHeader';
import {RFValue} from 'react-native-responsive-fontsize';
import {
  ArrowRight2,
  EmptyWalletAdd,
  Location,
  SearchNormal1,
} from 'iconsax-react-native';
import {ImageBack, Package} from '../../assets/images';
import {color} from '@/constants/Colors';
import DownloadIconRed from '@/components/svg/DownloadIconRed';
import HomeShipmentHistory from '@/components/HomeShipementHistory';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {HomeStackList, ReportStackList} from '@/navigation/navigationType';
import StoreButton, { IStoreButton } from '@/components/StoreButton';
import FinanceButton, {IFinanceButton} from '@/components/Financebutton';
import ScreenHeader from '@/components/share/ScreenHeader';

const {width} = Dimensions.get('window');

type Props = NativeStackScreenProps<ReportStackList & HomeStackList>;
const Reportscreen = ({navigation}: Props) => {
  const shipmentData = [
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
      status: 'In Transit',
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
      status: 'In Transit',
    },
  ];

  const storeButtonData: IStoreButton[] = [
    {
      label: 'Parcel Received',
      count: 50,
      url: 'ReceivedParcelHistory',
    },
    {
      label: 'Unassigned Parcel',
      count: 25,
      url: 'UnAssignParcelHistory',
    },
    {
      label: 'Assigned Parcel',
      count: 25,
      url: 'AssignParcelHistory',
    },
    {
      label: 'Parcels Collected',
      count: 20,
      url: 'ParcelCollectedHistory',
    },
    {
      label: 'Unpaid Parcel',
      count: 20,
      url: 'UnpaidParcelHistory',
    },
    {
      label: 'Overdue Parcel',
      count: 20,
      url: 'OverdueParcelHistory',
    },
  ];
  const financeButtonData: IFinanceButton[] = [
    {
      label: 'Paid to Driver',
      amount: "₦100,000.00",
    },
    {
      label: 'Collected from Receiver',
      amount:"₦200,000.00"
    },
    {
      label: 'Collected from Sender',
        amount:"₦50,000.00"
    },
    {
      label: 'Expected Overdue Income',
        amount:"₦25,500.30"
    },
  ];


  const handleViewAll = () => {
    navigation.navigate('Shipments');
  };
  return (
    <CustomView style={styles.container} padded>
      {/* Header */}
      <ScreenHeader title="Reports" OnNotificationClick={() => navigation.navigate("NotificationScreen")} type="Home" />
      <KeyboardAvoidingView
        style={{paddingTop: 10}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: 20}}
          keyboardShouldPersistTaps='handled'>
          {/* Balance Card */}
          <ImageBackground
            style={styles.balanceCard}
            source={ImageBack}
            resizeMode='contain'
            imageStyle={{opacity: 0.8}}>
                    
                        <View>
                          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
                            <View style={{ alignItems: "center", flexDirection: "column", justifyContent: "center", width: "100%" }}>
                              <Text style={styles.balanceLabel}>Total Earnings</Text>
                              <Text style={styles.balance}>₦ 25,000.00</Text>
                            </View>
                          </View>
                        </View>
                        <TouchableOpacity onPress={() => ''} style={styles.fundButton}>
                          <Text style={styles.fundButtonText}>View History</Text>
                        </TouchableOpacity>
                      
          </ImageBackground>
                 {/* Quick Search */}
                 <View style={styles.quickSearchContainer}>
            {/* <Text style={styles.quickSearchLabel} font='Medium'>
              Quick Search
            </Text> */}
            <View style={styles.searchInput}>
              <SearchNormal1
                color='#000'
                size={18}
                style={{flexBasis: '10%'}}
              />
              <TextInput
                style={{flexBasis: '88%', height: '100%'}}
                placeholder='Parcel ID or Phone Number'
                placeholderTextColor='#aaa'
              />
            </View>
          </View>
          {/* Store Buttons */}
          <Text style={styles.header}>Store Reports</Text>
          <StoreButton buttons={storeButtonData} />

                {/* Finance Report */}
                <Text style={styles.header}>Finance Reports</Text>
                <FinanceButton buttons={financeButtonData} />

          {/* Shipment History */}
          <HomeShipmentHistory data={shipmentData} onViewAll={handleViewAll} />
        </ScrollView>
      </KeyboardAvoidingView>
    </CustomView>
  );
};

export default Reportscreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header:{
    color:"#414651",
    lineHeight:RFValue(24),
    fontWeight: 500,
    fontSize:RFValue(16),
    marginVertical:RFValue(12)
  },
  balanceCard: {
    marginVertical: RFValue(16),
    padding: RFValue(16),
    backgroundColor: color.secondaryColor,
    borderRadius: RFValue(10),
  },
  balanceLabel: {
    color: '#fff',
    fontSize: RFValue(14),
  },
  balance: {
    color: '#fff',
    fontSize: RFValue(24),
    fontWeight: 'bold',
    marginVertical: RFValue(8),
  },
  quickSearchContainer: {
    marginVertical: RFValue(16),
    paddingHorizontal: RFValue(16),
    paddingTop: RFValue(16),
    paddingBottom: RFValue(5),
    backgroundColor: '#FAFAFA',
    borderRadius: RFValue(10),
  },
  quickSearchLabel: {
    fontSize: RFValue(14),
    marginBottom: RFValue(8),
    alignSelf: 'center',
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
  transactionButton: {
    backgroundColor: '#e0e0e0',
    paddingVertical: RFValue(4),
    paddingHorizontal: RFValue(4),
    borderRadius: RFValue(16),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
  },
  transactionButtonText: {
    fontSize: RFValue(12),
  },
  fundButton: {
    marginTop: RFValue(16),
    backgroundColor: '#aaffaa',
    paddingVertical: RFValue(6),
    paddingHorizontal: RFValue(8),
    borderRadius: RFValue(16),
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  fundButtonText: {
    color: '#003399',
    fontWeight: 'bold',
  },
  parcelButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: RFValue(16),
  },
  parcelButton: {
    width: width / 2 - RFValue(24),
    backgroundColor: '#f0f0f0',
    padding: RFValue(10),
    borderRadius: RFValue(10),
    marginVertical: RFValue(8),
    alignItems: 'center',
  },
});
