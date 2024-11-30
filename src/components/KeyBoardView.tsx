import {
  KeyboardAvoidingView,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import React from 'react';
import {RFValue} from 'react-native-responsive-fontsize';

interface ViewProps {
  /** Content inside the container */
  children: React.ReactNode;

  /** Should the container be padded? */
  padded?: boolean;

  /** Optionally override the background color */
  backgroundColor?: string;
}

const KeyBoardView = ({children}: ViewProps) => {
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 100}}
        keyboardShouldPersistTaps='handled'>
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default KeyBoardView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: RFValue(16),
  },
});
