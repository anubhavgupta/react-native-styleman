import { PixelRatio } from 'react-native';

const getRound = () => (value) => PixelRatio.roundToNearestPixel(value);

export {
  getRound
};
