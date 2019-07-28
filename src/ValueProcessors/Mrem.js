// Styling Utils
import { PixelRatio } from 'react-native';

const getMRem = (SCREEN_WIDTH_DP, DESIGN_GUIDELINES_BASE_WIDTH_DP, MODERATE_SCALING_FACTOR) => {
  const mulFactor = SCREEN_WIDTH_DP / DESIGN_GUIDELINES_BASE_WIDTH_DP;

  return (value) => PixelRatio.roundToNearestPixel(value + ((mulFactor * value) - value) * MODERATE_SCALING_FACTOR);
};

export {
  getMRem
};
