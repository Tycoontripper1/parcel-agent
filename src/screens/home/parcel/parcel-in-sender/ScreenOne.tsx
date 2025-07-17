// import { View, ViewStyle } from "react-native";
// import React, { use, useEffect, useState } from "react";
// import { RFValue } from "react-native-responsive-fontsize";
// import { CustomView, Input, Text } from "@/components";
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
// import { getLocations } from "../../../../../services/parcel";

// type Props = NativeStackScreenProps<HomeStackList>;
// const ScreenOne = ({ navigation }: Props) => {
//   // const [loading, setLoading] = useState(false);
//   const formData = useSelector((state: RootState) => state.parcel);
//   const dispatch = useDispatch();
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
//   // Convert into { [stateName]: Location[] }
//   const statesWithLocations: Record<string, Location[]> = stateRows.reduce(
//     (acc, curr) => {
//       acc[curr.name] = curr.locations;
//       return acc;
//     },
//     {} as Record<string, Location[]>
//   );

//   const formatPhoneNumber11 = (value: string) => {
//     const digits = value.replace(/\D/g, "").slice(0, 11);
//     if (digits.length <= 4) return digits;
//     if (digits.length <= 7) return `${digits.slice(0, 4)}-${digits.slice(4)}`;
//     return `${digits.slice(0, 4)}-${digits.slice(4, 7)}-${digits.slice(7)}`;
//   };
//   const [formErrors, setFormErrors] = useState({
//     senderPhoneNumber: "",
//     receiverPhoneNumber: "",
//     senderFullName: "",
//     senderAddress: "",
//     receiverFullName: "",
//     receiverAddress: "",
//     sendingFrom: "",
//     deliveryMotorPark: "",
//   });

//   const handleValidation = () => {
//     let isValid = true;

//     const senderPhone = formData.senderPhoneNumber.replace(/\D/g, "");
//     const receiverPhone = formData.receiverPhoneNumber.replace(/\D/g, "");

//     const newErrors = {
//       senderPhoneNumber: "",
//       receiverPhoneNumber: "",
//       senderFullName: "",
//       senderAddress: "",
//       receiverFullName: "",
//       receiverAddress: "",
//       sendingFrom: "",
//       deliveryMotorPark: "",
//     };

//     if (!senderPhone) {
//       newErrors.senderPhoneNumber = "Phone Number is required.";
//       isValid = false;
//     } else if (senderPhone.length !== 11) {
//       newErrors.senderPhoneNumber =
//         "Please enter a valid 11-digit mobile number.";
//       isValid = false;
//     }

//     if (!receiverPhone) {
//       newErrors.receiverPhoneNumber = "Phone Number is required.";
//       isValid = false;
//     } else if (receiverPhone.length !== 11) {
//       newErrors.receiverPhoneNumber =
//         "Please enter a valid 11-digit mobile number.";
//       isValid = false;
//     }

//     // if (!formData.senderFullName.trim()) {
//     //   newErrors.senderFullName = "Sender's full name is required.";
//     //   isValid = false;
//     // }

//     if (!formData.senderAddress.trim()) {
//       newErrors.senderAddress = "Sender's address is required.";
//       isValid = false;
//     }

//     if (!formData.receiverFullName.trim()) {
//       newErrors.receiverFullName = "Receiver's full name is required.";
//       isValid = false;
//     }

//     if (!formData.receiverAddress.trim()) {
//       newErrors.receiverAddress = "Receiver's address is required.";
//       isValid = false;
//     }

//     // Validate the sending state and location
//     if (!selectedFromState) {
//       newErrors.sendingFrom = "Sending state is required.";
//       isValid = false;
//     }

//     if (!selectedFromLocation) {
//       newErrors.sendingFrom = "Sending location is required.";
//       isValid = false;
//     }

//     // Validate the destination park and location
//     if (!selectedToState) {
//       newErrors.deliveryMotorPark = "Arriving state is required.";
//       isValid = false;
//     }

//     if (!selectedToLocation) {
//       newErrors.deliveryMotorPark = "Arriving location is required.";
//       isValid = false;
//     }

//     setFormErrors(newErrors);
//     return isValid;
//   };
//   // const statesWithLocations = {
//   //   Lagos: ["Ikeja", "Lekki", "Surulere"],
//   //   Abuja: ["Garki", "Maitama", "Wuse"],
//   //   Kano: ["Nassarawa", "Tarauni", "Gwale"],
//   // };

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
//       dispatch(updateField({ key: "sendingFrom", value: combined }));
//       //("Sending From Combined:", combined);
//     }
//   }, [selectedFromState, selectedFromLocation, dispatch]);

//   // useEffect for "sending to"
//   useEffect(() => {
//     if (selectedToState && selectedToLocation) {
//       const combined = `${selectedToState}, ${selectedToLocation}`;
//       dispatch(updateField({ key: "deliveryMotorPark", value: combined }));
//       //("Sending To Combined:", combined);
//     }
//   }, [selectedToState, selectedToLocation, dispatch]);

//   const handleNavigate = () => {
//     if (!handleValidation()) {
//       return;
//     }
//     navigation.navigate("ScreenOneParcelInSenderTwo");
//     //({ formData });
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

//   return (
//     <CustomView style={{ paddingVertical: RFValue(10) }}>
//       {/* {loading && <Spinner />} */}

//       <BackButton onClick={() => navigation.goBack()} />
//       <StepProgress step={1} totalSteps={3} />
//       {/* Body */}
//       <KeyBoardView padded={false}>
//         <View style={$bodyHeader}>
//           <Text font="SemiBold" size={18}>
//             Parcel In - Sender
//           </Text>
//         </View>
//         <View style={$cardHeader}>
//           <Text size={18} style={{ paddingTop: 15, paddingBottom: 10 }}>
//             Sender’s Information
//           </Text>
//           <Input
//             label="Phone Number"
//             placeholder="Enter phone number"
//             placeholderTextColor="#B8C2CC"
//             value={formData.senderPhoneNumber}
//             onChangeText={(value) => {
//               const cleaned = value.replace(/\D/g, "").slice(0, 11);
//               dispatch(
//                 updateField({
//                   key: "senderPhoneNumber",
//                   value: formatPhoneNumber11(cleaned),
//                 })
//               );
//             }}
//             keyboardType="number-pad"
//             errorMessage={formErrors.senderPhoneNumber}
//           />

//           {/* <Input
//             label="Full Name"
//             placeholder="Enter full name"
//             placeholderTextColor="#B8C2CC"
//             value={formData.senderFullName}
//             onChangeText={(value) =>
//               dispatch(updateField({ key: "senderFullName", value }))
//             }
//             keyboardType="default"
//             errorMessage={formErrors.senderFullName}
//           /> */}
//                     <Input
//             label="Address"
//             placeholder="Enter address"
//             placeholderTextColor="#B8C2CC"
//             value={formData.senderAddress}
//             onChangeText={(value) =>
//               dispatch(updateField({ key: "senderAddress", value }))
//             }
//             keyboardType="default"
//             errorMessage={formErrors.senderAddress}
//           />
//           <Input
//             label="Email Address (Optional)"
//             placeholder="Enter email"
//             placeholderTextColor="#B8C2CC"
//             value={formData.senderEmail}
//             onChangeText={(value) =>
//               dispatch(updateField({ key: "senderEmail", value }))
//             }
//             keyboardType="email-address"
//           />


//           <Text size={18} style={{ paddingTop: 15, paddingBottom: 10 }}>
//             Receiver’s Information
//           </Text>

//           <Input
//             label="Phone Number"
//             placeholder="Enter phone number"
//             placeholderTextColor="#B8C2CC"
//             value={formData.receiverPhoneNumber}
//             onChangeText={(value) => {
//               const cleaned = value.replace(/\D/g, "").slice(0, 11);
//               dispatch(
//                 updateField({
//                   key: "receiverPhoneNumber",
//                   value: formatPhoneNumber11(cleaned),
//                 })
//               );
//             }}
//             keyboardType="number-pad"
//             errorMessage={formErrors.receiverPhoneNumber}
//           />

//           <Input
//             label="Full Name"
//             placeholder="Enter full name"
//             placeholderTextColor="#B8C2CC"
//             value={formData.receiverFullName}
//             onChangeText={(value) =>
//               dispatch(updateField({ key: "receiverFullName", value }))
//             }
//             keyboardType="default"
//             errorMessage={formErrors.receiverFullName}
//           />
//           <Input
//             label="Address"
//             placeholder="Enter address"
//             placeholderTextColor="#B8C2CC"
//             value={formData.receiverAddress}
//             onChangeText={(value) =>
//               dispatch(updateField({ key: "receiverAddress", value }))
//             }
//             keyboardType="default"
//             errorMessage={formErrors.receiverAddress}
//           />

//           <Text size={18} style={{ paddingTop: 15, paddingBottom: 10 }}>
//             Park Details
//           </Text>

//           <SelectInput
//             label="Sending from State"
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
//               label="Sending from Location"
//               data={fromLocations.map((loc) => loc.location)}
//               placeholder="Select a dispatch location"
//               onSelect={(locationName) => {
//                 const found = fromLocations.find(
//                   (loc) => loc.location === locationName
//                 );
//                 setSelectedFromLocation(found ? found.location : null);
//               }}
//               errorMessage={formErrors.sendingFrom}
//             />
//           )}

//           {/* Destination Section (Sending To) */}
//           <SelectInput
//             label="Arriving to State"
//             data={Object.keys(statesWithLocations)}
//             placeholder="Select a state"
//             onSelect={(state) => {
//               setSelectedToState(state as keyof typeof statesWithLocations);
//               const locs =
//                 statesWithLocations[
//                   state as keyof typeof statesWithLocations
//                 ] || [];
//               setToLocations(locs);
//               setSelectedToLocation(null); // Reset location when state changes
//             }}
           
//           />

//           {/* Location Selector for Sending To */}
//           {selectedToState && (
//             <SelectInput
//               label="Arriving to Location"
//               data={toLocations.map((loc) => loc.location)}
//               placeholder="Select a delivery location"
//               onSelect={(locationName) => {
//                 const found = toLocations.find(
//                   (loc) => loc.location === locationName
//                 );
//                 setSelectedToLocation(found ? found.location : null);
//               }}
//               errorMessage={formErrors.deliveryMotorPark}
//             />
//           )}

//           <View style={$buttonsContainer}>
//             <ButtonHome
//               onPress={handleNavigate}
//               title="Next"
//               style={{ height: 55 }}
//               disabled={!formData.deliveryMotorPark}
//             />
//           </View>
//         </View>
//       </KeyBoardView>
//     </CustomView>
//   );
// };

// export default ScreenOne;
import { View, ViewStyle, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { RFValue } from "react-native-responsive-fontsize";
import { CustomView, Input, Text } from "@/components";
import StepProgress from "@/components/share/StepProgress";
import KeyBoardView from "@/components/KeyBoardView";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { HomeStackList } from "@/navigation/navigationType";
import { updateParcelField, addParcel, removeParcel, setCurrentParcelIndex } from "@/redux/slices/parcelVariationSlice";
import ButtonHome from "@/components/ButtonHome";
import BackButton from "@/components/share/BackButton";
import SelectInput from "@/components/SelectInput";
import { getLocations } from "../../../../../services/parcel";
import Ionicons from '@expo/vector-icons/Ionicons';

type Props = NativeStackScreenProps<HomeStackList>;
const ScreenOne = ({ navigation }: Props) => {
  const { parcels, currentParcelIndex } = useSelector((state: RootState) => state.parcelVariation);
  const currentParcel = parcels[currentParcelIndex];
  const dispatch = useDispatch();

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
  const [formErrors, setFormErrors] = useState({
    senderPhoneNumber: "",
    receiverPhoneNumber: "",
    senderAddress: "",
    receiverFullName: "",
    receiverAddress: "",
    sendingFrom: "",
    deliveryMotorPark: "",
  });

  // Location data handling
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

  // Location selection state
  const [selectedFromState, setSelectedFromState] = useState<keyof typeof statesWithLocations | null>(null);
  const [fromLocations, setFromLocations] = useState<Location[]>([]);
  const [selectedFromLocation, setSelectedFromLocation] = useState<string | null>(null);
  const [selectedToState, setSelectedToState] = useState<keyof typeof statesWithLocations | null>(null);
  const [toLocations, setToLocations] = useState<Location[]>([]);
  const [selectedToLocation, setSelectedToLocation] = useState<string | null>(null);

  // Update location fields in Redux
  useEffect(() => {
    if (selectedFromState && selectedFromLocation) {
      const combined = `${selectedFromState}, ${selectedFromLocation}`;
      dispatch(updateParcelField({
        index: currentParcelIndex,
        key: "sendingFrom",
        value: combined
      }));
    }
  }, [selectedFromState, selectedFromLocation, dispatch, currentParcelIndex]);

  useEffect(() => {
    if (selectedToState && selectedToLocation) {
      const combined = `${selectedToState}, ${selectedToLocation}`;
      dispatch(updateParcelField({
        index: currentParcelIndex,
        key: "deliveryMotorPark",
        value: combined
      }));
    }
  }, [selectedToState, selectedToLocation, dispatch, currentParcelIndex]);

  const formatPhoneNumber11 = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    if (digits.length <= 4) return digits;
    if (digits.length <= 7) return `${digits.slice(0, 4)}-${digits.slice(4)}`;
    return `${digits.slice(0, 4)}-${digits.slice(4, 7)}-${digits.slice(7)}`;
  };

  const handleValidation = () => {
    let isValid = true;
    const newErrors = { ...formErrors };

    const senderPhone = currentParcel.senderPhoneNumber.replace(/\D/g, "");
    const receiverPhone = currentParcel.receiverPhoneNumber.replace(/\D/g, "");

    if (!senderPhone) {
      newErrors.senderPhoneNumber = "Phone Number is required.";
      isValid = false;
    } else if (senderPhone.length !== 11) {
      newErrors.senderPhoneNumber = "Please enter a valid 11-digit mobile number.";
      isValid = false;
    } else {
      newErrors.senderPhoneNumber = "";
    }

    if (!receiverPhone) {
      newErrors.receiverPhoneNumber = "Phone Number is required.";
      isValid = false;
    } else if (receiverPhone.length !== 11) {
      newErrors.receiverPhoneNumber = "Please enter a valid 11-digit mobile number.";
      isValid = false;
    } else {
      newErrors.receiverPhoneNumber = "";
    }

    if (!currentParcel.senderAddress.trim()) {
      newErrors.senderAddress = "Sender's address is required.";
      isValid = false;
    } else {
      newErrors.senderAddress = "";
    }

    if (!currentParcel.receiverFullName.trim()) {
      newErrors.receiverFullName = "Receiver's full name is required.";
      isValid = false;
    } else {
      newErrors.receiverFullName = "";
    }

    if (!currentParcel.receiverAddress.trim()) {
      newErrors.receiverAddress = "Receiver's address is required.";
      isValid = false;
    } else {
      newErrors.receiverAddress = "";
    }

    if (!selectedFromState) {
      newErrors.sendingFrom = "Sending state is required.";
      isValid = false;
    } else {
      newErrors.sendingFrom = "";
    }

    if (!selectedFromLocation) {
      newErrors.sendingFrom = "Sending location is required.";
      isValid = false;
    } else {
      newErrors.sendingFrom = "";
    }

    if (!selectedToState) {
      newErrors.deliveryMotorPark = "Arriving state is required.";
      isValid = false;
    } else {
      newErrors.deliveryMotorPark = "";
    }

    if (!selectedToLocation) {
      newErrors.deliveryMotorPark = "Arriving location is required.";
      isValid = false;
    } else {
      newErrors.deliveryMotorPark = "";
    }

    setFormErrors(newErrors);
    return isValid;
  };

  const handleNavigate = () => {
    if (!handleValidation()) return;
    navigation.navigate("ScreenOneParcelInSenderTwo");
  };

  const handleAddParcel = () => {
    dispatch(addParcel());
    dispatch(setCurrentParcelIndex(parcels.length));
  };

  const handleSelectParcel = (index: number) => {
    dispatch(setCurrentParcelIndex(index));
    // Reset location selections when changing parcels
    setSelectedFromState(null);
    setSelectedFromLocation(null);
    setSelectedToState(null);
    setSelectedToLocation(null);
  };

  const handleDeleteParcel = (index: number) => {
    if (index > 0) { // Don't allow deleting the first parcel
      dispatch(removeParcel(index));
      if (currentParcelIndex >= index) {
        dispatch(setCurrentParcelIndex(Math.max(0, currentParcelIndex - 1)));
      }
    }
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
    <CustomView style={{ paddingTop: RFValue(10) }}>
      <BackButton onClick={() => navigation.goBack()} />
      <StepProgress step={1} totalSteps={3} />

      {/* Parcel Navigation */}
      <View style={styles.parcelNavContainer}>
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

        <View style={styles.currentParcelIndicator}>
          <Text font="SemiBold" size={14} style={styles.currentParcelText}>
            Parcel {currentParcelIndex + 1} of {parcels.length}
          </Text>
          {currentParcelIndex > 0 && (
            <TouchableOpacity 
              onPress={() => handleDeleteParcel(currentParcelIndex)}
              style={styles.deleteButton}
            >
              <Ionicons name="trash-outline" size={16} color="#FF3B30" />
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
              <Ionicons name="chevron-forward" size={14} color="white" />
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
            Sender's Information
          </Text>
          
          <Input
            label="Phone Number"
            placeholder="Enter phone number"
            placeholderTextColor="#B8C2CC"
            value={currentParcel.senderPhoneNumber}
            onChangeText={(value) => {
              const cleaned = value.replace(/\D/g, "").slice(0, 11);
              dispatch(updateParcelField({
                index: currentParcelIndex,
                key: "senderPhoneNumber",
                value: formatPhoneNumber11(cleaned)
              }));
              if (cleaned.length === 11) {
                setFormErrors({...formErrors, senderPhoneNumber: ""});
              }
            }}
            keyboardType="number-pad"
            errorMessage={formErrors.senderPhoneNumber}
          />

          <Input
            label="Address"
            placeholder="Enter address"
            placeholderTextColor="#B8C2CC"
            value={currentParcel.senderAddress}
            onChangeText={(value) => {
              dispatch(updateParcelField({
                index: currentParcelIndex,
                key: "senderAddress",
                value
              }));
              if (value.trim()) {
                setFormErrors({...formErrors, senderAddress: ""});
              }
            }}
            keyboardType="default"
            errorMessage={formErrors.senderAddress}
          />

          <Input
            label="Email Address (Optional)"
            placeholder="Enter email"
            placeholderTextColor="#B8C2CC"
            value={currentParcel.senderEmail || ''}
            onChangeText={(value) =>
              dispatch(updateParcelField({
                index: currentParcelIndex,
                key: "senderEmail",
                value
              }))
            }
            keyboardType="email-address"
          />

          <Text size={18} style={{ paddingTop: 15, paddingBottom: 10 }}>
            Receiver's Information
          </Text>

          <Input
            label="Phone Number"
            placeholder="Enter phone number"
            placeholderTextColor="#B8C2CC"
            value={currentParcel.receiverPhoneNumber}
            onChangeText={(value) => {
              const cleaned = value.replace(/\D/g, "").slice(0, 11);
              dispatch(updateParcelField({
                index: currentParcelIndex,
                key: "receiverPhoneNumber",
                value: formatPhoneNumber11(cleaned)
              }));
              if (cleaned.length === 11) {
                setFormErrors({...formErrors, receiverPhoneNumber: ""});
              }
            }}
            keyboardType="number-pad"
            errorMessage={formErrors.receiverPhoneNumber}
          />

          <Input
            label="Full Name"
            placeholder="Enter full name"
            placeholderTextColor="#B8C2CC"
            value={currentParcel.receiverFullName}
            onChangeText={(value) => {
              dispatch(updateParcelField({
                index: currentParcelIndex,
                key: "receiverFullName",
                value
              }));
              if (value.trim()) {
                setFormErrors({...formErrors, receiverFullName: ""});
              }
            }}
            keyboardType="default"
            errorMessage={formErrors.receiverFullName}
          />

          <Input
            label="Address"
            placeholder="Enter address"
            placeholderTextColor="#B8C2CC"
            value={currentParcel.receiverAddress}
            onChangeText={(value) => {
              dispatch(updateParcelField({
                index: currentParcelIndex,
                key: "receiverAddress",
                value
              }));
              if (value.trim()) {
                setFormErrors({...formErrors, receiverAddress: ""});
              }
            }}
            keyboardType="default"
            errorMessage={formErrors.receiverAddress}
          />

          <Text size={18} style={{ paddingTop: 15, paddingBottom: 10 }}>
            Park Details
          </Text>

          <SelectInput
            label="Sending from State"
            data={Object.keys(statesWithLocations)}
            placeholder="Select a state"
            onSelect={(state) => {
              setSelectedFromState(state as keyof typeof statesWithLocations);
              const locs = statesWithLocations[state as keyof typeof statesWithLocations] || [];
              setFromLocations(locs);
              setSelectedFromLocation(null);
              setFormErrors({...formErrors, sendingFrom: ""});
            }}
            errorMessage={formErrors.sendingFrom}
          />

          {selectedFromState && (
            <SelectInput
              label="Sending from Location"
              data={fromLocations.map((loc) => loc.location)}
              placeholder="Select a dispatch location"
              onSelect={(locationName) => {
                const found = fromLocations.find((loc) => loc.location === locationName);
                setSelectedFromLocation(found ? found.location : null);
                setFormErrors({...formErrors, sendingFrom: ""});
              }}
              errorMessage={formErrors.sendingFrom}
            />
          )}

          <SelectInput
            label="Arriving to State"
            data={Object.keys(statesWithLocations)}
            placeholder="Select a state"
            onSelect={(state) => {
              setSelectedToState(state as keyof typeof statesWithLocations);
              const locs = statesWithLocations[state as keyof typeof statesWithLocations] || [];
              setToLocations(locs);
              setSelectedToLocation(null);
              setFormErrors({...formErrors, deliveryMotorPark: ""});
            }}
            errorMessage={formErrors.deliveryMotorPark}
          />

          {selectedToState && (
            <SelectInput
              label="Arriving to Location"
              data={toLocations.map((loc) => loc.location)}
              placeholder="Select a delivery location"
              onSelect={(locationName) => {
                const found = toLocations.find((loc) => loc.location === locationName);
                setSelectedToLocation(found ? found.location : null);
                setFormErrors({...formErrors, deliveryMotorPark: ""});
              }}
              errorMessage={formErrors.deliveryMotorPark}
            />
          )}

          <View style={$buttonsContainer}>
            <ButtonHome
              onPress={handleNavigate}
              title="Next"
              style={{ height: 55 }}
              disabled={!currentParcel.deliveryMotorPark}
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
    fontSize: RFValue(12),
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

export default ScreenOne;