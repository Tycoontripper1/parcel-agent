import React, {useState} from 'react';
import {
  Modal,
  TextInput,
  TouchableWithoutFeedback,
  View,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ViewStyle,
  TextStyle,
} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {color} from '@/constants/Colors';
import {Ionicons} from '@expo/vector-icons';
import Text from './Text';
import {useTheme} from '@/hooks/useTheme';

export interface Wallet {
  title: string;
  icon: React.ReactNode;
}

type SelectInputProps = {
  data: Wallet[];
  placeholder: string;
  onSelect: any;
  isModalVisible: boolean;
  setIsModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

const FundWallet = ({
  data,
  placeholder,
  onSelect,
  isModalVisible,
  setIsModalVisible,
}: SelectInputProps) => {
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const handleSelect = (value: any) => {
    setSelectedValue(value);
    onSelect(value);
    setIsModalVisible(false);
  };
  console.log(selectedValue);
  const {theme} = useTheme();
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
      {/* Modal for Bottom Sheet */}
      <Modal
        transparent
        visible={isModalVisible}
        animationType='slide'
        onRequestClose={() => setIsModalVisible(false)}>
        <TouchableWithoutFeedback onPress={() => setIsModalVisible(false)}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 30 : 0}
          style={[$bottomSheet]}>
          <View>
            {/* Line */}
            <View style={styles.dragHandleContainer}>
              <TouchableOpacity style={styles.dragHandle} />
            </View>
            {/* Header Section */}
            <View style={styles.header}>
              <Text style={styles.modalTitle}>{placeholder}</Text>
              <TouchableOpacity
                onPress={() => setIsModalVisible(false)}
                style={styles.closeButton}>
                <Ionicons name='close' size={24} color={color.black} />
              </TouchableOpacity>
            </View>

            {/* Search Input */}

            {/* List of Options */}
            <FlatList
              data={data}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={styles.option}
                  onPress={() => handleSelect(item.title)}>
                  <Text style={styles.optionText}>{item.title}</Text>
                  {/* <View>{item.icon}</View> */}
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

export default FundWallet;

const styles = StyleSheet.create({
  container: {
    marginVertical: RFValue(10),
  },
  label: {
    fontSize: RFValue(12),
    color: '#7B8794',
    marginBottom: RFValue(5),
  },

  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },

  dragHandleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
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
