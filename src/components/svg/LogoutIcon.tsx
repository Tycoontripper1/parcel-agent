import React from 'react';
import Svg, {Path, Rect} from 'react-native-svg';

interface ILogoutIcon {
  color: string;
}
const LogoutIcon = ({color}: ILogoutIcon) => {
  return (
    <Svg width='40' height='40' viewBox='0 0 37 36' fill='none'>
      {/* <Rect x='0.75' width='36' height='36' rx='18' fill={color} /> */}
      <Path
      d="M16 17L21 12M21 12L16 7M21 12H9M12 17C12 17.93 12 18.395 11.8978 18.7765C11.6204 19.8117 10.8117 20.6204 9.77646 20.8978C9.39496 21 8.92997 21 8 21H7.5C6.10218 21 5.40326 21 4.85195 20.7716C4.11687 20.4672 3.53284 19.8831 3.22836 19.1481C3 18.5967 3 17.8978 3 16.5V7.5C3 6.10217 3 5.40326 3.22836 4.85195C3.53284 4.11687 4.11687 3.53284 4.85195 3.22836C5.40326 3 6.10218 3 7.5 3H8C8.92997 3 9.39496 3 9.77646 3.10222C10.8117 3.37962 11.6204 4.18827 11.8978 5.22354C12 5.60504 12 6.07003 12 7" stroke="#213264" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
      />
    </Svg>
  );
};



export default LogoutIcon;
