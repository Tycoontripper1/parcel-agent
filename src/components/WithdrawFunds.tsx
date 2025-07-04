import React, { useState } from 'react';
import {
  Modal,
  TouchableWithoutFeedback,
  View,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ViewStyle,
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { color } from '@/constants/Colors';
import Text from './Text';
import { useTheme } from '@/hooks/useTheme';

// Define your route stack type
type RootStackParamList = {
  WithdrawToBank: undefined;
  WithdrawToWallet: undefined;
  // Add more screens as needed
};

export interface Wallet {
  title: string;
  icon: React.ReactNode;
  route: string;
}

type WithdrawFundsProps = {
  data: Wallet[];
  placeholder: string;
  onSelect: (value: string) => void;
  isModalVisible: boolean;
  setIsModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

const WithdrawFunds = ({
  data,
  placeholder,
  onSelect,
  isModalVisible,
  setIsModalVisible,
}: WithdrawFundsProps) => {
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { theme } = useTheme();

  const handleSelect = (item: Wallet) => {
    setSelectedValue(item.title);
    onSelect(item.title);
    setIsModalVisible(false);
    navigation.navigate(item.route as keyof RootStackParamList); // Navigate to selected screen
  };

  const $bottomSheet: ViewStyle = {
    backgroundColor: theme.background,
    borderTopLeftRadius: RFValue(16),
    borderTopRightRadius: RFValue(16),
    padding: RFValue(16),
    maxHeight: '60%',
    marginBottom: 30,
  };

  return (
    <View style={styles.container}>
      <Modal
        transparent
        visible={isModalVisible}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setIsModalVisible(false)}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 30 : 0}
          style={$bottomSheet}
        >
          <View>
            {/* Drag Handle */}
            <View style={styles.dragHandleContainer}>
              <TouchableOpacity style={styles.dragHandle} />
            </View>

            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.modalTitle}>{placeholder}</Text>
              <TouchableOpacity
                onPress={() => setIsModalVisible(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color={color.black} />
              </TouchableOpacity>
            </View>

            {/* Options List */}
            <FlatList
              data={data}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.option}
                  onPress={() => handleSelect(item)}
                >
                  <Text style={styles.optionText}>{item.title}</Text>
                  <Text>{item.icon}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

export default WithdrawFunds;

const styles = StyleSheet.create({
  container: {
    marginVertical: RFValue(10),
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  dragHandleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginBottom: RFValue(10),
  },
  dragHandle: {
    height: 5,
    width: 50,
    backgroundColor: color.allWhite,
    borderRadius: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: RFValue(10),
  },
  modalTitle: {
    fontSize: RFValue(16),
    fontWeight: 'bold',
  },
  closeButton: {
    padding: RFValue(5),
  },
  option: {
    paddingVertical: RFValue(10),
    paddingHorizontal: RFValue(10),
    backgroundColor: '#F9F9F9',
    borderRadius: RFValue(8),
    marginBottom: RFValue(8),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionText: {
    fontSize: RFValue(14),
    color: color.gray,
  },
});
