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
import {Entypo, Ionicons} from '@expo/vector-icons';
import Text from './Text';
import {useTheme} from '@/hooks/useTheme';

type SelectInputProps = {
  label: string;
  data: string[];
  placeholder: string;
  onSelect: (value: string) => void;
  showSearch?: boolean; // Optional search input
};

const SelectInput = ({
  label,
  data,
  placeholder,
  onSelect,
  showSearch = false,
}: SelectInputProps) => {
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false); // State for focus

  const handleSelect = (value: string) => {
    setSelectedValue(value);
    onSelect(value);
    setIsModalVisible(false);
  };

  const filteredData = data.filter((item) =>
    item.toLowerCase().includes(searchText.toLowerCase())
  );
  const {theme} = useTheme();

  const inputContainer: ViewStyle = {
    height: RFValue(45),
    borderWidth: 1,
    borderColor: color.allWhite,
    borderRadius: RFValue(8),
    justifyContent: 'space-between',
    paddingHorizontal: RFValue(10),
    backgroundColor: theme.background,
    flexDirection: 'row',
    alignItems: 'center',
  };
  const $placeholder: TextStyle = {
    fontSize: RFValue(14),
    color: theme.inputText,
  };
  const $searchContainer: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: color.allWhite,
    borderRadius: RFValue(8),
    paddingHorizontal: RFValue(10),
    marginBottom: RFValue(10),
    backgroundColor: theme.background,
  };
  const $bottomSheet: ViewStyle = {
    backgroundColor: theme.background,
    borderTopLeftRadius: RFValue(16),
    borderTopRightRadius: RFValue(16),
    padding: RFValue(16),
    maxHeight: '60%',
    marginBottom: 30,
    overflow: 'hidden', // Ensures the rounded corners are visible
  };
  
  const $searchInput: TextStyle = {
    marginLeft: RFValue(5),
    fontSize: RFValue(14),
    padding: RFValue(10),
    flex: 1,
    color: theme.text,
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={inputContainer}
        onPress={() => setIsModalVisible(true)}>
        <Text style={$placeholder}>{selectedValue || placeholder}</Text>
        <Entypo name='chevron-small-down' size={24} color={color.inputColor} />
      </TouchableOpacity>

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
          style={[
            $bottomSheet,
            isSearchFocused ? {maxHeight: '75%'} : {maxHeight: '60%'}, // Adjust height dynamically
          ]}>
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
            {showSearch && (
              <View style={$searchContainer}>
                <Ionicons name='search' size={18} color={color.inputColor} />
                <TextInput
                  style={$searchInput}
                  placeholder='Search state'
                  value={searchText}
                  onChangeText={setSearchText}
                  onFocus={() => setIsSearchFocused(true)} // Set focus state
                  onBlur={() => setIsSearchFocused(false)} // Clear focus state
                />
              </View>
            )}

            {/* List of Options */}
            <FlatList
              data={filteredData}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={styles.option}
                  onPress={() => handleSelect(item)}>
                  <Text style={styles.optionText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

export default SelectInput;

const styles = StyleSheet.create({
  container: {
    marginVertical: RFValue(10),
  },
  label: {
    fontSize: RFValue(14),
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
  },
  optionText: {
    fontSize: RFValue(14),
    color: color.gray,
  },
});
