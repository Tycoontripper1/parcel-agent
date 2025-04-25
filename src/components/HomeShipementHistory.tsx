import React, { useEffect, useState } from 'react';
import {View, Image, TouchableOpacity, StyleSheet} from 'react-native';
import {Text} from '@/components';
import {RFValue} from 'react-native-responsive-fontsize';
import {color} from '@/constants/Colors';
import { getShipmentsHistory } from '../../services/parcel';
import { formatDate } from '@/utils/formartDates';

interface ParcelDetails {
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
  park: {
    source: string;
    destination: string;
  };
  addedBy: {
    name: string;
    phone: string;
  };
  paymentOption: string | null;
  paymentStatus: string;
  driver: string | null;
  status: string;
  parcelId: string;
  qrImage: string;
  createdAt: string;
}


interface ShipmentHistoryProps {
  onViewAll: () => void;
}

const HomeShipmentHistory = ({onViewAll}: ShipmentHistoryProps) => {
  const [allShipments, setAllShipments] = useState<ParcelDetails[]>([]);
  useEffect(() => {
    const fetchDriver = async () => {
      try {
        const result = await getShipmentsHistory();
        console.log(result, "result");
        setAllShipments(result?.data?.details?.rows);
      } catch (error) {
        console.error("Failed to fetch drivers:", error);
      }
    };
    fetchDriver();
  }, []);



  return (
    <View style={styles.shipmentContainer}>
      <Text style={styles.shipmentLabel} font='SemiBold'>
        Shipment History
      </Text>
      {allShipments.map((item, index) => (
        <View key={index} style={styles.shipmentRow}>
          <Image source={{ uri: item?.parcel?.thumbnails[0] }} style={styles.shipmentImage} />
          <View style={styles.shipmentDetails}>
            <View style={{flexDirection: 'column', gap: 4}}>
              <Text size={11} color='#717680'>
                Sender
              </Text>
              <Text size={12}>{item.sender.fullName}</Text>
              <Text size={10} color='#717680'>
                {formatDate(item.createdAt)}
              </Text>
            </View>
            <View style={{flexDirection: 'column', gap: 4}}>
              <Text size={10} color='#717680'>
                Receiver
              </Text>
              <Text size={12}>{item?.receiver.fullName}</Text>
            </View>
            <View style={{flexDirection: 'column', gap: 4}}>
              <Text size={10} color='#717680'>
                Charges
              </Text>
              <Text size={12}>₦{item?.parcel.totalFee}</Text>
              <View
                style={{
                  backgroundColor:
                    item.status === 'Arrived'
                      ? '#F7F9FC'
                      : item.status === 'Delivered'
                      ? '#ECFDF3'
                      : '#FFF6ED',
                  justifyContent: 'center',
                  flexDirection: 'row',
                  borderRadius: 8,
                }}>
                <Text
                  size={10}
                  color={
                    item.status === 'Arrived'
                      ? '#213264'
                      : item.status === 'Delivered'
                      ? '#12B76A'
                      : '#FB6514'
                  }>
                  {item.status}
                </Text>
              </View>
            </View>
          </View>
        </View>
      ))}
      <TouchableOpacity onPress={onViewAll}>
        <Text style={styles.viewAll}>View All</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  shipmentContainer: {
    marginVertical: RFValue(16),
    backgroundColor: color.offWhite,
    paddingVertical: RFValue(16),
    borderRadius: 10,
  },
  shipmentLabel: {
    fontSize: RFValue(18),
    marginBottom: RFValue(8),
    alignSelf: 'center',
  },
  shipmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: RFValue(10),
    borderRadius: RFValue(10),
    marginBottom: RFValue(8),
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFF0',
  },
  shipmentImage: {
    width: RFValue(40),
    height: RFValue(40),
    borderRadius: RFValue(20),
    marginRight: RFValue(10),
  },
  shipmentDetails: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  viewAll: {
    textAlign: 'center',
    color: '#003399',
    marginTop: RFValue(10),
  },
});

export default HomeShipmentHistory;
