import {Dimensions, PixelRatio} from 'react-native';

// Get device screen dimensions
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

// Base dimensions (e.g., based on iPhone X or another standard device)
const BASE_WIDTH = 375; // iPhone X width
const BASE_HEIGHT = 812; // iPhone X height

/**
 * Normalize size for width and horizontal scaling.
 * Uses PixelRatio for better precision on high-density screens.
 */
export const scale = (size: number) =>
  PixelRatio.roundToNearestPixel((SCREEN_WIDTH / BASE_WIDTH) * size);

/**
 * Normalize size for height and vertical scaling.
 * Uses PixelRatio for better precision on high-density screens.
 */
export const verticalScale = (size: number) =>
  PixelRatio.roundToNearestPixel((SCREEN_HEIGHT / BASE_HEIGHT) * size);

/**
 * Adjust font sizes for responsiveness.
 * Optionally, pass a factor to customize scaling intensity.
 */
export const moderateScale = (size: number, factor = 0.5) =>
  size + (scale(size) - size) * factor;

/**
 * Normalize font size specifically, considering PixelRatio.
 * Ensures fonts are neither too small nor too large on high-DPI screens.
 */
export const normalizeFontSize = (size: number) =>
  PixelRatio.roundToNearestPixel(size * (SCREEN_WIDTH / BASE_WIDTH));
