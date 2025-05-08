import { CustomView, Spinner, Text } from "@/components";

// import { Clipboard } from 'react-native';
import ButtonHome from "@/components/ButtonHome";
import KeyBoardView from "@/components/KeyBoardView";
import { RootState } from "@/redux/store";
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";

import ViewShot from "react-native-view-shot";
import * as Print from "expo-print";

import { PDFDocument, rgb } from "pdf-lib";
import React, { useEffect, useRef, useState } from "react";
import { Alert } from "react-native";
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ViewStyle,
  Dimensions,
} from "react-native";

import {
  DriverStackList,
  HomeStackList,
  ReportStackList,
  RootStackParamList,
} from "@/navigation/navigationType";
import { RouteProp } from "@react-navigation/native";
import { RFValue } from "react-native-responsive-fontsize";
import { useDispatch, useSelector } from "react-redux";
import HomeHeader from "@/components/share/HomeHeader";

import { singleParcelInterface } from "@/utils/interface";
import { getParcelDetails } from "../../services/parcel";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BackButton from "./share/BackButton";
import Animated, { FadeInUp } from "react-native-reanimated";
import { ScrollView } from "react-native-gesture-handler";
import Success from "./svg/Success";
import { Helper } from "@/helper/helper";
import { resetForm } from "@/redux/slices/parcelSlice";
import StepProgress from "./share/StepProgress";

type TransactionType = "Handling fee" | "Overdue fee" | "Upfront fee";

interface ParcelDetailsType {
  id: string;
  sender: {
    phone: string;
    fullName: string;
    email: string;
    address: string;
  };
  receiver: {
    phone: string;
    fullName: string;
    email: string;
    address: string;
  };
  parcel: {
    type: string;
    value: string;
    chargesPayable: string;
    chargesPaidBy: string;
    handlingFee: string;
    totalFee: string;
    description: string;
    thumbnails: string[];
  };
  driver: {
    name: string | null;
    phone: string | null;
  };
  park: {
    source: string;
    destination: string;
  };
  addedBy: {
    name: string;
    phone: string;
  };
  collectedOnArrivalBy: {
    name: string;
    agentId: string;
  };
  paymentOption: string | null;
  paymentStatus: string;

  status: string;
  parcelId: string;
  qrImage: string;
  createdAt: string;
}

interface Props {
  navigation: NativeStackNavigationProp<RootStackParamList & HomeStackList & DriverStackList>;
  route: RouteProp<HomeStackList, "ComfirmationDriver">;
}
const ComfirmationDriver
 = ({ navigation }: Props) => {
  const formData = useSelector((state: RootState) => state.parcel);
  const viewShotRef = useRef<ViewShot | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [BarValue, setBarValue] = useState("lintangwisesa");
  const [parcelItem, setParcelItem] = useState<ParcelDetailsType | null>(null);
  const [parcelDetails, setParcelDetails] =
    useState<singleParcelInterface | null>(null);
  useEffect(() => {
    const fetchParcelDetails = async () => {
      const parcel = await getParcelDetails();

      setParcelDetails(parcel);
    };
    fetchParcelDetails();
  }, []);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const storedItem = await AsyncStorage.getItem("parcelItem");
        if (storedItem !== null) {
          setParcelItem(JSON.parse(storedItem)); // Parse the stored string back to an object
        }
      } catch (error) {
        console.error("Error retrieving item from AsyncStorage:", error);
      }
    };

    fetchItem();
  }, []);
  const createdAt = parcelItem?.createdAt;
  const date = createdAt ? new Date(createdAt) : new Date();
  const formattedDate = `${date.getDate()}-${
    date.getMonth() + 1
  }-${date.getFullYear()}`;
  const formattedTime = `${date.getHours()}:${
    date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()
  } ${date.getHours() < 12 ? "AM" : "PM"}`;

  // Styles
  const $bodyHeader: ViewStyle = {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: RFValue(20),
    paddingHorizontal: RFValue(12),
  };
  const $buttonsContainer: ViewStyle = {
    padding: RFValue(12),
  };
  const $buttonsContainerDriver: ViewStyle = {
    padding: RFValue(16),
  };
  const parcelId = "PEH658498706";

  const copyToClipboard = (text: string) => {
    // Clipboard.setString(text);
    Alert.alert("Copied", "Parcel ID copied to clipboard");
  };
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    const handleSubmit = () => {
      console.log(formData);
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        Helper.vibrate();
        navigation.replace('RootTabStack');
        // dispatch(resetForm())
        dispatch(resetForm()); // Reset the form data in Redux
      }, 2000);
    };

  return (
    <CustomView style={{ paddingVertical: RFValue(10) }}>
       {loading && <Spinner />}

<BackButton onClick={() => navigation.goBack()} />

      {/* Body */}
      <StepProgress step={3} totalSteps={3} />
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 20}}>
        <View style={styles.container}>
          <Animated.View
            entering={FadeInUp.duration(500).delay(600)}
            style={{
              paddingVertical: 20,
              flexDirection: 'row',
              justifyContent: 'center',
            }}>
            <Success />
          </Animated.View>

          <View style={{ padding:RFValue(16), flexDirection: "column", gap: 6 }}>
            <Text style={{ textAlign: "center", color:"#252B37", fontSize:RFValue(18) ,}}>SMS has been sent to notify the sender/receiver.</Text>
             <Text style={{ textAlign: "center", color:'#717680' }}>Parcel received successfully</Text>
               <Text style={{ textAlign: "center", color:"#717680" }}>Parcel ID</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingVertical: 6,
              padding: RFValue(32),
              marginTop: RFValue(8),
            }}
          >
            <Text size={16}>{parcelDetails?.parcelId}</Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 6,
                paddingVertical: 6,
              }}
            >
              <TouchableOpacity onPress={() => copyToClipboard(parcelId)}>
                <View
                  style={{
                    padding: 4,
                    borderRadius: 8,
                  }}
                >
                  <Text color="#717680" size={12}>
                    Copy ID
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        <View style={$buttonsContainer}>
          <ButtonHome
            onPress={handleSubmit}
            title="Go to Dashboard"
            style={{ height: 40 }}
          />
        </View>
        <View style={$buttonsContainer}>
          <ButtonHome
            onPress={() => navigation.navigate("DriversScreen")}
            title="Register Driver"
            style={{ height: 40 , backgroundColor: "#E6FFDB"}}
          />
        </View>
        </View>
      </ScrollView>
    </CustomView>
  );
};

const styles = StyleSheet.create({
      container: {
        flex: 1,
        padding: 16,
        justifyContent: 'center',
        paddingVertical: 60,
      },
  header: {
    fontSize: RFValue(18),
    fontWeight: "bold",
    marginBottom: RFValue(16),
    textAlign: "center",
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
  sectionContainer: {
    marginBottom: RFValue(2),
    // paddingVertical: RFValue(12),
    backgroundColor: "#FDFDFD",
    borderRadius: RFValue(8),
    paddingHorizontal: RFValue(16),
    paddingVertical: RFValue(6),
  },
  sectionHeader: {
    paddingVertical: RFValue(8),
    borderBottomWidth: 1,
    borderBottomColor: "#E9EAEB",
    marginBottom: RFValue(6),
  },
  barcodeContainer: { alignItems: "center", marginVertical: RFValue(10) },
  infoText: {
    fontSize: RFValue(10),

    marginBottom: RFValue(4),
    color: "#252B37",
  },
  descriptionText: {
    fontSize: RFValue(10),
    marginBottom: RFValue(4),
    color: "#717680",
  },
  imageContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: RFValue(16),
  },
  button: {
    backgroundColor: "#4CAF50",
    paddingVertical: RFValue(12),
    borderRadius: RFValue(8),
    alignItems: "center",
  },
  buttonText: {
    fontSize: RFValue(16),
    color: "#fff",
    fontWeight: "bold",
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
  counter: {
    fontSize: 14,
    color: "gray",
    marginBottom: 20,
  },
  title: { textAlign: "center", marginBottom: 16 },
  image: { width: "100%", height: 200, alignSelf: "center", marginBottom: 16 },
});

export default ComfirmationDriver
;
