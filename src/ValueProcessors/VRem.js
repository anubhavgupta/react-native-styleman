// Styling Utils
import { PixelRatio } from 'react-native';

const getVRem = (SCREEN_HEIGHT_DP, DESIGN_GUIDELINES_BASE_HEIGHT_DP) => {
  const mulFactor = SCREEN_HEIGHT_DP / DESIGN_GUIDELINES_BASE_HEIGHT_DP;

  return (value) => PixelRatio.roundToNearestPixel(mulFactor * value);
};

export {
  getVRem
};
