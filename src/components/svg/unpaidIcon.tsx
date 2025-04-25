import React from "react";
import Svg, { Path, Rect } from "react-native-svg";

interface IDebitIcon {
  color: string;
}
const UnpaidIcon = () => {
  return (
<Svg width="25" height="24" viewBox="0 0 25 24" fill="none" >
<Rect x="0.333252" width="24" height="24" rx="12" fill="#FAFAFA"/>
<Path d="M10.4465 13.8873L14.2198 10.114M14.2198 13.8873L10.4465 10.114M12.3332 18.6673C15.9998 18.6673 18.9998 15.6673 18.9998 12.0007C18.9998 8.33398 15.9998 5.33398 12.3332 5.33398C8.6665 5.33398 5.6665 8.33398 5.6665 12.0007C5.6665 15.6673 8.6665 18.6673 12.3332 18.6673Z" stroke="#252B37" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</Svg>


  );
};

export default UnpaidIcon;
