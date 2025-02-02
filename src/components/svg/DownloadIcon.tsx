import React from 'react';
import Svg, {Path, Rect} from 'react-native-svg';

interface IDownloadIcon {
  color: string;
}
const DownloadIcon = ({color}: IDownloadIcon) => {
  return (
    <Svg width='40' height='40' viewBox='0 0 37 36' fill='none'>
      <Rect x='0.75' width='36' height='36' rx='18' fill={color} />
      <Path
        d='M26.25 20.5V23.8333C26.25 24.2754 26.0744 24.6993 25.7618 25.0118C25.4493 25.3244 25.0254 25.5 24.5833 25.5H12.9167C12.4746 25.5 12.0507 25.3244 11.7382 25.0118C11.4256 24.6993 11.25 24.2754 11.25 23.8333V20.5M14.5833 16.3333L18.75 20.5M18.75 20.5L22.9167 16.3333M18.75 20.5V10.5'
        stroke='#213264'
        stroke-width='2'
        stroke-linecap='round'
        stroke-linejoin='round'
      />
    </Svg>
  );
};

export default DownloadIcon;
