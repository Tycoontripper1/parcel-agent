import React from 'react';
import Svg, {ClipPath, Defs, G, Path, Rect} from 'react-native-svg';

const DriverAdd = () => {
  return (
    <Svg width='25' height='24' viewBox='0 0 25 24' fill='none'>
      <G clip-path='url(#clip0_912_8429)'>
        <Path
          d='M16.5 21V19C16.5 17.9391 16.0786 16.9217 15.3284 16.1716C14.5783 15.4214 13.5609 15 12.5 15H5.5C4.43913 15 3.42172 15.4214 2.67157 16.1716C1.92143 16.9217 1.5 17.9391 1.5 19V21M20.5 8V14M23.5 11H17.5M13 7C13 9.20914 11.2091 11 9 11C6.79086 11 5 9.20914 5 7C5 4.79086 6.79086 3 9 3C11.2091 3 13 4.79086 13 7Z'
          stroke='#213264'
          stroke-width='2'
          stroke-linecap='round'
          stroke-linejoin='round'
        />
      </G>
      <Defs>
        <ClipPath id='clip0_912_8429'>
          <Rect
            width='24'
            height='24'
            fill='white'
            transform='translate(0.5)'
          />
        </ClipPath>
      </Defs>
    </Svg>
  );
};

export default DriverAdd;
