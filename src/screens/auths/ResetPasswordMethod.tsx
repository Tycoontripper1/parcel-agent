import {TouchableOpacity, View, ViewStyle} from 'react-native';
import React from 'react';
import {useTheme} from '@/hooks/useTheme';
import Header from '@/components/share/Header';
import KeyBoardView from '@/components/KeyBoardView';
import {RFValue} from 'react-native-responsive-fontsize';
import {Text} from '@/components';
import {color} from '@/constants/Colors';
import {Ionicons} from '@expo/vector-icons';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '@/navigation/Navigation';

type Props = NativeStackScreenProps<RootStackParamList>;

const ResetPasswordMethod = ({navigation}: Props) => {
  const {theme} = useTheme();

  // Styles
  const $container: ViewStyle = {
    flex: 1,
    backgroundColor: theme.background,
  };
  const $bodyHeader: ViewStyle = {
    paddingVertical: RFValue(30),
    flexDirection: 'column',
    gap: 6,
    paddingTop: RFValue(50),
  };
  const $cardHeader: ViewStyle = {
    paddingVertical: RFValue(10),
    flexDirection: 'column',
    gap: 14,
  };
  const $card: ViewStyle = {
    height: RFValue(70),
    paddingHorizontal: RFValue(10),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    gap: 6,
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 8,
  };
  return (
    <View style={$container}>
      {/* Top Section */}
      <Header title='Password Recovery' />

      {/* Body */}
      <KeyBoardView>
        <View style={$bodyHeader}>
          <Text font='SemiBold' size={18}>
            Choose Reset Method
          </Text>
          <Text size={14} color={color.textGray}>
            How would you like to reset your forgotten password?
          </Text>
        </View>
        <View style={$cardHeader}>
          <TouchableOpacity
            onPress={() => navigation.navigate('ResetPasswordWithPhone')}
            style={$card}>
            <View style={{flexDirection: 'column', gap: 4, flexBasis: '90%'}}>
              <Text size={14} color={color.textGray}>
                SMS
              </Text>
              <Text size={12} color={color.textGray}>
                A password reset OTP would be sent your phone number.
              </Text>
            </View>
            {/* Icon */}
            <View style={{flexBasis: '10%'}}>
              <Ionicons name='arrow-forward-outline' size={18} />
            </View>
          </TouchableOpacity>
          {/* Email */}
          <TouchableOpacity
            onPress={() => navigation.navigate('ResetPasswordWithEmail')}
            style={$card}>
            <View style={{flexDirection: 'column', gap: 4, flexBasis: '90%'}}>
              <Text size={14} color={color.textGray}>
                Email
              </Text>
              <Text size={12} color={color.textGray}>
                A password reset link would be sent to your email.
              </Text>
            </View>
            {/* Icon */}
            <View style={{flexBasis: '10%'}}>
              <Ionicons name='arrow-forward-outline' size={18} />
            </View>
          </TouchableOpacity>
        </View>
      </KeyBoardView>
    </View>
  );
};

export default ResetPasswordMethod;
