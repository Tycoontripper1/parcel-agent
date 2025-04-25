import React, {useState} from 'react';
import {
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {Button, Input, Spinner, Text} from '@/components';
import KeyBoardView from '@/components/KeyBoardView';
import GoogleIcon from '@/components/svg/GoogleIcon';
import {MaterialIcons} from '@expo/vector-icons';
import {useTheme} from '@/hooks/useTheme';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {color} from '@/constants/Colors';
import Header from '@/components/share/Header';
import {Helper} from '@/helper/helper';
import Toast from 'react-native-toast-message';
import {RootStackParamList, AuthStackParamList} from '@/navigation/navigationType';
import {loginUser} from '../../../services/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = NativeStackScreenProps<RootStackParamList & AuthStackParamList>;

const LoginScreen = ({navigation}: Props) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const {theme} = useTheme();

  const handleValidation = () => {
    let isValid = true;
    const emailRegex = /\S+@\S+\.\S+/;
    const phoneRegex = /^\d{4}-\d{3}-\d{4}$/;

    if (!email) {
      setEmailError('Email or Phone number is required.');
      isValid = false;
    } else if (!emailRegex.test(email) && !phoneRegex.test(email)) {
      setEmailError('Enter a valid email or phone (e.g. 0904-856-987).');
      isValid = false;
    } else {
      setEmailError('');
    }

    if (!password) {
      setPasswordError('Password is required.');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters.');
      isValid = false;
    } else {
      setPasswordError('');
    }

    return isValid;
  };

  const formatPhoneNumber = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 4) return digits;
    if (digits.length <= 7) return `${digits.slice(0, 4)}-${digits.slice(4)}`;
    return `${digits.slice(0, 4)}-${digits.slice(4, 7)}-${digits.slice(7)}`;
  };

  const handleClick = async () => {
    if (!handleValidation()) return;
    setLoading(true);

    try {
      const cleanedInput = /^\d{4}-\d{3}-\d{4}$/.test(email) ? email.replace(/-/g, '') : email;

      const result = await loginUser({emailPhone: cleanedInput, password});
      setLoading(false);

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: result?.data?.message || 'Login Successfully',
      });

      Helper.vibrate();

      const token = result?.data?.token;
      const userDetails = result?.data?.details;

      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('user', JSON.stringify(userDetails));

      if (!userDetails.isEmailVerified) {
        navigation.navigate('OTPVerificationScreen', {phone: userDetails.phone});
      } else if (!userDetails.isKycComplete) {
        navigation.navigate('BusinessInfoScreen');
      } else {
        navigation.navigate('RootTabStack');
      }
    } catch (error: any) {
      setLoading(false);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message || 'Something went wrong',
      });
    }
  };

  const $container: ViewStyle = {flex: 1, backgroundColor: theme.background};
  const $signUpText: TextStyle = {fontSize: 16, marginLeft: 5, color: theme.secondary};
  const $forgotPassword: TextStyle = {alignItems: 'flex-end', marginBottom: 30};
  const $linkText: TextStyle = {fontSize: 16, color: theme.secondary};

  return (
    <View style={$container}>
      {loading && <Spinner />}
      <Header title="Welcome Back" />
      <KeyBoardView>
        <View style={styles.form}>
          <Text style={styles.loginText} bold>Log in</Text>
          <Text style={styles.subText}>Enter your login details to proceed</Text>

          <Input
            label="Phone/Email Address"
            placeholder="Enter email or phone (0904-856-987)"
            placeholderTextColor="#B8C2CC"
            value={email}
            onChangeText={(text) => {
              const emailRegex = /\S+@\S+\.\S+/;
              const phoneStartRegex = /^\d/; // Check if it starts with a digit
              if (phoneStartRegex.test(text)) {
                setEmail(formatPhoneNumber(text));
              } else {
                setEmail(text);
              }
            }}
            
            LeftIcon={<MaterialIcons name="mail-outline" size={18} color={color.gray} />}
            errorMessage={emailError}
            keyboardType="default"
          />

          <Input
            label="Password"
            placeholder="Enter password"
            placeholderTextColor="#B8C2CC"
            value={password}
            onChangeText={setPassword}
            LeftIcon={<MaterialIcons name="lock-outline" size={18} color={color.gray} />}
            type="password"
            errorMessage={passwordError}
            keyboardType="default"
          />

          <TouchableOpacity
            onPress={() => navigation.navigate('AuthStacks', {screen: 'ResetMethod'})}
            style={$forgotPassword}>
            <Text style={$linkText}>Forgot Password?</Text>
          </TouchableOpacity>

          <Button title="Login" onPress={handleClick} style={{height: 50}} />

          <View style={styles.orContainer}>
            <View style={styles.line} />
            <Text style={styles.orText}>OR</Text>
            <View style={styles.line} />
          </View>

          <TouchableOpacity style={[styles.googleButton, {borderColor: theme.border}]}>
            <GoogleIcon />
            <Text style={styles.googleText}>Sign in with Google</Text>
          </TouchableOpacity>

          <View style={styles.signUpContainer}>
            <Text style={styles.subText}>Don’t have an account?</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('AuthStacks', {screen: 'CreateAccountScreen'})}>
              <Text style={$signUpText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyBoardView>
    </View>
  );
};

const styles = StyleSheet.create({
  form: {
    padding: 0,
  },
  loginText: {
    fontSize: 22,
    paddingVertical: 8,
  },
  subText: {
    fontSize: 16,
    color: color.textGray,
    marginBottom: 30,
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#E4E7EB',
  },
  orText: {
    marginHorizontal: 10,
    fontSize: 16,
    color: color.textGray,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
    justifyContent: 'center',
  },
  googleText: {
    fontSize: 16,
    marginLeft: 10,
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
});

export default LoginScreen;
