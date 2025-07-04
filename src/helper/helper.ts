import {Platform} from 'react-native';
import {Vibration} from 'react-native';

interface IObjectMapper {
  [key: string]: string | number;
}

const detectDayLight = () => {
  const today = new Date();
  const currentHour = today.getHours();
  if (currentHour < 12) {
    return 'Good Morning';
  } else if (currentHour < 18) {
    return 'Good Afternoon';
  } else {
    return 'Good Evening';
  }
};

const checkAllValues = (objectEntries: any) => {
  return Object.values(objectEntries).every((value) => value);
};

const omitAnObjectKey = (obj: any, ...props: any[]) => {
  const result = {...obj};
  props.forEach((prop) => {
    delete result[prop];
  });
  return result;
};
export const formatCurrency = (value:any) => {
  if (!value) return '';
  const amount = parseFloat(value) / 100;
  return amount.toLocaleString('en-NG', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};


const findObjectByValueInArray = (
  arr: IObjectMapper[] | any,
  value: string,
  objectKey: string
) => {
  return arr && arr.find((obj: IObjectMapper) => value === obj[objectKey]);
};

const calculatePerc = (amount: string) => {
  const perc = 2.5 / 100;
  const num = Number(amount);
  return (perc * num).toFixed(2) + '';
};

export const formatToDays = (date: string) => {
  const date_1 = new Date(date);
  const date_2 = new Date();

  const difference = date_1.getTime() - date_2.getTime();
  const TotalDays = Math.ceil(difference / (1000 * 3600 * 24));
  return TotalDays;
};

const formatDateAndTime = (date: any) => {
  const months = [
    'Jan',
    'Feb',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const d = new Date(date);
  const year = d.getFullYear();
  let day = d.getDate();
  const month = months[d.getMonth()];
  day = day < 10 ? 0 + day : day;

  let hours = d.getHours();
  let minutes: any = d.getMinutes();
  const ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12;
  minutes = minutes < 10 ? '0' + minutes : minutes;
  const strTime = hours + ':' + minutes + ' ' + ampm;

  return `${month} ${day}, ${year}`;
};

const strArrayToObjArray = (str: string[], key: string[]) => {
  const res: any[] = [];
  str.forEach((el) => {
    const nt = {[key[0]]: el, [key[1]]: el};
    res.push(nt);
  });
  return res;
};

const paddingTop = Platform.OS ? 15 : 15;
const numberFormat = (value: any) => new Intl.NumberFormat().format(value);

// Vibrate
const vibrate = () => {
  return Vibration.vibrate();
};

export const Helper = {
  detectDayLight,
  checkAllValues,
  omitAnObjectKey,
  findObjectByValueInArray,
  calculatePerc,
  formatToDays,
  formatDateAndTime,
  strArrayToObjArray,
  paddingTop,
  numberFormat,
  vibrate,
  formatCurrency,
};
