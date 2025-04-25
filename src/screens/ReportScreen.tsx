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
import React, {useEffect, useState} from 'react';
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
import ReceivedIcon from '@/components/svg/receivedIcon';
import UnassignedIcon from '@/components/svg/unassignedIcon';
import AssignedIcon from '@/components/svg/assignedIcon';
import CollectedIcon from '@/components/svg/collectedIcon';
import UnpaidIcon from '@/components/svg/unpaidIcon';
import OverdueIcon from '@/components/svg/overdueIcon';
import { getShipmentsHistory } from '../../services/parcel';

const {width} = Dimensions.get('window');

type Props = NativeStackScreenProps<ReportStackList & HomeStackList>;
interface ParcelDetails {
  id: string;

  paymentStatus: string;

}
const Reportscreen = ({navigation}: Props) => {

  const [allShipments, setAllShipments] = useState<ParcelDetails[]>([]);
const [paidShipments, setPaidShipments] = useState<ParcelDetails[]>([]);

useEffect(() => {
  const fetchDriver = async () => {
    try {
      const result = await getShipmentsHistory();
      const rows = result?.data?.details?.rows || [];
      setAllShipments(rows);
      setPaidShipments(rows.filter((item: ParcelDetails) => item.paymentStatus === 'paid'));
    } catch (error) {
      console.error("Failed to fetch drivers:", error);
    }
  };
  fetchDriver();
}, []);

const filterByStatus = (status: string) => {
  return allShipments.filter((item) => item.paymentStatus === status);
};

const counts = {
  received: filterByStatus('received').length,
  unassigned: filterByStatus('paid').length,
  assigned: filterByStatus('assigned').length,
  collected: filterByStatus('collected').length,
  unpaid: filterByStatus('unpaid').length,
  overdue: filterByStatus('overdue').length,
};

const storeButtonData: IStoreButton[] = [
  {
    label: 'Parcel Received',
    count: counts.received,
    url: 'UnAssignParcelHistory',
    icon: <ReceivedIcon />,
    onPress: () =>
      navigation.navigate('UnAssignParcelHistory', {
        data: filterByStatus('received'),
        label: 'Parcel Received',
      }),
  },
  {
    label: 'Unassigned Parcel',
    count: counts.unassigned,
    url: 'UnAssignParcelHistory',
    icon: <UnassignedIcon />,
    onPress: () =>
      navigation.navigate('UnAssignParcelHistory', {
        data: filterByStatus('paid'),
        label: 'Unassigned Parcel',
      }),
  },
  {
    label: 'Assigned Parcel',
    count: counts.assigned,
    url: 'UnAssignParcelHistory',
    icon: <AssignedIcon />,
    onPress: () =>
      navigation.navigate('UnAssignParcelHistory', {
        data: filterByStatus('assigned'),
        label: 'Assigned Parcel',
      }),
  },
  {
    label: 'Parcels Collected',
    count: counts.collected,
    url: 'UnAssignParcelHistory',
    icon: <CollectedIcon />,
    onPress: () =>
      navigation.navigate('UnAssignParcelHistory', {
        data: filterByStatus('collected'),
        label: 'Parcels Collected',
      }),
  },
  {
    label: 'Unpaid Parcel',
    count: counts.unpaid,
    url: 'UnAssignParcelHistory',
    icon: <UnpaidIcon />,
    onPress: () =>
      navigation.navigate('UnAssignParcelHistory', {
        data: filterByStatus('unpaid'),
        label: 'Unpaid Parcel',
      }),
  },
  {
    label: 'Overdue Parcel',
    count: counts.overdue,
    url: 'UnAssignParcelHistory',
    icon: <OverdueIcon />,
    onPress: () =>
      navigation.navigate('UnAssignParcelHistory', {
        data: filterByStatus('overdue'),
        label: 'Overdue Parcel',
      }),
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
      <ScreenHeader title="Reports" onNotificationShow={false} type="Home" />
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
          <HomeShipmentHistory onViewAll={handleViewAll} />
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
