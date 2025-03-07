import React from "react";
import {
  Modal as RNModal,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { Ionicons } from "@expo/vector-icons"; // For close icon
import { useTheme } from "@/hooks/useTheme";
import CheckIcon from "./svg/check";

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  
  message: string;
}

const CloseModal = ({ visible, onClose, message }: ModalProps) => {
  const { theme } = useTheme(); // Access the theme

  return (
    <RNModal transparent={true} visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: theme.background }]}>
          {/* Close Icon */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color="#000" />
          </TouchableOpacity>

          {/* Modal Content */}
          <View style={styles.content}>
            <CheckIcon  />
            <Text style={styles.message}>{message}</Text>
          </View>

          {/* Full-width Close Button */}
          <TouchableOpacity style={styles.actionButton} onPress={onClose}>
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  container: {
    width: "90%",
    maxWidth: 350,
    padding: RFValue(20),
    borderRadius: 10,
    // alignItems: "center",
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    color:"#414651",
    width:RFValue(40),
    height:RFValue(40),
    borderRadius: "50%",
    display: "flex",
    justifyContent:"center",
    alignItems:"center",
    backgroundColor: "#F5F5F5",
    top: RFValue(10),
    right: RFValue(10),
  },
  content: {
    alignItems: "flex-start",
    marginVertical: RFValue(20),
  },
  message: {
    fontSize: RFValue(16),
    textAlign: "center",
    marginTop: RFValue(10),
    color: "#181D27",
  },
  actionButton: {
    width: "100%",
    backgroundColor: "#E6FFDB",
    color:"#213264",
    paddingVertical: RFValue(12),
    borderRadius: 8,
    alignItems: "center",
    marginTop: RFValue(10),
  },
  buttonText: {
    color: "#213264",
    fontSize: RFValue(14),
    fontWeight: "bold",
  },
});

export default CloseModal;
