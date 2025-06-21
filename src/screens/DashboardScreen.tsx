

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
  Dimensions,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  ImageBackground,
  ScrollView,
  Platform,
} from 'react-native';
import { CustomView, Text } from '@/components';
import HomeHeader from '@/components/share/HomeHeader';
import { RFValue } from 'react-native-responsive-fontsize';
import ParcelButton, { IParcelButton } from '@/components/ParcelButton';
import {
  ArrowRight2,
  EmptyWalletAdd,
  Location,
  SearchNormal1,
} from 'iconsax-react-native';
import { ImageBack } from '../../assets/images';
import { color } from '@/constants/Colors';
import FundWallet, { Wallet } from '@/components/FundWallet';
import WalletIcon from '@/components/svg/WalletIcon';
import TransferIcon from '@/components/svg/TransferIcon';
import USSDIcon from '@/components/svg/USSDIcon';
import { getUser } from '../../services/auth';
import HomeShipmentHistory from '@/components/HomeShipementHistory';
import { useFocusEffect } from '@react-navigation/native';

// Add the icon imports
import DownloadIcon from '@/components/svg/DownloadIcon';
import DownloadIconUp from '@/components/svg/DownloadIconUp';
import DownloadIconRed from '@/components/svg/DownloadIconRed';
import DownloadIconSender from '@/components/svg/DownloadIconSender';

const { width } = Dimensions.get('window');

const DashboardScreen = ({ navigation }: any) => {
  const [userDetail, setUserDetails] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isWallet, setIsWallet] = useState(false);

  // Memoized data with icons
  const parcelButtonData = useMemo<IParcelButton[]>(() => [
    {
      label: 'Driver',
      type: 'In',
      icon: <DownloadIcon color='#E8ECF7' />,
      url: 'ScreenOneParcelInDriver'
    },
    {
      label: 'Receiver',
      type: 'Out',
      icon: <DownloadIconUp color='#E6FFDB' />,
      url: 'SearchParcelOutReceiver'
    },
    {
      label: 'Sender',
      type: 'In',
      icon: <DownloadIconSender />,
      url: 'ScreenOneParcelInSender'
    },
    {
      label: 'Driver',
      type: 'Out',
      icon: <DownloadIconRed color='#FFEAD5' />,
      url: 'ScreenOneParcelOutDriver'
    }
  ], []);

  const WalletData = useMemo<Wallet[]>(() => [
    { title: 'Fund with Card', icon: <WalletIcon /> },
    { title: 'Fund with Bank Transfer', icon: <TransferIcon /> },
    { title: 'Fund with USSD', icon: <USSDIcon /> },
  ], []);

  // Fetch user data with focus effect
  useFocusEffect(
    useCallback(() => {
      const fetchUser = async () => {
        const userDetails = await getUser();
        setUserDetails(userDetails);
      };
      fetchUser();
    }, [])
  );

  // Memoized handlers
  const handleSearchChange = useCallback((text: string) => setSearchQuery(text), []);
  const handleViewAll = useCallback(() => navigation.navigate('Shipments'), [navigation]);
  const handleViewDetails = useCallback((item: any) => 
    navigation.navigate("UnAssignParcelDetails", { item }), [navigation]);

  return (
    <CustomView style={styles.container} padded>
      <HomeHeader
        type='Home'
        OnNotificationClick={() => navigation.navigate('NotificationScreen')}
      >
        <View style={{ flexDirection: 'column', gap: 2, paddingBottom:4 }}>
          <Text size={18} font='Medium'>
            Hello, {userDetail?.firstName || ''}
          </Text>
          <Text size={14} font='Medium' color='#717680'>
            Agent ID: {userDetail?.agentId || ''}
          </Text>
          <View style={styles.locationContainer}>
            <Location color='#000' size={16} />
            <Text size={12} font='Medium'>
              {userDetail?.state || ''}
            </Text>
          </View>
        </View>
      </HomeHeader>

      <ScrollView
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Balance Card */}
        <ImageBackground
          style={styles.balanceCard}
          source={ImageBack}
          resizeMode='contain'
          imageStyle={{ opacity: 0.8 }}
        >
          <View style={styles.balanceHeader}>
            <View>
              <Text style={styles.balanceLabel}>Available Balance</Text>
              <Text style={styles.balance}>₦0.00</Text>
            </View>
            <TouchableOpacity 
              style={styles.transactionButton} 
              onPress={() => navigation.navigate('TransactionHistory')}
            >
              <Text style={styles.transactionButtonText}>
                Transaction History
              </Text>
              <ArrowRight2 color='#000' size={18} />
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity
            onPress={() => setIsWallet(true)}
            style={styles.fundButton}
          >
            <EmptyWalletAdd size={18} color='#000' />
            <Text style={styles.fundButtonText}>Fund Wallet</Text>
          </TouchableOpacity>
        </ImageBackground>

        <FundWallet
          isModalVisible={isWallet}
          setIsModalVisible={setIsWallet}
          data={WalletData}
          placeholder='Fund Wallet'
          onSelect={()=> ""}
        />
        
        {/* Parcel Buttons */}
        <ParcelButton buttons={parcelButtonData} />
        
        {/* Quick Search */}
        <View style={styles.quickSearchContainer}>
          <Text style={styles.quickSearchLabel} font='Medium'>
            Quick Search
          </Text>
          <View style={styles.searchInput}>
            <SearchNormal1 color='#000' size={18} style={{ marginRight: 8 }} />
            <TextInput
              style={styles.inputField}
              placeholder='Parcel ID/Phone No'
              placeholderTextColor='#aaa'
              value={searchQuery}
              onChangeText={handleSearchChange}
            />
          </View>
        </View>
        
        {/* Shipment History */}
        <HomeShipmentHistory
          searchQuery={searchQuery}
          onViewAll={handleViewAll}
          handleViewAll={handleViewDetails}
          limit={10}
        />
      </ScrollView>
    </CustomView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

  },
  contentContainer: {
    paddingBottom: 20,
  },
  balanceCard: {
    marginVertical: RFValue(16),
    padding: RFValue(16),
    backgroundColor: color.secondaryColor,
    borderRadius: RFValue(10),
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
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
    padding: RFValue(16),
    backgroundColor: '#FAFAFA',
    borderRadius: RFValue(10),
  },
  quickSearchLabel: {
    fontSize: RFValue(14),
    marginBottom: RFValue(8),
    textAlign: 'center',
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
  inputField: {
    flex: 1,
    height: '100%',
  },
  transactionButton: {
    backgroundColor: '#e0e0e0',
    paddingVertical: RFValue(4),
    paddingHorizontal: RFValue(8),
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
    width: '100%',
    gap: 6,
    alignSelf: 'flex-start',
  },
  fundButtonText: {
    color: '#003399',
    fontWeight: 'bold',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
});

export default DashboardScreen;

// import {
//   Dimensions,
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
//   StyleSheet,
//   TextInput,
//   TouchableOpacity,
//   View,
//   ImageBackground,
// } from 'react-native';
// import React, {useEffect, useState} from 'react';
// import {CustomView, Text} from '@/components';
// import HomeHeader from '@/components/share/HomeHeader';
// import {RFValue} from 'react-native-responsive-fontsize';
// import ParcelButton, {IParcelButton} from '@/components/ParcelButton';
// import DownloadIcon from '@/components/svg/DownloadIcon';
// import DownloadIconUp from '@/components/svg/DownloadIconUp';
// import {
//   ArrowRight2,
//   EmptyWalletAdd,
//   Location,
//   SearchNormal1,
// } from 'iconsax-react-native';
// import {ImageBack, Package} from '../../assets/images';
// import {color} from '@/constants/Colors';
// import DownloadIconRed from '@/components/svg/DownloadIconRed';
// import HomeShipmentHistory from '@/components/HomeShipementHistory';
// import {NativeStackScreenProps} from '@react-navigation/native-stack';
// import {HomeStackList, ReportStackList, RootStackParamList, WalletStackList} from '@/navigation/navigationType';
// import DownloadIconSender from '@/components/svg/DownloadIconSender';
// import FundWallet, {Wallet} from '@/components/FundWallet';
// import WalletIcon from '@/components/svg/WalletIcon';
// import TransferIcon from '@/components/svg/TransferIcon';
// import USSDIcon from '@/components/svg/USSDIcon';
// import { getUser } from '../../services/auth';
// import { UserDetails } from '@/utils/interface';

// const {width} = Dimensions.get('window');

// type Props = NativeStackScreenProps<HomeStackList & WalletStackList & RootStackParamList & ReportStackList>;
// const DashboardScreen = ({navigation}: Props) => {
//   const [userDetail, setUserDetails] = useState<UserDetails | null>(null);
//   const [searchQuery, setSearchQuery] = useState('');
//   useEffect(() => {
//     const fetchUser = async () => {
//       const userDetails = await getUser();
//       console.log(userDetails, 'userDetails');
//       setUserDetails(userDetails)
//     };
//     fetchUser();
//   }
//   , []);

//   const handleSearchChange = (text: string) => {
//     setSearchQuery(text);
//   };

//   const parcelButtonData: IParcelButton[] = [
//     {
//       label: 'Driver',
//       type: 'In',
//       icon: <DownloadIcon color='#E8ECF7' />,
//       url: 'ScreenOneParcelInDriver',
//     },
//     {
//       label: 'Receiver',
//       type: 'Out',
//       icon: <DownloadIconUp color='#E6FFDB' />,
//       url: 'SearchParcelOutReceiver',

//     },
//     {
//       label: 'Sender',
//       type: 'In',
//       icon: <DownloadIconSender />,
//       url: 'ScreenOneParcelInSender',
//       // url: 'ScreenOneParcelInSenderTwo',
//     },
//     {
//       label: 'Driver',
//       type: 'Out',
//       icon: <DownloadIconRed color='#FFEAD5' />,
//       url: 'ScreenOneParcelOutDriver',
//     },
//   ];

//   const WalletData: Wallet[] = [
//     {
//       title: 'Fund with Card',
//       icon: <WalletIcon />,
//     },
//     {
//       title: 'Fund with Bank Transfer',
//       icon: <TransferIcon />,
//     },
//     {title: 'Fund with USSD', icon: <USSDIcon />},
//   ];

//   const handleViewAll = () => {
//     navigation.navigate('Shipments');
//   };

//  const handleViewDetails = (item: any) => {
//     navigation.navigate("UnAssignParcelDetails", { item });
//   };
//   const [isWallet, setIsWallet] = useState(false);
//   return (
//     <CustomView style={styles.container} padded>
//       {/* Header */}
//       <HomeHeader
//         type='Home'
//         OnNotificationClick={() => navigation.navigate('NotificationScreen')}>
//         <View style={{flexDirection: 'column', gap: 2}}>
//           <Text size={18} font='Medium'>
//             Hello, {userDetail?.firstName}
//           </Text>
//           <Text size={14} font='Medium' color='#717680'>
//             Agent ID: {userDetail?.agentId}
//           </Text>
//           <View
//             style={{
//               flexDirection: 'row',
//               alignItems: 'center',
//               gap: 4,
//               marginTop: 4,
//             }}>
//             <Location color='#000' size={16} />
//             <Text size={12} font='Medium'>
//               {userDetail?.state}
//             </Text>
//           </View>
//         </View>
//       </HomeHeader>
//       <KeyboardAvoidingView
//         style={{paddingTop: 10}}
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
//         <ScrollView
//           showsHorizontalScrollIndicator={false}
//           showsVerticalScrollIndicator={false}
//           contentContainerStyle={{paddingBottom: 20}}
//           keyboardShouldPersistTaps='handled'>
//         {/* Balance Card */}
//           <ImageBackground
//             style={styles.balanceCard}
//             source={ImageBack}
//             resizeMode='contain'
//             imageStyle={{opacity: 0.8}}>
//             <View>
//               <View
//                 style={{
//                   flexDirection: 'row',
//                   justifyContent: 'space-between',
//                   alignItems: 'flex-start',
//                 }}>
//                 <View>
//                   <Text style={styles.balanceLabel}>Available Balance</Text>
//                   <Text style={styles.balance}>₦0.00</Text>
//                 </View>
//                 <TouchableOpacity style={styles.transactionButton} onPress={() => navigation.navigate('TransactionHistory')}>
//                   <Text style={styles.transactionButtonText}>
//                     Transaction History
//                   </Text>
//                   <ArrowRight2 color='#000' size={18} />
//                 </TouchableOpacity>
//               </View>
//             </View>
//             <TouchableOpacity
//               onPress={() => setIsWallet(true)}
//               style={styles.fundButton}>
//               <EmptyWalletAdd size={18} color='#000' />
//               <Text style={styles.fundButtonText}>Fund Wallet</Text>
//             </TouchableOpacity>
//           </ImageBackground>

//           <FundWallet
//             isModalVisible={isWallet}
//             setIsModalVisible={setIsWallet}
//             data={WalletData}
//             placeholder='Fund Wallet'
//             onSelect={() => ''}
//           />
//           {/* Parcel Buttons */}
//           <ParcelButton buttons={parcelButtonData} />
//           {/* Quick Search */}
//           <View style={styles.quickSearchContainer}>
//         <Text style={styles.quickSearchLabel} font='Medium'>
//           Quick Search
//         </Text>
//         <View style={styles.searchInput}>
//           <SearchNormal1 color='#000' size={18} style={{flexBasis: '10%'}} />
//           <TextInput
//             style={{flexBasis: '88%', height: '100%'}}
//             placeholder='Parcel ID/Phone No'
//             placeholderTextColor='#aaa'
//             value={searchQuery}
//             onChangeText={handleSearchChange}
//           />
//         </View>
//       </View>
//       {/* Shipment History */}
//       <HomeShipmentHistory
//         searchQuery={searchQuery}
//         onViewAll={handleViewAll}
//         handleViewAll={handleViewDetails}
//         limit={10}    
//       />
//         </ScrollView>
//       </KeyboardAvoidingView>
//     </CustomView>
//   );
// };

// export default DashboardScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   balanceCard: {
//     marginVertical: RFValue(16),
//     padding: RFValue(16),
//     backgroundColor: color.secondaryColor,
//     borderRadius: RFValue(10),
//   },
//   balanceLabel: {
//     color: '#fff',
//     fontSize: RFValue(12),
//   },
//   balance: {
//     color: '#fff',
//     fontSize: RFValue(18),
//     fontWeight: 'bold',
//     marginVertical: RFValue(8),
//   },
//   quickSearchContainer: {
//     marginVertical: RFValue(16),
//     paddingHorizontal: RFValue(16),
//     paddingTop: RFValue(16),
//     paddingBottom: RFValue(5),
//     backgroundColor: '#FAFAFA',
//     borderRadius: RFValue(10),
//   },
//   quickSearchLabel: {
//     fontSize: RFValue(14),
//     marginBottom: RFValue(8),
//     alignSelf: 'center',
//   },
//   searchInput: {
//     backgroundColor: '#fff',
//     borderRadius: RFValue(8),
//     padding: RFValue(12),
//     borderWidth: 1,
//     borderColor: '#E9EAEB',
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   transactionButton: {
//     backgroundColor: '#e0e0e0',
//     paddingVertical: RFValue(4),
//     paddingHorizontal: RFValue(4),
//     borderRadius: RFValue(16),
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     gap: 6,
//   },
//   transactionButtonText: {
//     fontSize: RFValue(12),
//   },
//   fundButton: {
//     marginTop: RFValue(16),
//     backgroundColor: '#aaffaa',
//     paddingVertical: RFValue(6),
//     paddingHorizontal: RFValue(8),
//     borderRadius: RFValue(16),
//     justifyContent: 'center',
//     alignItems: 'center',
//     flexDirection: 'row',
//     gap: 6,
//   },
//   fundButtonText: {
//     color: '#003399',
//     fontWeight: 'bold',
//   },
//   parcelButtonsContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//     marginHorizontal: RFValue(16),
//   },
//   parcelButton: {
//     width: width / 2 - RFValue(24),
//     backgroundColor: '#f0f0f0',
//     padding: RFValue(16),
//     borderRadius: RFValue(10),
//     marginVertical: RFValue(8),
//     alignItems: 'center',
//   },
// });
