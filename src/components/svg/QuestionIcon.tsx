
import React from 'react';
import Svg, {Path, Rect} from 'react-native-svg';

const QuestionIcon = () => {
  return (
    <Svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      <Rect width="40" height="40" rx="20" fill="#F5F5F5"/>
      <Path
d="M17.09 17C17.3251 16.3317 17.7892 15.7681 18.4 15.4091C19.0108 15.0502 19.7289 14.9189 20.4272 15.0387C21.1255 15.1585 21.7588 15.5215 22.2151 16.0635C22.6713 16.6055 22.9211 17.2915 22.92 18C22.92 20 19.92 21 19.92 21M20 25H20.01M30 20C30 25.5228 25.5228 30 20 30C14.4772 30 10 25.5228 10 20C10 14.4772 14.4772 10 20 10C25.5228 10 30 14.4772 30 20Z" stroke="#414651" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
      />
    </Svg>
  );
};

export default QuestionIcon;

