import { CustomView, Button, Text } from "@/components";
import { RootStackParamList } from "@/navigation/navigationType";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { AccountStackList } from "@/navigation/navigationType";
import { AuthStackParamList } from "@/navigation/navigationType";
import LogoutIcon from "@/components/svg/LogoutIcon";
import { Avatar } from "../../assets/images";
import { View, Image, TouchableOpacity, ViewStyle } from "react-native";
import ArrowRight from "@/components/svg/ArrowRight";
import AccountButton, { IAccountButton } from "@/components/AccountButton";
import { RFValue } from "react-native-responsive-fontsize";
import ScreenHeader from "@/components/share/ScreenHeader";

type Props = NativeStackScreenProps<
  RootStackParamList & AccountStackList & AuthStackParamList
>;

const SettingsPage = ({ navigation }: Props) => {
  const accountButtonData: IAccountButton[] = [
    {
      label: "Account Information",
      desc: "Update your account information",
      url: "AccountInformation",
    },
    {
      label: "Parcel Updates",
      desc: "Parcel notification settings",
      url: "ParcelUpdates",
    },
    {
      label: "Overdue Parcel",
      desc: "Overdue parcel notification settings",
      url: "OverdueParcel",
    },
    {
      label: "Help and Support",
      desc: "Get support or send feedback",
      url: "HomeAndSupport",
    },
  ];
  const $bodyHeader: ViewStyle = {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: RFValue(18),
  };
  return (
    <CustomView style={styles.container} padded>
<ScreenHeader title="Account Settings" OnNotificationClick={() => navigation.navigate("NotificationsScreen")} type="Home" />
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        keyboardShouldPersistTaps="handled"
      >
        <View
          style={{
            flexDirection: "column",
            alignItems: "center",
            marginTop: RFValue(16),
            gap: RFValue(12),
          }}
        >
          {/* Profile Image */}
          <Image
            source={Avatar}
            style={{
              width: 84,
              height: 84,
              borderRadius: 42, 
              backgroundColor: "#E0E0E0",
            }}
            resizeMode="cover"
          />
        </View>
        {/* settings button */}
        <View style={styles.buttonContainer}>
          <View style={$bodyHeader}>
            <Text font="SemiBold" size={18}>
              Chinedu Marcus
            </Text>
            <Text size={14} font="Medium" color="#717680">
              Agent ID: PP64763
            </Text>
          </View>

          <AccountButton buttons={accountButtonData} />
        </View>

        {/* logout button */}
        <TouchableOpacity
          onPress={() => navigation.replace("AuthStacks", { screen: "Login" })}
          style={{
            width: "100%",
            padding: RFValue(8),
            flexDirection: "row",
            marginVertical: RFValue(12),
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "#FDFDFD",
            borderWidth: 1,
            borderColor: "#D5D7DA",
            borderRadius: 8,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent:"center",
              gap: RFValue(10),
            }}
          >
            <LogoutIcon color="#F5F5F5" />
            <Text size={14} font="Medium">
              Log Out
            </Text>
          </View>
          {/* <Ionicons name="arrow-forward" size={20} /> */}
          <ArrowRight color="" />
        </TouchableOpacity>
      </ScrollView>
    </CustomView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonContainer: {
    paddingVertical: RFValue(24),
    paddingHorizontal: RFValue(12),
    backgroundColor: "#FAFAFA",
    marginTop: RFValue(16),
    borderRadius: RFValue(16),
    width: "100%",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "80%",
  },
  label: {
    fontSize: 18,
  },
});

export default SettingsPage;
