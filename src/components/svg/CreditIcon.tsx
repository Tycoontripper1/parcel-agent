

import React from 'react';
import Svg, {Path, Rect} from 'react-native-svg';

interface ICreditIcon {
  color: string;
}
const CreditIcon = () => {
  return (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Rect width="24" height="24" rx="12" fill="#DFFCE9"/>
      <Path
d="M8.66675 8.66602L15.3334 15.3327M15.3334 15.3327V8.66602M15.3334 15.3327H8.66675" stroke="#12B76A" stroke-linecap="round" stroke-linejoin="round"
      />
    </Svg>
  );
};


export default CreditIcon;
