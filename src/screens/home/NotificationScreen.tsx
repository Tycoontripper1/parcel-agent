import React, { useCallback, useState } from "react";
import {
  View,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Platform,
  RefreshControl,
  Image,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { HomeStackList } from "@/navigation/navigationType";
import { CustomView, Text } from "@/components";
import HomeHeader from "@/components/share/HomeHeader";
import { RFValue } from "react-native-responsive-fontsize";
import { ArrowRight2 } from "iconsax-react-native";
import { color } from "@/constants/Colors";
import NotificationIcon from "@/components/svg/NotificationIcon";
import {
  getAllNotification,
  markNotificationAsRead,
} from "../../../services/auth";
import { useFocusEffect } from "@react-navigation/native";
import { parseISO } from "date-fns";
import { Ionicons } from "@expo/vector-icons";
import { format, subDays } from "date-fns";

export interface NotificationItem {
  id: string;
  title: string;
  content?: string;
  isRead?: boolean;
  createdAt?: string;
  startDate?: string;
  endDate?: string;
}

type Props = NativeStackScreenProps<HomeStackList>;

const NotificationsScreen = ({ navigation }: Props) => {
  const [refreshing, setRefreshing] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useFocusEffect(
    useCallback(() => {
      const fetchNotification = async () => {
        // Get current date
        const currentDate = new Date();

        // Calculate date 7 days ago
        const sevenDaysAgo = subDays(currentDate, 7);

        // Format dates as YYYY-MM-DD strings
        const endDate = format(currentDate, "yyyy-MM-dd");
        const startDate = format(sevenDaysAgo, "yyyy-MM-dd")

        const notification = await getAllNotification(startDate, endDate);
        setNotifications(notification?.data.details || []);
      };

      fetchNotification();
    }, [])
  );
  const onRefresh = useCallback(() => {
    setRefreshing(true);

    // Simulate a network request
    setTimeout(() => {
      setRefreshing(false); // End the refreshing state
    }, 1500);
  }, []);

  const NotificationIcon = ({ showDot = false }) => {
    return (
      <View style={{ position: "relative", width: 40, height: 40 }}>
        <View
          style={{
            borderWidth: 1,
            borderColor: "#cccc",
            borderRadius: 20,
            width: 40,
            height: 40,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Ionicons name="notifications-outline" size={22} color="black" />
        </View>

        {/* Red dot if not read */}
        {showDot && (
          <View
            style={{
              position: "absolute",
              top: -2,
              right: 4,
              backgroundColor: "red",
              borderRadius: 5,
              width: 10,
              height: 10,
            }}
          />
        )}
      </View>
    );
  };

  interface HandlePressNotificationParams extends NotificationItem {}

  const handlePressNotification = async (
    notif: HandlePressNotificationParams
  ): Promise<void> => {
    if (!notif.isRead) {
      await markNotificationAsRead(notif.id);
      setNotifications((prev: NotificationItem[]) =>
        prev.map((n: NotificationItem) =>
          n.id === notif.id ? { ...n, isRead: true } : n
        )
      );
    }
    navigation.navigate("NotificationDetails", {
      id: notif.id,
    });
    //(notif, "Notification pressed");
  };

  const renderNotification = ({ item }: { item: NotificationItem }) => (
    <View style={styles.notificationCard}>
      <View>
        <NotificationIcon showDot={!item?.isRead} />
      </View>
      <View style={{ flexBasis: "90%" }}>
        <View
          style={{
            paddingBottom: 4,
            borderBottomWidth: 1,
            borderBottomColor: "#E9EAEB",
          }}
        >
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item?.content}</Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: 10,
            paddingHorizontal: 10,
          }}
        >
          <Text style={styles.timestamp}>
            {format(parseISO(item?.createdAt ?? ""), "dd-MM-yyyy, hh:mm a")}
          </Text>
          <TouchableOpacity
            onPress={() => handlePressNotification(item)}
            style={{ flexDirection: "row", alignItems: "center" }}
          >
            <Text style={styles.viewText} size={12} font="SemiBold">
              View
            </Text>
            <ArrowRight2 size={16} color={color.secondary} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
  const EmptyNotifications = () => (
    <View style={styles.emptyContainer}>
      <Image
        source={{
          uri: "https://cdn-icons-png.flaticon.com/512/4076/4076478.png",
        }}
        style={styles.emptyImage}
        resizeMode="contain"
      />
      <Text style={styles.emptyTitle}>No Notifications Yet</Text>
      <Text style={styles.emptySubtitle}>
        When you get notifications, they'll appear here
      </Text>
    </View>
  );

  return (
    <CustomView style={{ flex: 1 }}>
      {/* Header */}
      <View style={{ padding: RFValue(16) }}>
        <HomeHeader type="Stack" title="Notifications" />
      </View>
      <View style={styles.container}>
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={renderNotification}
          contentContainerStyle={[
            styles.list,
            notifications.length === 0 && styles.emptyList,
          ]}
          ListEmptyComponent={<EmptyNotifications />}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={
                Platform.OS === "android"
                  ? [color.primary, color.inputColor, "blue"]
                  : undefined
              } // Android spinner colors
              tintColor={Platform.OS === "ios" ? color.primary : undefined} // iOS spinner color
            />
          }
        />
      </View>
    </CustomView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9F9F9", marginVertical: 10 },

  list: { paddingHorizontal: 16, paddingVertical: 16 },
  notificationCard: {
    backgroundColor: "#FFF",
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 10,
  },
  title: { fontSize: 16, fontWeight: "bold", color: "#333" },
  description: { fontSize: 14, color: "#666", marginVertical: 8 },
  timestamp: { fontSize: 12, color: "#999" },
  viewText: { color: color.secondary },
  emptyList: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    alignItems: "center",
    paddingHorizontal: RFValue(40),
    marginTop: RFValue(-50), // Adjust based on your layout
  },
  emptyImage: {
    width: RFValue(200),
    height: RFValue(200),
    marginBottom: RFValue(16),
  },
  emptyTitle: {
    fontSize: RFValue(18),
    fontFamily: "Medium",
    color: color.gray,
    marginBottom: RFValue(8),
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: RFValue(14),
    fontFamily: "Regular",
    color: color.textGray,
    textAlign: "center",
    lineHeight: RFValue(20),
  },
});

export default NotificationsScreen;
