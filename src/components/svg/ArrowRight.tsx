
import {View, Text} from 'react-native';
import React from 'react';
import Svg, {Path, Rect} from 'react-native-svg';

interface IDownloadIcon {
  color: string;
}
const ArrowRight = ({color}: IDownloadIcon) => {
  return (
    <Svg width="20" height="20" viewBox="0 0 20 20" fill="none" >
      {/* <Rect x='0.25' width='36' height='36' rx='18' fill={color} /> */}
      <Path
 d="M7.5 15L12.5 10L7.5 5" stroke="#717680" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"
      />
    </Svg>
  );
};

export default ArrowRight;

