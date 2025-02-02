import React from 'react';
import {View, Image, TouchableOpacity, StyleSheet} from 'react-native';
import {Text} from '@/components';
import {RFValue} from 'react-native-responsive-fontsize';
import {color} from '@/constants/Colors';

interface ShipmentItem {
  image: any;
  sender: string;
  receiver: string;
  time: string;
  charges: string;
  status: string;
}

interface ShipmentHistoryProps {
  data: ShipmentItem[];
  onViewAll: () => void;
}

const HomeShipmentHistory = ({data, onViewAll}: ShipmentHistoryProps) => {
  return (
    <View style={styles.shipmentContainer}>
      <Text style={styles.shipmentLabel} font='SemiBold'>
        Shipment History
      </Text>
      {data.map((item, index) => (
        <View key={index} style={styles.shipmentRow}>
          <Image source={item.image} style={styles.shipmentImage} />
          <View style={styles.shipmentDetails}>
            <View style={{flexDirection: 'column', gap: 4}}>
              <Text size={11} color='#717680'>
                Sender
              </Text>
              <Text size={12}>{item.sender}</Text>
              <Text size={10} color='#717680'>
                {item.time}
              </Text>
            </View>
            <View style={{flexDirection: 'column', gap: 4}}>
              <Text size={10} color='#717680'>
                Receiver
              </Text>
              <Text size={12}>{item.receiver}</Text>
            </View>
            <View style={{flexDirection: 'column', gap: 4}}>
              <Text size={10} color='#717680'>
                Charges
              </Text>
              <Text size={12}>{item.charges}</Text>
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
