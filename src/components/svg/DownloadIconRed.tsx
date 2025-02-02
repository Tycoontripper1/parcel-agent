import React from 'react';
import Svg, {Path, Rect} from 'react-native-svg';

interface IDownloadIcon {
  color: string;
}
const DownloadIconRed = ({color}: IDownloadIcon) => {
  return (
    <Svg width='40' height='40' viewBox='0 0 37 36' fill='none'>
      <Rect x='0.75' width='36' height='36' rx='18' fill={color} />
      <Path
        d='M25.75 20.5V23.8333C25.75 24.2754 25.5744 24.6993 25.2618 25.0118C24.9493 25.3244 24.5254 25.5 24.0833 25.5H12.4167C11.9746 25.5 11.5507 25.3244 11.2382 25.0118C10.9256 24.6993 10.75 24.2754 10.75 23.8333V20.5M22.4167 14.6667L18.25 10.5M18.25 10.5L14.0833 14.6667M18.25 10.5V20.5'
        stroke='#FB6514'
        stroke-width='2'
        stroke-linecap='round'
        stroke-linejoin='round'
      />
    </Svg>
  );
};

export default DownloadIconRed;
