import { CustomView, Spinner, Text } from "@/components";

// import { Clipboard } from 'react-native';
import ButtonHome from "@/components/ButtonHome";
import KeyBoardView from "@/components/KeyBoardView";
import { RootState } from "@/redux/store";
import { NativeStackNavigationProp, NativeStackScreenProps } from "@react-navigation/native-stack";

import ViewShot from "react-native-view-shot";
import * as Print from "expo-print";

import { PDFDocument, rgb } from "pdf-lib";
import React, { useRef, useState } from "react";
import { Alert } from "react-native";
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ViewStyle,
  Dimensions
} from "react-native";

import { HomeStackList, ReportStackList, RootStackParamList } from "@/navigation/navigationType";
import { RouteProp } from "@react-navigation/native";
import { RFValue } from "react-native-responsive-fontsize";
import { useSelector } from "react-redux";
import HomeHeader from "@/components/share/HomeHeader";
import * as Sharing from 'expo-sharing';
import { WebView } from "react-native-webview";
import JsBarcode from "jsbarcode";
import Barcode from '@kichiyaki/react-native-barcode-generator';



type TransactionType = "Handling fee" | "Overdue fee" | "Upfront fee";

interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  date: string;
  receiver: string;
  sender: string;
  title: string;
  properDate: string;
  status: string;
}


interface Props {
  navigation: NativeStackNavigationProp<RootStackParamList>;
  route: RouteProp<HomeStackList, 'PrintParcel'>;
}
const PrintParcel = ({  navigation }: Props) => {
  const formData = useSelector((state: RootState) => state.parcel);
  const viewShotRef = useRef<ViewShot | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [BarValue, setBarValue] = useState('lintangwisesa');

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
    padding: RFValue(16),
  };
  const parcelId = "PEH658498706"

  const copyToClipboard = (text: string) => {
    // Clipboard.setString(text);
    Alert.alert("Copied", "Parcel ID copied to clipboard");
  };

  


  const handlePrint = async () => {
    const viewShot = viewShotRef.current; // Store reference
  
    if (!viewShot) {
      Alert.alert("Error", "ViewShot reference is not available.");
      return;
    }
  
    try {
      const uri = await viewShot?.capture?.(); // No more possible null warning
      console.log("Captured URI:", uri);
  
      if (uri) {
        const isAvailable = await Sharing.isAvailableAsync();
        if (!isAvailable) {
          Alert.alert("Error", "Sharing is not available on this device.");
          return;
        }
  
        await Sharing.shareAsync(uri);
      } else {
        Alert.alert("Error", "Failed to capture the image.");
      }
    } catch (error) {
      Alert.alert("Print Error", "Something went wrong while sharing.");
      console.error("Sharing Error:", error);
    }
  };
  
  
  const handleExportPDF = async () => {
    try {
      // Ensure viewShotRef is available
      const viewShot = viewShotRef.current;
      if (!viewShot || !viewShot.capture) {
        Alert.alert("Error", "ViewShot reference is not available.");
        return;
      }
  
      // Capture screenshot
      const uri = await viewShot.capture();
      if (!uri) {
        Alert.alert("Error", "Failed to capture the screenshot.");
        return;
      }
  
      console.log("Captured URI:", uri);
  
      // Fetch the image file
      let response;
      try {
        response = await fetch(uri);
      } catch (fetchError) {
        console.error("Fetch Error:", fetchError);
        Alert.alert("Error", "Failed to fetch the captured image.");
        return;
      }
  
      // Convert to Blob
      const blob = await response.blob();
  
      // Convert to Base64
      const reader = new FileReader();
      reader.readAsDataURL(blob);
  
      reader.onloadend = async () => {
        const result = reader.result;
        if (!result || typeof result !== "string") {
          Alert.alert("Error", "Failed to convert image to Base64.");
          return;
        }
  
        // Ensure the result contains "base64,"
        const base64Index = result.indexOf("base64,");
        if (base64Index === -1) {
          Alert.alert("Error", "Invalid Base64 format.");
          return;
        }
  
        const base64data = result.substring(base64Index + 7); // Extract only the Base64 data
  
        try {
          // Generate PDF
          const { uri: pdfUri } = await Print.printToFileAsync({
            html: `<img src="data:image/png;base64,${base64data}" style="width:100%" />`,
            base64: true,
          });
  
          console.log("PDF Saved at:", pdfUri);
  
          // Share or Save the PDF
          const canShare = await Sharing.isAvailableAsync();
          if (canShare) {
            await Sharing.shareAsync(pdfUri);
          } else {
            Alert.alert("PDF saved", `Saved at: ${pdfUri}`);
          }
        } catch (printError) {
          console.error("Print Error:", printError);
          Alert.alert("Error", "Failed to generate PDF.");
        }
      };
    } catch (error) {
      console.error("Export PDF Error:", error);
      Alert.alert("Error", "Something went wrong while exporting to PDF.");
    }
  };
  
  


  return (
    <CustomView style={{ paddingVertical: RFValue(10) }}>
      <View style={{ paddingHorizontal: RFValue(10) }}>
        <HomeHeader type="Stack" title="Parcel Details" />
      </View>

      {/* Body */}
      <KeyBoardView padded={false}>
      <ViewShot ref={viewShotRef} options={{ format: "png", quality: 1 }}>
      <View>
          <Text style={{ textAlign: "center" }}>Parcel ID</Text>
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
          <Text size={12}>PEH658498706</Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 6,
            }}
          >
            <TouchableOpacity onPress={() => copyToClipboard(parcelId)}>
              <View
                style={{
                  backgroundColor: "#FEDEDC",
                  padding: 4,
                  borderRadius: 8,
                }}
              >
                <Text color="#F04438" size={10}>
                  Copy
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingVertical: 6,
            padding: RFValue(16),
          }}
        >
          <Text size={12}>
            Date: <Text color="#717680">01-10-2024</Text>
          </Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 6,
            }}
          >
            <View style={{ padding: 4, borderRadius: 8 }}>
              <Text size={12}>
                Time: <Text color="#717680">01:30 PM</Text>
              </Text>
            </View>
          </View>
        </View>

        {/* From Sender's Information */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeader} font="SemiBold" size={14}>
            From
          </Text>
          <View
            style={{
              backgroundColor: "white",
              padding: RFValue(6),
              borderRadius: 8,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text style={styles.infoText}>Name: </Text>
              <Text style={styles.infoText}>{formData.senderFullName} </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text style={styles.infoText}>Email: </Text>
              <Text style={styles.infoText}>{formData.senderEmail} </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text style={styles.infoText}>Phone Number:</Text>
              <Text style={styles.infoText}>{formData.senderPhoneNumber} </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text style={styles.infoText}>Dispatch Park </Text>
              <Text style={styles.infoText}>{formData.sendingFrom}</Text>
            </View>
          </View>
        </View>

        {/* To Receiver's Information */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeader} font="SemiBold" size={14}>
            To
          </Text>
          <View
            style={{
              backgroundColor: "white",
              padding: RFValue(6),
              borderRadius: 8,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text style={styles.infoText}>Name </Text>
              <Text style={styles.infoText}>{formData.receiverFullName} </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text style={styles.infoText}>Email </Text>
              <Text style={styles.infoText}>{formData.receiverEmail} </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text style={styles.infoText}>Phone Number</Text>
              <Text style={styles.infoText}>
                {formData.receiverPhoneNumber}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text style={styles.infoText}>Delivery Park</Text>
              <Text style={styles.infoText}>
                {"Challenge Motor Park (Terminal 1)"}
              </Text>
            </View>
          </View>
        </View>

        {/* Driver’s Information */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeader} font="SemiBold" size={14}>
            Driver’s Information
          </Text>
          <View
            style={{
              backgroundColor: "white",
              padding: RFValue(6),
              borderRadius: 8,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text style={styles.infoText}>Name</Text>
              <Text style={styles.infoText}>{"Chinedu Joseph"}</Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text style={styles.infoText}>Phone Number</Text>
              <Text style={styles.infoText}>{formData.driverNumber}</Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text style={styles.infoText}>Driver ID</Text>
              <Text style={styles.infoText}>{"PP878r86"}</Text>
            </View>
          </View>
        </View>

            {/* Barcode */}
            <View style={styles.barcodeContainer}>
              <Barcode
                    format="CODE128"
                    value={parcelId}
                    text={BarValue ? BarValue : 'lintangwisesa'}
                    style={{ marginBottom: 20 }}
                    textStyle={{ color:'#000' }}
                    maxWidth={Dimensions.get('window').width / 1.5}
                    background="#fffff"
                    lineColor="#000"
                    width={2}
                />
        </View>

      </ViewShot>
        <View style={$buttonsContainer}>
          <ButtonHome
            onPress={handlePrint}
            title="Print Parcel Slip"
            style={{ height: 55 }}
          />
        </View>
        <View style={$buttonsContainer}>
          <ButtonHome
            onPress={handleExportPDF}
            title="Save as PDF"
            style={{ height: 55 }}
          />
        </View>
      </KeyBoardView>
    </CustomView>
  );
};

const styles = StyleSheet.create({
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
    color: "#717680",
  },
  descriptionText: {
    fontSize: RFValue(10),
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

export default PrintParcel;
