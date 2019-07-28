import { Dimensions } from 'react-native';

const getScreenWidthPX = () => {
  const dims = Dimensions.get('window');

  return dims.width * dims.scale;
};
const getScreenHeightPX = () => {
  const dims = Dimensions.get('window');

  return dims.height * dims.scale;
};

export {
  getScreenWidthPX,
  getScreenHeightPX
};
