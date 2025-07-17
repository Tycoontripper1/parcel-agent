import { CustomView, Spinner, Text } from "@/components";
import ButtonHome from "@/components/ButtonHome";
import KeyBoardView from "@/components/KeyBoardView";
import BackButton from "@/components/share/BackButton";
import StepProgress from "@/components/share/StepProgress";
import { HomeStackList } from "@/navigation/navigationType";
import { RootState } from "@/redux/store";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  ViewStyle,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";
import { ParcelInDriver } from "../../../../../../services/parcel";
import { resetForm } from "@/redux/slices/parcelSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setCurrentParcelIndex, updateParcelField } from "@/redux/slices/parcelVariationSlice";

type Props = NativeStackScreenProps<HomeStackList>;
const ParcelInDriverUnRegisteredPreviewScreen = ({ navigation }: Props) => {
  const { parcels, currentParcelIndex } = useSelector((state: RootState) => state.parcelVariation);
  const currentParcel = parcels[currentParcelIndex];
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  // Edit States
  const [editingSenderPhone, setEditingSenderPhone] = useState(false);
  const [editedSenderPhone, setEditedSenderPhone] = useState(currentParcel.senderPhoneNumber);
  const [editingReceiverPhone, setEditingReceiverPhone] = useState(false);
  const [editedReceiverPhone, setEditedReceiverPhone] = useState(currentParcel.receiverPhoneNumber);

  const handleSelectParcel = (index: number) => {
    dispatch(setCurrentParcelIndex(index));
    // Reset edit states when changing parcels
    setEditingSenderPhone(false);
    setEditingReceiverPhone(false);
  };

  const HandleContinue = async () => {
    setLoading(true);
    try {
      const payload = {
        parcels: parcels.map(parcel => ({
          sender: {
            phone: parcel.senderPhoneNumber?.replace(/-/g, ""),
          },
          receiver: {
            phone: parcel.receiverPhoneNumber?.replace(/-/g, ""),
          },
          park: {
            source: parcel.departureState,
            destination: parcel.deliveryMotorPark,
          },
          parcel: {
            type: parcel.parcelType,
            value: parcel.parcelValue ? String(Number(parcel.parcelValue)) : "",
            chargesPayable: parcel.chargesPayable ? String(Number(parcel.chargesPayable)) : "",
            chargesPaidBy: parcel.chargesPayBy,
            handlingFee: String(parcel.handlingFee ? Number(parcel.handlingFee) : ""),
            totalFee: parcel.handlingFee && parcel.chargesPayable
              ? String(Number(parcel.handlingFee) + Number(parcel.chargesPayable))
              : "",
            description: parcel.parcelDescription,
            thumbnails: parcel.parcelImages || [],
          },
          paymentOption: "bank",
          status: "arrived",
        }))
      };
      //(payload, "payload")

      const result = await ParcelInDriver(payload);
      
      await AsyncStorage.setItem(
        "parcelDetails",
        JSON.stringify(result?.data?.details)
      );
      
      Toast.show({
        type: "success",
        text1: "Success",
        text2: result?.data?.message || "Parcel Received!",
      });

      dispatch(resetForm());
      navigation.navigate("PrintParcel");
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Submission Failed",
        text2: error.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  // Styles
  const $bodyHeader: ViewStyle = {
    padding: RFValue(16),
    flexDirection: "column",
    gap: 6,
  };
  const $buttonsContainer: ViewStyle = {
    padding: RFValue(16),
  };

  return (
    <CustomView style={{ paddingVertical: RFValue(10) }}>
      {loading && <Spinner />}
      <BackButton onClick={() => navigation.goBack()} />
      <StepProgress step={2} totalSteps={2} />

      {/* Parcel Navigation */}
      <View style={styles.parcelNavContainer}>
        {/* Left Side - Back Button or Spacer */}
        <View style={styles.navButtonContainer}>
          {currentParcelIndex > 0 ? (
            <TouchableOpacity 
              onPress={() => handleSelectParcel(currentParcelIndex - 1)}
              style={styles.navButton}
            >
              <Ionicons name="chevron-back" size={20} color="white" />
              <Text style={styles.navButtonText}>Previous</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.navButtonPlaceholder} />
          )}
        </View>

        {/* Center - Current Parcel Indicator */}
        <View style={styles.currentParcelIndicator}>
          <Text font="SemiBold" size={16} style={styles.currentParcelText}>
            Parcel {currentParcelIndex + 1} of {parcels.length}
          </Text>
        </View>

        {/* Right Side - Next or Spacer */}
        <View style={styles.navButtonContainer}>
          {currentParcelIndex < parcels.length - 1 ? (
            <TouchableOpacity 
              onPress={() => handleSelectParcel(currentParcelIndex + 1)}
              style={styles.navButton}
            >
              <Text style={styles.navButtonText}>Next</Text>
              <Ionicons name="chevron-forward" size={20} color="white" />
            </TouchableOpacity>
          ) : (
            <View style={styles.navButtonPlaceholder} />
          )}
        </View>
      </View>

      {/* Body */}
      <KeyBoardView padded={false}>
        <View style={$bodyHeader}>
          <Text font="SemiBold" size={18}>
            Confirm Parcel Details
          </Text>
        </View>

        {/* Status */}
        <View style={styles.statusContainer}>
          <Text size={14}>Status</Text>
          <View style={styles.statusBadge}>
            <Text color="#F79009">In Transit</Text>
          </View>
        </View>

        {/* Sender's Information */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeader} font="SemiBold" size={14}>
            Sender's Information
          </Text>
          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <Text style={styles.infoText}>Phone Number:</Text>
              {editingSenderPhone ? (
                <TextInput
                  style={styles.input}
                  value={editedSenderPhone}
                  onChangeText={setEditedSenderPhone}
                  autoFocus
                  onBlur={() => {
                    dispatch(updateParcelField({
                      index: currentParcelIndex,
                      key: "senderPhoneNumber",
                      value: editedSenderPhone
                    }));
                    setEditingSenderPhone(false);
                  }}
                  onSubmitEditing={() => {
                    dispatch(updateParcelField({
                      index: currentParcelIndex,
                      key: "senderPhoneNumber",
                      value: editedSenderPhone
                    }));
                    setEditingSenderPhone(false);
                  }}
                  keyboardType="phone-pad"
                />
              ) : (
                <View style={styles.editableRow}>
                  <Text style={styles.infoText}>
                    {currentParcel.senderPhoneNumber.replace(/-/g, "")}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      setEditedSenderPhone(currentParcel.senderPhoneNumber);
                      setEditingSenderPhone(true);
                    }}
                    style={styles.editButton}
                  >
                    <AntDesign name="edit" size={20} color="#4A90E2" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Receiver's Information */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeader} font="SemiBold" size={14}>
            Receiver's Information
          </Text>
          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <Text style={styles.infoText}>Phone Number:</Text>
              {editingReceiverPhone ? (
                <TextInput
                  style={styles.input}
                  value={editedReceiverPhone}
                  onChangeText={setEditedReceiverPhone}
                  autoFocus
                  onBlur={() => {
                    dispatch(updateParcelField({
                      index: currentParcelIndex,
                      key: "receiverPhoneNumber",
                      value: editedReceiverPhone
                    }));
                    setEditingReceiverPhone(false);
                  }}
                  onSubmitEditing={() => {
                    dispatch(updateParcelField({
                      index: currentParcelIndex,
                      key: "receiverPhoneNumber",
                      value: editedReceiverPhone
                    }));
                    setEditingReceiverPhone(false);
                  }}
                  keyboardType="phone-pad"
                />
              ) : (
                <View style={styles.editableRow}>
                  <Text style={styles.infoText}>
                    {currentParcel.receiverPhoneNumber.replace(/-/g, "")}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      setEditedReceiverPhone(currentParcel.receiverPhoneNumber);
                      setEditingReceiverPhone(true);
                    }}
                    style={styles.editButton}
                  >
                    <AntDesign name="edit" size={20} color="#4A90E2" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Park Detail */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeader} font="SemiBold" size={14}>
            Park Detail
          </Text>
          <View style={styles.infoBox}>
            <View style={styles.infoRow}>
              <Text style={styles.infoText}>Departure State:</Text>
              <Text style={styles.infoText}>{currentParcel.departureState}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoText}>Destination Motor Park:</Text>
              <Text style={styles.infoText}>{currentParcel.deliveryMotorPark}</Text>
            </View>
          </View>
        </View>

        {/* Parcel Information */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeader} font="SemiBold" size={14}>
            Parcel Information
          </Text>
          <View style={styles.infoBox}>
            <View style={styles.infoRow}>
              <Text style={styles.infoText}>Charges Paid By:</Text>
              <Text style={styles.infoText}>{currentParcel.chargesPayBy}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoText}>Parcel Type:</Text>
              <Text style={styles.infoText}>{currentParcel.parcelType}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoText}>Parcel Worth:</Text>
              <Text style={styles.infoText}>₦{currentParcel.parcelValue}</Text>
            </View>
            <View style={[styles.infoRow, styles.borderBottom]}>
              <Text style={styles.infoText}>Charges Payable:</Text>
              <Text style={styles.infoText}>₦{currentParcel.chargesPayable}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoText}>Handling Fee:</Text>
              <Text style={styles.infoText}>₦{currentParcel.handlingFee}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoText}>Total Paid:</Text>
              <Text style={styles.infoText}>
                ₦{currentParcel.handlingFee && currentParcel.chargesPayable
                  ? String(
                      Number(currentParcel.handlingFee) +
                      Number(currentParcel.chargesPayable))
                  : ""}
              </Text>
            </View>
          </View>
        </View>

        {/* Parcel Description */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeader} font="SemiBold" size={14}>
            Parcel Description
          </Text>
          <View style={styles.infoBox}>
            <Text style={styles.descriptionText}>
              {currentParcel.parcelDescription}
            </Text>
          </View>
        </View>

        {/* Parcel Photos */}
        {currentParcel.parcelImages?.filter(photo => photo).length > 0 && (
          <View style={styles.photoSection}>
            <Text style={styles.counter}>
              {currentParcel.parcelImages.filter(photo => photo).length}/2 photos
            </Text>
            <View style={styles.photoGrid}>
              {currentParcel.parcelImages.map((photo, index) => (
                <TouchableOpacity key={index} style={styles.photoBox}>
                  {photo && (
                    <Image
                      source={{ uri: `http://45.9.191.184:8001/parcel/v1.0/api/files?slugs=${photo}` }}
                      style={styles.photoPreview}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Submit Button */}
        <View style={$buttonsContainer}>
          <ButtonHome
            onPress={HandleContinue}
            title={parcels.length > 1 ? "Receive All Parcels" : "Receive Parcel"}
            style={{ height: 55 }}
            disabled={!currentParcel.handlingFee}
          />
        </View>
      </KeyBoardView>
    </CustomView>
  );
};

const styles = StyleSheet.create({
  // Navigation Styles
  parcelNavContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: RFValue(16),
    marginBottom: RFValue(16),
    width: '100%',
  },
  navButtonContainer: {
    flex: 1,
    maxWidth: '30%',
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#215B23',
    borderRadius: RFValue(8),
    paddingVertical: RFValue(10),
    paddingHorizontal: RFValue(12),
    gap: RFValue(6),
  },
  navButtonText: {
    color: 'white',
    fontSize: RFValue(14),
    fontWeight: '500',
  },
  navButtonPlaceholder: {
    flex: 1,
  },
  currentParcelIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: RFValue(20),
    paddingHorizontal: RFValue(16),
    paddingVertical: RFValue(8),
    minWidth: RFValue(120),
    justifyContent: 'center',
    marginHorizontal: RFValue(8),
  },
  currentParcelText: {
    color: '#215B23',
  },

  // Content Styles
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: RFValue(6),
    paddingHorizontal: RFValue(16),
  },
  statusBadge: {
    backgroundColor: '#FFF8E6',
    padding: RFValue(4),
    borderRadius: RFValue(8),
  },
  sectionContainer: {
    marginBottom: RFValue(10),
    backgroundColor: '#FDFDFD',
    borderRadius: RFValue(8),
    padding: RFValue(16),
  },
  sectionHeader: {
    paddingVertical: RFValue(8),
    borderBottomWidth: 1,
    borderBottomColor: '#E9EAEB',
    marginBottom: RFValue(6),
    color: '#414651',
  },
  infoBox: {
    backgroundColor: 'white',
    padding: RFValue(6),
    borderRadius: RFValue(8),
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: RFValue(4),
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: '#E9EAEB',
  },
  infoText: {
    fontSize: RFValue(13),
    color: '#717680',
  },
  descriptionText: {
    fontSize: RFValue(14),
    color: '#717680',
  },
  editableRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButton: {
    marginLeft: RFValue(8),
  },
  input: {
    fontSize: RFValue(12),
    color: '#717680',
    padding: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#E9EAEB',
    textAlign: 'right',
    flex: 1,
  },
  photoSection: {
    paddingVertical: RFValue(10),
    paddingHorizontal: RFValue(16),
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: RFValue(20),
  },
  photoBox: {
    width: '47%',
    aspectRatio: 1,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: RFValue(10),
    borderRadius: RFValue(10),
    borderColor: '#ddd',
  },
  photoPreview: {
    width: '100%',
    height: '100%',
    borderRadius: RFValue(8),
  },
  counter: {
    fontSize: RFValue(14),
    color: 'gray',
    marginBottom: RFValue(20),
  },
    infoContainer: {
    backgroundColor: "white",
    padding: RFValue(6),
    borderRadius: 8,
  },
});

export default ParcelInDriverUnRegisteredPreviewScreen;




// import { CustomView, Spinner, Text } from "@/components";
// import ButtonHome from "@/components/ButtonHome";
// import KeyBoardView from "@/components/KeyBoardView";
// import BackButton from "@/components/share/BackButton";
// import StepProgress from "@/components/share/StepProgress";
// import { HomeStackList } from "@/navigation/navigationType";
// import { RootState } from "@/redux/store";
// import { NativeStackScreenProps } from "@react-navigation/native-stack";
// import React, { useState } from "react";
// import AntDesign from '@expo/vector-icons/AntDesign';
// import {
//   View,
//   StyleSheet,
//   Image,
//   TouchableOpacity,
//   TextInput,
//   ViewStyle,
// } from "react-native";
// import { RFValue } from "react-native-responsive-fontsize";
// import Toast from "react-native-toast-message";
// import { useDispatch, useSelector } from "react-redux";
// import { ParcelInDriver } from "../../../../../../services/parcel";
// import { resetForm, updateField } from "@/redux/slices/parcelSlice";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { Icon } from "iconsax-react-native";

// type Props = NativeStackScreenProps<HomeStackList>;
// const ParcelInDriverUnRegisteredPreviewScreen = ({ navigation }: Props) => {
//   const formData = useSelector((state: RootState) => state.parcel);
//   const dispatch = useDispatch();
//   const [loading, setLoading] = useState(false);
//   // Sender Phone Edit States
//   const [editingSenderPhone, setEditingSenderPhone] = useState(false);
//   const [editedSenderPhone, setEditedSenderPhone] = useState(
//     formData.senderPhoneNumber
//   );
//   // Receiver Phone Edit States
//   const [editingReceiverPhone, setEditingReceiverPhone] = useState(false);
//   const [editedReceiverPhone, setEditedReceiverPhone] = useState(
//     formData.receiverPhoneNumber
//   );

//   // Driver Phone Edit States
//   const [editingDriverPhone, setEditingDriverPhone] = useState(false);
//   const [editedDriverPhone, setEditedDriverPhone] = useState(
//     formData.driverNumber
//   );

//   const HandleContinue = async () => {
//     setLoading(true);
//     try {
//       const payload = {
//         sender: {
//           phone: formData.senderPhoneNumber?.replace(/-/g, ""),
//         },
//         receiver: {
//           phone: formData.receiverPhoneNumber?.replace(/-/g, ""),
//         },
//         park: {
//           source: formData.departureState,
//           destination: formData.deliveryMotorPark,
//         },
//         parcel: {
//           type: formData.parcelType,
//           value: formData.parcelValue
//             ? String(Number(formData.parcelValue))
//             : "",
//           chargesPayable: formData.chargesPayable
//             ? String(Number(formData.chargesPayable))
//             : "",
//           chargesPaidBy: formData.chargesPayBy,
//           handlingFee: String(
//             formData.handlingFee ? Number(formData.handlingFee) : ""
//           ),
//           totalFee:
//             formData.parcelValue && formData.chargesPayable
//               ? String(
//                   Number(formData.parcelValue) + Number(formData.chargesPayable)
//                 )
//               : "",
//           description: formData.parcelDescription,
//           thumbnails: formData.parcelImages || [],
//         },
//         // driver: {
//         //   phone: formData.driverNumber?.replace(/-/g, ""),
//         //   name: formData.driverName,
//         // },
//         paymentOption: "bank",
//         status: "arrived",
//       };

//       const result = await ParcelInDriver(payload);
//       //(result, "result");
//       // ✅ Save to local storage
//       await AsyncStorage.setItem(
//         "parcelDetails",
//         JSON.stringify(result?.data?.details)
//       );
//       Toast.show({
//         type: "success",
//         text1: "Success",
//         text2: result?.data?.message || "Parcel Received!",
//       });

//       dispatch(resetForm()); // 🧼 clear form
//       navigation.navigate("PrintParcel");
//     } catch (error: any) {
//       console.error("Parcel submission error:", error);
//       Toast.show({
//         type: "error",
//         text1: "Submission Failed",
//         text2: error.message || "Something went wrong",
//       });
//     } finally {
//       setLoading(false);
//     }
//     //({ formData });
//   };

//   // Styles
//   const $bodyHeader: ViewStyle = {
//     padding: RFValue(16),
//     flexDirection: "column",
//     gap: 6,
//   };
//   const $buttonsContainer: ViewStyle = {
//     padding: RFValue(16),
//   };

//   return (
//     <CustomView style={{ paddingVertical: RFValue(10) }}>
//       {loading && <Spinner />}
//       <BackButton onClick={() => navigation.goBack()} />
//       <StepProgress step={2} totalSteps={2} />
//       {/* Body */}
//       <KeyBoardView padded={false}>
//         <View style={$bodyHeader}>
//           <Text font="SemiBold" size={18}>
//             Confirm Parcel Details
//           </Text>
//         </View>
//         <View
//           style={{
//             flexDirection: "row",
//             justifyContent: "space-between",
//             alignItems: "center",
//             paddingVertical: 6,
//             padding: RFValue(16),
//           }}
//         >
//           <Text size={14}>Status</Text>
//           <View
//             style={{ backgroundColor: "#FFF8E6", padding: 4, borderRadius: 8 }}
//           >
//             <Text color="#F79009"> In Transit</Text>
//           </View>
//         </View>
//         {/* Sender's Information */}
//         <View style={styles.sectionContainer}>
//           <Text style={styles.sectionHeader} font="SemiBold" size={14}>
//             Sender's Information
//           </Text>
//           <View style={styles.infoContainer}>
//             <View style={styles.infoRow}>
//               <Text style={styles.infoText}>Phone Number:</Text>
//               {editingSenderPhone ? (
//                 <TextInput
//                   style={styles.input}
//                   value={editedSenderPhone}
//                   onChangeText={setEditedSenderPhone}
//                   autoFocus
//                   onBlur={() => {
//                     dispatch(
//                       updateField({
//                         key: "senderPhoneNumber",
//                         value: editedSenderPhone,
//                       })
//                     );
//                     setEditingSenderPhone(false);
//                   }}
//                   onSubmitEditing={() => {
//                     dispatch(
//                       updateField({
//                         key: "senderPhoneNumber",
//                         value: editedSenderPhone,
//                       })
//                     );
//                     setEditingSenderPhone(false);
//                   }}
//                   keyboardType="phone-pad"
//                 />
//               ) : (
//                 <View style={styles.editableRow}>
//                   <Text style={styles.infoText}>
//                     {formData.senderPhoneNumber.replace(/-/g, "")}
//                   </Text>
//                   <TouchableOpacity
//                     onPress={() => {
//                       setEditedSenderPhone(formData.senderPhoneNumber);
//                       setEditingSenderPhone(true);
//                     }}
//                     style={styles.editButton}
//                   >
              
//                     <AntDesign name="edit" size={20} color="#4A90E2" />
//                   </TouchableOpacity>
//                 </View>
//               )}
//             </View>
//           </View>
//         </View>

//         {/* Receiver's Information */}
//         <View style={styles.sectionContainer}>
//           <Text style={styles.sectionHeader} font="SemiBold" size={14}>
//             Receiver's Information
//           </Text>
//           <View style={styles.infoContainer}>
//             <View style={styles.infoRow}>
//               <Text style={styles.infoText}>Phone Number:</Text>
//               {editingReceiverPhone ? (
//                 <TextInput
//                   style={styles.input}
//                   value={editedReceiverPhone}
//                   onChangeText={setEditedReceiverPhone}
//                   autoFocus
//                   onBlur={() => {
//                     dispatch(
//                       updateField({
//                         key: "receiverPhoneNumber",
//                         value: editedReceiverPhone,
//                       })
//                     );
//                     setEditingReceiverPhone(false);
//                   }}
//                   onSubmitEditing={() => {
//                     dispatch(
//                       updateField({
//                         key: "receiverPhoneNumber",
//                         value: editedReceiverPhone,
//                       })
//                     );
//                     setEditingReceiverPhone(false);
//                   }}
//                   keyboardType="phone-pad"
//                 />
//               ) : (
//                 <View style={styles.editableRow}>
//                   <Text style={styles.infoText}>
//                     {formData.receiverPhoneNumber.replace(/-/g, "")}
//                   </Text>
//                   <TouchableOpacity
//                     onPress={() => {
//                       setEditedReceiverPhone(formData.receiverPhoneNumber);
//                       setEditingReceiverPhone(true);
//                     }}
//                     style={styles.editButton}
//                   >
//                    <AntDesign name="edit" size={20} color="#4A90E2" />
//                   </TouchableOpacity>
//                 </View>
//               )}
//             </View>
//           </View>
//         </View>
//         {/* Park Detail */}
//         <View style={styles.sectionContainer}>
//           <Text style={styles.sectionHeader} font="SemiBold" size={14}>
//             Park Detail
//           </Text>
//           <View
//             style={{
//               backgroundColor: "white",
//               padding: RFValue(6),
//               borderRadius: 8,
//             }}
//           >
//             <View
//               style={{
//                 flexDirection: "row",
//                 alignItems: "center",
//                 justifyContent: "space-between",
//               }}
//             >
//               <Text style={styles.infoText}>Departure State:</Text>
//               <Text style={styles.infoText}> {formData.departureState}</Text>
//             </View>
//             <View
//               style={{
//                 flexDirection: "row",
//                 alignItems: "center",
//                 justifyContent: "space-between",
//               }}
//             >
//               <Text style={styles.infoText}>Destination Motor Park:</Text>
//               <Text style={styles.infoText}>{formData.deliveryMotorPark}</Text>
//             </View>
//           </View>
//         </View>

//         {/* Parcel Information */}
//         <View style={styles.sectionContainer}>
//           <Text style={styles.sectionHeader} font="SemiBold" size={14}>
//             Parcel Information
//           </Text>
//           <View
//             style={{
//               backgroundColor: "white",
//               padding: RFValue(6),
//               borderRadius: 8,
//             }}
//           >
//             <View
//               style={{
//                 flexDirection: "row",
//                 alignItems: "center",
//                 justifyContent: "space-between",
//               }}
//             >
//               <Text style={styles.infoText}>Charges Paid By:</Text>
//               <Text style={styles.infoText}>{formData.chargesPayBy}</Text>
//             </View>
//             <View
//               style={{
//                 flexDirection: "row",
//                 alignItems: "center",
//                 justifyContent: "space-between",
//               }}
//             >
//               <Text style={styles.infoText}>Parcel Type:</Text>
//               <Text style={styles.infoText}>{formData.parcelType}</Text>
//             </View>
//             <View
//               style={{
//                 flexDirection: "row",
//                 alignItems: "center",
//                 justifyContent: "space-between",
//               }}
//             >
//               <Text style={styles.infoText}>Parcel Worth:</Text>
//               <Text style={styles.infoText}>₦{formData.parcelValue}</Text>
//             </View>
//             <View
//               style={{
//                 flexDirection: "row",
//                 alignItems: "center",
//                 justifyContent: "space-between",
//                 borderBottomWidth: 1,
//                 borderBottomColor: "#E9EAEB",
//               }}
//             >
//               <Text style={styles.infoText}>Charges Payable:</Text>
//               <Text style={styles.infoText}>₦{formData.chargesPayable}</Text>
//             </View>
//             <View
//               style={{
//                 flexDirection: "row",
//                 alignItems: "center",
//                 justifyContent: "space-between",
//               }}
//             >
//               <Text style={styles.infoText}>Handling Fee:</Text>
//               <Text style={styles.infoText}>₦{formData.handlingFee}</Text>
//             </View>
//             <View
//               style={{
//                 flexDirection: "row",
//                 alignItems: "center",
//                 justifyContent: "space-between",
//               }}
//             >
//               <Text style={styles.infoText}>Total Paid:</Text>
//               <Text style={styles.infoText}>
//               ₦{formData.handlingFee && formData.chargesPayable
//                   ? String(
//                       Number(formData.handlingFee) +
//                         Number(formData.chargesPayable)
//                     )
//                   : ""}
//               </Text>
//             </View>
//           </View>
//         </View>

//         {/* Parcel Description */}
//         <View style={styles.sectionContainer}>
//           <Text style={styles.sectionHeader} font="SemiBold" size={14}>
//             Parcel Description
//           </Text>
//           <View
//             style={{
//               backgroundColor: "white",
//               padding: RFValue(6),
//               borderRadius: 8,
//             }}
//           >
//             <Text style={styles.descriptionText}>
//               {formData.parcelDescription}
//             </Text>
//           </View>
//         </View>

//         {formData.parcelImages &&
//         formData.parcelImages.filter((photo) => photo).length > 0 ? (
//           <View style={{ paddingVertical: RFValue(10), padding: RFValue(16) }}>
//             <Text style={styles.counter}>
//               {formData.parcelImages.filter((photo) => photo !== null).length}
//               /2 photos
//             </Text>
//             <View style={styles.photoGrid}>
//               {formData.parcelImages.map((photo, index) => (
//                 <TouchableOpacity key={index} style={styles.photoBox}>
//                   {photo ? (
//                     <Image
//                       source={{ uri:  `http://45.9.191.184:8001/parcel/v1.0/api/files?slugs=${photo}`  }}
//                       style={styles.photoPreview}
//                     />
//                   ) : (
//                     <View></View>
//                   )}
//                 </TouchableOpacity>
//               ))}
//             </View>
//           </View>
//         ) : (
//           <View></View>
//         )}
//         <View style={$buttonsContainer}>
//           <ButtonHome
//             onPress={HandleContinue}
//             title="Receive Parcel"
//             style={{ height: 55 }}
//             disabled={!formData.handlingFee}
//           />
//         </View>
//       </KeyBoardView>
//     </CustomView>
//   );
// };

// const styles = StyleSheet.create({
//   header: {
//     fontSize: RFValue(18),
//     fontWeight: "bold",
//     marginBottom: RFValue(16),
//     textAlign: "center",
//   },
//   sectionContainer: {
//     marginBottom: RFValue(10),
//     // paddingVertical: RFValue(12),
//     backgroundColor: "#FDFDFD",
//     borderRadius: RFValue(8),
//     padding: RFValue(16),
//   },
//   sectionHeader: {
//     paddingVertical: RFValue(8),
//     borderBottomWidth: 1,
//     borderBottomColor: "#E9EAEB",
//     marginBottom: RFValue(6),
//     color: "#414651",
//   },
//   infoText: {
//     fontSize: RFValue(13),
//     marginBottom: RFValue(4),
//     color: "#717680",
//   },
//   descriptionText: {
//     fontSize: RFValue(14),
//     color: "#717680",
//   },
//   imageContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: RFValue(16),
//   },
//   image: {
//     width: RFValue(70),
//     height: RFValue(70),
//     borderRadius: RFValue(8),
//   },
//   button: {
//     backgroundColor: "#4CAF50",
//     paddingVertical: RFValue(12),
//     borderRadius: RFValue(8),
//     alignItems: "center",
//   },
//   buttonText: {
//     fontSize: RFValue(16),
//     color: "#fff",
//     fontWeight: "bold",
//   },
//   photoGrid: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     justifyContent: "space-between",
//     marginBottom: 20,
//   },
//   photoBox: {
//     width: "47%",
//     aspectRatio: 1,
//     backgroundColor: "#F5F5F5",
//     justifyContent: "center",
//     alignItems: "center",
//     marginVertical: 20,
//     borderRadius: 10,
//     borderColor: "#ddd",
//   },
//   photoPreview: {
//     width: "100%",
//     height: "100%",
//     borderRadius: 8,
//   },
//   counter: {
//     fontSize: 14,
//     color: "gray",
//     marginBottom: 20,
//   },
//   // editing styles
//   infoContainer: {
//     backgroundColor: "white",
//     padding: RFValue(6),
//     borderRadius: 8,
//   },
//   infoRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//   },
//   editableRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   editButton: {
//     marginLeft: RFValue(8),
//   },
//   input: {
//     fontSize: RFValue(12),
//     color: "#717680",
//     padding: 4,
//     borderBottomWidth: 1,
//     borderBottomColor: "#E9EAEB",
//     textAlign: "right",
//     flex: 1,
//   },
// });

// export default ParcelInDriverUnRegisteredPreviewScreen;
