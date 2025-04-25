import React from "react";
import Svg, { Path, Rect } from "react-native-svg";

interface IDebitIcon {
  color: string;
}
const ReceivedIcon = () => {
  return (
    <Svg width="24" height="24" viewBox="0 0 24 " fill="none">
      <Rect width="24" height="24" rx="12" fill="#F7F9FC" />
      <Path
        d="M9.3335 12.0007H14.6668M12.0002 14.6673V9.33398M12.0002 18.6673C15.6668 18.6673 18.6668 15.6673 18.6668 12.0007C18.6668 8.33398 15.6668 5.33398 12.0002 5.33398C8.3335 5.33398 5.3335 8.33398 5.3335 12.0007C5.3335 15.6673 8.3335 18.6673 12.0002 18.6673Z"
        stroke="#213264"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </Svg>
  );
};

export default ReceivedIcon;
