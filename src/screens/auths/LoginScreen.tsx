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
import {AuthStackParamList} from '@/navigation/navigationType';

type Props = NativeStackScreenProps<AuthStackParamList>;

const LoginScreen = ({navigation}: Props) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const {theme} = useTheme();

  const handleValidation = () => {
    let isValid = true;

    // Email validation
    if (!email) {
      setEmailError('Email is required.');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Please enter a valid email address.');
      isValid = false;
    } else {
      setEmailError('');
    }

    // Password validation
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

  const handleClick = () => {
    if (!handleValidation()) {
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Helper.vibrate();
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Login Successfully',
      });
      navigation.navigate('Settings');
    }, 2000);
  };

  // Styles

  const $container: ViewStyle = {
    flex: 1,
    backgroundColor: theme.background,
  };
  const $signUpText: TextStyle = {
    fontSize: 16,
    marginLeft: 5,
    color: theme.secondary,
  };
  const $forgotPassword: TextStyle = {
    alignItems: 'flex-end',
    marginBottom: 30,
  };
  const $linkText: TextStyle = {
    fontSize: 16,
    color: theme.secondary,
  };

  return (
    <View style={$container}>
      {loading && <Spinner />}
      {/* Top Section */}
      <Header title='Welcome Back' />

      {/* Login Form */}
      <KeyBoardView>
        <View style={styles.form}>
          <Text style={styles.loginText} bold>
            Log in
          </Text>
          <Text style={styles.subText}>
            Enter your login details to proceed
          </Text>

          {/* Email Input */}
          <Input
            label='Email Address'
            placeholder='Enter email'
            placeholderTextColor='#B8C2CC'
            value={email}
            onChangeText={(text) => {
              setEmail(text);
            }}
            LeftIcon={
              <MaterialIcons name='mail-outline' size={18} color={color.gray} />
            }
            errorMessage={emailError}
            keyboardType='email-address'
          />

          {/* Password Input */}
          <Input
            label='Password'
            placeholder='Enter password'
            placeholderTextColor='#B8C2CC'
            value={password}
            onChangeText={(text) => {
              setPassword(text);
            }}
            LeftIcon={
              <MaterialIcons name='lock-outline' size={18} color={color.gray} />
            }
            type='password'
            errorMessage={passwordError}
            keyboardType='default'
          />

          {/* Forgot Password */}
          <TouchableOpacity
            onPress={() => navigation.navigate('ResetMethod')}
            style={$forgotPassword}>
            <Text style={$linkText}>Forgot Password?</Text>
          </TouchableOpacity>

          {/* Login Button */}
          <Button title='Login' onPress={handleClick} style={{height: 50}} />

          {/* OR Section */}
          <View style={styles.orContainer}>
            <View style={styles.line} />
            <Text style={styles.orText}>OR</Text>
            <View style={styles.line} />
          </View>

          {/* Google Sign-In */}
          <TouchableOpacity
            style={[styles.googleButton, {borderColor: theme.border}]}>
            <GoogleIcon />
            <Text style={styles.googleText}>Sign in with Google</Text>
          </TouchableOpacity>

          {/* Sign Up */}
          <View style={styles.signUpContainer}>
            <Text style={styles.subText}>Don’t have an account?</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('CreateAccountScreen')}>
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
