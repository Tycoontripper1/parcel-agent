import React from "react";
import Svg, { Path, Rect } from "react-native-svg";

interface IDebitIcon {
  color: string;
}
const OverdueIcon = () => {
  return (
<Svg width="24" height="24" viewBox="0 0 24 24" fill="none" >
<Rect x="0.666748" width="24" height="24" rx="12" fill="#FFFBFA"/>
<Path d="M9.94678 12.0007H15.2801M12.6134 18.6673C16.2801 18.6673 19.2801 15.6673 19.2801 12.0007C19.2801 8.33398 16.2801 5.33398 12.6134 5.33398C8.94678 5.33398 5.94678 8.33398 5.94678 12.0007C5.94678 15.6673 8.94678 18.6673 12.6134 18.6673Z" stroke="#F04438" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</Svg>



  );
};

export default OverdueIcon;
