import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

interface CheckboxProps {
  /** Is the checkbox initially checked? */
  checked?: boolean;

  /** Callback for when the checkbox is toggled */
  onChange?: (checked: boolean) => void;

  /** Label text for the checkbox */
  label?: string;
}

const Checkbox = ({checked = false, onChange, label}: CheckboxProps) => {
  const [isChecked, setIsChecked] = useState(checked);

  const handlePress = () => {
    setIsChecked(!isChecked);
    if (onChange) {
      onChange(!isChecked);
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <View style={[styles.box, isChecked && styles.checked]} />
      {label && <Text style={styles.label}>{label}</Text>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  box: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#333',
    marginRight: 10,
  },
  checked: {
    backgroundColor: '#007bff',
  },
  label: {
    fontSize: 16,
  },
});

export default Checkbox;
