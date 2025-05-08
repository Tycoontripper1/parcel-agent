import {ReportStackList} from './navigationType';
import {useNavigationState} from '@react-navigation/native';
import {useEffect} from 'react';
import {color} from '@/constants/Colors';
import {createStackNavigator} from '@react-navigation/stack';
import ComingSoon from '@/screens/ComingSoon';
import {RFValue} from 'react-native-responsive-fontsize';
import {useTheme} from '@/hooks/useTheme';
import Reportscreen from '@/screens/ReportScreen';
import ShipmentHistory from '@/screens/home/ShipmentHistory';
import AssignParcelHistory from '@/screens/reports/store/Assigned-Parcel/AssignParcelHistory';
import AssignParcelDetails from '@/screens/reports/store/Assigned-Parcel/AssignParcelDetails';
import OverdueParcelHistory from '@/screens/reports/store/overdue-parcel/OverdueparcelHistory';
import OverdueParcelDetails from '@/screens/reports/store/overdue-parcel/OverdueParcelDetails';
import ParcelCollectedHistory from '@/screens/reports/store/parcel-collected/ParcelcollectedHistory';
import ParcelcollectedDetails from '@/screens/reports/store/parcel-collected/ParcelCollectedDetails';
import ReceivedParcelHistory from '@/screens/reports/store/parcel-received/ParcelReceivedhistory';
import UnAssignParcelHistory from '@/screens/reports/store/unassigned-parcel/UnassignedParcelHistory';
import UnAssignParcelDetails from '@/screens/reports/store/unassigned-parcel/UnAssignParcelDetails';
import UnpaidParcelHistory from '@/screens/reports/store/unpaid-parcel/UnpaidParcelHistory';
import UnPaidParcelDetails from '@/screens/reports/store/unpaid-parcel/UnpaidParcelDetails';
import PrintParcel from '@/components/PrintParcel';
import PrintParcelItem from '@/components/printParcelItem';


const Report = createStackNavigator<ReportStackList>();

interface Props {
  navigation: any;
}
const ReportStack = ({navigation}: Props) => {
  const {theme} = useTheme();

  const state = useNavigationState((s) => s);

  useEffect(() => {
    if (state?.routes[0].state?.index && state.routes[0].state.index > 0) {
      navigation?.setOptions({
        tabBarStyle: {
          
          backgroundColor: theme.background,
        },
      });
    } else {
      navigation?.setOptions({
        tabBarStyle: {
          height: 75,
          backgroundColor: theme.background,
          borderTopWidth: 1,
          borderTopColor: '#e0e0e0',
          paddingBottom: RFValue(10),
        },
      });
    }
  }, [state, navigation]);
  return (
    <Report.Navigator
      initialRouteName='Reportscreen'
      screenOptions={{
        headerMode: 'float',
        headerShown: false,
        headerBackgroundContainerStyle: {backgroundColor: theme.background},
        gestureEnabled: true,
      }}>
      <Report.Screen
        name='Reportscreen'
        component={Reportscreen}
        options={{headerShown: false}}
      />
      <Report.Screen
        name='Shipments'
        component={ShipmentHistory}
        options={{headerShown: false}}
      />
      <Report.Screen
        name='AssignParcelHistory'
        component={AssignParcelHistory}
        options={{headerShown: false}}
      />
      <Report.Screen
        name='AssignParcelDetails'
        component={AssignParcelDetails}
        options={{headerShown: false}}
      />
      <Report.Screen
        name='OverdueParcelHistory'
        component={OverdueParcelHistory}
        options={{headerShown: false}}
      />
      <Report.Screen
        name='OverdueParcelDetails'
        component={OverdueParcelDetails}
        options={{headerShown: false}}
      />
      <Report.Screen
        name='ParcelCollectedHistory'
        component={ParcelCollectedHistory}
        options={{headerShown: false}}
      />
      <Report.Screen
        name='ParcelcollectedDetails'
        component={ParcelcollectedDetails}
        options={{headerShown: false}}
      />
      <Report.Screen
        name='UnAssignParcelHistory'
        component={UnAssignParcelHistory}
        options={{headerShown: false}}
      />
      <Report.Screen
        name='UnAssignParcelDetails'
        component={UnAssignParcelDetails}
        options={{headerShown: false}}
      />
      <Report.Screen
        name='ReceivedParcelHistory'
        component={ReceivedParcelHistory}
        options={{headerShown: false}}
      />
      <Report.Screen
        name='UnpaidParcelHistory'
        component={UnpaidParcelHistory}
        options={{headerShown: false}}
      />
      <Report.Screen
        name='UnPaidParcelDetails'
        component={UnPaidParcelDetails}
        options={{headerShown: false}}
      />
            <Report.Screen
              name='PrintParcel'
              component={PrintParcel}
              options={{headerShown: false}}
            />
            <Report.Screen
              name='PrintParcelItem'
              component={PrintParcelItem}
              options={{headerShown: false}}
            />
    </Report.Navigator>
  );
};

export default ReportStack;
