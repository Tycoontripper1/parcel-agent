
import React from "react";
import Svg, { Path, Rect } from "react-native-svg";

interface IDebitIcon {
  color: string;
}
const DebitIcon = () => {
  return (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Rect width="24" height="24" rx="12" fill="#FEDEDC" />
      <Path
       d="M8.66675 15.3327L15.3334 8.66602M15.3334 8.66602H8.66675M15.3334 8.66602V15.3327" stroke="#F04438" stroke-linecap="round" stroke-linejoin="round"
      />
    </Svg>
  );
};

export default DebitIcon;
