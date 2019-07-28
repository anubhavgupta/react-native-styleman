// Styling Utils
import { PixelRatio } from 'react-native';

const getRem = (SCREEN_WIDTH_DP, DESIGN_GUIDELINES_BASE_WIDTH_DP) => {
  const mulFactor = SCREEN_WIDTH_DP / DESIGN_GUIDELINES_BASE_WIDTH_DP;

  return (value) => PixelRatio.roundToNearestPixel(mulFactor * value);
};

export {
  getRem
};
