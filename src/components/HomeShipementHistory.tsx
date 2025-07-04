import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { Text } from "@/components";
import { RFValue } from "react-native-responsive-fontsize";
import { color } from "@/constants/Colors";
import { getShipmentsHistory } from "../../services/parcel";
import { formatDate } from "@/utils/formartDates";

interface ParcelDetails {
  id: string;
  sender: { phone: string; fullName: string; email: string; address: string };
  receiver: { phone: string; fullName: string; email: string; address: string };
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
  park: { source: string; destination: string };
  addedBy: { name: string; phone: string };
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
  limit?: number;
  onViewAll: () => void;
  handleViewAll?: (item: ParcelDetails) => void;
}

const fallbackImage = "https://via.placeholder.com/100x100?text=No+Image";

const HomeShipmentHistory = ({
  searchQuery,
  onViewAll,
  limit,
  handleViewAll,
}: ShipmentHistoryProps) => {
  const [allShipments, setAllShipments] = useState<ParcelDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShipments = async () => {
      try {
        const result = await getShipmentsHistory();
        if (result?.data?.error) {
          setAllShipments([]);
        } else {
          setAllShipments(result?.data?.details?.rows || []);
        }
      } catch (error) {
        console.error("Failed to fetch shipments:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchShipments();
  }, []);

  const filteredShipments = allShipments.filter((item) => {
    const query = (searchQuery || "").toLowerCase();
    return (
      item?.parcelId?.toLowerCase().includes(query) ||
      item?.receiver?.phone?.toLowerCase().includes(query) ||
      item?.sender?.phone?.toLowerCase().includes(query)
    );
  });

  const visibleShipments = limit
    ? filteredShipments.slice(0, limit)
    : filteredShipments;

  const renderShipmentItem = ({ item }: { item: ParcelDetails }) => {
    const statusColors = {
      unassigned: { bg: "#FFEAD5", text: "#FB6514" },
      assigned: { bg: "#E0F2FE", text: "#0284C7" },
      arrived: { bg: "#EBE9FE", text: "#7A5AF8" },
      overdue: { bg: "#FEE2E2", text: "#DC2626" },
      received: { bg: "#DFFCE9", text: "#12B76A" },
      default: { bg: "#E5E7EB", text: "#374151" },
    };

    const currentColor =
      statusColors[item.status as keyof typeof statusColors] || statusColors.default;

    return (
      <TouchableOpacity
        style={styles.shipmentRow}
        onPress={() => handleViewAll?.(item)}
      >
     
        <Image
          source={{
            uri:    `http://45.9.191.184:8001/parcel/v1.0/api/files?slugs=${item?.parcel?.thumbnails[0] || fallbackImage}`,
          }}
          style={styles.shipmentImage}
        />
        <View style={styles.shipmentDetails}>
          <View style={{ flexDirection: "column", gap: 4 }}>
            <Text size={RFValue(10)} color="#717680">
              Sender
            </Text>
            <Text size={RFValue(8)}>
              {item.sender.fullName || item.sender.phone}
            </Text>
            <Text size={8} color="#717680">
              {formatDate(item.createdAt)}
            </Text>
          </View>
          <View style={{ flexDirection: "column", gap: 4 }}>
            <Text size={10} color="#717680">
              Receiver
            </Text>
            <Text size={RFValue(8)}>
              {item?.receiver.fullName || item?.receiver.phone}
            </Text>
          </View>
          <View style={{ flexDirection: "column", gap: 4 }}>
            <Text size={10} color="#717680">
              Charges
            </Text>
            <Text size={RFValue(8)}>₦{item?.parcel.totalFee}</Text>
            <View
              style={{
                backgroundColor: currentColor.bg,
                padding: 4,
                borderRadius: 8,
              }}
            >
              <Text
                style={{
                  color: currentColor.text,
                  fontSize: RFValue(8),
                  textAlign: "center",
                }}
              >
                {item.status === "received"
                  ? "Collected"
                  : item.status.charAt(0).toUpperCase() + item.status.slice(1)}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.shipmentContainer}>
      <Text style={styles.shipmentLabel} font="SemiBold">
        Shipment History
      </Text>
      {loading ? (
        <ActivityIndicator size="large" color="#AEFF8C" />
      ) : (
        // <FlatList
        //   data={visibleShipments}
        //   keyExtractor={(item) => item.id}
        //   renderItem={renderShipmentItem}
        //   contentContainerStyle={{ paddingBottom: 8 }}
        // />
        <View style={{ paddingBottom: 8 }}>
  {visibleShipments.map((item) => (
    <View key={item.id}>{renderShipmentItem({ item })}</View>
  ))}
</View>

      )}
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
    alignSelf: "center",
  },
  shipmentRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: RFValue(10),
    borderRadius: RFValue(10),
    marginBottom: RFValue(8),
    borderBottomWidth: 1,
    borderBottomColor: "#EFEFF0",
  },
  shipmentImage: {
    width: RFValue(40),
    height: RFValue(40),
    borderRadius: RFValue(20),
    marginRight: RFValue(10),
  },
  shipmentDetails: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  viewAll: {
    textAlign: "center",
    color: "#003399",
    marginTop: RFValue(10),
  },
});

export default HomeShipmentHistory;
