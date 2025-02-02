import React from 'react';
import Svg, {Path, Rect} from 'react-native-svg';

const USSDIcon = () => {
  return (
    <Svg width='30' height='30' viewBox='0 0 24 24' fill='none'>
      <Rect width='24' height='24' rx='12' fill='#E8ECF7' />
      <Path
        d='M10.3334 6L8.33341 18M15.6667 6L13.6667 18M17.6667 9.33333H6.33341M17.0001 14.6667H5.66675'
        stroke='#213264'
        stroke-width='1.5'
        stroke-linecap='round'
        stroke-linejoin='round'
      />
    </Svg>
  );
};

export default USSDIcon;
