

import React from "react";
import Svg, { Path, Rect } from "react-native-svg";

interface IDebitIcon {
  color: string;
}
const UserIcon = () => {
  return (
    <Svg width="21" height="18" viewBox="0 0 21 18" fill="none">
      <Rect width="21" height="18" rx="12" fill="#E6FFDB" />
      <Path
     d="M13.8335 16.5V14.8333C13.8335 13.9493 13.4823 13.1014 12.8572 12.4763C12.2321 11.8512 11.3842 11.5 10.5002 11.5H4.66683C3.78277 11.5 2.93493 11.8512 2.30981 12.4763C1.68469 13.1014 1.3335 13.9493 1.3335 14.8333V16.5M17.1668 5.66667V10.6667M19.6668 8.16667H14.6668M10.9168 4.83333C10.9168 6.67428 9.42444 8.16667 7.5835 8.16667C5.74255 8.16667 4.25016 6.67428 4.25016 4.83333C4.25016 2.99238 5.74255 1.5 7.5835 1.5C9.42444 1.5 10.9168 2.99238 10.9168 4.83333Z" stroke="#213264" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"
      />
    </Svg>
  );
};

export default UserIcon;
