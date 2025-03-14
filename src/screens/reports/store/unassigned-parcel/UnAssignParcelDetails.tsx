import { CustomView, Spinner, Text } from "@/components";
import ButtonHome from "@/components/ButtonHome";
import ConfirmPaymentModal from "@/components/ComfirmPaymentModal";
import KeyBoardView from "@/components/KeyBoardView";
import { RootState } from "@/redux/store";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import { ReportStackList } from "@/navigation/navigationType";
import { RouteProp } from "@react-navigation/native";
import { RFValue } from "react-native-responsive-fontsize";
import { useSelector } from "react-redux";
import HomeHeader from "@/components/share/HomeHeader";
import { Avatar } from "../../../../../assets/images";
import PaymentOption from "@/components/PaymentOption";

    type TransactionType = "Handling fee" | "Overdue fee" | "Upfront fee";

interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  date: string;
  receiver:string
  sender: string
  title: string;
  properDate:string
  status:string
}


  
// Define the props correctly
type Props = NativeStackScreenProps<ReportStackList, "UnAssignParcelDetails">;

// OR if you only need the `route` prop:
interface RouteProps {
  route: RouteProp<ReportStackList, "UnAssignParcelDetails">;
}
const UnAssignParcelDetails = ({ route, navigation }: Props) => {
      const formData = useSelector((state: RootState) => state.parcel);
        const [selectedOption, setSelectedOption] = useState<string>('Online');
        const [selectedPaymentAnswer, setSelectedPaymentAnswer] = useState<
          string | null
        >(null);
         const [modalVisible, setModalVisible] = useState(false);
    
      const HandleContinue = () => {
        console.log({formData});
        // navigation.navigate('');
      };
    const { idFrontImage, idBackImage } = useSelector(
      (state: RootState) => state.form
    );
  const { id } = route.params;


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

  return (
    <CustomView style={{paddingVertical: RFValue(10)}}>

      {modalVisible && (
        <ConfirmPaymentModal
          selectedOption={selectedPaymentAnswer}
          setModalVisible={setModalVisible}
          setSelectedOption={setSelectedPaymentAnswer}
          modalVisible={modalVisible}
        />
      )}
      <View style={{ paddingHorizontal: RFValue(10) }}>
        <HomeHeader type="Stack" title="Parcel Details" />
      </View>

      {/* Body */}
      <KeyBoardView padded={false}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 6,
            padding: RFValue(16),
            marginTop: RFValue(8),
          }}>
          <Text size={12}>Status</Text>
         <View style={{   flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 6}}>
         <View
            style={{backgroundColor: '#EBE9FE', padding: 4, borderRadius: 8,}}>
            <Text color='#7A5AF8' size={10}>Assigned</Text>
          </View>
         </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 6,
            padding: RFValue(16),
          }}>
          <Text size={12}>Date: <Text color="#717680">01-10-2024</Text></Text>
         <View style={{   flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 6}}>
         <View
            style={{ padding: 4, borderRadius: 8,}}>
             <Text size={12}>Time: <Text color="#717680">01:30 PM</Text></Text>
          </View>
         </View>
        </View>

        {/* Sender's Information */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeader} font='SemiBold' size={14}>
            Sender's Information
          </Text>
          <View
            style={{
              backgroundColor: 'white',
              padding: RFValue(6),
              borderRadius: 8,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text style={styles.infoText}>Name: </Text>
              <Text style={styles.infoText}>{formData.senderFullName} </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text style={styles.infoText}>Email: </Text>
              <Text style={styles.infoText}>{formData.senderEmail} </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text style={styles.infoText}>Phone Number:</Text>
              <Text style={styles.infoText}>{formData.senderPhoneNumber} </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text style={styles.infoText}>Address: </Text>
              <Text style={styles.infoText}>{formData.senderAddress} </Text>
            </View>
          </View>
        </View>

        {/* Receiver's Information */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeader} font='SemiBold' size={14}>
            Receiver's Information
          </Text>
          <View
            style={{
              backgroundColor: 'white',
              padding: RFValue(6),
              borderRadius: 8,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text style={styles.infoText}>Name: </Text>
              <Text style={styles.infoText}>{formData.receiverFullName} </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text style={styles.infoText}>Email: </Text>
              <Text style={styles.infoText}>{formData.receiverEmail} </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text style={styles.infoText}>Phone Number:</Text>
              <Text style={styles.infoText}>{formData.receiverPhoneNumber}</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text style={styles.infoText}>Address:</Text>
              <Text style={styles.infoText}>{formData.receiverAddress}</Text>
            </View>
          </View>
        </View>

        {/* Park Detail */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeader} font='SemiBold' size={14}>
            Park Detail
          </Text>
          <View
            style={{
              backgroundColor: 'white',
              padding: RFValue(6),
              borderRadius: 8,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text style={styles.infoText}>Dispatch Park:</Text>
              <Text style={styles.infoText}>{formData.sendingFrom}</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text style={styles.infoText}>Delivery Park:</Text>
              <Text style={styles.infoText}>{formData.deliveryMotorPark}</Text>
            </View>
          </View>
        </View>

        {/* Parcel Information */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeader} font='SemiBold' size={14}>
            Parcel Information
          </Text>
          <View
            style={{
              backgroundColor: 'white',
              padding: RFValue(6),
              borderRadius: 8,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text style={styles.infoText}>Charges Paid By:</Text>
              <Text style={styles.infoText}>{formData.chargesPayBy}</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text style={styles.infoText}>Parcel Type:</Text>
              <Text style={styles.infoText}>{formData.parcelType}</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text style={styles.infoText}>Parcel Worth:</Text>
              <Text style={styles.infoText}>{formData.parcelValue}</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottomWidth: 1,
                borderBottomColor: '#E9EAEB',
              }}>
              <Text style={styles.infoText}>Charges Payable:</Text>
              <Text style={styles.infoText}>{formData.chargesPayable}</Text>
            </View>
          </View>
        </View>

        {/* Parcel Description */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeader} font='SemiBold' size={14}>
            Parcel Description
          </Text>
          <View
            style={{
              backgroundColor: 'white',
              padding: RFValue(6),
              borderRadius: 8,
            }}>
            <Text style={styles.descriptionText}>
              {formData.parcelDescription}
            </Text>
          </View>
        </View>

        {formData.parcelImages &&
        formData.parcelImages.filter((photo) => photo).length > 0 ? (
          <View style={{paddingVertical: RFValue(10), padding: RFValue(16)}}>
            <Text style={styles.counter}>
              {formData.parcelImages.filter((photo) => photo !== null).length}
              /4 photos
            </Text>
            <View style={styles.photoGrid}>
              {formData.parcelImages.map((photo, index) => (
                <TouchableOpacity key={index} style={styles.photoBox}>
                  {photo ? (
                    <Image source={{uri: photo}} style={styles.photoPreview} />
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
        <View style={$buttonsContainer}>
          <ButtonHome
            onPress={HandleContinue}
            title='View Parcel Slip'
            style={{height: 55}}
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
    paddingVertical:RFValue(6)
  },
  sectionHeader: {
    paddingVertical: RFValue(8),
    borderBottomWidth: 1,
    borderBottomColor: "#E9EAEB",
    marginBottom: RFValue(6),
  },
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

export default UnAssignParcelDetails;
