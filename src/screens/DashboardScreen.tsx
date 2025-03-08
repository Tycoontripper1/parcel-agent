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
import ParcelButton, {IParcelButton} from '@/components/ParcelButton';
import DownloadIcon from '@/components/svg/DownloadIcon';
import DownloadIconUp from '@/components/svg/DownloadIconUp';
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
import {HomeStackList} from '@/navigation/navigationType';
import DownloadIconSender from '@/components/svg/DownloadIconSender';
import FundWallet, {Wallet} from '@/components/FundWallet';
import WalletIcon from '@/components/svg/WalletIcon';
import TransferIcon from '@/components/svg/TransferIcon';
import USSDIcon from '@/components/svg/USSDIcon';

const {width} = Dimensions.get('window');

type Props = NativeStackScreenProps<HomeStackList>;
const DashboardScreen = ({navigation}: Props) => {
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

  const parcelButtonData: IParcelButton[] = [
    {
      label: 'Driver',
      type: 'In',
      icon: <DownloadIcon color='#E8ECF7' />,
      url: 'ScreenOneParcelInDriver',
    },
    {
      label: 'Receiver',
      type: 'Out',
      icon: <DownloadIconUp color='#E6FFDB' />,
      url: 'SearchParcelOutReceiver',
    },
    {
      label: 'Sender',
      type: 'In',
      icon: <DownloadIconSender />,
      url: 'ScreenOneParcelInSender',
    },
    {
      label: 'Driver',
      type: 'Out',
      icon: <DownloadIconRed color='#FFEAD5' />,
      url: 'ScreenOneParcelOutDriver',
    },
  ];

  const WalletData: Wallet[] = [
    {
      title: 'Fund with Card',
      icon: <WalletIcon />,
    },
    {
      title: 'Fund with Bank Transfer',
      icon: <TransferIcon />,
    },
    {title: 'Fund with USSD', icon: <USSDIcon />},
  ];

  const handleViewAll = () => {
    navigation.navigate('Shipments');
  };
  const [isWallet, setIsWallet] = useState(false);
  return (
    <CustomView style={styles.container} padded>
      {/* Header */}
      <HomeHeader
        type='Home'
        OnNotificationClick={() => navigation.navigate('NotificationScreen')}>
        <View style={{flexDirection: 'column', gap: 2}}>
          <Text size={18} font='Medium'>
            Hello, Bombay
          </Text>
          <Text size={14} font='Medium' color='#717680'>
            Agent ID: PP64763
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 4,
              marginTop: 4,
            }}>
            <Location color='#000' size={16} />
            <Text size={12} font='Medium'>
              Lagos
            </Text>
          </View>
        </View>
      </HomeHeader>
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
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                }}>
                <View>
                  <Text style={styles.balanceLabel}>Available Balance</Text>
                  <Text style={styles.balance}>₦ 25,000.00</Text>
                </View>
                <TouchableOpacity style={styles.transactionButton}>
                  <Text style={styles.transactionButtonText}>
                    Transaction History
                  </Text>
                  <ArrowRight2 color='#000' size={18} />
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => setIsWallet(true)}
              style={styles.fundButton}>
              <EmptyWalletAdd color='#000' />
              <Text style={styles.fundButtonText}>Fund Wallet</Text>
            </TouchableOpacity>
          </ImageBackground>

          <FundWallet
            isModalVisible={isWallet}
            setIsModalVisible={setIsWallet}
            data={WalletData}
            placeholder='Fund Wallet'
            onSelect={() => ''}
          />
          {/* Parcel Buttons */}
          <ParcelButton buttons={parcelButtonData} />
          {/* Quick Search */}
          <View style={styles.quickSearchContainer}>
            <Text style={styles.quickSearchLabel} font='Medium'>
              Quick Search
            </Text>
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

          {/* Shipment History */}
          <HomeShipmentHistory data={shipmentData} onViewAll={handleViewAll} />
        </ScrollView>
      </KeyboardAvoidingView>
    </CustomView>
  );
};

export default DashboardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  balanceCard: {
    marginVertical: RFValue(16),
    padding: RFValue(16),
    backgroundColor: color.secondaryColor,
    borderRadius: RFValue(10),
  },
  balanceLabel: {
    color: '#fff',
    fontSize: RFValue(12),
  },
  balance: {
    color: '#fff',
    fontSize: RFValue(18),
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
    padding: RFValue(16),
    borderRadius: RFValue(10),
    marginVertical: RFValue(8),
    alignItems: 'center',
  },
});
