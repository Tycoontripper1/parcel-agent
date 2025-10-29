import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { RFValue } from "react-native-responsive-fontsize";
import { CustomView, Input, Text } from "@/components";
import StepProgress from "@/components/share/StepProgress";
import KeyBoardView from "@/components/KeyBoardView";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { HomeStackList } from "@/navigation/navigationType";
import { 
  updateField, 
  addParcel, 
  updateParcelField, 
  updateParcelImages,
  removeParcel,
  setCurrentParcelIndex
} from "@/redux/slices/parcelVariationSlice";
import ButtonHome from "@/components/ButtonHome";
import BackButton from "@/components/share/BackButton";
import SelectInput from "@/components/SelectInput";
import { Ionicons } from "@expo/vector-icons";
import PaymentOption from "@/components/PaymentOption";
import TextAreaInput from "@/components/TextAreaInput";
import ShootButton from "@/components/svg/ShootButton";
import ConfirmPaymentModal from "@/components/ComfirmPaymentModal";
import ParcelPhotoModal from "@/components/ParcelPhotoModal";
import { getLocations } from "../../../../../../services/parcel";
import { getUser } from "../../../../../../services/auth";

type Props = NativeStackScreenProps<HomeStackList>;

const ParcelInDriverUnRegistered = ({ navigation }: Props) => {
  const dispatch = useDispatch();
  const { parcels, currentParcelIndex } = useSelector((state: RootState) => state.parcelVariation);
  const currentParcel = parcels[currentParcelIndex];
  
  const [selectedOption, setSelectedOption] = useState<string>("Online");
  const [selectedPaymentAnswer, setSelectedPaymentAnswer] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [photoModalVisible, setPhotoModalVisible] = useState(false);
  
  // Error states for current parcel
  const [senderPhoneError, setSenderPhoneError] = useState("");
  const [receiverPhoneError, setReceiverPhoneError] = useState("");
  const [departureStateError, setDepartureStateError] = useState("");
  const [deliveryMotorParkError, setDeliveryMotorParkError] = useState("");
  const [parcelValueError, setParcelValueError] = useState("");
  const [handlingFeeError, setHandlingFeeError] = useState("");
  const [chargesPayableError, setChargesPayableError] = useState("");
  const [chargesPayByError, setChargesPayByError] = useState("");
  
  const [agentParkLocation, setAgentParkLocation] = useState("");

  const formatPhoneNumber11 = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    if (digits.length <= 4) return digits;
    if (digits.length <= 7) return `${digits.slice(0, 4)}-${digits.slice(4)}`;
    return `${digits.slice(0, 4)}-${digits.slice(4, 7)}-${digits.slice(7)}`;
  };

  useEffect(() => {
    const fetchUser = async () => {
      const userDetails = await getUser();
      setAgentParkLocation(userDetails?.parkLocation || "");
      //(userDetails.parkLocation, "agent park")
    };
    fetchUser();
  }, []);

  type Location = {
    id: string;
    state_id: string;
    location: string;
    address: string;
    park_type: string;
    status: string;
    createdAt: string;
    updatedAt: string;
  };

  const [stateRows, setStateRows] = useState<any[]>([]);
  
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const result = await getLocations();
        setStateRows(result?.data?.details.rows || []);
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };
    fetchLocations();
  }, []);

  const statesWithLocations: Record<string, Location[]> = stateRows.reduce(
    (acc, curr) => {
      acc[curr.name] = curr.locations;
      return acc;
    },
    {} as Record<string, Location[]>
  );

  // State for location selection
  const [selectedFromState, setSelectedFromState] = useState<keyof typeof statesWithLocations | null>(null);
  const [fromLocations, setFromLocations] = useState<Location[]>([]);
  const [selectedFromLocation, setSelectedFromLocation] = useState<string | null>(null);
  const [selectedToState, setSelectedToState] = useState<keyof typeof statesWithLocations | null>(null);
  const [toLocations, setToLocations] = useState<Location[]>([]);
  const [selectedToLocation, setSelectedToLocation] = useState<string | null>(null);

  // Update departure state when location changes
  useEffect(() => {
    if (selectedFromState && selectedFromLocation) {
      const combined = `${selectedFromState}, ${selectedFromLocation}`;
      dispatch(updateParcelField({ 
        index: currentParcelIndex, 
        key: "departureState", 
        value: combined 
      }));
    }
  }, [selectedFromState, selectedFromLocation, dispatch, currentParcelIndex]);

  // Update delivery motor park when location changes
  useEffect(() => {
    if (agentParkLocation && agentParkLocation.trim()) {
      dispatch(updateParcelField({ 
        index: currentParcelIndex, 
        key: "deliveryMotorPark", 
        value: agentParkLocation 
      }));
    } else if (selectedToState && selectedToLocation) {
      const combined = `${selectedToState}, ${selectedToLocation}`;
      dispatch(updateParcelField({ 
        index: currentParcelIndex, 
        key: "deliveryMotorPark", 
        value: combined 
      }));
    }
  }, [agentParkLocation, selectedToState, selectedToLocation, dispatch, currentParcelIndex]);

  const handleValidation = () => {
    let isValid = true;

    const cleanSenderPhone = currentParcel.senderPhoneNumber.replace(/\D/g, "");
    const cleanReceiverPhone = currentParcel.receiverPhoneNumber.replace(/\D/g, "");

    // Sender Phone
    if (!cleanSenderPhone) {
      setSenderPhoneError("Phone Number is required.");
      isValid = false;
    } else if (cleanSenderPhone.length !== 11) {
      setSenderPhoneError("Please enter a valid 11-digit mobile number.");
      isValid = false;
    } else {
      setSenderPhoneError("");
    }

    // Receiver Phone
    if (!cleanReceiverPhone) {
      setReceiverPhoneError("Phone Number is required.");
      isValid = false;
    } else if (cleanReceiverPhone.length !== 11) {
      setReceiverPhoneError("Please enter a valid 11-digit mobile number.");
      isValid = false;
    } else {
      setReceiverPhoneError("");
    }

    // Departure State
    if (!currentParcel.departureState.trim()) {
      setDepartureStateError("Departure state is required.");
      isValid = false;
    } else {
      setDepartureStateError("");
    }

    // Delivery Motor Park
    if (!currentParcel.deliveryMotorPark.trim()) {
      setDeliveryMotorParkError("Motor park is required.");
      isValid = false;
    } else {
      setDeliveryMotorParkError("");
    }

    // Parcel Value
    if (!currentParcel.parcelValue.trim()) {
      setParcelValueError("Parcel value is required.");
      isValid = false;
    } else {
      setParcelValueError("");
    }

    // Handling Fee
    if (!currentParcel.handlingFee.trim()) {
      setHandlingFeeError("Handling fee is required.");
      isValid = false;
    } else {
      setHandlingFeeError("");
    }

    // Charges Payable
    if (!currentParcel.chargesPayable.trim()) {
      setChargesPayableError("Charges payable is required.");
      isValid = false;
    } else {
      setChargesPayableError("");
    }

    // Charges Pay By
    if (!currentParcel.chargesPayBy.trim()) {
      setChargesPayByError("Please select who will pay.");
      isValid = false;
    } else {
      setChargesPayByError("");
    }

    return isValid;
  };

  const handleSave = (photos: string[]) => {
    dispatch(updateParcelImages({ 
      index: currentParcelIndex, 
      images: photos 
    }));
  };

  const handleAddParcel = () => {
    dispatch(addParcel());
    dispatch(setCurrentParcelIndex(parcels.length));
  };

  const handleDeleteParcel = (index: number) => {
    if (index > 0) {
      dispatch(removeParcel(index));
    }
  };

  const handleSelectParcel = (index: number) => {
    dispatch(setCurrentParcelIndex(index));
  };

  const HandleContinue = () => {
    if (!handleValidation()) {
      return;
    }
    navigation.navigate("ParcelInDriverUnRegisteredPreview");
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
      <StepProgress step={1} totalSteps={2} />
      
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
        <Text style={styles.navButtonText}>Prev</Text>
      </TouchableOpacity>
    ) : (
      <View style={styles.navButtonPlaceholder} />
    )}
  </View>

  {/* Center - Current Parcel Indicator */}
  <View style={styles.currentParcelIndicator}>
    <Text font="SemiBold" size={12} style={styles.currentParcelText}>
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

  {/* Right Side - Next or Add Button */}
  <View style={styles.navButtonContainer}>
    {currentParcelIndex < parcels.length - 1 ? (
      <TouchableOpacity 
        onPress={() => handleSelectParcel(currentParcelIndex + 1)}
        style={styles.navButton}
      >
        <Text style={styles.navButtonText}>Next</Text>
        <Ionicons name="chevron-forward" size={16} color="white" />
      </TouchableOpacity>
    ) : parcels.length < 10 ? (
      <TouchableOpacity
        onPress={handleAddParcel}
        style={styles.navButton}
      >
        <Text style={styles.navButtonText}>Add</Text>
        <Ionicons name="add" size={20} color="white" />
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
            Parcel In - Driver
          </Text>
        </View>
        
        <View style={$cardHeader}>
          <Input
            label="Receiver Phone Number"
            placeholder="Enter phone number"
            placeholderTextColor="#B8C2CC"
            value={currentParcel.receiverPhoneNumber}
            onChangeText={(value) => {
              const cleaned = value.replace(/\D/g, "").slice(0, 11);
              dispatch(updateParcelField({
                index: currentParcelIndex,
                key: "receiverPhoneNumber",
                value: formatPhoneNumber11(cleaned),
              }));
              if (cleaned.length === 11) setReceiverPhoneError("");
            }}
            keyboardType="number-pad"
            errorMessage={receiverPhoneError}
          />
          
          <Input
            label="Sender Phone Number"
            placeholder="Enter phone number"
            placeholderTextColor="#B8C2CC"
            value={currentParcel.senderPhoneNumber}
            onChangeText={(value) => {
              const cleaned = value.replace(/\D/g, "").slice(0, 11);
              dispatch(updateParcelField({
                index: currentParcelIndex,
                key: "senderPhoneNumber",
                value: formatPhoneNumber11(cleaned),
              }));
              if (cleaned.length === 11) setSenderPhoneError("");
            }}
            keyboardType="number-pad"
            errorMessage={senderPhoneError}
          />
          
          <SelectInput
            label="Arriving From State"
            data={Object.keys(statesWithLocations)}
            placeholder="Select a state"
            onSelect={(state) => {
              setSelectedFromState(state as keyof typeof statesWithLocations);
              const locs = statesWithLocations[state as keyof typeof statesWithLocations] || [];
              setFromLocations(locs);
              setSelectedFromLocation(null);
            }}
          />

          {selectedFromState && (
            <SelectInput
              label="Arriving From Location/Motor park"
              data={fromLocations.map((loc) => loc.location)}
              placeholder="Select a dispatch location"
              onSelect={(locationName) => {
                const found = fromLocations.find((loc) => loc.location === locationName);
                setSelectedFromLocation(found ? found.location : null);
              }}
              showSearch={true}
            />
          )}
          
          {agentParkLocation ? (
            <Input
              label="Destination Motor Park"
              placeholder="Enter departure park"
              placeholderTextColor="#B8C2CC"
              value={agentParkLocation}
              onChangeText={(value) => {
                dispatch(updateParcelField({
                  index: currentParcelIndex,
                  key: "deliveryMotorPark",
                  value,
                }));
                if (value.trim()) {
                  setDepartureStateError("");
                }
              }}
              keyboardType="default"
              errorMessage={deliveryMotorParkError}
            />
          ) : (
            <>
              <SelectInput
                label="Arriving to State"
                data={Object.keys(statesWithLocations)}
                placeholder="Select a state"
                onSelect={(state) => {
                  const selectedState = state as keyof typeof statesWithLocations;
                  setSelectedToState(selectedState);
                  const locations = statesWithLocations[selectedState] || [];
                  setToLocations(locations);
                  setSelectedToLocation(null);
                }}
              />

              {selectedToState && (
                <SelectInput
                  label="Arriving to Location"
                  data={toLocations.map((loc) => loc.location)}
                  placeholder="Select a delivery location"
                  onSelect={(locationName) => {
                    const found = toLocations.find((loc) => loc.location === locationName);
                    setSelectedToLocation(found ? found.location : null);
                  }}
                />
              )}
            </>
          )}

          <Text size={18} style={{ paddingTop: 15, paddingBottom: 10 }}>
            Parcel Information
          </Text>

          <Input
            label="Parcel Type (Optional)"
            placeholder="Enter parcel type"
            placeholderTextColor="#B8C2CC"
            value={currentParcel.parcelType}
            onChangeText={(value) => {
              dispatch(updateParcelField({
                index: currentParcelIndex,
                key: "parcelType",
                value,
              }));
           
            }}
            keyboardType="default"
          
          />
          
          <Input
            label="Parcel Value (₦)"
            placeholder="Enter parcel worth"
            placeholderTextColor="#B8C2CC"
            value={currentParcel.parcelValue}
            onChangeText={(value) => {
              dispatch(updateParcelField({
                index: currentParcelIndex,
                key: "parcelValue",
                value,
              }));
              if (value.trim()) setParcelValueError("");
            }}
            keyboardType="number-pad"
            errorMessage={parcelValueError}
          />

          <Input
            label="Charges Payable (₦)"
            placeholder="Enter amount charged"
            placeholderTextColor="#B8C2CC"
            value={currentParcel.chargesPayable}
            onChangeText={(value) => {
              dispatch(updateParcelField({
                index: currentParcelIndex,
                key: "chargesPayable",
                value,
              }));
              if (value.trim()) setChargesPayableError("");
            }}
            keyboardType="number-pad"
            errorMessage={chargesPayableError}
          />

          <SelectInput
            label="Charges to be paid by?"
            data={["sender", "receiver"]}
            placeholder="Select option"
            onSelect={(value) => 
              dispatch(updateParcelField({
                index: currentParcelIndex,
                key: "chargesPayBy",
                value,
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
          
          <Input
            label="Handling Fee (₦)"
            placeholder="Enter handling fee"
            placeholderTextColor="#B8C2CC"
            value={currentParcel.handlingFee}
            onChangeText={(value) => {
              dispatch(updateParcelField({
                index: currentParcelIndex,
                key: "handlingFee",
                value,
              }));
              if (value.trim()) setHandlingFeeError("");
            }}
            keyboardType="number-pad"
            errorMessage={handlingFeeError}
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
          
          <TextAreaInput
            label="Parcel Description(Optional)"
            placeholder="Enter a description..."
            placeholderTextColor="#B8C2CC"
            value={currentParcel.parcelDescription}
            onChangeText={(value) =>
              dispatch(updateParcelField({
                index: currentParcelIndex,
                key: "parcelDescription",
                value,
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
              disabled={!currentParcel}
              backgroundColor="#E6FFDB"
              buttonIcon={<ShootButton />}
            />
          </View>

          {currentParcel.parcelImages && currentParcel.parcelImages.filter((photo:any) => photo).length > 0 ? (
            <View style={{ paddingVertical: RFValue(10) }}>
              <Text style={styles.counter}>
                {currentParcel.parcelImages.filter((photo:any) => photo !== null).length}
                /2 photos
              </Text>
              <View style={styles.photoGrid}>
                {currentParcel.parcelImages.map((photo:any, index:any) => (
                  <TouchableOpacity key={index} style={styles.photoBox}>
                    {photo ? (
                      <Image
                        source={{ uri: `https://api.parcelpointng.com:4001/parcel/v1.0/files?slugs=${photo}` }}
                        style={styles.photoPreview}
                      />
                    ) : (
                      <View></View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ) : (
            <View></View>
          )}
        </View>
        
        <View style={{paddingHorizontal: RFValue(16)}}>
          <TouchableOpacity
            onPress={handleAddParcel}
            style={styles.addButton}
          >
            <Text style={styles.addText}>+ Add Parcel</Text>
          </TouchableOpacity>
          
          <View style={$buttonsContainer}>
            <ButtonHome
              onPress={HandleContinue}
              title="Continue"
              style={{ height: 55 }}
            />
          </View>
        </View>
      </KeyBoardView>
    </CustomView>
  );
};

const styles = StyleSheet.create({
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
  addButton: {
    backgroundColor: "#DFF6DD",
    padding: RFValue(12),
    borderRadius: RFValue(6),
    alignItems: "center",
    marginTop: RFValue(10),
  },
  addText: {
    color: "#215B23",
    fontWeight: "600",
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  label: {
    marginLeft: RFValue(8),
    fontSize: RFValue(14),
    color: "#717680",
    fontFamily: "System",
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
    fontSize: 14,
    color: "gray",
    marginBottom: 20,
  },
  photoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  photoBox: {
    width: "47%",
    aspectRatio: 1,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
    borderRadius: 10,
    borderColor: "#ddd",
  },
  photoPreview: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  parcelTab: {
    paddingHorizontal: RFValue(16),
    paddingVertical: RFValue(8),
    backgroundColor: '#F5F5F5',
    borderRadius: RFValue(20),
    marginRight: RFValue(8),
    flexDirection: 'row',
    alignItems: 'center',
  },
  activeParcelTab: {
    backgroundColor: '#215B23',
  },
  parcelTabText: {
    color: '#333',
    fontWeight: '500',
  },
  activeParcelTabText: {
    color: '#FFF',
  },
  deleteText: {
    color: '#FF0000',
    fontWeight: 'bold',
  },
  addParcelTab: {
    paddingHorizontal: RFValue(16),
    paddingVertical: RFValue(8),
    backgroundColor: '#DFF6DD',
    borderRadius: RFValue(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  addParcelText: {
    color: '#215B23',
    fontWeight: '500',
  },
  // navigation
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
    gap: RFValue(2),
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
});

export default ParcelInDriverUnRegistered;



// import {
//   Image,
//   StyleSheet,
//   TouchableOpacity,
//   View,
//   ViewStyle,
// } from "react-native";
// import React, { useEffect, useState } from "react";
// import { RFValue } from "react-native-responsive-fontsize";
// import { CustomView, Input, Text } from "@/components";
// import StepProgress from "@/components/share/StepProgress";
// import KeyBoardView from "@/components/KeyBoardView";
// import { useDispatch, useSelector } from "react-redux";
// import { RootState } from "@/redux/store";
// import { NativeStackScreenProps } from "@react-navigation/native-stack";
// import { HomeStackList } from "@/navigation/navigationType";
// import { updateField } from "@/redux/slices/parcelSlice";
// import ButtonHome from "@/components/ButtonHome";
// import BackButton from "@/components/share/BackButton";
// import SelectInput from "@/components/SelectInput";
// import { Ionicons } from "@expo/vector-icons";
// import PaymentOption from "@/components/PaymentOption";
// import TextAreaInput from "@/components/TextAreaInput";
// import ShootButton from "@/components/svg/ShootButton";
// import ConfirmPaymentModal from "@/components/ComfirmPaymentModal";
// import ParcelPhotoModal from "@/components/ParcelPhotoModal";
// import { FormatPhoneNumber11 } from "@/components/FormatNumber";
// import { getLocations } from "../../../../../../services/parcel";
// import { getUser } from "../../../../../../services/auth";

// import { singleParcelInterface } from "@/utils/interface";
// type Props = NativeStackScreenProps<HomeStackList>;
// const ParcelInDriverUnRegistered = ({ navigation }: Props) => {
//   // const [loading, setLoading] = useState(false);
//   const formData = useSelector((state: RootState) => state.parcel);
//   const dispatch = useDispatch();
//   const [selectedOption, setSelectedOption] = useState<string>("Online");
//   const [selectedPaymentAnswer, setSelectedPaymentAnswer] = useState<
//     string | null
//   >(null);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [photoModalVisible, setPhotoModalVisible] = useState(false);
//   const [driverPhoneError, setDriverPhoneError] = useState("");
//   const [receiverPhoneError, setReceiverPhoneError] = useState("");
//   const [senderPhoneError, setSenderPhoneError] = useState("");
//   const [driverNameError, setDriverNameError] = useState("");
//   const [departureStateError, setDepartureStateError] = useState("");
//   const [deliveryMotorParkError, setDeliveryMotorParkError] = useState("");
//   const [parcelTypeError, setParcelTypeError] = useState("");
//   const [parcelValueError, setParcelValueError] = useState("");
//   const [handlingFeeError, setHandlingFeeError] = useState("");
//   const [chargesPayableError, setChargesPayableError] = useState("");
//   const [chargesPayByError, setChargesPayByError] = useState("");
//   const [agent, setAgent] = useState("");
//   const [agentParkLocation, setAgentParkLocation] = useState("");

//   const formatPhoneNumber11 = (value: string) => {
//     const digits = value.replace(/\D/g, "").slice(0, 11);
//     if (digits.length <= 4) return digits;
//     if (digits.length <= 7) return `${digits.slice(0, 4)}-${digits.slice(4)}`;
//     return `${digits.slice(0, 4)}-${digits.slice(4, 7)}-${digits.slice(7)}`;
//   };
//   useEffect(() => {
//     const fetchUser = async () => {
//       const userDetails = await getUser();
//       setAgentParkLocation(userDetails?.parkLocation);
//     };

//     fetchUser();
//   }, []);

//   type Location = {
//     id: string;
//     state_id: string;
//     location: string;
//     address: string;
//     park_type: string;
//     status: string;
//     createdAt: string;
//     updatedAt: string;
//   };

//   const [stateRows, setStateRows] = useState<any[]>([]);
//   // get all location and convert to array
//   useEffect(() => {
//     const fetchLocations = async () => {
//       try {
//         const result = await getLocations();
//         setStateRows(result?.data?.details.rows || []);
//       } catch (error) {
//         console.error("Error fetching locations:", error);
//       }
//     };

//     fetchLocations();
//   }, []);
//   const statesWithLocations: Record<string, Location[]> = stateRows.reduce(
//     (acc, curr) => {
//       acc[curr.name] = curr.locations;
//       return acc;
//     },
//     {} as Record<string, Location[]>
//   );
//   // Sending from state
//   const [selectedFromState, setSelectedFromState] = useState<
//     keyof typeof statesWithLocations | null
//   >(null);
//   const [fromLocations, setFromLocations] = useState<Location[]>([]);
//   const [selectedFromLocation, setSelectedFromLocation] = useState<
//     string | null
//   >(null);

//   // Sending to state
//   const [selectedToState, setSelectedToState] = useState<
//     keyof typeof statesWithLocations | null
//   >(null);
//   const [toLocations, setToLocations] = useState<Location[]>([]);
//   const [selectedToLocation, setSelectedToLocation] = useState<string | null>(
//     null
//   );

//   // useEffect for "sending from"
//   useEffect(() => {
//     if (selectedFromState && selectedFromLocation) {
//       const combined = `${selectedFromState}, ${selectedFromLocation}`;
//       dispatch(updateField({ key: "departureState", value: combined }));
//     }
//   }, [selectedFromState, selectedFromLocation, dispatch]);

//   // useEffect for "sending to"
//   useEffect(() => {
//     if (agentParkLocation && agentParkLocation.trim()) {
//       dispatch(
//         updateField({ key: "deliveryMotorPark", value: agentParkLocation })
//       );
//       // //("Sending Agent Park Location:", agentParkLocation);
//     } else if (selectedToState && selectedToLocation) {
//       const combined = `${selectedToState}, ${selectedToLocation}`;
//       dispatch(updateField({ key: "deliveryMotorPark", value: combined }));
//       // //("Sending To Combined:", combined);
//     }
//   }, [agentParkLocation, selectedToState, selectedToLocation, dispatch]);

//   const handleValidation = () => {
//     let isValid = true;

//     const cleanDriverNumber = formData.driverNumber.replace(/\D/g, "");
//     const cleanSenderPhone = formData.senderPhoneNumber.replace(/\D/g, "");
//     const cleanReceiverPhone = formData.receiverPhoneNumber.replace(/\D/g, "");

//     // Sender Phone
//     if (!cleanSenderPhone) {
//       setSenderPhoneError("Phone Number is required.");
//       isValid = false;
//     } else if (cleanSenderPhone.length !== 11) {
//       setSenderPhoneError("Please enter a valid 11-digit mobile number.");
//       isValid = false;
//     } else {
//       setSenderPhoneError("");
//     }

//     // Receiver Phone
//     if (!cleanReceiverPhone) {
//       setReceiverPhoneError("Phone Number is required.");
//       isValid = false;
//     } else if (cleanReceiverPhone.length !== 11) {
//       setReceiverPhoneError("Please enter a valid 11-digit mobile number.");
//       isValid = false;
//     } else {
//       setReceiverPhoneError("");
//     }

//     // Departure State
//     if (!formData.departureState.trim()) {
//       setDepartureStateError("Departure state is required.");
//       isValid = false;
//     } else {
//       setDepartureStateError("");
//     }

//     // Delivery Motor Park
//     if (!formData.deliveryMotorPark.trim()) {
//       setDeliveryMotorParkError("Motor park is required.");
//       isValid = false;
//     } else {
//       setDeliveryMotorParkError("");
//     }

//     // Parcel Type
//     if (!formData.parcelType.trim()) {
//       setParcelTypeError("Parcel type is required.");
//       isValid = false;
//     } else {
//       setParcelTypeError("");
//     }

//     // Parcel Value
//     if (!formData.parcelValue.trim()) {
//       setParcelValueError("Parcel value is required.");
//       isValid = false;
//     } else {
//       setParcelValueError("");
//     }

//     // Handling Fee
//     if (!formData.handlingFee.trim()) {
//       setHandlingFeeError("Handling fee is required.");
//       isValid = false;
//     } else {
//       setHandlingFeeError("");
//     }

//     // Charges Payable
//     if (!formData.chargesPayable.trim()) {
//       setChargesPayableError("Charges payable is required.");
//       isValid = false;
//     } else {
//       setChargesPayableError("");
//     }

//     // Charges Pay By
//     if (!formData.chargesPayBy.trim()) {
//       setChargesPayByError("Please select who will pay.");
//       isValid = false;
//     } else {
//       setChargesPayByError("");
//     }

//     return isValid;
//   };



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

//   const handleSave = (photos: string[]) => {
//     dispatch(updateField({ key: "parcelImages", value: photos }));
//     //("Captured Photos:", photos);
//   };


//   type Parcel = {
//     receiverPhoneNumber: string;
//     senderPhoneNumber: string;
//     fromState: string;
//     fromLocation: string;
//     deliveryMotorPark:string
//     parcelType:string,
//     parcelValue:string,
//     chargesPayable:string
//     chargesPayBy:string
//     handlingFee:string
//     parcelDescription:string
//     parcelImages:[],
//     departureState:string

//   };

//   type ParcelKey = keyof Parcel;

//   const [parcels, setParcels] = useState<Parcel[]>([
//     {
//       receiverPhoneNumber: "",
//       senderPhoneNumber: "",
//       fromState: "",
//       fromLocation: "",
//       deliveryMotorPark:"",
//        parcelType:"",
//     parcelValue:"",
//     chargesPayable:"",
//     chargesPayBy:"",
//     handlingFee:"",
//     parcelDescription:"",
//     parcelImages:[],
//     departureState:""

//     },
//   ]);
//   const handleAddParcel = () => {
//     setParcels([
//       ...parcels,
//       {
//         receiverPhoneNumber: "",
//         senderPhoneNumber: "",
//         fromState: "",
//         fromLocation: "",
//         deliveryMotorPark:"",
//       parcelType:"",
//     parcelValue:"",
//     chargesPayable:"",
//     chargesPayBy:"",
//     handlingFee:"",
//     parcelDescription:"",
//     parcelImages:[],
//         departureState:""

//       },
//     ]);
//   };
//   const handleChangeParcel = (index: number, key: ParcelKey, value: any) => {
//     const updated = [...parcels];
//     updated[index][key] = value;
//     setParcels(updated);
//   };

//   const handleDeleteParcel = (index: number) => {
//     if (index === 0) return;
//     setParcels(parcels.filter((_, i) => i !== index));
//   };
  
//   const HandleContinue = () => {
//     // if (!handleValidation()) {
//     //   return;
//     // }
//     // navigation.navigate("ParcelInDriverUnRegisteredPreview");
//      dispatch(updateField({ key: "parcels", value: parcels }));
//     //(parcels);
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
//       <StepProgress step={1} totalSteps={2} />
//       {/* Body */}
//       <KeyBoardView padded={false}>
//      {parcels.map((parcel,index) => (
//         <View key={index}>
//            <View
//               style={{
//                 flexDirection: "row",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//                 marginBottom:RFValue(10),
//                 paddingHorizontal:RFValue(16)
//               }}
//             >
//               <Text style={{ fontSize: RFValue(16), fontWeight: "bold" }}>
//                 Parcel {index + 1}
//               </Text>
//               {index > 0 && (
//                 <TouchableOpacity onPress={() => handleDeleteParcel(index)}>
//                   <Text style={{ color: "red", fontWeight: "600" }}>
//                     Delete
//                   </Text>
//                 </TouchableOpacity>
//               )}
//             </View>
//          <View style={$bodyHeader}>
//           <Text font="SemiBold" size={18}>
//             Parcel In - Driver
//           </Text>
//         </View>
//         <View style={$cardHeader}>
//           <Input
//             label=" Receiver Phone Number"
//             placeholder="Enter phone number"
//             placeholderTextColor="#B8C2CC"
//             value={parcel.receiverPhoneNumber}
//             onChangeText={(value) => {
//               const cleaned = value.replace(/\D/g, "").slice(0, 11);
//               // dispatch(
//               //   updateField({
//               //     key: "receiverPhoneNumber",
//               //     value: formatPhoneNumber11(cleaned),
//               //   })
//               // );
//               handleChangeParcel(index, "receiverPhoneNumber", formatPhoneNumber11(cleaned))
//               if (cleaned.length === 11) setReceiverPhoneError("");
//             }}
//             keyboardType="number-pad"
//             errorMessage={receiverPhoneError}
//           />
//           <Input
//             label="Sender Phone Number"
//             placeholder="Enter phone number"
//             placeholderTextColor="#B8C2CC"
//             value={parcel.senderPhoneNumber}
//             onChangeText={(value) => {
//               const cleaned = value.replace(/\D/g, "").slice(0, 11);
//               handleChangeParcel(index, "senderPhoneNumber", formatPhoneNumber11(cleaned))
//               if (cleaned.length === 11) setSenderPhoneError("");
//             }}
//             keyboardType="number-pad"
//             errorMessage={senderPhoneError}
//           />
//           <SelectInput
//             label="Arriving From State"
//             data={Object.keys(statesWithLocations)}
//             placeholder="Select a state"
//             onSelect={(state) => {
//               setSelectedFromState(state as keyof typeof statesWithLocations);
//               const locs =
//                 statesWithLocations[
//                   state as keyof typeof statesWithLocations
//                 ] || [];
//               setFromLocations(locs);
//               setSelectedFromLocation(null); // Reset location when state changes
//             }}
//           />

//           {/* Location Selector for Sending From */}
//           {selectedFromState && (
//             <SelectInput
//               label="Arriving From Location/Motor park"
//               data={fromLocations.map((loc) => loc.location)}
//               placeholder="Select a dispatch location"
//               onSelect={(locationName) => {
//                 const found = fromLocations.find(
//                   (loc) => loc.location === locationName
//                 );
//                 setSelectedFromLocation(found ? found.location : null);
//               }}
//               showSearch={true}
//               // errorMessage={formErrors.sendingFrom}
//             />
//           )}
//           {agentParkLocation ? (
//             <Input
//               label="Destination Motor Park"
//               placeholder="Enter departure park"
//               placeholderTextColor="#B8C2CC"
//               value={agentParkLocation}
//               onChangeText={(value) => {
//                  handleChangeParcel(index, "deliveryMotorPark", value)
//                 if (value.trim()) {
//                   setDepartureStateError("");
//                 }
//               }}
//               keyboardType="default"
//               errorMessage={departureStateError}
//             />
//           ) : (
//             <>
//               <SelectInput
//                 label="Arriving to State"
//                 data={Object.keys(statesWithLocations)}
//                 placeholder="Select a state"
//                 onSelect={(state) => {
//                   const selectedState =
//                     state as keyof typeof statesWithLocations;
//                   setSelectedToState(selectedState);

//                   const locations = statesWithLocations[selectedState] || [];
//                   setToLocations(locations);
//                   setSelectedToLocation(null); // Reset location when state changes
//                 }}
//               />

//               {selectedToState && (
//                 <SelectInput
//                   label="Arriving to Location"
//                   data={toLocations.map((loc) => loc.location)}
//                   placeholder="Select a delivery location"
//                   onSelect={(locationName) => {
//                     const found = toLocations.find(
//                       (loc) => loc.location === locationName
//                     );
//                     setSelectedToLocation(found ? found.location : null);
//                   }}
//                   // errorMessage={formErrors.deliveryMotorPark}
//                 />
//               )}
//             </>
//           )}

//           <Text size={18} style={{ paddingTop: 15, paddingBottom: 10 }}>
//             Parcel Information
//           </Text>

//           <Input
//             label="Parcel Type (Optional)"
//             placeholder="Enter parcel type"
//             placeholderTextColor="#B8C2CC"
//             value={parcel.parcelType}
//             onChangeText={(value) => {
//               handleChangeParcel(index, "parcelType", value)
//               if (value.trim()) setParcelTypeError("");
//             }}
//             keyboardType="default"
//             errorMessage={parcelTypeError}
//           />
//           <Input
//             label="Parcel Value (₦)"
//             placeholder="Enter parcel worth"
//             placeholderTextColor="#B8C2CC"
//             value={parcel.parcelValue}
//             onChangeText={(value) => {
//                handleChangeParcel(index, "parcelValue", value)
//               if (value.trim()) setParcelValueError("");
//             }}
//             keyboardType="number-pad"
//             errorMessage={parcelValueError}
//           />

//           <Input
//             label="Charges Payable (₦)"
//             placeholder="Enter amount charged"
//             placeholderTextColor="#B8C2CC"
//             value={parcel.chargesPayable}
//             onChangeText={(value) => {
//                handleChangeParcel(index, "chargesPayable", value)
//               if (value.trim()) setChargesPayableError("");
//             }}
//             keyboardType="number-pad"
//             errorMessage={chargesPayableError}
//           />

//           <SelectInput
//             label="Charges to be paid by?"
//             data={["sender", "receiver"]}
//             placeholder="Select option"
//             onSelect={(value) =>
//               handleChangeParcel(index, "chargesPayBy", value)
//             }

//             // showSearch={true}
//           />
//           {parcel.chargesPayBy === "Sender" && (
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
//           <Input
//             label="Handling Fee (₦)"
//             placeholder="Enter handling fee"
//             placeholderTextColor="#B8C2CC"
//             value={parcel.handlingFee}
//             onChangeText={(value) => {
//               handleChangeParcel(index, "handlingFee", value)
//               if (value.trim()) setHandlingFeeError("");
//             }}
//             keyboardType="number-pad"
//             errorMessage={handlingFeeError}
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
              
//               {parcel.handlingFee && parcel.chargesPayable
//                 ? String(
//                     Number(parcel.handlingFee) +
//                       Number(parcel.chargesPayable)
//                   )
//                 : ""}
//             </Text>
//           </View>
//           <TextAreaInput
//             label="Parcel Description(Optional)"
//             placeholder="Enter a description..."
//             placeholderTextColor="#B8C2CC"
//             value={parcel.parcelDescription}
//             onChangeText={(value) =>
//                handleChangeParcel(index, "parcelDescription", value)
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
//               disabled={!parcel}
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
//                         source={{ uri:  `https://api.parcelpointng.com:4001/parcel/v1.0/files?slugs=${photo}`  }}
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
//         </View>
//        </View>
//      ))}
//      <View style={{paddingHorizontal:RFValue(16)}}>
//        <TouchableOpacity
//             onPress={handleAddParcel}
//             style={styles.addButton}
//           >
//             <Text style={styles.addText}>+ Add Parcel</Text>
//           </TouchableOpacity>
//           <View style={$buttonsContainer}>
//             <ButtonHome
//               onPress={HandleContinue}
//               title="Next"
//               style={{ height: 55 }}
//               // disabled={!parcels.}
//             />
//           </View>
//      </View>
//       </KeyBoardView>
//     </CustomView>
//   );
// };

// export default ParcelInDriverUnRegistered;

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
//     addButton: {
//     backgroundColor: "#DFF6DD",
//     padding: RFValue(12),
//     borderRadius: RFValue(6),
//     alignItems: "center",
//     marginTop: RFValue(10),
//   },
//   addText: {
//     color: "#215B23",
//     fontWeight: "600",
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
