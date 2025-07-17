// import {
//   Image,
//   StyleSheet,
//   TouchableOpacity,
//   View,
//   ViewStyle,
// } from "react-native";
// import React, { useState } from "react";
// import { RFValue } from "react-native-responsive-fontsize";
// import { CustomView, Input, Modal, Spinner, Text } from "@/components";
// import StepProgress from "@/components/share/StepProgress";
// import KeyBoardView from "@/components/KeyBoardView";
// import { useDispatch, useSelector } from "react-redux";
// import { RootState } from "@/redux/store";
// import Toast from "react-native-toast-message";
// import { NativeStackScreenProps } from "@react-navigation/native-stack";
// import { HomeStackList } from "@/navigation/navigationType";
// import { updateField } from "@/redux/slices/parcelSlice";
// import ButtonHome from "@/components/ButtonHome";
// import BackButton from "@/components/share/BackButton";
// import SelectInput from "@/components/SelectInput";
// import TextAreaInput from "@/components/TextAreaInput";
// import ShootButton from "@/components/svg/ShootButton";
// import { Ionicons } from "@expo/vector-icons";
// import PaymentOption from "@/components/PaymentOption";
// import ConfirmPaymentModal from "@/components/ComfirmPaymentModal";
// import ParcelPhotoModal from "@/components/ParcelPhotoModal";

// type Props = NativeStackScreenProps<HomeStackList>;
// const ScreenTwo = ({ navigation }: Props) => {
//   // const [loading, setLoading] = useState(false);
//   const formData = useSelector((state: RootState) => state.parcel);
//   const dispatch = useDispatch();
//   const [selectedOption, setSelectedOption] = useState<string>("Online");
//   const [selectedPaymentAnswer, setSelectedPaymentAnswer] = useState<
//     string | null
//   >(null);
//   const [modalVisible, setModalVisible] = useState(false);

//   const HandleContinue = () => {
//     navigation.navigate("ScreenOneParcelInSenderPreview");
//     //({ formData });
//   };
//   //   //({formData});

//   // Styles
//   const $bodyHeader: ViewStyle = {
//     padding: RFValue(16),
//     flexDirection: "column",
//     gap: 6,
//   };
//   const $cardHeader: ViewStyle = {
//     padding: RFValue(16),
//     backgroundColor: "#FDFDFD",
//   };
//   const $buttonsContainer: ViewStyle = {
//     paddingVertical: RFValue(16),
//   };

//   const [photoModalVisible, setPhotoModalVisible] = useState(false);

//   const handleSave = (photos: string[]) => {
//     dispatch(updateField({ key: "parcelImages", value: photos }));
//     //("Captured Photos:", photos);
//   };

//   return (
//     <CustomView style={{ paddingVertical: RFValue(10) }}>
//       {modalVisible && (
//         <ConfirmPaymentModal
//           selectedOption={selectedPaymentAnswer}
//           setModalVisible={setModalVisible}
//           setSelectedOption={setSelectedPaymentAnswer}
//           modalVisible={modalVisible}
//         />
//       )}
//       {photoModalVisible && (
//         <ParcelPhotoModal
//           visible={photoModalVisible}
//           onClose={() => setPhotoModalVisible(false)}
//           onSave={handleSave}
//         />
//       )}
//       {/* {loading && <Spinner />} */}

//       <BackButton onClick={() => navigation.goBack()} />
//       <StepProgress step={2} totalSteps={3} />
//       {/* Body */}
//       <KeyBoardView padded={false}>
//         <View style={$bodyHeader}>
//           <Text font="SemiBold" size={18}>
//             Parcel In - Sender
//           </Text>
//         </View>
//         <View style={$cardHeader}>
//           <Text size={18} style={{ paddingTop: 15, paddingBottom: 10 }}>
//             Parcel Information
//           </Text>
//           <Input
//             label="Parcel Type"
//             placeholder="Enter parcel type"
//             placeholderTextColor="#B8C2CC"
//             value={formData.parcelType}
//             onChangeText={(value) =>
//               dispatch(updateField({ key: "parcelType", value }))
//             }
//             keyboardType="default"
//           />
//           <Input
//             label="Parcel Value (₦)"
//             placeholder="Enter parcel worth"
//             placeholderTextColor="#B8C2CC"
//             value={formData.parcelValue}
//             onChangeText={(value) =>
//               dispatch(updateField({ key: "parcelValue", value }))
//             }
//             keyboardType="number-pad"
//           />

//           <Input
//             label="Charges Payable (₦)"
//             placeholder="Enter amount charged"
//             placeholderTextColor="#B8C2CC"
//             value={formData.chargesPayable}
//             onChangeText={(value) =>
//               dispatch(updateField({ key: "chargesPayable", value }))
//             }
//             keyboardType="number-pad"
//           />
//           <Input
//             label="Handling Fee (₦)"
//             placeholder="Enter handling fee"
//             placeholderTextColor="#B8C2CC"
//             value={formData.handlingFee}
//             onChangeText={(value) =>
//               dispatch(updateField({ key: "handlingFee", value }))
//             }
//             keyboardType="number-pad"
//           />

//           <View style={styles.container}>
//             {/* Icon and Label */}
//             <View style={styles.infoContainer}>
//               <Ionicons
//                 name="information-circle-outline"
//                 size={RFValue(20)}
//                 color="#717680"
//               />
//               <Text style={styles.label}>Total Fee</Text>
//             </View>
//             {/* Amount */}
//             <Text style={styles.amount}>
//             {formData.handlingFee && formData.chargesPayable
//               ? String(
//                   Number(formData.handlingFee) + Number(formData.chargesPayable)
//                 )
//               : ""}
//             </Text>
//           </View>
//           <SelectInput
//             label="Charges to be paid by?"
//             data={["sender", "receiver"]}
//             placeholder="Select option"
//             onSelect={(value) =>
//               dispatch(updateField({ key: "chargesPayBy", value }))
//             }
//             // showSearch={true}
//           />
//           {formData.chargesPayBy === "sender" && (
//             <View style={{ paddingBottom: 10 }}>
//               {selectedPaymentAnswer == "Yes" ? (
//                 <TouchableOpacity style={styles.confirmButton}>
//                   <Text style={styles.confirmButtonText}>
//                     Payment Confirmed
//                   </Text>
//                 </TouchableOpacity>
//               ) : (
//                 <PaymentOption
//                   selectedOption={selectedOption}
//                   setSelectedOption={setSelectedOption}
//                   onPress={() => setModalVisible(true)}
//                 />
//               )}
//             </View>
//           )}
//           <TextAreaInput
//             label="Parcel Description(Optional)"
//             placeholder="Enter a description..."
//             placeholderTextColor="#B8C2CC"
//             value={formData.parcelDescription}
//             onChangeText={(value) =>
//               dispatch(updateField({ key: "parcelDescription", value }))
//             }
//             keyboardType="default"
//           />

//           <Text size={18} style={{ paddingTop: 15, paddingBottom: 10 }}>
//             Take photos of the Parcel
//           </Text>

//           <View style={$buttonsContainer}>
//             <ButtonHome
//               onPress={() => setPhotoModalVisible(true)}
//               title="Take Photo"
//               style={{ height: 55 }}
//               disabled={!formData}
//               backgroundColor="#E6FFDB"
//               buttonIcon={<ShootButton />}
//             />
//           </View>

//           {formData.parcelImages &&
//           formData.parcelImages.filter((photo) => photo).length > 0 ? (
//             <View style={{ paddingVertical: RFValue(10) }}>
//               <Text style={styles.counter}>
//                 {formData.parcelImages.filter((photo) => photo !== null).length}
//                 /2 photos
//               </Text>
//               <View style={styles.photoGrid}>
//                 {formData.parcelImages.map((photo, index) => (
//                   <TouchableOpacity key={index} style={styles.photoBox}>
//                     {photo ? (
//                       <Image
//                         source={{ uri: `http://45.9.191.184:8001/parcel/v1.0/api/files?slugs=${photo}` }}
//                         style={styles.photoPreview}
//                       />
//                     ) : (
//                       <View></View>
//                     )}
//                   </TouchableOpacity>
//                 ))}
//               </View>
//             </View>
//           ) : (
//             <View></View>
//           )}
//           <View style={$buttonsContainer}>
//             <ButtonHome
//               onPress={HandleContinue}
//               title="Next"
//               style={{ height: 55 }}
//               disabled={!formData.parcelType}
//             />
//           </View>
//         </View>
//       </KeyBoardView>
//     </CustomView>
//   );
// };

// export default ScreenTwo;

// const styles = StyleSheet.create({
//   container: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     backgroundColor: "#F7F9FC",
//     padding: RFValue(12),
//     borderRadius: RFValue(8),
//     borderColor: "#E6E6E6",
//     borderWidth: 1,
//     marginTop: RFValue(2),
//     marginBottom: RFValue(10),
//   },
//   infoContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   label: {
//     marginLeft: RFValue(8),
//     fontSize: RFValue(14),
//     color: "#717680",
//     fontFamily: "System", // You can replace with custom font if needed
//   },
//   amount: {
//     fontSize: RFValue(14),
//     fontWeight: "600",
//     color: "#000",
//   },
//   confirmButton: {
//     backgroundColor: "#FAFAFA",
//     borderRadius: RFValue(8),
//     paddingVertical: RFValue(12),
//     alignItems: "center",
//   },
//   confirmButtonText: {
//     fontSize: RFValue(14),
//     fontWeight: "400",
//     color: "#000",
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: "bold",
//     marginBottom: 10,
//   },
//   subtitle: {
//     fontSize: 14,
//     color: "gray",
//     marginBottom: 10,
//   },
//   counter: {
//     fontSize: 14,
//     color: "gray",
//     marginBottom: 20,
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
// });
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import React, { useState } from "react";
import { RFValue } from "react-native-responsive-fontsize";
import { CustomView, Input, Text } from "@/components";
import StepProgress from "@/components/share/StepProgress";
import KeyBoardView from "@/components/KeyBoardView";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { HomeStackList } from "@/navigation/navigationType";
import { addParcel, removeParcel, setCurrentParcelIndex, updateParcelField, updateParcelImages } from "@/redux/slices/parcelVariationSlice";
import ButtonHome from "@/components/ButtonHome";
import BackButton from "@/components/share/BackButton";
import SelectInput from "@/components/SelectInput";
import TextAreaInput from "@/components/TextAreaInput";
import { Ionicons } from "@expo/vector-icons";
import PaymentOption from "@/components/PaymentOption";
import ConfirmPaymentModal from "@/components/ComfirmPaymentModal";
import ParcelPhotoModal from "@/components/ParcelPhotoModal";
import ShootButton from "@/components/svg/ShootButton";

type Props = NativeStackScreenProps<HomeStackList>;
const ScreenTwo = ({ navigation }: Props) => {
  const { parcels, currentParcelIndex } = useSelector((state: RootState) => state.parcelVariation);
  const currentParcel = parcels[currentParcelIndex];
  const dispatch = useDispatch();

  const [selectedOption, setSelectedOption] = useState<string>("Online");
  const [selectedPaymentAnswer, setSelectedPaymentAnswer] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [photoModalVisible, setPhotoModalVisible] = useState(false);

  const handleSelectParcel = (index: number) => {
    dispatch(setCurrentParcelIndex(index));
  };

  const handleAddParcel = () => {
    dispatch(addParcel());
    dispatch(setCurrentParcelIndex(parcels.length));
  };

  const handleDeleteParcel = (index: number) => {
    if (index > 0) {
      dispatch(removeParcel(index));
      if (currentParcelIndex >= index) {
        dispatch(setCurrentParcelIndex(Math.max(0, currentParcelIndex - 1)));
      }
    }
  };

  const handleSave = (photos: string[]) => {
    dispatch(updateParcelImages({ 
      index: currentParcelIndex, 
      images: photos 
    }));
  };

  const HandleContinue = () => {
    navigation.navigate("ScreenOneParcelInSenderPreview");
  };

  // Styles
  const $bodyHeader: ViewStyle = {
    padding: RFValue(16),
    flexDirection: "column",
    gap: 6,
  };
  const $cardHeader: ViewStyle = {
    padding: RFValue(16),
    backgroundColor: "#FDFDFD",
  };
  const $buttonsContainer: ViewStyle = {
    paddingVertical: RFValue(16),
  };

  return (
    <CustomView style={{ paddingVertical: RFValue(10) }}>
      {modalVisible && (
        <ConfirmPaymentModal
          selectedOption={selectedPaymentAnswer}
          setModalVisible={setModalVisible}
          setSelectedOption={setSelectedPaymentAnswer}
          modalVisible={modalVisible}
        />
      )}
      {photoModalVisible && (
        <ParcelPhotoModal
          visible={photoModalVisible}
          onClose={() => setPhotoModalVisible(false)}
          onSave={handleSave}
        />
      )}

      <BackButton onClick={() => navigation.goBack()} />
      <StepProgress step={2} totalSteps={3} />

      {/* Parcel Navigation */}
      <View style={styles.parcelNavContainer}>
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

        <View style={styles.currentParcelIndicator}>
          <Text font="SemiBold" size={16} style={styles.currentParcelText}>
            Parcel {currentParcelIndex + 1} of {parcels.length}
          </Text>
          {currentParcelIndex > 0 && (
            <TouchableOpacity 
              onPress={() => handleDeleteParcel(currentParcelIndex)}
              style={styles.deleteButton}
            >
              <Ionicons name="trash-outline" size={18} color="#FF3B30" />
            </TouchableOpacity>
          )}
        </View>

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
            <TouchableOpacity
              onPress={handleAddParcel}
              style={styles.navButton}
            >
              <Text style={styles.navButtonText}>Add</Text>
              <Ionicons name="add" size={20} color="white" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Body */}
      <KeyBoardView padded={false}>
        <View style={$bodyHeader}>
          <Text font="SemiBold" size={18}>
            Parcel In - Sender
          </Text>
        </View>
        <View style={$cardHeader}>
          <Text size={18} style={{ paddingTop: 15, paddingBottom: 10 }}>
            Parcel Information
          </Text>
          
          <Input
            label="Parcel Type"
            placeholder="Enter parcel type"
            placeholderTextColor="#B8C2CC"
            value={currentParcel.parcelType || ''}
            onChangeText={(value) =>
              dispatch(updateParcelField({
                index: currentParcelIndex,
                key: "parcelType",
                value
              }))
            }
            keyboardType="default"
          />
          
          <Input
            label="Parcel Value (₦)"
            placeholder="Enter parcel worth"
            placeholderTextColor="#B8C2CC"
            value={currentParcel.parcelValue || ''}
            onChangeText={(value) =>
              dispatch(updateParcelField({
                index: currentParcelIndex,
                key: "parcelValue",
                value
              }))
            }
            keyboardType="number-pad"
          />

          <Input
            label="Charges Payable (₦)"
            placeholder="Enter amount charged"
            placeholderTextColor="#B8C2CC"
            value={currentParcel.chargesPayable || ''}
            onChangeText={(value) =>
              dispatch(updateParcelField({
                index: currentParcelIndex,
                key: "chargesPayable",
                value
              }))
            }
            keyboardType="number-pad"
          />
          
          <Input
            label="Handling Fee (₦)"
            placeholder="Enter handling fee"
            placeholderTextColor="#B8C2CC"
            value={currentParcel.handlingFee || ''}
            onChangeText={(value) =>
              dispatch(updateParcelField({
                index: currentParcelIndex,
                key: "handlingFee",
                value
              }))
            }
            keyboardType="number-pad"
          />

          <View style={styles.container}>
            <View style={styles.infoContainer}>
              <Ionicons
                name="information-circle-outline"
                size={RFValue(20)}
                color="#717680"
              />
              <Text style={styles.label}>Total Fee</Text>
            </View>
            <Text style={styles.amount}>
              {currentParcel.handlingFee && currentParcel.chargesPayable
                ? String(
                    Number(currentParcel.handlingFee) + 
                    Number(currentParcel.chargesPayable))
                : ""}
            </Text>
          </View>

          <SelectInput
            label="Charges to be paid by?"
            data={["sender", "receiver"]}
            placeholder="Select option"
            onSelect={(value) =>
              dispatch(updateParcelField({
                index: currentParcelIndex,
                key: "chargesPayBy",
                value
              }))
            }
          />

          {currentParcel.chargesPayBy === "sender" && (
            <View style={{ paddingBottom: 10 }}>
              {selectedPaymentAnswer === "Yes" ? (
                <TouchableOpacity style={styles.confirmButton}>
                  <Text style={styles.confirmButtonText}>
                    Payment Confirmed
                  </Text>
                </TouchableOpacity>
              ) : (
                <PaymentOption
                  selectedOption={selectedOption}
                  setSelectedOption={setSelectedOption}
                  onPress={() => setModalVisible(true)}
                />
              )}
            </View>
          )}

          <TextAreaInput
            label="Parcel Description (Optional)"
            placeholder="Enter a description..."
            placeholderTextColor="#B8C2CC"
            value={currentParcel.parcelDescription || ''}
            onChangeText={(value) =>
              dispatch(updateParcelField({
                index: currentParcelIndex,
                key: "parcelDescription",
                value
              }))
            }
            keyboardType="default"
          />

          <Text size={18} style={{ paddingTop: 15, paddingBottom: 10 }}>
            Take photos of the Parcel
          </Text>

          <View style={$buttonsContainer}>
            <ButtonHome
              onPress={() => setPhotoModalVisible(true)}
              title="Take Photo"
              style={{ height: 55 }}
              backgroundColor="#E6FFDB"
              buttonIcon={<ShootButton />}
            />
          </View>

          {currentParcel.parcelImages?.filter(photo => photo).length > 0 ? (
            <View style={{ paddingVertical: RFValue(10) }}>
              <Text style={styles.counter}>
                {currentParcel.parcelImages.filter(photo => photo).length}
                /2 photos
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
          ) : null}

          <View style={$buttonsContainer}>
            <ButtonHome
              onPress={HandleContinue}
              title="Next"
              style={{ height: 55 }}
              disabled={!currentParcel.parcelType}
            />
          </View>
        </View>
      </KeyBoardView>
    </CustomView>
  );
};

const styles = StyleSheet.create({
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
    marginRight: RFValue(8),
  },
  deleteButton: {
    padding: RFValue(4),
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F7F9FC",
    padding: RFValue(12),
    borderRadius: RFValue(8),
    borderColor: "#E6E6E6",
    borderWidth: 1,
    marginTop: RFValue(2),
    marginBottom: RFValue(10),
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  label: {
    marginLeft: RFValue(8),
    fontSize: RFValue(14),
    color: "#717680",
  },
  amount: {
    fontSize: RFValue(14),
    fontWeight: "600",
    color: "#000",
  },
  confirmButton: {
    backgroundColor: "#FAFAFA",
    borderRadius: RFValue(8),
    paddingVertical: RFValue(12),
    alignItems: "center",
  },
  confirmButtonText: {
    fontSize: RFValue(14),
    fontWeight: "400",
    color: "#000",
  },
  counter: {
    fontSize: RFValue(14),
    color: "gray",
    marginBottom: RFValue(20),
  },
  photoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: RFValue(20),
  },
  photoBox: {
    width: "47%",
    aspectRatio: 1,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: RFValue(10),
    borderRadius: RFValue(10),
    borderColor: "#ddd",
  },
  photoPreview: {
    width: "100%",
    height: "100%",
    borderRadius: RFValue(8),
  },
});

export default ScreenTwo;