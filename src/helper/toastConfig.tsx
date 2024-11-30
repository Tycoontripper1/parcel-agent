import {errorColor, primaryColor} from '@/constants/Colors';
import {BaseToast, ErrorToast} from 'react-native-toast-message';
export const toastConfig = {
  /*
    Overwrite 'success' type,
    by modifying the existing `BaseToast` component
  */
  success: (props: any) => (
    <BaseToast
      {...props}
      style={{borderLeftColor: primaryColor}}
      contentContainerStyle={{paddingHorizontal: 15}}
      text1Style={{
        fontSize: 15,
        fontFamily: 'font_regular',
      }}
    />
  ),
  /*
    Overwrite 'error' type,
    by modifying the existing `ErrorToast` component
  */
  error: (props: any) => (
    <ErrorToast
      {...props}
      style={{borderLeftColor: errorColor}}
      contentContainerStyle={{paddingHorizontal: 15}}
      text1Style={{
        fontSize: 15,
        fontFamily: 'font_regular',
      }}
      text2Style={{
        fontSize: 13,
        fontFamily: 'font_regular',
      }}
    />
  ),
};
