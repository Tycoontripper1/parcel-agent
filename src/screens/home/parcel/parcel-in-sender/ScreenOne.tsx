import { View, ViewStyle } from "react-native";
import React, { use, useEffect, useState } from "react";
import { RFValue } from "react-native-responsive-fontsize";
import { CustomView, Input, Text } from "@/components";
import StepProgress from "@/components/share/StepProgress";
import KeyBoardView from "@/components/KeyBoardView";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Toast from "react-native-toast-message";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { HomeStackList } from "@/navigation/navigationType";
import { updateField } from "@/redux/slices/parcelSlice";
import ButtonHome from "@/components/ButtonHome";
import BackButton from "@/components/share/BackButton";
import SelectInput from "@/components/SelectInput";
import { getLocations } from "../../../../../services/parcel";

type Props = NativeStackScreenProps<HomeStackList>;
const ScreenOne = ({ navigation }: Props) => {
  // const [loading, setLoading] = useState(false);
  const formData = useSelector((state: RootState) => state.parcel);
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
  // get all location and convert to array
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
  // Convert into { [stateName]: Location[] }
  const statesWithLocations: Record<string, Location[]> = stateRows.reduce(
    (acc, curr) => {
      acc[curr.name] = curr.locations;
      return acc;
    },
    {} as Record<string, Location[]>
  );

  const formatPhoneNumber11 = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    if (digits.length <= 4) return digits;
    if (digits.length <= 7) return `${digits.slice(0, 4)}-${digits.slice(4)}`;
    return `${digits.slice(0, 4)}-${digits.slice(4, 7)}-${digits.slice(7)}`;
  };
  const [formErrors, setFormErrors] = useState({
    senderPhoneNumber: "",
    receiverPhoneNumber: "",
    senderFullName: "",
    senderAddress: "",
    receiverFullName: "",
    receiverAddress: "",
    sendingFrom: "",
    deliveryMotorPark: "",
  });

  const handleValidation = () => {
    let isValid = true;

    const senderPhone = formData.senderPhoneNumber.replace(/\D/g, "");
    const receiverPhone = formData.receiverPhoneNumber.replace(/\D/g, "");

    const newErrors = {
      senderPhoneNumber: "",
      receiverPhoneNumber: "",
      senderFullName: "",
      senderAddress: "",
      receiverFullName: "",
      receiverAddress: "",
      sendingFrom: "",
      deliveryMotorPark: "",
    };

    if (!senderPhone) {
      newErrors.senderPhoneNumber = "Phone Number is required.";
      isValid = false;
    } else if (senderPhone.length !== 11) {
      newErrors.senderPhoneNumber =
        "Please enter a valid 11-digit mobile number.";
      isValid = false;
    }

    if (!receiverPhone) {
      newErrors.receiverPhoneNumber = "Phone Number is required.";
      isValid = false;
    } else if (receiverPhone.length !== 11) {
      newErrors.receiverPhoneNumber =
        "Please enter a valid 11-digit mobile number.";
      isValid = false;
    }

    if (!formData.senderFullName.trim()) {
      newErrors.senderFullName = "Sender's full name is required.";
      isValid = false;
    }

    if (!formData.senderAddress.trim()) {
      newErrors.senderAddress = "Sender's address is required.";
      isValid = false;
    }

    if (!formData.receiverFullName.trim()) {
      newErrors.receiverFullName = "Receiver's full name is required.";
      isValid = false;
    }

    if (!formData.receiverAddress.trim()) {
      newErrors.receiverAddress = "Receiver's address is required.";
      isValid = false;
    }

    // Validate the sending state and location
    if (!selectedFromState) {
      newErrors.sendingFrom = "Sending state is required.";
      isValid = false;
    }

    if (!selectedFromLocation) {
      newErrors.sendingFrom = "Sending location is required.";
      isValid = false;
    }

    // Validate the destination park and location
    if (!selectedToState) {
      newErrors.deliveryMotorPark = "Arriving state is required.";
      isValid = false;
    }

    if (!selectedToLocation) {
      newErrors.deliveryMotorPark = "Arriving location is required.";
      isValid = false;
    }

    setFormErrors(newErrors);
    return isValid;
  };
  // const statesWithLocations = {
  //   Lagos: ["Ikeja", "Lekki", "Surulere"],
  //   Abuja: ["Garki", "Maitama", "Wuse"],
  //   Kano: ["Nassarawa", "Tarauni", "Gwale"],
  // };

  // Sending from state
  const [selectedFromState, setSelectedFromState] = useState<
    keyof typeof statesWithLocations | null
  >(null);
  const [fromLocations, setFromLocations] = useState<Location[]>([]);
  const [selectedFromLocation, setSelectedFromLocation] = useState<
    string | null
  >(null);

  // Sending to state
  const [selectedToState, setSelectedToState] = useState<
    keyof typeof statesWithLocations | null
  >(null);
  const [toLocations, setToLocations] = useState<Location[]>([]);
  const [selectedToLocation, setSelectedToLocation] = useState<string | null>(
    null
  );

  // useEffect for "sending from"
  useEffect(() => {
    if (selectedFromState && selectedFromLocation) {
      const combined = `${selectedFromState}, ${selectedFromLocation}`;
      dispatch(updateField({ key: "sendingFrom", value: combined }));
      console.log("Sending From Combined:", combined);
    }
  }, [selectedFromState, selectedFromLocation, dispatch]);

  // useEffect for "sending to"
  useEffect(() => {
    if (selectedToState && selectedToLocation) {
      const combined = `${selectedToState}, ${selectedToLocation}`;
      dispatch(updateField({ key: "deliveryMotorPark", value: combined }));
      console.log("Sending To Combined:", combined);
    }
  }, [selectedToState, selectedToLocation, dispatch]);

  const handleNavigate = () => {
    if (!handleValidation()) {
      return;
    }
    navigation.navigate("ScreenOneParcelInSenderTwo");
    console.log({ formData });
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
      {/* {loading && <Spinner />} */}

      <BackButton onClick={() => navigation.goBack()} />
      <StepProgress step={1} totalSteps={3} />
      {/* Body */}
      <KeyBoardView padded={false}>
        <View style={$bodyHeader}>
          <Text font="SemiBold" size={18}>
            Parcel In - Sender
          </Text>
        </View>
        <View style={$cardHeader}>
          <Text size={18} style={{ paddingTop: 15, paddingBottom: 10 }}>
            Sender’s Information
          </Text>
          <Input
            label="Phone Number"
            placeholder="Enter phone number"
            placeholderTextColor="#B8C2CC"
            value={formData.senderPhoneNumber}
            onChangeText={(value) => {
              const cleaned = value.replace(/\D/g, "").slice(0, 11);
              dispatch(
                updateField({
                  key: "senderPhoneNumber",
                  value: formatPhoneNumber11(cleaned),
                })
              );
            }}
            keyboardType="number-pad"
            errorMessage={formErrors.senderPhoneNumber}
          />

          <Input
            label="Full Name"
            placeholder="Enter full name"
            placeholderTextColor="#B8C2CC"
            value={formData.senderFullName}
            onChangeText={(value) =>
              dispatch(updateField({ key: "senderFullName", value }))
            }
            keyboardType="default"
            errorMessage={formErrors.senderFullName}
          />
          <Input
            label="Email Address (Optional)"
            placeholder="Enter email"
            placeholderTextColor="#B8C2CC"
            value={formData.senderEmail}
            onChangeText={(value) =>
              dispatch(updateField({ key: "senderEmail", value }))
            }
            keyboardType="email-address"
          />
          <Input
            label="Address"
            placeholder="Enter address"
            placeholderTextColor="#B8C2CC"
            value={formData.senderAddress}
            onChangeText={(value) =>
              dispatch(updateField({ key: "senderAddress", value }))
            }
            keyboardType="default"
            errorMessage={formErrors.senderAddress}
          />

          <Text size={18} style={{ paddingTop: 15, paddingBottom: 10 }}>
            Receiver’s Information
          </Text>

          <Input
            label="Phone Number"
            placeholder="Enter phone number"
            placeholderTextColor="#B8C2CC"
            value={formData.receiverPhoneNumber}
            onChangeText={(value) => {
              const cleaned = value.replace(/\D/g, "").slice(0, 11);
              dispatch(
                updateField({
                  key: "receiverPhoneNumber",
                  value: formatPhoneNumber11(cleaned),
                })
              );
            }}
            keyboardType="number-pad"
            errorMessage={formErrors.receiverPhoneNumber}
          />

          <Input
            label="Full Name"
            placeholder="Enter full name"
            placeholderTextColor="#B8C2CC"
            value={formData.receiverFullName}
            onChangeText={(value) =>
              dispatch(updateField({ key: "receiverFullName", value }))
            }
            keyboardType="default"
            errorMessage={formErrors.receiverFullName}
          />
          <Input
            label="Email Address (Optional)"
            placeholder="Enter email"
            placeholderTextColor="#B8C2CC"
            value={formData.receiverEmail}
            onChangeText={(value) =>
              dispatch(updateField({ key: "receiverEmail", value }))
            }
            keyboardType="email-address"
          />
          <Input
            label="Address"
            placeholder="Enter address"
            placeholderTextColor="#B8C2CC"
            value={formData.receiverAddress}
            onChangeText={(value) =>
              dispatch(updateField({ key: "receiverAddress", value }))
            }
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
              const locs =
                statesWithLocations[
                  state as keyof typeof statesWithLocations
                ] || [];
              setFromLocations(locs);
              setSelectedFromLocation(null); // Reset location when state changes
            }}
            
          />

          {/* Location Selector for Sending From */}
          {selectedFromState && (
            <SelectInput
              label="Sending from Location"
              data={fromLocations.map((loc) => loc.location)}
              placeholder="Select a dispatch location"
              onSelect={(locationName) => {
                const found = fromLocations.find(
                  (loc) => loc.location === locationName
                );
                setSelectedFromLocation(found ? found.location : null);
              }}
              errorMessage={formErrors.sendingFrom}
            />
          )}

          {/* Destination Section (Sending To) */}
          <SelectInput
            label="Arriving to State"
            data={Object.keys(statesWithLocations)}
            placeholder="Select a state"
            onSelect={(state) => {
              setSelectedToState(state as keyof typeof statesWithLocations);
              const locs =
                statesWithLocations[
                  state as keyof typeof statesWithLocations
                ] || [];
              setToLocations(locs);
              setSelectedToLocation(null); // Reset location when state changes
            }}
           
          />

          {/* Location Selector for Sending To */}
          {selectedToState && (
            <SelectInput
              label="Arriving to Location"
              data={toLocations.map((loc) => loc.location)}
              placeholder="Select a delivery location"
              onSelect={(locationName) => {
                const found = toLocations.find(
                  (loc) => loc.location === locationName
                );
                setSelectedToLocation(found ? found.location : null);
              }}
              errorMessage={formErrors.deliveryMotorPark}
            />
          )}

          <View style={$buttonsContainer}>
            <ButtonHome
              onPress={handleNavigate}
              title="Next"
              style={{ height: 55 }}
              disabled={!formData.deliveryMotorPark}
            />
          </View>
        </View>
      </KeyBoardView>
    </CustomView>
  );
};

export default ScreenOne;
