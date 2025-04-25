import React from "react";
import Svg, { Path, Rect } from "react-native-svg";

interface IDebitIcon {
  color: string;
}
const AssignedIcon = () => {
  return (
<Svg width="25" height="24" viewBox="0 0 25 24" fill="none">
<Rect x="0.666748" width="24" height="24" rx="12" fill="#F7FFF4"/>
<Path d="M10.0067 13.674C10.1267 13.874 10.2733 14.0607 10.44 14.2273C11.6667 15.454 13.66 15.454 14.8933 14.2273C15.3933 13.7273 15.68 13.094 15.7733 12.4473M9.56 11.554C9.65333 10.9007 9.94 10.274 10.44 9.77396C11.6667 8.5473 13.66 8.5473 14.8933 9.77396C15.0667 9.9473 15.2067 10.134 15.3267 10.3273M9.88 15.454V13.674H11.66M15.4533 8.54732V10.3273H13.6733M19.3333 12.0007C19.3333 15.6826 16.3486 18.6673 12.6667 18.6673C8.98477 18.6673 6 15.6826 6 12.0007C6 8.31875 8.98477 5.33398 12.6667 5.33398C16.3486 5.33398 19.3333 8.31875 19.3333 12.0007Z" stroke="#9EE87F" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</Svg>

  );
};

export default AssignedIcon;
