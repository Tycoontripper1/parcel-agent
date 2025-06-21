import { CustomView, Button, Text } from "@/components";
import { RootStackParamList } from "@/navigation/navigationType";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Modal, Animated, Easing, TouchableWithoutFeedback } from "react-native";
import { AccountStackList } from "@/navigation/navigationType";
import { AuthStackParamList } from "@/navigation/navigationType";
import LogoutIcon from "@/components/svg/LogoutIcon";
import { Avatar } from "../../assets/images";
import { View, Image, TouchableOpacity, ViewStyle } from "react-native";
import ArrowRight from "@/components/svg/ArrowRight";
import AccountButton, { IAccountButton } from "@/components/AccountButton";
import { RFValue } from "react-native-responsive-fontsize";
import ScreenHeader from "@/components/share/ScreenHeader";
import { getUser } from "../../services/auth";
import { UserDetails } from "@/utils/interface";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "@/hooks/useTheme";
import AnimatedModal from "@/components/AnimatedModal";

type Props = NativeStackScreenProps<
  RootStackParamList & AccountStackList & AuthStackParamList
>;

const SettingsPage = ({ navigation }: Props) => {
  const [userDetail, setUserDetails] = useState<UserDetails | null>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const modalScale = new Animated.Value(0);
  const modalOpacity = new Animated.Value(0);
  const backdropOpacity = new Animated.Value(0);
  const theme = useTheme();

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

  useEffect(() => {
    const fetchUser = async () => {
      const userDetails = await getUser();
      console.log(userDetails, 'userDetails');
      setUserDetails(userDetails)
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();
      navigation.replace("AuthStacks", { screen: "Login" });
    } catch (error) {
      console.error('Failed to clear AsyncStorage.', error);
    }
  };
const toggleLogoutModal = () => {
  setShowLogoutModal(!showLogoutModal);
};


  return (
    <CustomView style={styles.container} padded>
      <ScreenHeader 
        title="Account Settings" 
        OnNotificationClick={() => navigation.navigate("NotificationsScreen")} 
        type="Home" 
      />
      
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
          <Image
            source={{ uri: userDetail?.userImage }}
            style={{
              width: 84,
              height: 84,
              borderRadius: 42, 
              backgroundColor: "#E0E0E0",
            }}
            resizeMode="cover"
          />
        </View>
        
        <View style={styles.buttonContainer}>
          <View style={$bodyHeader}>
            <Text font="SemiBold" size={18}>
              {userDetail?.firstName} {userDetail?.lastName}
            </Text>
            <Text size={14} font="Medium" color="#717680">
              Agent ID: {userDetail?.agentId}
            </Text>
          </View>

          <AccountButton buttons={accountButtonData} />
        </View>

        <TouchableOpacity
          onPress={toggleLogoutModal}
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
          <ArrowRight color="" />
        </TouchableOpacity>
      </ScrollView>

      {/* Logout Confirmation Modal */}
  <AnimatedModal
      visible={showLogoutModal}
      onClose={toggleLogoutModal}
      animationType="scale" 
       animationDuration={600} 
      backdropOpacity={0.7}
    >
      <Text font="Bold" size={18} style={styles.modalTitle}>
        Are you sure?
      </Text>
      <Text size={14} font="Regular" style={styles.modalText}>
        You'll need to log in again to access your account.
      </Text>
      
      <View style={styles.modalButtons}>
        <TouchableOpacity 
          onPress={toggleLogoutModal}
          style={[styles.modalButton, styles.cancelButton]}
        >
          <Text font="SemiBold" size={14} style={styles.cancelButtonText}>
            Cancel
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={handleLogout}
          style={[styles.modalButton, styles.logoutButton]}
        >
          <Text font="SemiBold" size={14} style={styles.logoutButtonText}>
            Log Out
          </Text>
        </TouchableOpacity>
      </View>
    </AnimatedModal>
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


  // Modal styles

 modalBackdrop: {
    ...StyleSheet.absoluteFillObject, // This replaces the manual positioning
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flex:1
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
   
    zIndex: 10, // Ensure it appears above the backdrop
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
  

    // zIndex: 20, // Higher than container
  },
  modalTitle: {
    textAlign: 'center',
    marginBottom: 8,
  },
  modalText: {
    textAlign: 'center',
    marginBottom: 24,
    color: '#666',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#F5F5F5',
    marginRight: 8,
  },
  logoutButton: {
    backgroundColor: '#AEFF8C',
    marginLeft: 8,
  },
  cancelButtonText: {
    color: '#333',
  },
  logoutButtonText: {
    color: 'white',
  },
});

export default SettingsPage;