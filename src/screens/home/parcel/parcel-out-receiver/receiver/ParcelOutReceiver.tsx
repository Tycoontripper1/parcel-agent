// import {CustomView, Input, Spinner, Text} from '@/components';
// import ButtonHome from '@/components/ButtonHome';
// import KeyBoardView from '@/components/KeyBoardView';
// import BackButton from '@/components/share/BackButton';
// import ShootButton from '@/components/svg/ShootButton';
// import {HomeStackList} from '@/navigation/navigationType';
// import {Ionicons} from '@expo/vector-icons';
// import {NativeStackScreenProps} from '@react-navigation/native-stack';
// import {useDispatch, useSelector} from 'react-redux';
// import {RootState} from '@/redux/store';
// import React, {useState} from 'react';
// import {
//   View,
//   StyleSheet,
//   Alert,
//   ViewStyle,
//   TouchableOpacity,
// } from 'react-native';
// import {updateField} from '@/redux/slices/parcelSlice';
// import {RFValue} from 'react-native-responsive-fontsize';
// import Toast from 'react-native-toast-message';

// type Props = NativeStackScreenProps<HomeStackList>;
// const formData = useSelector((state: RootState) => state.parcel);
// const dispatch = useDispatch();
// const ParcerOutReceiver = ({navigation}: Props) => {
//   const [parcelId, setParcelId] = useState('');
//   const [loading, setLoading] = useState(false);

//   // Function to handle parcel search
//   const handleSubmit = () => {
//     // setLoading(true);
//     // setTimeout(() => {
//     //   setLoading(false);
//     //   Toast.show({
//     //     type: 'success',
//     //     text1: 'Success',
//     //     text2: 'Parcel loaded!',
//     //   });
//     //   navigation.navigate('ParcelCongratulation', {
//     //     message: 'Parcel released successfully',
//     //   });
//     // }, 3000);
//     navigation.navigate('ParcelInDriverUnRegistered');
//   };


//   // Styles
//   const $bodyHeader: ViewStyle = {
//     flexDirection: 'column',
//     gap: 6,
//     paddingVertical: RFValue(30),
//   };
//   const $buttonsContainer: ViewStyle = {
//     paddingVertical: RFValue(16),
//   };

//   return (
//     <CustomView style={{paddingVertical: RFValue(10)}}>
//       {loading && <Spinner />}
//       <BackButton onClick={() => navigation.goBack()} />
//       {/* Body */}
//       <KeyBoardView padded={true}>
//         <View style={$bodyHeader}>
//           <Text font='SemiBold'  size={18}>
//           Parcel Out - Receiver
//           </Text>
//         </View>
//         <>
//           {/* Parcel Input */}
//           <View style={styles.inputContainer}>
//             <Text style={styles.label} font='Medium' size={16}>
//             Enter receiver’s information
//             </Text>

//             <Input
//             label='Full Name'
//             placeholder='Enter Name'
//             placeholderTextColor='#B8C2CC'
//             value={formData.receiverFullName}
//             onChangeText={(value) =>
//               dispatch(updateField({key: 'receiverFullName', value}))
//             }
//             keyboardType='default'
//           />
//            <Input
//             label=' Receiver Phone Number'
//             placeholder='Enter phone number'
//             placeholderTextColor='#B8C2CC'
//             value={formData.receiverPhoneNumber}
//             onChangeText={(value) =>
//               dispatch(updateField({key: 'receiverPhoneNumber', value}))
//             }
//             keyboardType='number-pad'
//           />
     
        
//           </View>
         
//           {/* Search Button */}
//           <View style={$buttonsContainer}>
//             <ButtonHome
//               onPress={handleSubmit}
//               title='Continue'
//               style={{height: 55}}
//               disabled={!formData.receiverPhoneNumber || !formData.receiverFullName}
//               textColor='#61616B'
//             />
//           </View>
//         </>
//       </KeyBoardView>
//     </CustomView>
//   );
// };
// export default ParcerOutReceiver;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     padding: 20,
//   },
//   scanButton: {
//     backgroundColor: '#E6FFDB',
//     padding: 15,
//     borderRadius: 10,
//     width: '100%',
//     alignItems: 'center',
//     marginBottom: 20,
//     flexDirection: 'row',
//     justifyContent: 'center',
//     gap: 10,
//   },
//   scanButtonText: {
//     color: '#1b4e73',
//     fontSize: 18,
//     fontWeight: '600',
//   },
//   orContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginVertical: 20,
//   },
//   divider: {
//     flex: 1,
//     height: 1,
//     backgroundColor: '#ddd',
//   },
//   orText: {
//     marginHorizontal: 10,
//     color: '#aaa',
//     fontSize: 14,
//   },
//   inputContainer: {
//     width: '100%',
//     marginBottom: 20,
//   },
//   label: {
//     color: '#555',
//     marginBottom: 5,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 8,
//     padding: 10,
//     fontSize: 16,
//     width: '100%',
//     backgroundColor: '#f9f9f9',
//   },
//   searchButton: {
//     backgroundColor: '#eee',
//     padding: 15,
//     borderRadius: 10,
//     width: '80%',
//     alignItems: 'center',
//   },
//   searchButtonText: {
//     color: '#555',
//     fontSize: 18,
//     fontWeight: '600',
//   },
//   outputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 16,
//     margin: 8,
//     backgroundColor: '#f9fff4',
//     borderRadius: 12,
//     borderWidth: 1.5,
//     borderColor: '#ddd',
//   },
//   checkedContainer: {
//     borderColor: '#4CAF50',
//   },

//   infoContainer: {
//     flexDirection: 'column',
//     marginLeft: 16,
//   },
//   name: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   phone: {
//     fontSize: 14,
//     color: '#555',
//   },
// });
import { CustomView, Input, Spinner, Text } from '@/components';
import ButtonHome from '@/components/ButtonHome';
import KeyBoardView from '@/components/KeyBoardView';
import BackButton from '@/components/share/BackButton';
import { HomeStackList } from '@/navigation/navigationType';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { updateField } from '@/redux/slices/parcelSlice';
import { RFValue } from 'react-native-responsive-fontsize';
import Toast from 'react-native-toast-message';

type Props = NativeStackScreenProps<HomeStackList>;

const ParcelOutReceiver = ({ navigation }: Props) => {
  const dispatch = useDispatch();
  const formData = useSelector((state: RootState) => state.parcel);
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    navigation.navigate('ParcelOtpVerificationReceiver');
  };

  const $bodyHeader: ViewStyle = {
    flexDirection: 'column',
    gap: 6,
    paddingVertical: RFValue(30),
  };
  const $buttonsContainer: ViewStyle = {
    paddingVertical: RFValue(16),
  };

  return (
    <CustomView style={{ paddingVertical: RFValue(10) }}>
      {loading && <Spinner />}
      <BackButton onClick={() => navigation.goBack()} />

      <KeyBoardView padded={true}>
        <View style={$bodyHeader}>
          <Text font='SemiBold' size={18}>
            Parcel Out - Receiver
          </Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label} font='Medium' size={16}>
            Enter receiver’s information
          </Text>

          <Input
            label='Full Name'
            placeholder='Enter Name'
            placeholderTextColor='#B8C2CC'
            value={formData.receiverFullName}
            onChangeText={(value) =>
              dispatch(updateField({ key: 'receiverFullName', value }))
            }
            keyboardType='default'
          />

          <Input
            label='Receiver Phone Number'
            placeholder='Enter phone number'
            placeholderTextColor='#B8C2CC'
            value={formData.receiverPhoneNumber}
            onChangeText={(value) =>
              dispatch(updateField({ key: 'receiverPhoneNumber', value }))
            }
            keyboardType='number-pad'
          />
        </View>

        <View style={$buttonsContainer}>
          <ButtonHome
            onPress={handleSubmit}
            title='Continue'
            style={{ height: 55 }}
            disabled={!formData.receiverPhoneNumber || !formData.receiverFullName}
            textColor='#61616B'
          />
        </View>
      </KeyBoardView>
    </CustomView>
  );
};

export default ParcelOutReceiver;

const styles = StyleSheet.create({
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    color: '#555',
    marginBottom: 5,
  },
});

