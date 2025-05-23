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
  searchQuery: string;
  limit?: number; // Optional limit
  onViewAll: () => void;
}

const HomeShipmentHistory = ({searchQuery,onViewAll, limit}: ShipmentHistoryProps) => {
  const [allShipments, setAllShipments] = useState<ParcelDetails[]>([]);
  useEffect(() => {
    const fetchShipments = async () => {
      try {
        const result = await getShipmentsHistory();
        console.log(result, "result");
        setAllShipments(result?.data?.details?.rows);
      } catch (error) {
        console.error("Failed to fetch drivers:", error);
      }
    };
    fetchShipments();
  }, []);
  // Filter shipments based on the search query
  const filteredShipments = allShipments?.filter(item => {
    const parcelId = item?.parcelId?.toLowerCase() || ''; // Default to empty string if null or undefined
    const phone = item?.receiver?.phone?.toLowerCase() || ''; // Default to empty string if null or undefined
    const query = (searchQuery || '').toLowerCase();
  
    return parcelId.includes(query) || phone.includes(query);
  });
  
  const visibleShipments = limit ? filteredShipments.slice(0, limit) : filteredShipments;



  return (
    <View style={styles.shipmentContainer}>
      <Text style={styles.shipmentLabel} font='SemiBold'>
        Shipment History
      </Text>
      {visibleShipments.map((item, index) => (
        <View key={index} style={styles.shipmentRow}>
          <Image source={{ uri: item?.parcel?.thumbnails[0] }} style={styles.shipmentImage} />
          <View style={styles.shipmentDetails}>
            <View style={{flexDirection: 'column', gap: 4}}>
              <Text size={11} color='#717680'>
                Sender
              </Text>
              <Text size={12}>{item.sender.fullName ? item.sender.fullName: item.sender.phone }</Text>
              <Text size={10} color='#717680'>
                {formatDate(item.createdAt)}
              </Text>
            </View>
            <View style={{flexDirection: 'column', gap: 4}}>
              <Text size={10} color='#717680'>
                Receiver
              </Text>
              <Text size={12}>{item?.receiver.fullName ? item?.receiver.fullName : item?.receiver.phone}</Text>
              
            </View>
            <View style={{flexDirection: 'column', gap: 4}}>
              <Text size={10} color='#717680'>
                Charges
              </Text>
              <Text size={12}>₦{item?.parcel.totalFee}</Text>
          
          <View
            style={{
              backgroundColor:
                item.status === 'unassigned'
                  ? '#FFEAD5'
                  : item.status === 'assigned'
                  ? '#E0F2FE'
                  : item.status === 'arrived'
                  ? '#EBE9FE'
                  : item.status === 'overdue'
                  ? '#FEE2E2'
                  : item.status === 'received'
                  ? '#DFFCE9'
                  : '#E5E7EB', // default fallback
              padding: 4,
              borderRadius: 8,
            }}
          >
            <Text
              style={{
                color:
                  item.status === 'unassigned'
                    ? '#FB6514'
                    : item.status === 'assigned'
                    ? '#0284C7'
                    : item.status === 'arrived'
                    ? '#7A5AF8'
                    : item.status === 'overdue'
                    ? '#DC2626'
                    : item.status === 'received'
                    ? '#12B76A'
                    : '#374151', // default fallback
                fontSize: 10,
              }}
            >
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
